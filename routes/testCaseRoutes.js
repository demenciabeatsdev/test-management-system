const express = require('express');
const router = express.Router();
const { authenticateToken, checkRole } = require('../middlewares/authMiddleware');// Middleware de autenticación
const {
  getAllTestCases,
  createTestCase,
  getTestCaseById,
  updateTestCase,
  deleteTestCase,
  getTestCasesByTestSuiteId
} = require('../controllers/testCaseController');

// Rutas para las operaciones de CRUD en Test Cases
router.get('/', authenticateToken, checkRole('Administrador'), getAllTestCases); // Obtener todos los casos de prueba
router.post('/', authenticateToken, checkRole('Administrador'), createTestCase); // Crear un nuevo caso de prueba
router.get('/:id', authenticateToken, checkRole('Administrador'), getTestCaseById); // Obtener un caso de prueba por ID
router.put('/:id', authenticateToken, checkRole('Administrador'), updateTestCase); // Actualizar un caso de prueba por ID
router.delete('/:id', authenticateToken, checkRole('Administrador'), deleteTestCase); // Eliminar un caso de prueba por ID
router.get('/test-suite/:test_suite_id',authenticateToken, checkRole('Administrador'),getTestCasesByTestSuiteId);
module.exports = router;



