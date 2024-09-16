const express = require('express');
const router = express.Router();
const {
  getAllTestCaseSteps,
  createTestCaseStep,
  getTestCaseStepById,
  getTestCaseStepsByTestCaseId,  // Nueva función añadida
  updateTestCaseStep,
  deleteTestCaseStep,
} = require('../controllers/testCaseStepsController');
const { authenticateToken, checkRole } = require('../middlewares/authMiddleware');

// Rutas para pasos de casos de prueba
router.get('/', authenticateToken, checkRole('Administrador'), getAllTestCaseSteps);
router.post('/', authenticateToken, checkRole('Administrador'), createTestCaseStep);
router.get('/:id', authenticateToken, checkRole('Administrador'), getTestCaseStepById);
router.get('/by-test-case/:test_case_id', authenticateToken, checkRole('Administrador'), getTestCaseStepsByTestCaseId); // Nueva ruta añadida
router.put('/:id', authenticateToken, checkRole('Administrador'), updateTestCaseStep);
router.delete('/:id', authenticateToken, checkRole('Administrador'), deleteTestCaseStep);

module.exports = router;
