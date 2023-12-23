/**
 * Documentos Routes
 * 
 * /api/upload
 * 
 */

const { Router } = require("express");
const { upload, handleFileUpload } = require("../controllers/documentos");


const router = Router();


// router.post('/upload', upload.single('urlFactura'), handleFileUpload);



module.exports = router;