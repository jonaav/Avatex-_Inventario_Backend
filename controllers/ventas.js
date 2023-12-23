const { obtenerNombreMes } = require("../helpers/dateHelper");
const Kardex = require("../models/Kardex");
const Venta = require("../models/Venta");
const { actualizarVentaKardex } = require("../service/kardex/kardex");


const getVentas = async (req, res = response) => {
    const { mes, year } = req.params;
    
    // Convierte el mes y año a números enteros
    const mesInt = parseInt(mes, 10);
    const yearInt = parseInt(year, 10);

    // Obtén las ventas filtradas por mes y año
    const ventas = await Venta.find({
        fecha: {
            $gte: new Date(yearInt, mesInt - 1, 1), // Primer día del mes
            $lt: new Date(yearInt, mesInt, 1) // Primer día del siguiente mes
        }
    }).sort({ fecha: -1 }).exec();

    res.json({
        ok: true,
        ventas: ventas
    })
}

const registrarVenta = async (req, res = response) => {
    console.log('------ REGISTRAR_VENTAS ------')
    const newVenta = new Venta(req.body);
    const opcion = 'add';
    try {
        for(const producto of newVenta.productos){
            const kardex = await Kardex.findOne({ 
                producto: producto.nombre ,
                mes: obtenerNombreMes(newVenta.fecha),
                year: newVenta.fecha.getFullYear()
            });
            if (!kardex) throw new Error(`No se encontró kardex ${producto.nombre}`);
            await actualizarVentaKardex(kardex, producto.cantidad, opcion);
        }
        const venta = await newVenta.save();
        console.log(venta)
        res.json({
            ok: true,
            msg: 'La venta fue registrada',
            venta: venta
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: error.message || 'No se pudo registrar la venta'
        });
    }
}

const eliminarVenta = async (req, res = response) => {
    const id = req.params.id;
    const opcion = '';
    console.log('ID:', id)
    try {
        const venta = await Venta.findById(id);
        if (!venta) throw new Error(`La venta no existe`);
        for(const producto of venta.productos){
            const kardex = await Kardex.findOne({ 
                producto: producto.nombre ,
                mes: obtenerNombreMes(venta.fecha),
                year: venta.fecha.getFullYear()
            });
            if (!kardex) throw new Error(`No se encontró kardex ${producto.nombre}`);
            await actualizarVentaKardex(kardex, producto.cantidad, opcion);
        }
        await Venta.findByIdAndDelete(id);
        return res.json({
            ok: true,
            msg: `La venta se ha eliminado`
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: error.message || 'No se pudo eliminar la venta',
        });
    }
}


module.exports = {
    getVentas,
    registrarVenta,
    eliminarVenta
}