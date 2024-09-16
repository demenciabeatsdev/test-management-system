const express = require('express');
const router = express.Router();
const { 
  getAllRequirements, 
  createRequirement, 
  getRequirementById, 
  updateRequirement, 
  deleteRequirement 
} = require('../controllers/requirementController');
const { authenticateToken, checkRole } = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, checkRole('Administrador'), getAllRequirements);
router.post('/', authenticateToken, checkRole('Administrador'), createRequirement);
router.get('/:id', authenticateToken, checkRole('Administrador'), getRequirementById);
router.put('/:id', authenticateToken, checkRole('Administrador'), updateRequirement);
router.delete('/:id', authenticateToken, checkRole('Administrador'), deleteRequirement);

module.exports = router;
