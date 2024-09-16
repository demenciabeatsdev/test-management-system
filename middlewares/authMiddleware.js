const jwt = require('jsonwebtoken');
const db = require('../db');

// Middleware para autenticar el token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Token requerido' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });

    // Verificar si el token está en la base de datos y es válido
    const result = await db.query('SELECT * FROM user_tokens WHERE token = $1 AND is_active = TRUE', [token]);
    if (result.rows.length === 0) return res.status(403).json({ message: 'Token no válido o inactivo' });

    req.user = user; // Decodificar el token y guardar el usuario en req.user
    next();
  });
};

// Middleware para verificar el rol del usuario
const checkRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      // Obtener el rol del usuario desde la base de datos usando el ID del rol
      const result = await db.query('SELECT role_name FROM roles WHERE id = $1', [req.user.role_id]);
      if (result.rows.length === 0) {
        return res.status(403).json({ message: 'Rol de usuario no encontrado' });
      }

      const userRole = result.rows[0].role_name;

      // Comparar el rol del usuario con el rol requerido
      if (userRole !== requiredRole) {
        return res.status(403).json({ message: 'Acceso denegado: Rol insuficiente' });
      }

      next();
    } catch (error) {
      console.error('Error al verificar el rol del usuario:', error);
      return res.status(500).json({ message: 'Error al verificar el rol del usuario' });
    }
  };
};

module.exports = {
  authenticateToken,
  checkRole,
};
