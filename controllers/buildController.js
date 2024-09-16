const db = require('../db'); // Importar el módulo de conexión a la base de datos

// Obtener todos los builds
const getAllBuilds = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM builds');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener builds:', err);
    res.status(500).json({ message: 'Error al obtener builds' });
  }
};

// Crear un nuevo build
const createBuild = async (req, res) => {
  const { version, release_date, tech_leader, created_by, keywords } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO builds (version, release_date, tech_leader, created_by, keywords) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [version, release_date, tech_leader, created_by, keywords]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear build:', err);
    res.status(500).json({ message: 'Error al crear build' });
  }
};

// Obtener un build por ID
const getBuildById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM builds WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Build no encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener build:', err);
    res.status(500).json({ message: 'Error al obtener build' });
  }
};

// Actualizar un build existente
const updateBuild = async (req, res) => {
  const { id } = req.params;
  const { version, release_date, tech_leader, created_by, keywords } = req.body;
  try {
    const result = await db.query(
      'UPDATE builds SET version = $1, release_date = $2, tech_leader = $3, created_by = $4, keywords = $5 WHERE id = $6 RETURNING *',
      [version, release_date, tech_leader, created_by, keywords, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Build no encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar build:', err);
    res.status(500).json({ message: 'Error al actualizar build' });
  }
};

// Eliminar un build existente
const deleteBuild = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM builds WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Build no encontrado' });
    }
    res.status(200).json({ message: 'Build eliminado' });
  } catch (err) {
    console.error('Error al eliminar build:', err);
    res.status(500).json({ message: 'Error al eliminar build' });
  }
};

module.exports = {
  getAllBuilds,
  createBuild,
  getBuildById,
  updateBuild,
  deleteBuild,
};
