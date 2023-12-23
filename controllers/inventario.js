const { response } = require("express");
const { getKardexByMesAndYear, renovarKardex } = require("../service/kardex/kardex");
const { obtenerNombreMes, obtenerNombreMesAnterior } = require("../helpers/dateHelper");
const Producto = require("../models/Producto");
const Kardex = require("../models/Kardex");


const getKardexListBy = async (req, res = response) => {
    console.log(req.params)
    const { mes, year } = req.params;
    const { lista } = await getKardexByMesAndYear({ mes, year });

    res.json({
        ok: true,
        kardexList: lista
    })
}

const renovarKardexMes = async (req, res = response) => {
    const fecha = new Date();
    const mes = obtenerNombreMes(fecha);
    // const mesAnt = obtenerNombreMesAnterior(fecha);
    const year = fecha.getFullYear();
    try {
        const productos = await Producto.find().sort({ nombre: 1 });
        const kardexList = [];
        for (const producto of productos)  {
            console.log('PRODUCTO -> ', producto.nombre);
            const kExiste = await Kardex.findOne({ producto: producto.nombre, mes: mes, year: year })
            console.log('KDX Existe: ', kExiste)
            if (kExiste) continue;
            const kdxAnterior = await Kardex.findOne({ producto: producto.nombre }).sort({fecha:-1}).limit(1).exec()
            console.log('KDX Anterior: ', kdxAnterior)
            const newKardex = await renovarKardex(producto.nombre, kdxAnterior, mes, year);
            console.log('KDX Renovado: ', newKardex)
            kardexList.push(newKardex.kardex);
        };
        const countKardex = await Kardex.countDocuments({mes: mes, year: year });
        console.log('Lista ->',kardexList)
        res.json({
            ok: true,
            msg: 'Proceso exitoso',
            kdxRenovados: kardexList,
            count: productos.length - countKardex
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: error.message || 'Ocurrió un error al renovar inventario mensual'
        });
    }
}

const validaKardexMensual = async (req, res = response) => {
    const fecha = new Date();
    const mes = obtenerNombreMes(fecha);
    const year = fecha.getFullYear();
    try {
        const productos = await Producto.find();
        const kdxList = await Kardex.find({mes: mes, year: year })
        if (productos.length!==kdxList.length) {
            const count = productos.length-kdxList.length;
            res.json({
                ok: true,
                msg: `Faltan ${count} por crear`,
                count: count
            });
        }else{
            res.json({
                ok: true,
                msg: `El inventario está al día`,
                count: 0
            });
        }
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: error.message || 'Ocurrió un error al verificar inventario mensual'
        });
    }
}


module.exports = {
    getKardexListBy,
    renovarKardexMes,
    validaKardexMensual,
}