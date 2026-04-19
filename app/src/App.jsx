import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'

// Componentes temporários (o ideal é extrair para a pasta src/pages/ futuramente)
const Medicos = () => {
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState(null);

  // Form state
  const [nome, setNome] = useState('');
  const [crm, setCrm] = useState('');
  const [ufcrm, setUfcrm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formStatus, setFormStatus] = useState({ error: null, success: '' });

  const fetchMedicos = async () => {
    setLoading(true);
    setListError(null);
    try {
      const response = await fetch('/api/v1/medicos');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao carregar médicos.');
      }

      setMedicos(data);
    } catch (err) {
      setListError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ error: null, success: '' });

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/v1/medicos/${editingId}` : '/api/v1/medicos';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, CRM: crm, UFCRM: ufcrm }),
      });

      const resultText = await response.text(); // A API PHP pode retornar texto puro
      let result;
      try {
        result = JSON.parse(resultText);
      } catch (e) {
        result = resultText; // Fallback caso não seja um JSON
      }

      if (!response.ok) {
        let errorMessage = `Erro do Servidor (${response.status}): `;
        errorMessage += result.message || resultText || 'Nenhum detalhe retornado pelo backend.';
        throw new Error(errorMessage);
      }

      setFormStatus({ success: result.message || result, error: null });
      setNome('');
      setCrm('');
      setUfcrm('');
      setEditingId(null);
      fetchMedicos(); // Recarrega a lista
    } catch (err) {
      setFormStatus({ error: err.message, success: '' });
    }
  };

  const handleEdit = (medico) => {
    setEditingId(medico.id);
    setNome(medico.nome);
    setCrm(medico.CRM);
    setUfcrm(medico.UFCRM);
    setFormStatus({ error: null, success: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir este médico?')) return;
    try {
      const response = await fetch(`/api/v1/medicos/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro do Servidor (${response.status}): ${errorText.substring(0, 100)}`);
      }
      fetchMedicos();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h2>Médicos</h2>

      <form onSubmit={handleSubmit} className="form-container">
        <h3>{editingId ? 'Editar Médico' : 'Cadastrar Novo Médico'}</h3>
        {formStatus.error && <p className="form-error">{formStatus.error}</p>}
        {formStatus.success && <p className="form-success">{formStatus.success}</p>}
        <div className="form-group">
          <label>Nome:</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>CRM:</label>
          <input type="text" value={crm} onChange={(e) => setCrm(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>UF do CRM:</label>
          <input type="text" value={ufcrm} onChange={(e) => setUfcrm(e.target.value)} maxLength="2" required />
        </div>
        <button type="submit" className="btn btn-primary">
          {editingId ? 'Atualizar' : 'Cadastrar'}
        </button>
        {editingId && (
          <button type="button" onClick={() => {
            setEditingId(null); setNome(''); setCrm(''); setUfcrm(''); setFormStatus({ error: null, success: '' });
          }} className="btn btn-secondary" style={{ marginLeft: '10px' }}>
            Cancelar
          </button>
        )}
      </form>

      <h3>Médicos Cadastrados</h3>
      {loading && <p>Carregando...</p>}
      {listError && <p style={{ color: 'red' }}>{listError}</p>}
      {!loading && !listError && (
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px' }}>ID</th>
              <th style={{ padding: '8px' }}>Nome</th>
              <th style={{ padding: '8px' }}>CRM</th>
              <th style={{ padding: '8px' }}>UF</th>
              <th style={{ padding: '8px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {medicos.length > 0 ? (
              medicos.map(medico => (
                <tr key={medico.id}>
                  <td style={{ padding: '8px' }}>{medico.id}</td>
                  <td style={{ padding: '8px' }}>{medico.nome}</td>
                  <td style={{ padding: '8px' }}>{medico.CRM}</td>
                  <td style={{ padding: '8px' }}>{medico.UFCRM}</td>
                  <td style={{ padding: '8px' }}>
                    <button onClick={() => handleEdit(medico)} style={{ marginRight: '5px' }}>Editar</button>
                    <button onClick={() => handleDelete(medico.id)}>Excluir</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: '8px', textAlign: 'center' }}>Nenhum médico encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState(null);

  // Form state
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [cpf, setCpf] = useState('');
  const [carteirinha, setCarteirinha] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formStatus, setFormStatus] = useState({ error: null, success: '' });

  const fetchPacientes = async () => {
    setLoading(true);
    setListError(null);
    try {
      const response = await fetch('http://localhost:3000/api/v1/pacientes');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Erro ao carregar pacientes.');
      }

      setPacientes(data);
    } catch (err) {
      setListError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ error: null, success: '' });

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `http://localhost:3000/api/v1/pacientes/${editingId}` : 'http://localhost:3000/api/v1/pacientes';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, dataNascimento, cpf, carteirinha }),
      });

      const resultText = await response.text(); // Lê como texto primeiro para evitar erro
      let result;
      try {
        result = JSON.parse(resultText);
      } catch (err) {
        throw new Error(`Erro do Servidor: não retornou JSON válido. Resposta: ${resultText.substring(0, 50)}...`);
      }

      if (!response.ok) {
        throw new Error(result.message || result || 'Erro ao criar paciente.');
      }

      // Extrai a string se 'result' for um objeto, para evitar crash no React
      setFormStatus({ success: result.message || result, error: null });
      setNome('');
      setDataNascimento('');
      setCpf('');
      setCarteirinha('');
      setEditingId(null);
      fetchPacientes(); // Recarrega a lista
    } catch (err) {
      setFormStatus({ error: err.message, success: '' });
    }
  };

  const handleEdit = (paciente) => {
    setEditingId(paciente.id);
    setNome(paciente.nome);
    setDataNascimento(paciente.dataNascimento);
    setCpf(paciente.cpf);
    setCarteirinha(paciente.carteirinha);
    setFormStatus({ error: null, success: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir este paciente?')) return;
    try {
      const response = await fetch(`http://localhost:3000/api/v1/pacientes/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro do Servidor (${response.status}): ${errorText.substring(0, 100)}`);
      }
      fetchPacientes();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h2>Pacientes</h2>

      <form onSubmit={handleSubmit} className="form-container">
        <h3>{editingId ? 'Editar Paciente' : 'Cadastrar Novo Paciente'}</h3>
        {formStatus.error && <p className="form-error">{formStatus.error}</p>}
        {formStatus.success && <p className="form-success">{formStatus.success}</p>}
        <div className="form-group">
          <label>Nome:</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Data de Nascimento:</label>
          <input type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>CPF:</label>
          <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Carteirinha:</label>
          <input type="text" value={carteirinha} onChange={(e) => setCarteirinha(e.target.value)} required />
        </div>
        <button type="submit">{editingId ? 'Atualizar' : 'Cadastrar'}</button>
        {editingId && (
          <button type="button" onClick={() => {
            setEditingId(null); setNome(''); setDataNascimento(''); setCpf(''); setCarteirinha(''); setFormStatus({ error: null, success: '' });
          }} style={{ marginLeft: '10px' }}>
            Cancelar
          </button>
        )}
      </form>

      <h3>Pacientes Cadastrados</h3>
      {loading && <p>Carregando...</p>}
      {listError && <p style={{ color: 'red' }}>{listError}</p>}
      {!loading && !listError && (
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px' }}>ID</th>
              <th style={{ padding: '8px' }}>Nome</th>
              <th style={{ padding: '8px' }}>Data de Nascimento</th>
              <th style={{ padding: '8px' }}>CPF</th>
              <th style={{ padding: '8px' }}>Carteirinha</th>
              <th style={{ padding: '8px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.length > 0 ? (
              pacientes.map(paciente => (
                <tr key={paciente.id}>
                  <td style={{ padding: '8px' }}>{paciente.id}</td>
                  <td style={{ padding: '8px' }}>{paciente.nome}</td>
                  <td style={{ padding: '8px' }}>{paciente.dataNascimento}</td>
                  <td style={{ padding: '8px' }}>{paciente.cpf}</td>
                  <td style={{ padding: '8px' }}>{paciente.carteirinha}</td>
                  <td style={{ padding: '8px' }}>
                    <button onClick={() => handleEdit(paciente)} style={{ marginRight: '5px' }}>Editar</button>
                    <button onClick={() => handleDelete(paciente.id)}>Excluir</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: '8px', textAlign: 'center' }}>Nenhum paciente encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="app-layout">
        <aside className="sidebar">
          <h2>apLIS</h2>
          <nav>
            <Link to="/medicos" className="nav-link">Médicos</Link>
            <Link to="/pacientes" className="nav-link">Pacientes</Link>
          </nav>
        </aside>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<h3>Bem-vindo! Selecione uma opção ao lado.</h3>} />
            <Route path="/medicos" element={<Medicos />} />
            <Route path="/pacientes" element={<Pacientes />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
