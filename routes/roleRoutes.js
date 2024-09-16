const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { authenticateToken, checkRole } = require('../middlewares/authMiddleware'); // Importar middleware de autenticación

// Rutas para roles
router.get('/',authenticateToken, checkRole('Administrador'), roleController.getAllRoles);
router.post('/', authenticateToken, checkRole('Administrador'),roleController.createRole);
router.delete('/:id',authenticateToken, checkRole('Administrador'), roleController.deleteRole);

module.exports = router;
