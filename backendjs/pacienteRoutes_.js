const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/PacienteController');

router.get('/', pacienteController.getAll);
router.post('/', pacienteController.create);

module.exports = router;