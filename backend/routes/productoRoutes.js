const generateCrudRoutes = require('./genericRoutes');
const productoController = require('../controllers/productoController');

module.exports = generateCrudRoutes(productoController);
