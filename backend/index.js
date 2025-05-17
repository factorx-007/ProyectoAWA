require('dotenv').config();
const mongoose = require('mongoose');

const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  methods: '*', 
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

mongoose.connect(process.env.URI)
.then(() => {
  console.log('🟢 Conectado a MongoDB, base de datos: ' + mongoose.connection.db.databaseName);
  })
.catch(err => console.error('🔴 Error al conectar a MongoDB', err));

const usuarioRoutes = require('./routes/usuarioRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const calificacionRoutes = require('./routes/calificacionRoutes');
const compraRoutes = require('./routes/compraRoutes');
const denunciaRoutes = require('./routes/denunciaRoutes');
const interaccionRoutes = require('./routes/interaccionRoutes');
const itemRoutes = require('./routes/itemRoutes');
const motivoDenunciaRoutes = require('./routes/motivoDenunciaRoutes');
const productoRoutes = require('./routes/productoRoutes');
const imgsRoutesUsers = express.static(path.join(__dirname, 'uploads', 'user_imgs'));
const imgsRoutesItems = express.static(path.join(__dirname, 'uploads', 'item_imgs'));
const uploadRoutes = require('./routes/uploadRoutes');//uploadRoutes tiene el middleware
const authRoutes = require('./routes/authRoutes');

const chatRoutes =  require('./routes/chatRoutes');
const mensajeRoutes = require('./routes/mensajeRoutes');

app.use(express.json());

const authMiddleware = require('./auth/authMiddleware');

app.use('/api/auth', authRoutes);

//app.use('/api/usuarios', authMiddleware, usuarioRoutes); //quitar la protección de middeware si se hace un post

app.use('/api/usuarios', (req, res, next) => {
  if (req.method === 'POST' && req.path === '/') {
    return next();
  }
  authMiddleware(req, res, next);
}, usuarioRoutes);

app.use('/api/categorias', authMiddleware, categoriaRoutes);
app.use('/api/calificaciones', authMiddleware, calificacionRoutes);
app.use('/api/compras', authMiddleware, compraRoutes);
app.use('/api/denuncias', authMiddleware, denunciaRoutes);
app.use('/api/interacciones', authMiddleware, interaccionRoutes);
app.use('/api/items', authMiddleware, itemRoutes);
app.use('/api/motivos-denuncia', authMiddleware, motivoDenunciaRoutes);
app.use('/api/productos', authMiddleware, productoRoutes);

app.use('/api/uploads/user_imgs', authMiddleware, imgsRoutesUsers);//obtener imágenes
app.use('/api/uploads/item_imgs', authMiddleware, imgsRoutesItems);
app.use('/api/upload-img', uploadRoutes);//añadir middleware

//urls de mongoDB
app.use('/api/chats', authMiddleware, chatRoutes);
app.use('/api/mensajes', authMiddleware, mensajeRoutes);

const PORT = 4000;

app.listen(PORT, () => {
  console.log('Servidor iniciado en puerto ' + PORT);
});
