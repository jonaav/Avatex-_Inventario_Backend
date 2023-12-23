/**
 * Proveedores Routes
 * 
 * /api/proveedores
 * 
 */

const { Router } = require("express");
const { 
    getProveedores, 
    crearProveedor, 
    eliminarProveedor 
} = require("../controllers/proveedores");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");


const router = Router();

//Obtener proveedor
router.get('/', getProveedores);
//Crear proveedores
router.post(
    '/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ], 
    crearProveedor);
//Eliminar proveedores
router.delete('/:id', eliminarProveedor);


module.exports = router;