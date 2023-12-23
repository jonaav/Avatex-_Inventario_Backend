const multer = require('multer');
const path = require('path');

// Especificar la ruta absoluta al directorio de carga
const uploadDir = path.join(__dirname, '..', 'public', 'facturas');
// Configuración de multer para manejar la carga de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('URL---',uploadDir)
        cb(null, uploadDir); // Directorio donde se almacenarán los archivos
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Nombre de archivo único
    },
});

const upload = multer({ storage: storage });

const handleFileUpload = (req, res) => {
    console.log('URL---',uploadDir)
    console.log('file req---',req.file)
    const { filename } = req.file;
    const fileUrl = `/facturas/${filename}`;
    res.json({ ok:true, message: 'Archivo subido con éxito', fileUrl});
  };

module.exports={
    upload,
    handleFileUpload
}