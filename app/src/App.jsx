import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'

// Componentes temporários (o ideal é extrair para a pasta src/pages/ futuramente)
const Medicos = () => {
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/medicos');
        
        // Tenta ler o corpo da resposta como JSON, independentemente do status.
        // Isso é crucial para obter a mensagem de erro que vem da API.
        const data = await response.json();

        if (!response.ok) {
          // Se a API enviou uma mensagem de erro no JSON, use-a.
          // Caso contrário, use uma mensagem padrão.
          throw new Error(data.message || 'Erro ao carregar médicos.');
        }

        setMedicos(data);
      } catch (err) {
        // `err.message` pode ser a mensagem da API, um erro de rede,
        // ou um erro de parsing de JSON (como o que você viu).
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicos();
  }, []);

  return (
    <div>
      <h2>Médicos</h2>
      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px' }}>ID</th>
              <th style={{ padding: '8px' }}>Nome</th>
              <th style={{ padding: '8px' }}>CRM</th>
              <th style={{ padding: '8px' }}>UF</th>
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '8px', textAlign: 'center' }}>Nenhum médico encontrado.</td>
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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/pacientes');

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || data.error || 'Erro ao carregar pacientes.');
        }

        setPacientes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPacientes();
  }, []);

  return (
    <div>
      <h2>Pacientes</h2>
      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px' }}>ID</th>
              <th style={{ padding: '8px' }}>Nome</th>
              <th style={{ padding: '8px' }}>Data de Nascimento</th>
              <th style={{ padding: '8px' }}>CPF</th>
              <th style={{ padding: '8px' }}>Carteirinha</th>
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: '8px', textAlign: 'center' }}>Nenhum paciente encontrado.</td>
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
            <Route path="/" element={<h1>Bem-vindo! Selecione uma opção ao lado.</h1>} />
            <Route path="/medicos" element={<Medicos />} />
            <Route path="/pacientes" element={<Pacientes />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
