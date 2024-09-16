const db = require('../db'); // Importar el módulo de conexión a la base de datos

// Obtener todos los pasos de casos de prueba
const getAllTestCaseSteps = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM test_case_steps'); // Consulta SQL para obtener todos los pasos de casos de prueba
    res.status(200).json(result.rows); // Devolver los pasos en formato JSON
  } catch (err) {
    console.error('Error al obtener pasos de casos de prueba:', err); // Manejar errores de consulta
    res.status(500).json({ message: 'Error al obtener pasos de casos de prueba' });
  }
};
// Crear un nuevo paso de caso de prueba
const createTestCaseStep = async (req, res) => {
  const { test_case_id, step_number, actions, expected_results, created_by } = req.body; // Obtener los datos del cuerpo de la solicitud
  try {
    const result = await db.query(
      'INSERT INTO test_case_steps (test_case_id, step_number, actions, expected_results, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [test_case_id, step_number, actions, expected_results, created_by] // Insertar el nuevo paso en la base de datos
    );
    res.status(201).json(result.rows[0]); // Devolver el paso creado como JSON
  } catch (err) {
    console.error('Error al crear paso de caso de prueba:', err); // Manejar errores de inserción
    if (err.code === '23505') {
      res.status(409).json({ message: 'Ya existe un paso con el mismo número para este caso de prueba.' });
    } else {
      res.status(500).json({ message: 'Error al crear paso de caso de prueba' });
    }
  }
};
// Obtener un paso de caso de prueba por ID
const getTestCaseStepById = async (req, res) => {
  const { id } = req.params; // Obtener el ID del paso de caso de prueba de los parámetros de la solicitud
  try {
    const result = await db.query('SELECT * FROM test_case_steps WHERE id = $1', [id]); // Consultar el paso específico
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Paso de caso de prueba no encontrado' }); // Manejar caso de paso no encontrado
    }
    res.status(200).json(result.rows[0]); // Devolver el paso como JSON
  } catch (err) {
    console.error('Error al obtener paso de caso de prueba:', err); // Manejar errores de consulta
    res.status(500).json({ message: 'Error al obtener paso de caso de prueba' });
  }
};
// Obtener todos los pasos de casos de prueba por el ID del caso de prueba
const getTestCaseStepsByTestCaseId = async (req, res) => {
  const { test_case_id } = req.params; // Obtener el ID del caso de prueba de los parámetros de la solicitud
  try {
    const result = await db.query('SELECT * FROM test_case_steps WHERE test_case_id = $1 ORDER BY step_number', [test_case_id]); // Consultar los pasos específicos por el ID del caso de prueba
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron pasos para este caso de prueba' }); // Manejar caso de pasos no encontrados
    }
    res.status(200).json(result.rows); // Devolver los pasos como JSON
  } catch (err) {
    console.error('Error al obtener pasos de caso de prueba por ID de caso de prueba:', err); // Manejar errores de consulta
    res.status(500).json({ message: 'Error al obtener pasos de caso de prueba por ID de caso de prueba' });
  }
};
// Actualizar un paso de caso de prueba existente
const updateTestCaseStep = async (req, res) => {
  const { id } = req.params; // Obtener el ID del paso de caso de prueba de los parámetros de la solicitud
  const { step_number, actions, expected_results } = req.body; // Obtener los datos actualizados del cuerpo de la solicitud
  try {
    const result = await db.query(
      'UPDATE test_case_steps SET step_number = $1, actions = $2, expected_results = $3 WHERE id = $4 RETURNING *',
      [step_number, actions, expected_results, id] // Actualizar el paso en la base de datos
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Paso de caso de prueba no encontrado' }); // Manejar caso de paso no encontrado
    }
    res.status(200).json(result.rows[0]); // Devolver el paso actualizado como JSON
  } catch (err) {
    console.error('Error al actualizar paso de caso de prueba:', err); // Manejar errores de actualización
    if (err.code === '23505') {
      res.status(409).json({ message: 'Ya existe un paso con el mismo número para este caso de prueba.' });
    } else {
      res.status(500).json({ message: 'Error al actualizar paso de caso de prueba' });
    }
  }
};
// Eliminar un paso de caso de prueba existente
const deleteTestCaseStep = async (req, res) => {
  const { id } = req.params; // Obtener el ID del paso de caso de prueba de los parámetros de la solicitud
  try {
    const result = await db.query('DELETE FROM test_case_steps WHERE id = $1 RETURNING *', [id]); // Eliminar el paso de la base de datos
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Paso de caso de prueba no encontrado' }); // Manejar caso de paso no encontrado
    }
    res.status(200).json({ message: 'Paso de caso de prueba eliminado' }); // Confirmar eliminación exitosa
  } catch (err) {
    console.error('Error al eliminar paso de caso de prueba:', err); // Manejar errores de eliminación
    res.status(500).json({ message: 'Error al eliminar paso de caso de prueba' });
  }
};

module.exports = {
  getAllTestCaseSteps,
  createTestCaseStep,
  getTestCaseStepById,
  getTestCaseStepsByTestCaseId,  // Nueva función añadida
  updateTestCaseStep,
  deleteTestCaseStep,
};
