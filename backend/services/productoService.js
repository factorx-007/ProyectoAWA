const BaseService = require('./BaseService');
const { Producto } = require('../models');

class ProductoService extends BaseService {
  constructor() {
    super(Producto);
  }
}

module.exports = new ProductoService();
