const Paciente = require('../models/Paciente');

exports.getAll = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll();
    // Formatar dataNascimento para YYYY-MM-DD conforme exemplo
    const formatados = pacientes.map(p => {
      let dataFormatada = p.dataNascimento;
      // Garante que não vai quebrar se a dataNascimento já for uma string
      if (p.dataNascimento && typeof p.dataNascimento.toISOString === 'function') {
        dataFormatada = p.dataNascimento.toISOString().split('T')[0];
      }
      return {
        ...p,
        dataNascimento: dataFormatada
      };
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