const express = require('express');
const router = express.Router();
const { 
  getAllBuilds, 
  createBuild, 
  getBuildById, 
  updateBuild, 
  deleteBuild 
} = require('../controllers/buildController');
const { authenticateToken, checkRole } = require('../middlewares/authMiddleware');

// Rutas para Builds
router.get('/', authenticateToken, checkRole('Administrador'), getAllBuilds); // Obtener todos los builds
router.post('/', authenticateToken, checkRole('Administrador'), createBuild); // Crear un nuevo build
router.get('/:id', authenticateToken, checkRole('Administrador'), getBuildById); // Obtener un build por ID
router.put('/:id', authenticateToken, checkRole('Administrador'), updateBuild); // Actualizar un build
router.delete('/:id', authenticateToken, checkRole('Administrador'), deleteBuild); // Eliminar un build

module.exports = router;
