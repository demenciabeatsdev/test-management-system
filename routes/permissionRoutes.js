const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');
const { authenticateToken, checkRole } = require('../middlewares/authMiddleware');

// Rutas para permisos
router.get('/', authenticateToken, checkRole('Administrador'), permissionController.getAllPermissions); // Obtener todos los permisos
router.post('/', authenticateToken, checkRole('Administrador'), permissionController.createPermission); // Crear un nuevo permiso
router.get('/:id', authenticateToken, checkRole('Administrador'), permissionController.getPermissionById); // Obtener un permiso por ID
router.delete('/:id', authenticateToken, checkRole('Administrador'), permissionController.deletePermission); // Eliminar un permiso por ID

module.exports = router;
