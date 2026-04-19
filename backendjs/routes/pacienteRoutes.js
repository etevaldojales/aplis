const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/PacienteController');

router.get('/', pacienteController.getAll);
router.post('/', pacienteController.create);

router.get('/:id', pacienteController.getPacienteById);
router.put('/:id', pacienteController.updatePaciente);
router.delete('/:id', pacienteController.deletePaciente);

module.exports = router;