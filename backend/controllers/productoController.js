const BaseController = require('./BaseController');
const productoService = require('../services/productoService');

class ProductoController extends BaseController {
  constructor() {
    super(productoService);
  }
}

module.exports = new ProductoController();
