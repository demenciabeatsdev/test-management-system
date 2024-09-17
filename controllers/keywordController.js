const db = require('../db'); // Importar el módulo de conexión a la base de datos

// Obtener todas las keywords
const getAllKeywords = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM keywords'); // Consulta SQL para obtener todas las keywords
    res.status(200).json(result.rows); // Devolver las keywords en formato JSON
  } catch (err) {
    console.error('Error al obtener keywords:', err); // Manejar errores de consulta
    res.status(500).json({ message: 'Error al obtener keywords' });
  }
};
// Crear una nueva keyword
const createKeyword = async (req, res) => {
  const { keyword_name, description } = req.body; // Obtener los datos del cuerpo de la solicitud
  try {
    const result = await db.query(
      'INSERT INTO keywords (keyword_name, description) VALUES ($1, $2) RETURNING *', 
      [keyword_name, description] // Insertar la nueva keyword en la base de datos
    );
    res.status(201).json(result.rows[0]); // Devolver la keyword creada como JSON
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ message: `La keyword con el nombre "${keyword_name}" ya existe.` });
    }
    console.error('Error al crear keyword:', err); // Manejar errores de inserción
    res.status(500).json({ message: 'Error al crear keyword' });
  }
};
// Obtener una keyword por ID
const getKeywordById = async (req, res) => {
  const { id } = req.params; // Obtener el ID de la keyword de los parámetros de la solicitud
  try {
    const result = await db.query('SELECT * FROM keywords WHERE id = $1', [id]); // Consultar la keyword específica
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Keyword no encontrada' }); // Manejar caso de keyword no encontrada
    }
    res.status(200).json(result.rows[0]); // Devolver la keyword como JSON
  } catch (err) {
    console.error('Error al obtener keyword:', err); // Manejar errores de consulta
    res.status(500).json({ message: 'Error al obtener keyword' });
  }
};
// Actualizar una keyword existente
const updateKeyword = async (req, res) => {
  const { id } = req.params; // Obtener el ID de la keyword de los parámetros de la solicitud
  const { keyword_name, description } = req.body; // Obtener los datos actualizados del cuerpo de la solicitud
  try {
    const result = await db.query(
      'UPDATE keywords SET keyword_name = $1, description = $2 WHERE id = $3 RETURNING *',
      [keyword_name, description, id] // Actualizar la keyword en la base de datos
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Keyword no encontrada' }); // Manejar caso de keyword no encontrada
    }
    res.status(200).json(result.rows[0]); // Devolver la keyword actualizada como JSON
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ message: `La keyword con el nombre "${keyword_name}" ya existe.` });
    }
    console.error('Error al actualizar keyword:', err); // Manejar errores de actualización
    res.status(500).json({ message: 'Error al actualizar keyword' });
  }
};
// Eliminar una keyword existente
const deleteKeyword = async (req, res) => {
  const { id } = req.params; // Obtener el ID de la keyword de los parámetros de la solicitud
  try {
    const result = await db.query('DELETE FROM keywords WHERE id = $1 RETURNING *', [id]); // Eliminar la keyword de la base de datos
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Keyword no encontrada' }); // Manejar caso de keyword no encontrada
    }
    res.status(200).json({ message: 'Keyword eliminada' }); // Confirmar eliminación exitosa
  } catch (err) {
    console.error('Error al eliminar keyword:', err); // Manejar errores de eliminación
    res.status(500).json({ message: 'Error al eliminar keyword' });
  }
};
// Agregar múltiples keywords a un campo de keywords en una tabla específica
const addKeywordsToUUID = async (req, res) => {
  const { uuid, keywords, tableName } = req.body; // Obtener el UUID, las keywords y el nombre de la tabla desde el cuerpo de la solicitud

  // Verificar que el nombre de la tabla sea uno permitido
  const validTables = ['projects', 'test_suites','test_plan','test_cases','requirements']; // Definir las tablas válidas que pueden contener el campo de keywords
  if (!validTables.includes(tableName)) {
    return res.status(400).json({ message: `Nombre de tabla inválido. Solo se permiten las tablas: ${validTables.join(', ')}.` });
  }

  try {
    // Obtener las keywords actuales del UUID especificado en la tabla correspondiente
    const currentKeywordsResult = await db.query(
      `SELECT keywords FROM ${tableName} WHERE id = $1`,
      [uuid]
    );

    if (currentKeywordsResult.rows.length === 0) {
      return res.status(404).json({ message: 'UUID no encontrado en la tabla especificada' }); // Manejar caso de UUID no encontrado
    }

    const currentKeywords = currentKeywordsResult.rows[0].keywords || []; // Obtener las keywords actuales

    // Combinar las keywords actuales con las nuevas, eliminando duplicados
    const updatedKeywords = Array.from(new Set([...currentKeywords, ...keywords]));

    // Actualizar la tabla con las nuevas keywords
    const result = await db.query(
      `UPDATE ${tableName} SET keywords = $1 WHERE id = $2 RETURNING *`,
      [updatedKeywords, uuid]
    );

    res.status(200).json(result.rows[0]); // Devolver el registro actualizado como JSON
  } catch (err) {
    console.error('Error al agregar keywords:', err); // Manejar errores de actualización
    res.status(500).json({ message: 'Error al agregar keywords' });
  }
};

module.exports = {
  getAllKeywords,
  createKeyword,
  getKeywordById,
  updateKeyword,
  deleteKeyword,
  addKeywordsToUUID,
};
