const db = require('../db'); // Importar el módulo de conexión a la base de datos

// Obtener todos los Casos de Prueba
const getAllTestCases = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM test_cases'); // Consulta SQL para obtener todos los casos de prueba
    res.status(200).json(result.rows); // Devolver los casos de prueba en formato JSON
  } catch (err) {
    console.error('Error al obtener casos de prueba:', err); // Manejar errores de consulta
    res.status(500).json({ message: 'Error al obtener casos de prueba' });
  }
};
// Crear un nuevo Caso de Prueba
const createTestCase = async (req, res) => {
  const { name, summary, preconditions, importance, test_suite_id, created_by, status, keywords } = req.body; // Obtener los datos del cuerpo de la solicitud
  try {
    const result = await db.query(
      'INSERT INTO test_cases (name, summary, preconditions, importance, test_suite_id, created_by, status, keywords) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, summary, preconditions, importance, test_suite_id, created_by, status, keywords] // Insertar el nuevo caso de prueba en la base de datos
    );
    res.status(201).json(result.rows[0]); // Devolver el caso de prueba creado como JSON
  } catch (err) {
    console.error('Error al crear caso de prueba:', err); // Manejar errores de inserción
    res.status(500).json({ message: 'Error al crear caso de prueba' });
  }
};
// Obtener un Caso de Prueba por ID
const getTestCaseById = async (req, res) => {
  const { id } = req.params; // Obtener el ID del caso de prueba de los parámetros de la solicitud
  try {
    const result = await db.query('SELECT * FROM test_cases WHERE id = $1', [id]); // Consultar el caso de prueba específico
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Caso de prueba no encontrado' }); // Manejar caso de caso de prueba no encontrado
    }
    res.status(200).json(result.rows[0]); // Devolver el caso de prueba como JSON
  } catch (err) {
    console.error('Error al obtener caso de prueba:', err); // Manejar errores de consulta
    res.status(500).json({ message: 'Error al obtener caso de prueba' });
  }
};
// Obtener todos los Casos de Prueba por Test Suite ID
const getTestCasesByTestSuiteId = async (req, res) => {
  const { test_suite_id } = req.params; // Obtener el ID de la test suite de los parámetros de la solicitud
  try {
    const result = await db.query('SELECT * FROM test_cases WHERE test_suite_id = $1', [test_suite_id]); // Consultar casos de prueba por ID de test suite
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron casos de prueba para esta test suite' }); // Manejar caso de casos de prueba no encontrados
    }
    res.status(200).json(result.rows); // Devolver los casos de prueba como JSON
  } catch (err) {
    console.error('Error al obtener casos de prueba por ID de test suite:', err); // Manejar errores de consulta
    res.status(500).json({ message: 'Error al obtener casos de prueba por ID de test suite' });
  }
};
// Actualizar un Caso de Prueba existente
const updateTestCase = async (req, res) => {
  const { id } = req.params; // Obtener el ID del caso de prueba de los parámetros de la solicitud
  const { name, summary, preconditions, importance, test_suite_id, status, keywords } = req.body; // Obtener los datos actualizados del cuerpo de la solicitud
  try {
    const result = await db.query(
      'UPDATE test_cases SET name = $1, summary = $2, preconditions = $3, importance = $4, test_suite_id = $5, status = $6, keywords = $7 WHERE id = $8 RETURNING *',
      [name, summary, preconditions, importance, test_suite_id, status, keywords, id] // Actualizar el caso de prueba en la base de datos
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Caso de prueba no encontrado' }); // Manejar caso de caso de prueba no encontrado
    }
    res.status(200).json(result.rows[0]); // Devolver el caso de prueba actualizado como JSON
  } catch (err) {
    console.error('Error al actualizar caso de prueba:', err); // Manejar errores de actualización
    res.status(500).json({ message: 'Error al actualizar caso de prueba' });
  }
};
// Eliminar un Caso de Prueba existente
const deleteTestCase = async (req, res) => {
  const { id } = req.params; // Obtener el ID del caso de prueba de los parámetros de la solicitud
  try {
    const result = await db.query('DELETE FROM test_cases WHERE id = $1 RETURNING *', [id]); // Eliminar el caso de prueba de la base de datos
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Caso de prueba no encontrado' }); // Manejar caso de caso de prueba no encontrado
    }
    res.status(200).json({ message: 'Caso de prueba eliminado' }); // Confirmar eliminación exitosa
  } catch (err) {
    console.error('Error al eliminar caso de prueba:', err); // Manejar errores de eliminación
    res.status(500).json({ message: 'Error al eliminar caso de prueba' });
  }
};

module.exports = {
  getAllTestCases,
  createTestCase,
  getTestCaseById,
  getTestCasesByTestSuiteId,
  updateTestCase,
  deleteTestCase,
};
