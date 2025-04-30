const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const usuarioRoutes = require('./routes/usuarioRoutes');
// backend/index.js o server.js
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));


app.use(express.json());
app.use('/api/usuarios', usuarioRoutes);

app.listen(port, () => {
  console.log('Servidor iniciado tu puedes mi rey');
});
