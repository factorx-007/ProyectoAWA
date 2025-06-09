const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../auth/authMiddleware');

const router = express.Router();

// Carpetas permitidas para subir archivos
const allowedFolders = ['user_imgs', 'item_imgs'];

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Carpeta por defecto
    let carpeta = 'item_imgs';
    
    // Si se envía la carpeta en el query string
    if (req.query.carpeta && allowedFolders.includes(req.query.carpeta)) {
      carpeta = req.query.carpeta;
    }

    // Crear la ruta completa de la carpeta
    const dir = path.join(__dirname, '..', 'uploads', carpeta);
    
    // Asegurarse de que el directorio exista
    try {
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    } catch (err) {
      cb(err);
    }
  },
  filename: function (req, file, cb) {
    // Generar un nombre de archivo único con timestamp
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${timestamp}${ext}`);
  }
});

// Configurar multer con límites de archivo
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1
  },
  fileFilter: (req, file, cb) => {
    // Validar tipos de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes JPG, PNG y WEBP.'));
    }
  }
});

// Ruta para subir imágenes
router.post('/', 
  // Middleware de autenticación
  authMiddleware,
  
  // Middleware de multer para manejar la subida
  upload.single('imagen'),
  
  // Manejador de la ruta
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          error: 'No se recibió ningún archivo o el archivo es inválido.' 
        });
      }

      // Obtener la carpeta del query string o usar la predeterminada
      const carpeta = (req.query.carpeta && allowedFolders.includes(req.query.carpeta)) 
        ? req.query.carpeta 
        : 'item_imgs';

      // Construir la URL de la imagen
      const imageUrl = `/api/uploads/${carpeta}/${req.file.filename}`;
      
      // Respuesta exitosa
      res.json({ 
        success: true,
        nombreArchivo: req.file.filename,
        url: imageUrl,
        mensaje: 'Imagen subida correctamente',
        carpeta: carpeta
      });
      
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al procesar la imagen',
        detalle: error.message 
      });
    }
  }
);

// Manejador de errores global
router.use((err, req, res, next) => {
  console.error('Error en uploadRoutes:', err);
  res.status(500).json({ 
    success: false,
    error: 'Error al procesar la solicitud',
    detalle: err.message 
  });
});

module.exports = router;
