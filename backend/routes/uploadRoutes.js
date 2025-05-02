/*const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../auth/authMiddleware');

const router = express.Router();

const allowedFolders = ['user_imgs', 'item_imgs'];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const carpeta = req.body.carpeta;
    if (!allowedFolders.includes(carpeta)) {
      return cb(new Error('Carpeta inválida, carpeta que se intentó: ' + carpeta));
    }

    const dir = path.join(__dirname, '..', 'uploads', carpeta);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}${ext}`);
  }
});

const upload = multer({ storage });

router.post('/', authMiddleware, upload.single('imagen'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se recibió ningún archivo.' });
  }

  return res.json({ nombreArchivo: req.file.filename });
});

module.exports = router;
*/

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../auth/authMiddleware');
const { log } = require('console');

const router = express.Router();

const allowedFolders = ['user_imgs', 'item_imgs'];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // multer ya habrá procesado req.body.carpeta si el campo 'carpeta' fue enviado antes que el archivo
    const carpeta = req.body?.carpeta;
    if (!carpeta || !allowedFolders.includes(carpeta)) {
      return cb(new Error('Carpeta inválida, carpeta que se intentó: ' + carpeta));
    }

    const dir = path.join(__dirname, '..', 'uploads', carpeta);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}${ext}`);
  }
});

const upload = multer({ storage });

// Ya no necesitas interceptar el body antes
router.post('/', upload.single('imagen'), (req, res) => {
  console.log('req.body:', req.body);
  console.log('req.file:', req.file);
  if (!req.file) {
    return res.status(400).json({ error: 'No se recibió ningún archivo.' });
  }

  return res.json({ nombreArchivo: req.file.filename });
});

module.exports = router;
