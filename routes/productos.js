/**
 * Productos Routes
 * 
 * /api/productos
 * 
 */

const { Router } = require("express");
const { getProductos, crearProducto, eliminarProducto, editarProducto } = require("../controllers/productos");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

//Obtener productos
router.get( '/', getProductos );
//Crear producto
router.post(
    '/', 
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearProducto);
//Editar producto
router.put('/:id', editarProducto);
//Eliminar producto
router.delete('/:id', eliminarProducto);


module.exports = router;