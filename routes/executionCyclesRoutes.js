const express = require('express');
const router = express.Router();
const {
  createExecutionCycle,
  updateTestCaseExecution,
  updateExecutionCycle,
  deleteExecutionCycle,
  deleteTestCaseFromCycle,
  getExecutionSummaryByTestPlanId,
  executeMultipleTestCases,  // Asegúrate de que esta función esté exportada en tu archivo de controlador.
} = require('../controllers/executionCyclesController');

// Define las rutas y asegúrate de que las funciones estén definidas
router.post('/create', createExecutionCycle);
router.put('/update-test-case', updateTestCaseExecution);
router.put('/update-cycle/:id', updateExecutionCycle);
router.delete('/delete-cycle/:id', deleteExecutionCycle);
router.delete('/delete-test-case', deleteTestCaseFromCycle);
router.get('/summary/:test_plan_id', getExecutionSummaryByTestPlanId);
router.put('/execute-multiple-test-cases', executeMultipleTestCases);


module.exports = router;
