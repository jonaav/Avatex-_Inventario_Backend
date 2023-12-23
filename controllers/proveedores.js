
const { response } = require('express');
const Proveedor = require('../models/Proveedor');

const getProveedores = async ( req, res= response) => {
    const proveedores = await Proveedor.find().sort({nombre: 1});

    res.json({
        ok:true,
        proveedores: proveedores
    })
}

const crearProveedor = async ( req, res= response) => {
    const proveedor = new Proveedor(req.body);

    try {
        //Verifica proveedor repetido
        const existeProveedor = await Proveedor.findOne({nombre: proveedor.nombre})
        if(existeProveedor) throw new Error(`El proveedor ${proveedor.nombre} ya se encuentra registrado`);
        //Guarda proveedor
        const proveedorGuardado = await proveedor.save();
        res.json({
            ok: true,
            msg: `${proveedorGuardado.nombre} se guardó correctamente`,
            proveedor: proveedorGuardado
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: error.message || 'No se pudo registrar el proveedor'
        })
    }
}

const eliminarProveedor = async ( req, res= response) => {
    const proveedorId = req.params.id;
    try {
        const proveedor = await Proveedor.findById(proveedorId);
        if(!proveedor) throw new Error(`No se encontró ${proveedor.nombre}`);
        await Proveedor.findByIdAndDelete(proveedorId);
        res.json({
            ok: true,
            msg: `Se eliminó ${proveedor.nombre}`,
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: error.message || 'No se pudo eliminar el proveedor'
        })
    }
}

module.exports = {
    getProveedores,
    crearProveedor,
    eliminarProveedor
}