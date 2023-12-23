
const Kardex = require("../../models/Kardex");


const crearKardex = async (producto) => {
    const kardex = new Kardex();
    try {
        kardex.nuevoKardex(producto);
        const kardexGuardado = await kardex.save();
        console.log('Kardex Guradado', kardexGuardado)
        return {
            ok: true,
            msg: 'Kardex creado correctamente',
            kardex: kardexGuardado
        }
    } catch (error) {
        console.log(error)
        return {
            ok: false,
            msg: 'Error al crear Kardex',
            error: error
        }
    }
}


const actualizarCompraKardex = async(kardex, cantidad, costo, fecha, opcion) => {
    try {
        console.log(kardex);
        kardex.compras += (opcion==='add')? cantidad:-cantidad;
        kardex.costo = costo;
        kardex.fecha = fecha;
        kardex.calcularSaldo();
        const guardado = await kardex.save();
        console.log('kGuardado: ', guardado);
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            msg: error.message
        }
    }
}

const actualizarVentaKardex = async(kardex, cantidad, opcion) => {
    try {
        console.log(kardex);
        if(cantidad>kardex.saldo) throw new Error(`La cantidad vendida de ${kardex.producto} supera el stock`);
        kardex.ventas += (opcion==='add')? cantidad:-cantidad;
        kardex.calcularSaldo();
        const guardado = await kardex.save();
        console.log('kGuardado: ', guardado);
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            msg: error.message
        }
    }
}

const getKardexByMesAndYear = async ({mes, year}) => {

    try {
        const list = await Kardex.find({ mes, year }).sort({ producto: 1 }).exec();
        if (!list) {
            throw new Error(`No se encontraron datos`);
        }
        return {
            ok: true,
            lista: list
        };
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            msg: error.message
        };
    }
}

const renovarKardex = async (producto='', lastKdx={}, mes, year) => {
    const kardex = new Kardex();
    try {
        if(lastKdx){
            kardex.renuevaKardex(lastKdx, mes, year);
        }else{
            kardex.nuevoKardex(producto);
        }
        const kardexGuardado = await kardex.save();
        console.log('Kardex Guradado', kardexGuardado)
        return {
            ok: true,
            msg: 'Kardex creado correctamente',
            kardex: kardexGuardado
        }
    } catch (error) {
        console.log(error)
        return {
            ok: false,
            msg: 'Error al crear Kardex',
            error: error
        }
    }
}

module.exports = {
    crearKardex,
    actualizarCompraKardex,
    actualizarVentaKardex,
    getKardexByMesAndYear,
    renovarKardex,
}