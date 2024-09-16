const db = require('../db'); // Importar el módulo de conexión a la base de datos

// Obtener todos los proyectos
const getAllProjects = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM projects'); // Consulta SQL para obtener todos los proyectos
    res.status(200).json(result.rows); // Devolver los proyectos en formato JSON
  } catch (err) {
    console.error('Error al obtener proyectos:', err); // Manejar errores de consulta
    res.status(500).json({ message: 'Error al obtener proyectos' });
  }
};
// Crear un nuevo proyecto con keywords
const createProject = async (req, res) => {
  const { name, description, created_by, keywords } = req.body; // Obtener los datos del cuerpo de la solicitud, incluyendo keywords como array de UUIDs
  try {
    const result = await db.query(
      'INSERT INTO projects (name, description, created_by, keywords) VALUES ($1, $2, $3, $4) RETURNING *', 
      [name, description, created_by, keywords] // Insertar el nuevo proyecto en la base de datos con keywords
    );
    res.status(201).json(result.rows[0]); // Devolver el proyecto creado como JSON
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ message: `El proyecto con el nombre "${name}" ya existe.` });
    }
    console.error('Error al crear proyecto:', err); // Manejar errores de inserción
    res.status(500).json({ message: 'Error al crear proyecto' });
  }
};
// Obtener un proyecto por ID
const getProjectById = async (req, res) => {
  const { id } = req.params; // Obtener el ID del proyecto de los parámetros de la solicitud
  try {
    const result = await db.query('SELECT * FROM projects WHERE id = $1', [id]); // Consultar proyecto específico
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Proyecto no encontrado' }); // Manejar caso de proyecto no encontrado
    }
    res.status(200).json(result.rows[0]); // Devolver el proyecto como JSON
  } catch (err) {
    console.error('Error al obtener proyecto:', err); // Manejar errores de consulta
    res.status(500).json({ message: 'Error al obtener proyecto' });
  }
};
// Obtener todas las test suites, test suites hijas y sus test cases asociados por Project ID
const getTestSuitesAndCasesByProjectId = async (req, res) => {
  const { id } = req.params; // Obtener el ID del proyecto de los parámetros de la solicitud
  try {
    // Consulta SQL para obtener el proyecto, test suites, test suites hijas y test cases asociados
    const query = `
      SELECT 
        p.id as project_id,
        p.name as project_name,
        ts.id as test_suite_id,
        ts.name as test_suite_name,
        ts.parent_suite_id as parent_suite_id,
        ts_hija.id as child_test_suite_id,
        ts_hija.name as child_test_suite_name,
        tc.id as test_case_id,
        tc.name as test_case_name,
        tc.summary as test_case_summary,
        tc.importance as test_case_importance
      FROM 
        projects p
      LEFT JOIN 
        test_suites ts ON ts.project_id = p.id
      LEFT JOIN 
        test_suites ts_hija ON ts_hija.parent_suite_id = ts.id
      LEFT JOIN 
        test_cases tc ON tc.test_suite_id = ts.id OR tc.test_suite_id = ts_hija.id
      WHERE 
        p.id = $1
      ORDER BY 
        p.id, ts.id, ts_hija.id, tc.id
    `;

    const result = await db.query(query, [id]); // Ejecutar la consulta SQL
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron test suites o casos de prueba para este proyecto' }); // Manejar caso de no encontrar resultados
    }

    // Construir la estructura jerárquica en JSON
    const projectHierarchy = {
      project_id: result.rows[0].project_id,
      project_name: result.rows[0].project_name,
      test_suites: []
    };

    const testSuiteMap = {}; // Mapa para almacenar las test suites y sus hijos
    const testSuiteChildMap = {}; // Mapa para almacenar las test suites hijas y sus casos de prueba

    result.rows.forEach(row => {
      // Agregar test suite principal si no está en el mapa
      if (row.test_suite_id && !testSuiteMap[row.test_suite_id]) {
        testSuiteMap[row.test_suite_id] = {
          test_suite_id: row.test_suite_id,
          test_suite_name: row.test_suite_name,
          child_test_suites: [],
          test_cases: []
        };
        projectHierarchy.test_suites.push(testSuiteMap[row.test_suite_id]);
      }

      // Agregar test suite hija si no está en el mapa de hijos
      if (row.child_test_suite_id && !testSuiteChildMap[row.child_test_suite_id]) {
        const childTestSuite = {
          test_suite_id: row.child_test_suite_id,
          test_suite_name: row.child_test_suite_name,
          test_cases: []
        };
        testSuiteMap[row.test_suite_id].child_test_suites.push(childTestSuite);
        testSuiteChildMap[row.child_test_suite_id] = childTestSuite; // Agregar al mapa de suites hijas
      }

      // Agregar test cases a la test suite o test suite hija correspondiente
      if (row.test_case_id) {
        if (row.parent_suite_id) { // Si es un caso de prueba de una suite hija
          const childSuite = testSuiteChildMap[row.test_suite_id];
          if (childSuite) {
            childSuite.test_cases.push({
              test_case_id: row.test_case_id,
              test_case_name: row.test_case_name,
              test_case_summary: row.test_case_summary,
              test_case_importance: row.test_case_importance
            });
          }
        } else { // Si es un caso de prueba de una suite principal
          testSuiteMap[row.test_suite_id].test_cases.push({
            test_case_id: row.test_case_id,
            test_case_name: row.test_case_name,
            test_case_summary: row.test_case_summary,
            test_case_importance: row.test_case_importance
          });
        }
      }
    });

    res.status(200).json(projectHierarchy); // Devolver la jerarquía del proyecto como JSON
  } catch (err) {
    console.error('Error al obtener test suites y casos de prueba por ID de proyecto:', err); // Manejar errores de consulta
    res.status(500).json({ message: 'Error al obtener test suites y casos de prueba por ID de proyecto' });
  }
};
// Actualizar un proyecto existente con keywords
const updateProject = async (req, res) => {
  const { id } = req.params; // Obtener el ID del proyecto de los parámetros de la solicitud
  const { name, description, keywords } = req.body; // Obtener los datos actualizados del cuerpo de la solicitud, incluyendo keywords como array de UUIDs
  try {
    const result = await db.query(
      'UPDATE projects SET name = $1, description = $2, keywords = $3 WHERE id = $4 RETURNING *',
      [name, description, keywords, id] // Actualizar el proyecto en la base de datos con keywords
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Proyecto no encontrado' }); // Manejar caso de proyecto no encontrado
    }
    res.status(200).json(result.rows[0]); // Devolver el proyecto actualizado como JSON
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ message: `El proyecto con el nombre "${name}" ya existe.` });
    }
    console.error('Error al actualizar proyecto:', err); // Manejar errores de actualización
    res.status(500).json({ message: 'Error al actualizar proyecto' });
  }
};
// Eliminar un proyecto existente
const deleteProject = async (req, res) => {
  const { id } = req.params; // Obtener el ID del proyecto de los parámetros de la solicitud
  try {
    const result = await db.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]); // Eliminar el proyecto de la base de datos
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Proyecto no encontrado' }); // Manejar caso de proyecto no encontrado
    }
    res.status(200).json({ message: 'Proyecto eliminado' }); // Confirmar eliminación exitosa
  } catch (err) {
    console.error('Error al eliminar proyecto:', err); // Manejar errores de eliminación
    res.status(500).json({ message: 'Error al eliminar proyecto' });
  }
};

module.exports = {
  getAllProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  getTestSuitesAndCasesByProjectId, // Nueva función añadida
};
