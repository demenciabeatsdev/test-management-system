const db = require('../db'); // Importar el módulo de conexión a la base de datos

// Obtener todos los planes de prueba
const getAllTestPlans = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM test_plans'); // Consulta SQL para obtener todos los planes de prueba
    res.status(200).json(result.rows); // Devolver los planes de prueba en formato JSON
  } catch (err) {
    console.error('Error al obtener planes de prueba:', err); // Manejar errores de consulta
    res.status(500).json({ message: 'Error al obtener planes de prueba' });
  }
};
// Crear un nuevo plan de prueba
const createTestPlan = async (req, res) => {
  const { name, description, requirement_id, build_id, created_by, keywords } = req.body; // Obtener los datos del cuerpo de la solicitud
  try {
    const result = await db.query(
      'INSERT INTO test_plans (name, description, requirement_id, build_id, created_by, keywords) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, requirement_id, build_id, created_by, keywords]
    ); // Insertar el nuevo plan de prueba en la base de datos
    res.status(201).json(result.rows[0]); // Devolver el plan de prueba creado como JSON
  } catch (err) {
    console.error('Error al crear plan de prueba:', err); // Manejar errores de inserción
    res.status(500).json({ message: 'Error al crear plan de prueba' });
  }
};
// Obtener un plan de prueba por ID con detalles completos
const getTestPlanById = async (req, res) => {
  const { id } = req.params; // Obtener el ID del plan de prueba de los parámetros de la solicitud
  try {
    const result = await db.query('SELECT * FROM test_plans WHERE id = $1', [id]); // Consultar plan de prueba específico
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Plan de prueba no encontrado' }); // Manejar caso de plan de prueba no encontrado
    }
    res.status(200).json(result.rows[0]); // Devolver el plan de prueba como JSON
  } catch (err) {
    console.error('Error al obtener plan de prueba:', err); // Manejar errores de consulta
    res.status(500).json({ message: 'Error al obtener plan de prueba' });
  }
};
// Actualizar un plan de prueba existente
const updateTestPlan = async (req, res) => {
  const { id } = req.params; // Obtener el ID del plan de prueba de los parámetros de la solicitud
  const { name, description, requirement_id, build_id, keywords } = req.body; // Obtener los datos actualizados del cuerpo de la solicitud
  try {
    const result = await db.query(
      'UPDATE test_plans SET name = $1, description = $2, requirement_id = $3, build_id = $4, keywords = $5 WHERE id = $6 RETURNING *',
      [name, description, requirement_id, build_id, keywords, id]
    ); // Actualizar el plan de prueba en la base de datos
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Plan de prueba no encontrado' }); // Manejar caso de plan de prueba no encontrado
    }
    res.status(200).json(result.rows[0]); // Devolver el plan de prueba actualizado como JSON
  } catch (err) {
    console.error('Error al actualizar plan de prueba:', err); // Manejar errores de actualización
    res.status(500).json({ message: 'Error al actualizar plan de prueba' });
  }
};
// Eliminar un plan de prueba existente
const deleteTestPlan = async (req, res) => {
  const { id } = req.params; // Obtener el ID del plan de prueba de los parámetros de la solicitud
  try {
    const result = await db.query('DELETE FROM test_plans WHERE id = $1 RETURNING *', [id]); // Eliminar el plan de prueba de la base de datos
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Plan de prueba no encontrado' }); // Manejar caso de plan de prueba no encontrado
    }
    res.status(200).json({ message: 'Plan de prueba eliminado' }); // Confirmar eliminación exitosa
  } catch (err) {
    console.error('Error al eliminar plan de prueba:', err); // Manejar errores de eliminación
    res.status(500).json({ message: 'Error al eliminar plan de prueba' });
  }
};
// Obtener todos los casos de prueba asociados a un plan de prueba
const getTestCasesByTestPlan = async (req, res) => {
  const { id } = req.params; // Obtener el ID del plan de prueba de los parámetros de la solicitud
  try {
    const query = `
      SELECT 
        tc.id, 
        tc.name, 
        tc.summary, 
        tc.preconditions, 
        tc.importance, 
        ts.name as test_suite_name, 
        ts.id as test_suite_id
      FROM test_plan_cases tpc
      JOIN test_cases tc ON tpc.test_case_id = tc.id
      JOIN test_suites ts ON tc.test_suite_id = ts.id
      WHERE tpc.test_plan_id = $1;
    `;

    const result = await db.query(query, [id]); // Consultar los casos de prueba asociados al plan de prueba
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron casos de prueba para este plan de prueba' }); // Manejar caso de no encontrar casos de prueba
    }
    res.status(200).json(result.rows); // Devolver los casos de prueba como JSON
  } catch (err) {
    console.error('Error al obtener casos de prueba por plan de prueba:', err); // Manejar errores de consulta
    res.status(500).json({ message: 'Error al obtener casos de prueba por plan de prueba' });
  }
};
// Asociar uno o más casos de prueba a un plan de prueba
const addTestCasesToTestPlan = async (req, res) => {
  const { id } = req.params; // Obtener el ID del plan de prueba de los parámetros de la solicitud
  const { test_case_ids } = req.body; // Obtener los IDs de los casos de prueba a asociar del cuerpo de la solicitud (array de UUIDs)
  
  if (!Array.isArray(test_case_ids) || test_case_ids.length === 0) {
    return res.status(400).json({ message: 'Debe proporcionar una lista de IDs de casos de prueba' });
  }

  try {
    for (const testCaseId of test_case_ids) {
      // Obtener detalles del caso de prueba
      const testCaseResult = await db.query('SELECT * FROM test_cases WHERE id = $1', [testCaseId]);

      if (testCaseResult.rows.length === 0) {
        return res.status(404).json({ message: `Caso de prueba con ID ${testCaseId} no encontrado.` });
      }

      const testCase = testCaseResult.rows[0];

      // Insertar en test_plan_cases con los valores duplicados
      await db.query(
        `INSERT INTO test_plan_cases (test_plan_id, test_case_id, duplicated_name, duplicated_summary, duplicated_preconditions, duplicated_importance, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [
          id,
          testCase.id,
          testCase.name,  // duplicated_name
          testCase.summary,  // duplicated_summary
          testCase.preconditions,  // duplicated_preconditions
          testCase.importance,  // duplicated_importance
        ]
      );
    }

    res.status(201).json({ message: 'Casos de prueba asociados al plan de prueba con éxito.' });
  } catch (err) {
    console.error('Error al asociar casos de prueba al plan de prueba:', err); // Manejar errores de inserción
    res.status(500).json({ message: 'Error al asociar casos de prueba al plan de prueba' });
  }
};

module.exports = {
  getAllTestPlans,
  createTestPlan,
  getTestPlanById,
  updateTestPlan,
  deleteTestPlan,
  getTestCasesByTestPlan, // Método combinado para obtener todos los casos de prueba asociados a un plan
  addTestCasesToTestPlan, // Exportar la función existente
};
