/**
 * Ventas Routes
 * 
 * /api/Ventas
 * 
 */

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { getVentas, eliminarVenta, registrarVenta } = require("../controllers/ventas");


const router = Router();

//Obtener Ventas
router.get('/:mes/:year', getVentas);
//Registrar Venta
router.post(
    '/',
    [
        check('productos','No hay productos vendidos').not().isEmpty(),
        check('fecha','La fecha es obligatoria').not().isEmpty(),
        check('total','Se requiere el monto total').not().isEmpty(),
        validarCampos
    ],
    registrarVenta);
//Eliminar Venta
router.delete('/:id', eliminarVenta);

module.exports = router;