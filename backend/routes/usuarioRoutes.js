const generateCrudRoutes = require('./genericRoutes');
const usuarioController = require('../controllers/usuarioController');

module.exports = generateCrudRoutes(usuarioController);
