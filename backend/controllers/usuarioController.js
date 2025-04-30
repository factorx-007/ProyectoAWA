const usuarioService = require('../services/usuarioService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Solo si vas a usar JWT

module.exports = {
  async listarUsuarios(req, res) {
    const usuarios = await usuarioService.obtenerTodos();
    res.json(usuarios);
  },

  async crearUsuario(req, res) {
    const { nombres, apellidos, email, contrasena, telefono, url_img } = req.body;

    if (!nombres || !apellidos || !email || !contrasena || !telefono) {
      return res.status(400).json({ mensaje: 'Todos los campos obligatorios deben estar completos' });
    }

    try {
      // Cifrar contraseña
      const hashedPassword = await bcrypt.hash(contrasena, 10);

      const nuevoUsuario = await usuarioService.crear({
        nombres,
        apellidos,
        email,
        contrasena: hashedPassword,
        telefono,
        url_img
      });

      res.status(201).json(nuevoUsuario);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ mensaje: 'El email ya está registrado' });
      }
      console.error(error);
      res.status(500).json({ mensaje: 'Error al crear el usuario' });
    }
  },

  async obtenerUsuario(req, res) {
    const usuario = await usuarioService.obtenerPorId(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuario);
  },

  async eliminarUsuario(req, res) {
    const eliminado = await usuarioService.eliminar(req.params.id);
    if (!eliminado) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario eliminado' });
  },

  // 🔐 NUEVO: Método para iniciar sesión
  async login(req, res) {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
      return res.status(400).json({ mensaje: 'Email y contraseña son requeridos' });
    }

    try {
      const usuario = await usuarioService.obtenerPorEmail(email);
      if (!usuario) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }

      const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
      if (!esValida) {
        return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
      }

      // Puedes retornar un JWT o solo los datos básicos del usuario
      const token = jwt.sign({ id: usuario.id, email: usuario.email }, 'secret_key', { expiresIn: '1h' });

      res.json({ mensaje: 'Inicio de sesión exitoso', usuario: { id: usuario.id, email: usuario.email }, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al iniciar sesión' });
    }
  }
};
