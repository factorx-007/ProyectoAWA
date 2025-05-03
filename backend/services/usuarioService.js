const bcrypt = require('bcryptjs');
const BaseService = require('./BaseService');
const { Usuario } = require('../models');

class UsuarioService extends BaseService {
  constructor() {
    super(Usuario);
  }

  async create(data) {
    if (!data.contrasena) {
      throw new Error("La contraseña es requerida");
    }

    const salt = await bcrypt.genSalt(10);
    data.contrasena = await bcrypt.hash(data.contrasena, salt);

    return await super.create(data);
  }

  async validatePassword(email, plainPassword) {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return null;

    const match = await bcrypt.compare(plainPassword, usuario.contrasena);
    if (!match) return null;

    return usuario;
  }
}

module.exports = new UsuarioService();
