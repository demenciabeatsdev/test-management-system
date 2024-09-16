const express = require('express');
const router = express.Router();
const {
  getAllTestSuites,
  createTestSuite,
  getTestSuiteById,
  getTestSuitesByProjectId,
  getTestSuitesByParentSuiteId,
  deleteTestSuite,
  associateTestSuite,
  getTestCasesByTestSuite, // Nueva función importada
} = require('../controllers/TestSuitesController');
const { authenticateToken, checkRole } = require('../middlewares/authMiddleware');

// Rutas para Test Suites
router.get('/', authenticateToken, checkRole('Administrador'), getAllTestSuites); // Obtener todas las test suites
router.post('/', authenticateToken, checkRole('Administrador'), createTestSuite); // Crear una nueva test suite
router.get('/:id', authenticateToken, checkRole('Administrador'), getTestSuiteById); // Obtener una test suite por ID
router.get('/project/:project_id', authenticateToken, checkRole('Administrador'), getTestSuitesByProjectId); // Obtener todas las test suites por ID de proyecto
router.get('/parent/:parent_suite_id', authenticateToken, checkRole('Administrador'), getTestSuitesByParentSuiteId); // Obtener todas las test suites por ID de suite padre
router.delete('/:id', authenticateToken, checkRole('Administrador'), deleteTestSuite); // Eliminar una test suite por ID
router.put('/associate', authenticateToken, checkRole('Administrador'), associateTestSuite); // Asociar una test suite hija a una suite padre

// Nueva ruta para obtener todos los casos de prueba asociados a una Test Suite con jerarquía completa
router.get('/:id/test-cases', authenticateToken, checkRole('Administrador'), getTestCasesByTestSuite); // Obtener casos de prueba por ID de test suite

module.exports = router;
