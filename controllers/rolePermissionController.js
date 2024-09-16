const db = require('../db');

// Asignar un permiso a un rol
const assignPermissionToRole = async (req, res) => {
  const { role_id, permission_id } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) RETURNING *',
      [role_id, permission_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al asignar permiso al rol:', err);
    res.status(500).json({ message: 'Error al asignar permiso al rol' });
  }
};
// Obtener todos los permisos de un rol
const getPermissionsByRole = async (req, res) => {
  const { role_id } = req.params;
  try {
    const result = await db.query(
      'SELECT permissions.* FROM permissions JOIN role_permissions ON permissions.id = role_permissions.permission_id WHERE role_permissions.role_id = $1',
      [role_id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener permisos del rol:', err);
    res.status(500).json({ message: 'Error al obtener permisos del rol' });
  }
};

module.exports = {
  assignPermissionToRole,
  getPermissionsByRole,
};
