const db = require('../db');  // Importar el módulo de conexión a la base de datos
const jwt = require('jsonwebtoken');  // Importar la librería JWT para manejar tokens
const bcrypt = require('bcrypt');  // Importar bcrypt para manejar el hash de contraseñas

// Función de inicio de sesión
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verificar si el usuario existe en la base de datos
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = result.rows[0];

    // Comparar la contraseña proporcionada con el hash almacenado
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Verificar si el usuario ya tiene un token activo no expirado
    const tokenCheck = await db.query(
      'SELECT * FROM user_tokens WHERE user_id = $1 AND is_active = TRUE AND expires_at > NOW()',
      [user.id]
    );

    if (tokenCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Ya tienes un token activo. Debes cerrar sesión antes de iniciar una nueva sesión.' });
    }

    // Generar un token de acceso JWT
    const accessToken = jwt.sign({ id: user.id, role_id: user.role_id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1h',  // Expiración del token
    });

    // Calcular la fecha de expiración del token
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);  // Expira en 1 hora

    // Guardar el token en la base de datos con la fecha de expiración
    await db.query(
      'INSERT INTO user_tokens (user_id, token, is_active, expires_at) VALUES ($1, $2, TRUE, $3)',
      [user.id, accessToken, expiresAt]
    );

    // Actualizar el campo last_login con la fecha y hora actual
    await db.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

    res.status(200).json({ accessToken });  // Devolver el token al cliente
  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    res.status(500).json({ message: 'Error al iniciar sesión' });  // Manejar errores
  }
};

// Función de logout (cerrar sesión)
const logoutUser = async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token requerido' });

  try {
    // Verificar si el token es válido y aún está activo
    const tokenCheck = await db.query('SELECT * FROM user_tokens WHERE token = $1 AND is_active = TRUE AND expires_at > NOW()', [token]);

    if (tokenCheck.rows.length === 0) {
      return res.status(400).json({ message: 'Token inválido o ya expirado.' });
    }

    // Marcar el token como inactivo en la base de datos
    await db.query('UPDATE user_tokens SET is_active = FALSE WHERE token = $1', [token]);

    res.status(200).json({ message: 'Logout exitoso' });  // Confirmar logout exitoso
  } catch (err) {
    console.error('Error al cerrar sesión:', err);
    res.status(500).json({ message: 'Error al cerrar sesión' });  // Manejar errores
  }
};

// Función para crear el primer usuario administrador (para uso temporal)
const createFirstAdminUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Verificar si ya existe un usuario administrador
    const userCheck = await db.query('SELECT * FROM users WHERE role_id = (SELECT id FROM roles WHERE role_name = $1)', ['Administrador']);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Ya existe un usuario administrador. Este endpoint es temporal y solo para crear el primer usuario.' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear rol de administrador si no existe
    const roleCheck = await db.query('SELECT * FROM roles WHERE role_name = $1', ['Administrador']);
    let roleId;
    if (roleCheck.rows.length === 0) {
      const newRole = await db.query('INSERT INTO roles (role_name, description) VALUES ($1, $2) RETURNING *', ['Administrador', 'Rol de administrador con acceso completo']);
      roleId = newRole.rows[0].id;
    } else {
      roleId = roleCheck.rows[0].id;
    }

    // Crear el usuario administrador
    const result = await db.query(
      'INSERT INTO users (username, email, password_hash, role_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, email, hashedPassword, roleId]
    );

    // Generar token de acceso para el nuevo administrador
    const user = result.rows[0];
    const accessToken = jwt.sign({ id: user.id, role_id: user.role_id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1h',
    });

    // Calcular la fecha de expiración del token
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);  // Expira en 1 hora

    // Guardar el token en la base de datos con la fecha de expiración
    await db.query('INSERT INTO user_tokens (user_id, token, is_active, expires_at) VALUES ($1, $2, TRUE, $3)', [user.id, accessToken, expiresAt]);

    res.status(201).json({ user: result.rows[0], accessToken });
  } catch (err) {
    console.error('Error al crear el primer usuario administrador:', err);
    res.status(500).json({ message: 'Error al crear el primer usuario administrador' });
  }
};

module.exports = {
  loginUser,
  logoutUser,
  createFirstAdminUser,  // Exportar la función para crear el primer administrador
};
