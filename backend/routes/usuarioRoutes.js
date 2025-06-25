const generateCrudRoutes = require('./genericRoutes');
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/ventas/:id_usuario', usuarioController.ventas);

generateCrudRoutes(usuarioController, router);

module.exports = router;