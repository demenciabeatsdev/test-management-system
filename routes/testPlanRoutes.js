const express = require('express');
const router = express.Router();
const {
  getAllTestPlans,
  createTestPlan,
  getTestPlanById,
  updateTestPlan,
  deleteTestPlan,
  getTestCasesByTestPlan, // Importar el método combinado
  addTestCasesToTestPlan, // Importar la función existente
} = require('../controllers/testPlanController');
const { authenticateToken, checkRole } = require('../middlewares/authMiddleware');

// Rutas para Test Plans
router.get('/', authenticateToken, checkRole('Administrador'), getAllTestPlans); // Obtener todos los planes de prueba
router.post('/', authenticateToken, checkRole('Administrador'), createTestPlan); // Crear un nuevo plan de prueba
router.get('/:id', authenticateToken, checkRole('Administrador'), getTestPlanById); // Obtener un plan de prueba por ID
router.put('/:id', authenticateToken, checkRole('Administrador'), updateTestPlan); // Actualizar un plan de prueba
router.delete('/:id', authenticateToken, checkRole('Administrador'), deleteTestPlan); // Eliminar un plan de prueba
router.get('/:id/test-cases', authenticateToken, checkRole('Administrador'), getTestCasesByTestPlan); // Obtener todos los casos de prueba por plan de prueba
router.post('/:id/test-cases', authenticateToken, checkRole('Administrador'), addTestCasesToTestPlan); // Asociar casos de prueba al plan de prueba

module.exports = router;
