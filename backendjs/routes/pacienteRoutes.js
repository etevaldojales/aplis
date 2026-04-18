const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/PacienteController');

router.get('/', pacienteController.getAll);
router.post('/', pacienteController.create);

// As rotas abaixo foram comentadas porque os métodos ainda não existem no PacienteController.js
// router.get('/:id', pacienteController.getPacienteById);
// router.put('/:id', pacienteController.updatePaciente);
// router.delete('/:id', pacienteController.deletePaciente);

module.exports = router;