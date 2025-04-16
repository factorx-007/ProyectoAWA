const { Usuario } = require('../models');

module.exports = {
  async obtenerTodos() {
    return await Usuario.findAll();
  },

  async crear(data) {
    return await Usuario.create(data);
  },

  async obtenerPorId(id) {
    return await Usuario.findByPk(id);
  },

  async eliminar(id) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return null;
    await usuario.destroy();
    return true;
  }
};
