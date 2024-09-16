const db = require('../db'); // Importar el módulo de conexión a la base de datos

/**
 * Crea un ciclo de ejecución vinculado a un plan de prueba y copia inmutablemente
 * los casos de prueba vinculados a ese plan de prueba.
 */
const createExecutionCycle = async (req, res) => {
  const { test_plan_id, execution_date, executed_by } = req.body;
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    // Insertar el ciclo de ejecución
    const insertCycleQuery = `
      INSERT INTO execution_cycles (test_plan_id, execution_date, executed_by, status_id)
      VALUES ($1, $2, $3, (SELECT id FROM execution_status WHERE status_name = 'Pendiente'))
      RETURNING *;
    `;
    const cycleResult = await client.query(insertCycleQuery, [test_plan_id, execution_date, executed_by]);
    const executionCycle = cycleResult.rows[0];

    // Copiar inmutablemente los casos de prueba vinculados
    const copyTestCasesQuery = `
      INSERT INTO test_case_execution (execution_cycle_id, test_case_id, executed_by, status_id, start_time, end_time, logs)
      SELECT $1, tpc.test_case_id, $2, (SELECT id FROM execution_status WHERE status_name = 'Pendiente'), NOW(), NULL, '{}'::json
      FROM test_plan_cases tpc
      WHERE tpc.test_plan_id = $3
      RETURNING *;
    `;
    const testCaseResults = await client.query(copyTestCasesQuery, [executionCycle.id, executed_by, test_plan_id]);

    await client.query('COMMIT');
    res.status(201).json({
      cycle: executionCycle,
      testCases: testCaseResults.rows,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear ejecución de ciclo:', error);
    res.status(500).json({ message: 'Error al crear ejecución de ciclo' });
  } finally {
    client.release();
  }
};
/**
 * Actualiza el estado de un caso de prueba y posiblemente el estado del ciclo completo.
 */
const updateTestCaseExecution = async (req, res) => {
  const { execution_cycle_id, test_case_id, status_name, executed_by } = req.body;
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    // Actualizar el caso de prueba
    const updateTestCaseQuery = `
      UPDATE test_case_execution
      SET status_id = (SELECT id FROM execution_status WHERE status_name = $1), executed_by = $2,
          start_time = COALESCE(start_time, NOW()), end_time = CASE WHEN $1 IN ('Completado', 'Fallido') THEN NOW() ELSE end_time END,
          logs = COALESCE(logs, '{}'::json)
      WHERE execution_cycle_id = $3 AND test_case_id = $4
      RETURNING *;
    `;
    const testCaseResult = await client.query(updateTestCaseQuery, [status_name, executed_by, execution_cycle_id, test_case_id]);

    // Verificar si se actualizó el caso de prueba
    if (testCaseResult.rows.length === 0) {
      throw new Error('No se encontró ningún caso de prueba para actualizar.');
    }

    // Verificar el estado de todos los casos de prueba del ciclo
    const checkAllCasesQuery = `
      SELECT COUNT(*) AS total_cases,
             COUNT(*) FILTER (WHERE status_id = (SELECT id FROM execution_status WHERE status_name = 'Completado')) AS completed_count,
             COUNT(*) FILTER (WHERE status_id = (SELECT id FROM execution_status WHERE status_name = 'Fallido')) AS failed_count,
             COUNT(*) FILTER (WHERE status_id = (SELECT id FROM execution_status WHERE status_name = 'Pendiente')) AS pending_count,
             COUNT(*) FILTER (WHERE status_id NOT IN ((SELECT id FROM execution_status WHERE status_name IN ('Completado', 'Fallido', 'Pendiente')))) AS in_progress_count
      FROM test_case_execution 
      WHERE execution_cycle_id = $1;
    `;
    const allCasesResult = await client.query(checkAllCasesQuery, [execution_cycle_id]);

    const { total_cases, completed_count, failed_count, pending_count, in_progress_count } = allCasesResult.rows[0];

    // Determinar el nuevo estado del ciclo de ejecución
    let newCycleStatus = null;
    if (parseInt(completed_count) + parseInt(failed_count) === parseInt(total_cases)) {
      // Todos los casos de prueba están "Completados" o "Fallidos"
      newCycleStatus = 'Completado';
    } else if (parseInt(pending_count) > 0) {
      // Hay al menos un caso de prueba "Pendiente"
      newCycleStatus = 'Pendiente';
    } else if (parseInt(in_progress_count) > 0) {
      // Hay al menos un caso de prueba que está "En Progreso" o en otro estado
      newCycleStatus = 'En Progreso';
    }

    // Actualizar el estado del ciclo de ejecución si es necesario
    if (newCycleStatus) {
      const updateCycleStatusQuery = `
        UPDATE execution_cycles
        SET status_id = (SELECT id FROM execution_status WHERE status_name = $1)
        WHERE id = $2
        RETURNING *;
      `;
      await client.query(updateCycleStatusQuery, [newCycleStatus, execution_cycle_id]);
    }

    await client.query('COMMIT');
    res.status(200).json(testCaseResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al actualizar caso de prueba:', error);
    res.status(500).json({ message: 'Error al actualizar caso de prueba' });
  } finally {
    client.release();
  }
};
/**
 * Elimina un ciclo de ejecución completo, incluyendo todos los casos de prueba asociados.
 */
const deleteExecutionCycle = async (req, res) => {
  const { id } = req.params; // Obtener el ID del ciclo de ejecución de los parámetros de la solicitud
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    // Eliminar los casos de prueba asociados al ciclo de ejecución
    await client.query('DELETE FROM test_case_execution WHERE execution_cycle_id = $1', [id]);

    // Eliminar el ciclo de ejecución
    const deleteCycleQuery = 'DELETE FROM execution_cycles WHERE id = $1 RETURNING *';
    const cycleResult = await client.query(deleteCycleQuery, [id]);

    if (cycleResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Ciclo de ejecución no encontrado' });
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Ciclo de ejecución eliminado correctamente' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al eliminar ciclo de ejecución:', error);
    res.status(500).json({ message: 'Error al eliminar ciclo de ejecución' });
  } finally {
    client.release();
  }
};
/**
 * Actualiza los datos propios de un ciclo de ejecución, como cambiar la relación con otro test plan.
 */
const updateExecutionCycle = async (req, res) => {
  const { id } = req.params; // Obtener el ID del ciclo de ejecución de los parámetros de la solicitud
  const { test_plan_id, execution_date, executed_by, status_id } = req.body; // Datos a actualizar

  try {
    const updateQuery = `
      UPDATE execution_cycles
      SET test_plan_id = $1, execution_date = $2, executed_by = $3, status_id = $4
      WHERE id = $5
      RETURNING *;
    `;
    const result = await db.query(updateQuery, [test_plan_id, execution_date, executed_by, status_id, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ciclo de ejecución no encontrado' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar ciclo de ejecución:', error);
    res.status(500).json({ message: 'Error al actualizar ciclo de ejecución' });
  }
};
/**
 * Elimina un caso de prueba específico de un ciclo de ejecución.
 */
const deleteTestCaseFromCycle = async (req, res) => {
  const { execution_cycle_id, test_case_id } = req.body; // Obtener el ID del ciclo de ejecución y del caso de prueba

  try {
    const deleteQuery = `
      DELETE FROM test_case_execution
      WHERE execution_cycle_id = $1 AND test_case_id = $2
      RETURNING *;
    `;
    const result = await db.query(deleteQuery, [execution_cycle_id, test_case_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Caso de prueba no encontrado en el ciclo de ejecución' });
    }

    res.status(200).json({ message: 'Caso de prueba eliminado del ciclo de ejecución correctamente' });
  } catch (error) {
    console.error('Error al eliminar caso de prueba del ciclo de ejecución:', error);
    res.status(500).json({ message: 'Error al eliminar caso de prueba del ciclo de ejecución' });
  }
};
/**
 * Obtiene un resumen detallado del estado de los casos de prueba de un plan de prueba por su ID.
 */
const getExecutionSummaryByTestPlanId = async (req, res) => {
  const { test_plan_id } = req.params; // Obtener el ID del plan de prueba de los parámetros de la solicitud

  try {
    // Obtener el estado del ciclo de ejecución
    const cycleQuery = `
      SELECT 
        ec.id AS execution_cycle_id,
        es.status_name AS execution_status
      FROM execution_cycles ec
      JOIN execution_status es ON ec.status_id = es.id
      WHERE ec.test_plan_id = $1
      LIMIT 1;
    `;
    
    const cycleResult = await db.query(cycleQuery, [test_plan_id]); // Ejecutar la consulta del ciclo

    if (cycleResult.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron datos para el ciclo de ejecución.' });
    }

    const executionCycle = cycleResult.rows[0];

    // Obtener los casos de prueba y su estado
    const casesQuery = `
      SELECT 
        COUNT(*) FILTER (WHERE tce.status_id = (SELECT id FROM execution_status WHERE status_name = 'Pendiente')) AS pending_cases,
        COUNT(*) FILTER (WHERE tce.status_id = (SELECT id FROM execution_status WHERE status_name = 'Completado')) AS completed_cases,
        COUNT(*) FILTER (WHERE tce.status_id = (SELECT id FROM execution_status WHERE status_name = 'Fallido')) AS failed_cases,
        tc.name AS test_case_name,
        es.status_name AS test_case_status
      FROM test_case_execution tce
      JOIN test_cases tc ON tce.test_case_id = tc.id
      JOIN execution_status es ON tce.status_id = es.id
      WHERE tce.execution_cycle_id = $1
      GROUP BY tc.name, es.status_name;
    `;

    const casesResult = await db.query(casesQuery, [executionCycle.execution_cycle_id]); // Ejecutar la consulta de casos

    // Construir el JSON con los datos obtenidos
    const summary = {
      execution_cycle_id: executionCycle.execution_cycle_id,
      execution_status: executionCycle.execution_status,
      pending_cases: casesResult.rows.filter(row => row.test_case_status === 'Pendiente').length,
      executed_cases: casesResult.rows.filter(row => row.test_case_status === 'Completado' || row.test_case_status === 'Fallido').length,
      test_cases: casesResult.rows.map(row => ({
        test_case_name: row.test_case_name,
        status: row.test_case_status
      }))
    };

    res.status(200).json(summary); // Devolver el resumen como JSON

  } catch (error) {
    console.error('Error al obtener resumen de ejecución por ID de plan de prueba:', error);
    res.status(500).json({ message: 'Error al obtener resumen de ejecución.' });
  }
};

module.exports = {
  createExecutionCycle,
  updateTestCaseExecution,
  updateExecutionCycle,
  deleteExecutionCycle,
  deleteTestCaseFromCycle,
  getExecutionSummaryByTestPlanId, // Asegúrate de que esta función esté exportada
};