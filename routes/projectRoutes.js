const express = require('express');
const router = express.Router();
const { authenticateToken, checkRole } = require('../middlewares/authMiddleware'); // Importar middleware de autenticación
const projectController = require('../controllers/projectController');

// Rutas para Proyectos
router.get('/', authenticateToken, checkRole('Administrador'), projectController.getAllProjects); // Obtener todos los proyectos
router.post('/', authenticateToken, checkRole('Administrador'), projectController.createProject); // Crear un nuevo proyecto
router.get('/:id', authenticateToken, checkRole('Administrador'), projectController.getProjectById); // Obtener un proyecto por ID
router.put('/:id', authenticateToken, checkRole('Administrador'), projectController.updateProject); // Actualizar un proyecto existente
router.delete('/:id', authenticateToken, checkRole('Administrador'), projectController.deleteProject); // Eliminar un proyecto existente

// Nueva Ruta: Obtener todas las test suites y sus test cases asociados por Project ID
router.get('/:id/test-suites-cases', authenticateToken, projectController.getTestSuitesAndCasesByProjectId);

module.exports = router;
