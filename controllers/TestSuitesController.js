const db = require('../db'); // Importar el módulo de conexión a la base de datos

// Obtener todas las Test Suites
const getAllTestSuites = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM test_suites'); // Consulta SQL para obtener todas las test suites
    res.status(200).json(result.rows); // Devolver las test suites en formato JSON
  } catch (err) {
    console.error('Error al obtener test suites:', err); // Manejar errores de consulta
    res.status(500).json({ message: 'Error al obtener test suites' });
  }
};

// Crear una nueva Test Suite
const createTestSuite = async (req, res) => {
  const { name, description, project_id, parent_suite_id, created_by, keywords } = req.body; // Obtener los datos del cuerpo de la solicitud
  try {
    const result = await db.query(
      'INSERT INTO test_suites (name, description, project_id, parent_suite_id, created_by, keywords) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, project_id, parent_suite_id, created_by, keywords] // Insertar la nueva test suite en la base de datos
    );
    res.status(201).json(result.rows[0]); // Devolver la test suite creada como JSON
  } catch (err) {
    console.error('Error al crear test suite:', err); // Manejar errores de inserción
    res.status(500).json({ message: 'Error al crear test suite' });
  }
};

// Obtener una Test Suite por ID
const getTestSuiteById = async (req, res) => {
  const { id } = req.params; // Obtener el ID de la test suite de los parámetros de la solicitud
  try {
    const result = await db.query('SELECT * FROM test_suites WHERE id = $1', [id]); // Consultar la test suite específica
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Test suite no encontrada' }); // Manejar caso de test suite no encontrada
    }
    res.status(200).json(result.rows[0]); // Devolver la test suite como JSON
  } catch (err) {
    console.error('Error al obtener test suite:', err); // Manejar errores de consulta
    res.status(500).json({ message: 'Error al obtener test suite' });
  }
};

// Obtener todas las Test Suites por Proyecto ID
const getTestSuitesByProjectId = async (req, res) => {
  const { project_id } = req.params; // Obtener el ID del proyecto de los parámetros de la solicitud
  try {
    // Consulta SQL para obtener todas las test suites y sus relaciones por proyecto
    const query = `
      SELECT 
        ts.id AS test_suite_id,
        ts.name AS test_suite_name,
        ts.description AS test_suite_description,
        ts.project_id,
        ts.parent_suite_id,
        ts.created_by,
        ts.keywords,
        ts.created_at
      FROM 
        test_suites ts
      WHERE 
        ts.project_id = $1
      ORDER BY 
        ts.parent_suite_id, ts.id
    `;

    const result = await db.query(query, [project_id]); // Ejecutar la consulta SQL
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron test suites para este proyecto' }); // Manejar caso de test suites no encontradas
    }

    // Construir la jerarquía de test suites
    const testSuites = result.rows;
    const testSuitesMap = {};

    // Primero, crear un mapa de todas las test suites por su ID
    testSuites.forEach((suite) => {
      testSuitesMap[suite.test_suite_id] = {
        test_suite_id: suite.test_suite_id,
        test_suite_name: suite.test_suite_name,
        test_suite_description: suite.test_suite_description,
        project_id: suite.project_id,
        parent_suite_id: suite.parent_suite_id,
        created_by: suite.created_by,
        keywords: suite.keywords,
        created_at: suite.created_at,
        child_test_suites: [], // Inicializar el array de suites hijas
      };
    });

    // Construir la jerarquía de padres e hijos
    const hierarchy = [];
    testSuites.forEach((suite) => {
      if (suite.parent_suite_id) {
        // Si tiene un parent_suite_id, añadirlo como hijo de su suite padre
        const parentSuite = testSuitesMap[suite.parent_suite_id];
        if (parentSuite) {
          parentSuite.child_test_suites.push(testSuitesMap[suite.test_suite_id]);
        }
      } else {
        // Si no tiene parent_suite_id, es una suite raíz y se añade al nivel superior
        hierarchy.push(testSuitesMap[suite.test_suite_id]);
      }
    });

    res.status(200).json(hierarchy); // Devolver la jerarquía de test suites como JSON
  } catch (err) {
    console.error('Error al obtener test suites por ID de proyecto:', err); // Manejar errores de consulta
    res.status(500).json({ message: 'Error al obtener test suites por ID de proyecto' });
  }
};

// Obtener todas las Test Suites por Test Suite Parent ID
const getTestSuitesByParentSuiteId = async (req, res) => {
  const { parent_suite_id } = req.params; // Obtener el ID de la test suite padre de los parámetros de la solicitud
  try {
    const result = await db.query('SELECT * FROM test_suites WHERE parent_suite_id = $1', [parent_suite_id]); // Consultar test suites por ID de test suite padre
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron test suites para esta test suite padre' }); // Manejar caso de test suites no encontradas
    }
    res.status(200).json(result.rows); // Devolver las test suites como JSON
  } catch (err) {
    console.error('Error al obtener test suites por ID de test suite padre:', err); // Manejar errores de consulta
    res.status(500).json({ message: 'Error al obtener test suites por ID de test suite padre' });
  }
};

// Eliminar una Test Suite existente
const deleteTestSuite = async (req, res) => {
  const { id } = req.params; // Obtener el ID de la test suite de los parámetros de la solicitud
  try {
    const result = await db.query('DELETE FROM test_suites WHERE id = $1 RETURNING *', [id]); // Eliminar la test suite de la base de datos
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Test suite no encontrada' }); // Manejar caso de test suite no encontrada
    }
    res.status(200).json({ message: 'Test suite eliminada' }); // Confirmar eliminación exitosa
  } catch (err) {
    console.error('Error al eliminar test suite:', err); // Manejar errores de eliminación
    res.status(500).json({ message: 'Error al eliminar test suite' });
  }
};

// Asociar una Test Suite hija a una Test Suite padre existente
const associateTestSuite = async (req, res) => {
  const { parent_suite_id, child_suite_id } = req.body; // Obtener los IDs de la test suite padre e hija del cuerpo de la solicitud
  try {
    const result = await db.query(
      'UPDATE test_suites SET parent_suite_id = $1 WHERE id = $2 RETURNING *',
      [parent_suite_id, child_suite_id] // Asociar la test suite hija a la test suite padre
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Test suite hija no encontrada' }); // Manejar caso de test suite hija no encontrada
    }
    res.status(200).json(result.rows[0]); // Devolver la suite actualizada como JSON
  } catch (err) {
    console.error('Error al asociar test suite:', err); // Manejar errores de asociación
    res.status(500).json({ message: 'Error al asociar test suite' });
  }
};

const getTestCasesByTestSuite = async (req, res) => {
  const { id } = req.params; // Obtener el ID de la test suite de los parámetros de la solicitud
  console.log("ID de la suite:", id);
  
  try {
    // Consulta para obtener test suites y sus casos de prueba
    const suitesQuery = `
      WITH RECURSIVE suite_hierarchy AS (
        SELECT 
          ts.id AS suite_id,
          ts.name AS suite_name,
          ts.parent_suite_id,
          ts.project_id
        FROM 
          test_suites ts
        WHERE 
          ts.id = $1
        UNION ALL
        SELECT 
          ts.id AS suite_id,
          ts.name AS suite_name,
          ts.parent_suite_id,
          ts.project_id
        FROM 
          test_suites ts
        INNER JOIN 
          suite_hierarchy sh ON ts.parent_suite_id = sh.suite_id
      )
      SELECT 
        sh.suite_id, 
        sh.suite_name, 
        tc.id AS test_case_id, 
        tc.name AS test_case_name, 
        tcs.id AS step_id, 
        tcs.step_number, 
        tcs.actions, 
        tcs.expected_results
      FROM 
        suite_hierarchy sh
      LEFT JOIN 
        test_cases tc ON tc.test_suite_id = sh.suite_id
      LEFT JOIN 
        test_case_steps tcs ON tcs.test_case_id = tc.id
      ORDER BY 
        sh.suite_id, tc.id, tcs.step_number;
    `;

    const result = await db.query(suitesQuery, [id]); // Ejecutar la consulta
    console.log("Resultados obtenidos:", result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron casos de prueba para esta suite' });
    }

    // Construir la jerarquía de suites y casos de prueba
    const hierarchy = buildHierarchy(result.rows);
    console.log("Jerarquía construida:", hierarchy);

    res.status(200).json(hierarchy); // Devolver la jerarquía de suites y casos de prueba como JSON
  } catch (err) {
    console.error('Error al obtener casos de prueba por test suite:', err); // Manejar errores de consulta
    res.status(500).json({ message: 'Error al obtener casos de prueba por test suite' });
  }
};

function buildHierarchy(rows) {
  const suitesMap = {};

  rows.forEach(row => {
    if (!suitesMap[row.suite_id]) {
      suitesMap[row.suite_id] = {
        suite_id: row.suite_id,
        suite_name: row.suite_name,
        test_cases: [],
        child_suites: []
      };
    }

    const suite = suitesMap[row.suite_id];

    if (row.test_case_id && !suite.test_cases.some(tc => tc.test_case_id === row.test_case_id)) {
      suite.test_cases.push({
        test_case_id: row.test_case_id,
        test_case_name: row.test_case_name,
        steps: []
      });
    }

    const testCase = suite.test_cases.find(tc => tc.test_case_id === row.test_case_id);
    if (row.step_id) {
      testCase.steps.push({
        step_id: row.step_id,
        step_number: row.step_number,
        actions: row.actions,
        expected_results: row.expected_results
      });
    }
  });

  // Enlazar suites hijo
  Object.values(suitesMap).forEach(suite => {
    if (suite.parent_suite_id && suitesMap[suite.parent_suite_id]) {
      suitesMap[suite.parent_suite_id].child_suites.push(suite);
    }
  });

  return Object.values(suitesMap).filter(suite => !suite.parent_suite_id);
}


module.exports = {
  getAllTestSuites,
  createTestSuite,
  getTestSuiteById,
  getTestSuitesByProjectId,
  getTestSuitesByParentSuiteId,
  deleteTestSuite,
  associateTestSuite,
  getTestCasesByTestSuite, // Nueva función exportada
};
