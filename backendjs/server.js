const express = require('express');
const cors = require('cors');
const pacienteRoutes = require('./routes/pacienteRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1/pacientes', pacienteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend Node.js rodando na porta ${PORT}`);
});