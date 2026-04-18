
const db = require('../config/db');

class Paciente {
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM pacientes');
    return rows;
  }

  static async create(paciente) {
    const { nome, dataNascimento, carteirinha, cpf } = paciente;
    const [result] = await db.execute(
      'INSERT INTO pacientes (nome, dataNascimento, carteirinha, cpf) VALUES (?, ?, ?, ?)',
      [nome, dataNascimento, carteirinha, cpf]
    );
    return result.insertId;
  }
}

module.exports = Paciente;