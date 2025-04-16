const usuarioService = require('../services/usuarioService');

module.exports = {
  async listarUsuarios(req, res) {
    const usuarios = await usuarioService.obtenerTodos();
    res.json(usuarios);
  },

  async crearUsuario(req, res) {
    const { nombres, apellidos, email, contrasena, telefono, url_img } = req.body;

    // Validación básica
    if (!nombres || !apellidos || !email || !contrasena || !telefono) {
      return res.status(400).json({ mensaje: 'Todos los campos obligatorios deben estar completos' });
    }

    try {
      const nuevoUsuario = await usuarioService.crear({
        nombres,
        apellidos,
        email,
        contrasena,
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
  }
};
