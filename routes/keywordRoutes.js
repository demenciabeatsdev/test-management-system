const express = require('express');
const router = express.Router();
const { 
  getAllKeywords, 
  createKeyword, 
  getKeywordById, 
  updateKeyword, 
  deleteKeyword,
  addKeywordsToUUID // Importar el nuevo método
} = require('../controllers/keywordController'); // Importar el controlador de keywords
const { authenticateToken, checkRole } = require('../middlewares/authMiddleware');

// Ruta para obtener todas las keywords
router.get('/', authenticateToken, checkRole('Administrador'), getAllKeywords);

// Ruta para crear una nueva keyword
router.post('/', authenticateToken, checkRole('Administrador'), createKeyword);

// Ruta para obtener una keyword por ID
router.get('/:id', authenticateToken, checkRole('Administrador'), getKeywordById);

// Ruta para actualizar una keyword por ID
router.put('/:id', authenticateToken, checkRole('Administrador'), updateKeyword);

// Ruta para eliminar una keyword por ID
router.delete('/:id', authenticateToken, checkRole('Administrador'), deleteKeyword);

// Ruta para agregar múltiples keywords a un UUID en una tabla específica
router.post('/add-to-uuid', authenticateToken, checkRole('Administrador'), addKeywordsToUUID);

module.exports = router;
