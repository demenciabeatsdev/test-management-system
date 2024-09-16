const db = require('../db'); // Importar el módulo de conexión a la base de datos

// Obtener todos los requerimientos
const getAllRequirements = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM requirements');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener requerimientos:', err);
    res.status(500).json({ message: 'Error al obtener requerimientos' });
  }
};

// Crear un nuevo requerimiento
const createRequirement = async (req, res) => {
  const { name, description, created_by, keywords } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO requirements (name, description, created_by, keywords) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, created_by, keywords]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear requerimiento:', err);
    res.status(500).json({ message: 'Error al crear requerimiento' });
  }
};

// Obtener un requerimiento por ID
const getRequirementById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM requirements WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Requerimiento no encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener requerimiento:', err);
    res.status(500).json({ message: 'Error al obtener requerimiento' });
  }
};

// Actualizar un requerimiento existente
const updateRequirement = async (req, res) => {
  const { id } = req.params;
  const { name, description, keywords } = req.body;
  try {
    const result = await db.query(
      'UPDATE requirements SET name = $1, description = $2, keywords = $3 WHERE id = $4 RETURNING *',
      [name, description, keywords, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Requerimiento no encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar requerimiento:', err);
    res.status(500).json({ message: 'Error al actualizar requerimiento' });
  }
};

// Eliminar un requerimiento existente
const deleteRequirement = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM requirements WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Requerimiento no encontrado' });
    }
    res.status(200).json({ message: 'Requerimiento eliminado' });
  } catch (err) {
    console.error('Error al eliminar requerimiento:', err);
    res.status(500).json({ message: 'Error al eliminar requerimiento' });
  }
};

module.exports = {
  getAllRequirements,
  createRequirement,
  getRequirementById,
  updateRequirement,
  deleteRequirement,
};
