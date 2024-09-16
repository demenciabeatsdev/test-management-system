const db = require('../db'); // Importar el módulo de conexión a la base de datos

// Obtener todos los permisos
const getAllPermissions = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM permissions'); // Consulta SQL para obtener todos los permisos
    res.status(200).json(result.rows); // Devolver los permisos en formato JSON
  } catch (err) {
    console.error('Error al obtener permisos:', err); // Manejar errores de consulta
    res.status(500).json({ message: 'Error al obtener permisos' });
  }
};

// Crear un nuevo permiso
const createPermission = async (req, res) => {
  const { permission_name, description } = req.body; // Obtener los datos del cuerpo de la solicitud
  try {
    const result = await db.query(
      'INSERT INTO permissions (permission_name, description) VALUES ($1, $2) RETURNING *',
      [permission_name, description] // Insertar el nuevo permiso en la base de datos
    );
    res.status(201).json(result.rows[0]); // Devolver el permiso creado como JSON
  } catch (err) {
    if (err.code === '23505') { // Manejar error de llave duplicada
      return res.status(400).json({ message: `El permiso con el nombre "${permission_name}" ya existe.` });
    }
    console.error('Error al crear permiso:', err); // Manejar otros errores
    res.status(500).json({ message: 'Error al crear permiso' });
  }
};

// Obtener un permiso por ID
const getPermissionById = async (req, res) => {
  const { id } = req.params; // Obtener el ID del permiso de los parámetros de la solicitud
  try {
    const result = await db.query('SELECT * FROM permissions WHERE id = $1', [id]); // Consultar el permiso específico
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Permiso no encontrado' }); // Manejar caso de permiso no encontrado
    }
    res.status(200).json(result.rows[0]); // Devolver el permiso como JSON
  } catch (err) {
    console.error('Error al obtener permiso:', err); // Manejar errores de consulta
    res.status(500).json({ message: 'Error al obtener permiso' });
  }
};

// Eliminar un permiso
const deletePermission = async (req, res) => {
  const { id } = req.params; // Obtener el ID del permiso de los parámetros de la solicitud
  try {
    await db.query('DELETE FROM permissions WHERE id = $1', [id]); // Eliminar el permiso de la base de datos
    res.status(200).json({ message: 'Permiso eliminado' }); // Confirmar eliminación exitosa
  } catch (err) {
    console.error('Error al eliminar permiso:', err); // Manejar errores de eliminación
    res.status(500).json({ message: 'Error al eliminar permiso' });
  }
};

module.exports = {
  getAllPermissions,
  createPermission,
  getPermissionById, // Exportar la nueva función
  deletePermission,
};
