const db = require('../db');

// Obtener todos los roles
const getAllRoles = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM roles');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener roles:', err);
    res.status(500).json({ message: 'Error al obtener roles' });
  }
};

// Crear un nuevo rol
const createRole = async (req, res) => {
  const { role_name, description } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO roles (role_name, description) VALUES ($1, $2) RETURNING *',
      [role_name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ message: `El rol con el nombre "${role_name}" ya existe.` });
    }
    console.error('Error al crear rol:', err);
    res.status(500).json({ message: 'Error al crear rol' });
  }
};

// Eliminar un rol
const deleteRole = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM roles WHERE id = $1', [id]);
    res.status(200).json({ message: 'Rol eliminado' });
  } catch (err) {
    console.error('Error al eliminar rol:', err);
    res.status(500).json({ message: 'Error al eliminar rol' });
  }
};

module.exports = {
  getAllRoles,
  createRole,
  deleteRole,
};
