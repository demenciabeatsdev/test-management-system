const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, checkRole } = require('../middlewares/authMiddleware');

// Rutas para usuarios con autenticación y verificación de rol (opcional)
router.get('/', authenticateToken, checkRole('Administrador'), userController.getAllUsers);  // Obtener todos los usuarios
router.post('/', authenticateToken, checkRole('Administrador'), userController.createUser);  // Crear un nuevo usuario (solo Admin)
router.get('/:id', authenticateToken, checkRole('Administrador'), userController.getUserById);  // Obtener un usuario por ID
router.put('/:id', authenticateToken, checkRole('Administrador'), userController.updateUser);  // Actualizar un usuario (solo Admin)
router.delete('/:id', authenticateToken, checkRole('Administrador'), userController.deleteUser);  // Eliminar un usuario (solo Admin)

module.exports = router;
