const express = require('express');
const router = express.Router();
const rolePermissionController = require('../controllers/rolePermissionController');
const { authenticateToken, checkRole } = require('../middlewares/authMiddleware');
// Asignar permisos a roles
router.post('/assign',authenticateToken, checkRole('Administrador'), rolePermissionController.assignPermissionToRole);
router.get('/:role_id/permissions',authenticateToken, checkRole('Administrador'), rolePermissionController.getPermissionsByRole);

module.exports = router;
