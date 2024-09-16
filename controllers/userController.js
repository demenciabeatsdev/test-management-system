const db = require('../db'); // Importa el módulo de conexión a la base de datos
const bcrypt = require('bcrypt'); // Importa bcrypt para hashear contraseñas

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users'); // Ejecuta la consulta para obtener todos los usuarios
    res.status(200).json(result.rows); // Devuelve los resultados como JSON
  } catch (err) {
    console.error('Error al obtener usuarios:', err); // Muestra error en la consola
    res.status(500).json({ message: 'Error al obtener usuarios' }); // Devuelve error al cliente
  }
};

// Crear un nuevo usuario
const createUser = async (req, res) => {
  const { username, email, password_hash, role_id } = req.body; // Obtén los datos del cuerpo de la solicitud
  try {
    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password_hash, 10); // Genera un hash de la contraseña con un factor de costo de 10

    const result = await db.query(
      'INSERT INTO users (username, email, password_hash, role_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, email, hashedPassword, role_id] // Inserta el nuevo usuario en la base de datos
    );
    res.status(201).json(result.rows[0]); // Devuelve el usuario creado como JSON
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ message: `El usuario con el nombre "${username}" o email "${email}" ya existe.` });
    }
    console.error('Error al crear usuario:', err); // Muestra error en la consola
    res.status(500).json({ message: 'Error al crear usuario' }); // Devuelve error al cliente
  }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
  const { id } = req.params; // Obtén el ID del usuario de los parámetros de la solicitud
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]); // Ejecuta la consulta para obtener un usuario específico
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' }); // Devuelve error si el usuario no existe
    }
    res.status(200).json(result.rows[0]); // Devuelve el usuario como JSON
  } catch (err) {
    console.error('Error al obtener usuario:', err); // Muestra error en la consola
    res.status(500).json({ message: 'Error al obtener usuario' }); // Devuelve error al cliente
  }
};

// Actualizar un usuario existente
const updateUser = async (req, res) => {
  const { id } = req.params; // Obtén el ID del usuario de los parámetros de la solicitud
  const { username, email, role_id, is_active } = req.body; // Obtén los datos del cuerpo de la solicitud
  try {
    const result = await db.query(
      'UPDATE users SET username = $1, email = $2, role_id = $3, is_active = $4 WHERE id = $5 RETURNING *',
      [username, email, role_id, is_active, id] // Actualiza el usuario en la base de datos
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' }); // Devuelve error si el usuario no existe
    }
    res.status(200).json(result.rows[0]); // Devuelve el usuario actualizado como JSON
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ message: `El usuario con el nombre "${username}" o email "${email}" ya existe.` });
    }
    console.error('Error al actualizar usuario:', err); // Muestra error en la consola
    res.status(500).json({ message: 'Error al actualizar usuario' }); // Devuelve error al cliente
  }
};

// Eliminar un usuario existente
const deleteUser = async (req, res) => {
  const { id } = req.params; // Obtén el ID del usuario de los parámetros de la solicitud
  try {
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]); // Elimina el usuario de la base de datos
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' }); // Devuelve error si el usuario no existe
    }
    res.status(200).json({ message: 'Usuario eliminado' }); // Devuelve mensaje de éxito
  } catch (err) {
    console.error('Error al eliminar usuario:', err); // Muestra error en la consola
    res.status(500).json({ message: 'Error al eliminar usuario' }); // Devuelve error al cliente
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
