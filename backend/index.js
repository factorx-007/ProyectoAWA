// backend/index.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const Chat = require('./models/mongoModels/chat');
const Mensaje = require('./models/mongoModels/mensaje');

// Conexiones a bases
mongoose.connect(process.env.URI)
  .then(() => console.log('🟢 Conectado a MongoDB'))
  .catch(err => console.error('🔴 Error al conectar a MongoDB', err));

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET','POST'], allowedHeaders: ['Content-Type','Authorization'] }
});

// Middlewares
app.use(cors({ origin: 'http://localhost:3000', methods: '*', allowedHeaders: ['Content-Type','Authorization'] }));
app.use(express.json());

app.use('/api/uploads/user_imgs', require('./auth/authMiddleware'), express.static(path.join(__dirname, 'uploads','user_imgs')));
app.use('/api/uploads/item_imgs', require('./auth/authMiddleware'), express.static(path.join(__dirname, 'uploads','item_imgs')));

// Rutas REST
app.use('/api/auth', require('./routes/authRoutes'));
//app.use('/api/usuarios', require('./auth/authMiddleware'), require('./routes/usuarioRoutes'));
const authMiddleware = require('./auth/authMiddleware');
const usuarioRoutes = require('./routes/usuarioRoutes');
app.use('/api/usuarios', (req, res, next) => {
  if (req.method === 'POST' && req.path === '/') {
    return next();
  }
  authMiddleware(req, res, next);
}, usuarioRoutes);
app.use('/api/categorias', require('./auth/authMiddleware'), require('./routes/categoriaRoutes'));
app.use('/api/motivos-denuncia', require('./auth/authMiddleware'), require('./routes/motivoDenunciaRoutes'));
app.use('/api/items', require('./auth/authMiddleware'), require('./routes/itemRoutes'));
app.use('/api/productos', require('./auth/authMiddleware'), require('./routes/productoRoutes'));
app.use('/api/interacciones', require('./auth/authMiddleware'), require('./routes/interaccionRoutes'));
app.use('/api/calificaciones', require('./auth/authMiddleware'), require('./routes/calificacionRoutes'));
app.use('/api/compras', require('./auth/authMiddleware'), require('./routes/compraRoutes'));
app.use('/api/denuncias', require('./auth/authMiddleware'), require('./routes/denunciaRoutes'));
app.use('/api/upload-img', require('./routes/uploadRoutes')); // uploadRoutes incluye su propio middleware
app.use('/api/chats', require('./auth/authMiddleware'), require('./routes/chatRoutes'));
app.use('/api/mensajes', require('./auth/authMiddleware'), require('./routes/mensajeRoutes'));

// Socket.IO
const usuariosConectados = {}; // map userId -> socketId

io.on('connection', socket => {
  console.log('🔌 Cliente conectado', socket.id);

  socket.on('registrarUsuario', userId => {
    usuariosConectados[userId] = socket.id;
  });

  socket.on('mensaje', async data => {
    console.log('📨 Evento mensaje recibido:', data);
    const { idChat, emisor, contenido, _idTemp } = data;
    try {
      // Buscamos chat por su _id
      const chat = await Chat.findById(idChat);
      if (!chat) {
        console.error('Chat no encontrado para idChat:', idChat);
        return;
      }

      // Almacenamos el mensaje
      const mensaje = await Mensaje.create({
        idChat: chat._id,
        idEmisor: emisor,
        contenido,
        timestamp: new Date(),
      });

      // Preparamos el payload a enviar
      const mensajeFrontend = {
        _id: mensaje._id,
        _idTemp,
        idChat: mensaje.idChat,
        idEmisor: mensaje.idEmisor,
        contenido: mensaje.contenido,
        timestamp: mensaje.timestamp,
      };

      // Emitimos a todos los participantes del chat
      chat.idParticipantes.forEach(userId => {
        const sockId = usuariosConectados[userId];
        if (sockId) io.to(sockId).emit('mensaje', mensajeFrontend);
      });
    } catch (err) {
      console.error('Error manejando mensaje por socket:', err);
    }
  });
});

// Arrancar servidor HTTP con Socket.IO
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Servidor escuchando en puerto ${PORT}`));
