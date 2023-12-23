
const dateHelper = require("../../helpers/dateHelper");
const Compra = require("../../models/Compra");
const KardexCompra = require("../../models/KardexCompra");

const crearKardexCompra = async (fecha, cantidad, precio, idCompra, idKardex) => {
    try {
        const newKardexCompra = new KardexCompra({
            fecha: fecha,
            cantidad: cantidad,
            costo: precio,
            mes: dateHelper.obtenerNombreMes(fecha),
            year: dateHelper.obtenerAnio(fecha),
            idCompra: idCompra,
            idKardex: idKardex
        });
        const kardexCompra = await newKardexCompra.save()
        if (!kardexCompra) throw new Error(`Ocurrió un error al guardar kardexCompra ${producto.nombre}`);
        return kardexCompra;
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            msg: error.message
        }
    }
}
const getLastKardexCompra = async (idKardex) => {
    try {
        console.log('lastKC by id: ', idKardex)
        const lastKC = await KardexCompra.findOne({ idKardex }).sort({ fecha: -1 }).limit(1).exec();
        console.log('lastKC: ', lastKC)
        if (!lastKC) {
            return {
                ok: false,
                lastKC: {}
            };
        }
        return {
            ok: true,
            lastKC: lastKC
        };
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            msg: error.message
        };
    }
}

const getKardexComprasMesYear = async ({mes, year}) => {
    try {
        const kcList = await KardexCompra.find({mes,year}).sort({fecha: -1}).exec();
        if (!kcList) {
            throw new Error(`No se encontraron datos`);
        }
        const compras = [];
        for(const kc of kcList) {
            console.log('KC iterable -> ',kc.idCompra);
            const compra = await Compra.findOne({_id:kc.idCompra});
            const repetido = compras.some((c)=>c.id === compra.id)
            if(!repetido) compras.push(compra);
        }
        console.log('compras: -> ', compras)
        return {
            ok: true,
            compras: compras
        };
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            msg: error.message
        };
    }
} 

module.exports = {
    crearKardexCompra,
    getLastKardexCompra,
    getKardexComprasMesYear
}