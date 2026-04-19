const Paciente = require('../models/Paciente');

exports.getAll = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll();
    // Formatar dataNascimento para YYYY-MM-DD conforme exemplo
    const formatados = pacientes.map(p => {
      let dataFormatada = p.dataNascimento;
      if (dataFormatada instanceof Date) {
        dataFormatada = dataFormatada.toISOString().split('T')[0];
      }
      return { ...p, dataNascimento: dataFormatada };
    });
    res.status(200).json(formatados);
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error);
    res.status(500).json({ message: 'Erro ao buscar pacientes: ' + error.message });
  }
};

exports.create = async (req, res) => {
  try {
    await Paciente.create(req.body);
    res.status(201).json("Paciente criado com sucesso");
  } catch (error) {
    console.error("Erro ao criar paciente:", error);
    res.status(500).json({ message: 'Erro ao criar paciente: ' + error.message });
  }
};

exports.getPacienteById = async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params.id);
    if (paciente) {
      res.status(200).json(paciente);
    } else {
      res.status(404).json({ message: 'Paciente não encontrado' });
    }
  } catch (error) {
    console.error("Erro ao buscar paciente por ID:", error);
    res.status(500).json({ message: 'Erro ao buscar paciente por ID: ' + error.message });
  }
};

exports.updatePaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, dataNascimento, cpf, carteirinha } = req.body || {};
    const affectedRows = await Paciente.update(id, { nome, dataNascimento, cpf, carteirinha });
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Paciente não encontrado' });
    }
    res.status(200).json({ message: 'Paciente atualizado com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar paciente: ' + error.message });
  }
};

exports.deletePaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await Paciente.delete(id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Paciente não encontrado' });
    }
    res.status(200).json({ message: 'Paciente deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar paciente: ' + error.message });
  }
};
