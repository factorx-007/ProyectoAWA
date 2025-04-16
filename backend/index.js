const express = require('express');
const app = express();
const usuarioRoutes = require('./routes/usuarioRoutes');

app.use(express.json());
app.use('/api/usuarios', usuarioRoutes);

app.listen(3000, () => {
  console.log('Servidor iniciado en puerto 3000');
});
