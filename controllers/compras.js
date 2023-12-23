const { response } = require("express");
const Compra = require("../models/Compra");
const { actualizarCompraKardex } = require("../service/kardex/kardex");
const Kardex = require("../models/Kardex");
const { crearKardexCompra, getLastKardexCompra, getKardexComprasMesYear, } = require("../service/kardexCompra/kardexCompra");
const KardexCompra = require("../models/KardexCompra");
const { obtenerNombreMes } = require("../helpers/dateHelper");

const getCompras = async (req, res = response) => {
    console.log(req.params);
    const { mes, year } = req.params;
    const data = await getKardexComprasMesYear({mes,year});
    
    res.json({
        ok: true,
        compras: data.compras
    })
}

const registrarCompra = async (req, res = response) => {
    const newCompra = new Compra(req.body);
    const opcion = 'add';
    try {
        const compra = await newCompra.save();
        for (const producto of compra.productos) {
            const kdxExiste = await Kardex.findOne({ 
                producto: producto.nombre, 
                mes: obtenerNombreMes(compra.fecha),
                year: compra.fecha.getFullYear()
            });
            console.log('kdxExiste: ', kdxExiste)
            const kardexCompra = await crearKardexCompra(
                compra.fecha, producto.cantidad, producto.precio, compra.id, kdxExiste.id);
            await actualizarCompraKardex(kdxExiste, kardexCompra.cantidad, kardexCompra.costo, kardexCompra.fecha, opcion);
        }
        res.json({
            ok: true,
            msg: 'Compra registrada',
            compra: compra
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: error.message || 'Ocurrió un error al guardar la compra'
        });
    }
}

const updateCampoInCompra = async (req, res=response) => {
    const { campo, value } = req.body;
    const { id } = req.params;
    try {
        const compra = await Compra.findOne({_id: id});
        if (!compra) {
            return res.status(404).json({
                ok: false,
                msg: 'Compra no encontrada'
            });
        }
        compra[campo] = value;
        const resCompra = await compra.save();
        console.log('SE Agregó factura', resCompra);

        res.json({
            ok: true,
            msg: 'Compra actualizada',
            compra: resCompra
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: error.message || 'Ocurrió un error actualizar la compra'
        });
    }
}


const marcarCompraPagada = async (req, res=response) => {
    const { id } = req.params;
    try {
        const compra = await Compra.findOne({_id: id});
        if (!compra) {
            return res.status(404).json({
                ok: false,
                msg: 'Compra no encontrada'
            });
        }
        compra.pagado = 'SI';
        const resCompra = await compra.save();
        console.log('MARCA PAGADO', resCompra);

        res.json({
            ok: true,
            msg: 'Compra actualizada',
            compra: resCompra
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: error.message || 'Ocurrió un error actualizar la compra'
        });
    }
}


const eliminarCompra = async (req, res = response) => {
    const id = req.params.id;
    const opcion = '';
    console.log('ID:', id)
    try {
        //Busca compra
        const compra = await Compra.findById(id);
        if (!compra) throw new Error(`La compra no existe`);
        //Busca kardexcompras []
        const kardexCompras = await KardexCompra.find({ idCompra: id });
        console.log('KCs: ', kardexCompras)
        if (!kardexCompras) throw new Error(`kardexCompras no existen`);
        for (const kardexCompra of kardexCompras) {
            console.log('KC-> ', kardexCompra)
            //Busca kardex
            const kardex = await Kardex.findById(kardexCompra.idKardex);
            console.log('Kardex encontrado: ', kardex)
            //Elimina kardexcompra
            await KardexCompra.findByIdAndDelete(kardexCompra.id);
            //Busca ultima compra 
            const {lastKC,ok} = await getLastKardexCompra(kardex.id);
            console.log('Ultima compra: ', lastKC)
            if (ok) {
                //Actualiza kardex
                await actualizarCompraKardex(kardex, kardexCompra.cantidad, lastKC.costo, lastKC.fecha, opcion);
            } else {
                await actualizarCompraKardex(kardex, kardexCompra.cantidad, 0, new Date, opcion);
            }

        }
        //Eliminar compra
        await Compra.findByIdAndDelete(id);
        return res.json({
            ok: true,
            msg: `La compra con factura ${compra.factura} se ha eliminado`
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: error.message || 'No se pudo eliminar la compra',
        });
    }
}

module.exports = {
    getCompras,
    registrarCompra,
    updateCampoInCompra,
    eliminarCompra,
    marcarCompraPagada
}