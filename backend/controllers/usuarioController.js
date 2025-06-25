const BaseController = require('./BaseController');
const usuarioService = require('../services/usuarioService');

class UsuarioController extends BaseController {
  constructor() {
    super(usuarioService);
  }

  ventas = async (req, res) => {
    try {
      const id_usuario = req.params.id_usuario;
      const ventas = await this.service.getVentas(id_usuario);
      res.json(ventas);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

}

module.exports = new UsuarioController();
