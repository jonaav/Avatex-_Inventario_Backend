/**
 * Compras Routes
 * 
 * /api/compras
 * 
 */

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { getCompras, registrarCompra, eliminarCompra, marcarCompraPagada, updateCampoInCompra } = require("../controllers/compras");

const router = Router();

//Obtener Compras
router.get('/:mes/:year', getCompras);
//Marcar pagado
router.get('/:id', marcarCompraPagada);
//Registrar Compra
router.post(
    '/',
    [
        check('proveedor', 'El proveedor es obligatorio').not().isEmpty(),
        check('productos', 'No hay productos comprados').not().isEmpty(),
        check('fecha', 'La fecha es obligatoria').not().isEmpty(),
        check('total', 'Se requiere el monto total').not().isEmpty(),
        validarCampos
    ],
    registrarCompra);
//Update Compra
router.patch(
    '/:id',
    [
        check('campo', 'El campo está vacío').not().isEmpty(),
        check('value', 'El valor está vacío').not().isEmpty(),
        validarCampos
    ],
    updateCampoInCompra
);
//Eliminar Compra
router.delete('/:id', eliminarCompra);

module.exports = router;