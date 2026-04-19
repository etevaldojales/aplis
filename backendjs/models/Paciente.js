
const db = require('../config/db');

class Paciente {
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM pacientes WHERE deleted_at IS NULL');
    return rows;
  }

  static async create(paciente) {
    const { nome, dataNascimento, carteirinha, cpf, deleted_at } = paciente;
    const [result] = await db.execute(
      'INSERT INTO pacientes (nome, dataNascimento, carteirinha, cpf, deleted_at) VALUES (?, ?, ?, ?, ?)',
      [nome, dataNascimento, carteirinha, cpf, deleted_at]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM pacientes WHERE id = ? AND deleted_at IS NULL', [id]);
    return rows[0];
  }

  static async update(id, paciente) {
    const { nome, dataNascimento, carteirinha, cpf } = paciente;
    const [result] = await db.execute(
      'UPDATE pacientes SET nome = ?, dataNascimento = ?, carteirinha = ?, cpf = ? WHERE id = ?',
      [nome, dataNascimento, carteirinha, cpf, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.execute(
      'UPDATE pacientes SET deleted_at = NOW() WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  }
}

module.exports = Paciente;