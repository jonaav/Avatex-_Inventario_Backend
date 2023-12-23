/**
 * Home Routes
 * 
 * /api/kardex
 * 
 */

const { Router } = require("express");
const { getKardexListBy, renovarKardexMes, validaKardexMensual } = require("../controllers/inventario");


const router = Router();

//Obtener Kardex
router.get('/:mes/:year', getKardexListBy);
router.get('/renovar', renovarKardexMes);
router.get('/validarRenovacion', validaKardexMensual);



module.exports = router;