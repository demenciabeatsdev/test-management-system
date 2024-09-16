const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Ruta de inicio de sesión
router.post('/login', authController.loginUser);

// Ruta de logout (requiere autenticación)
router.post('/logout', authenticateToken, authController.logoutUser);

// Ruta temporal para crear el primer usuario administrador (sin autenticación)
router.post('/create-admin', authController.createFirstAdminUser);

module.exports = router;
