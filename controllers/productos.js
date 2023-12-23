const { response } = require("express");
const Producto = require("../models/Producto");
const Kardex = require("../models/Kardex");
const { crearKardex } = require("../service/kardex/kardex");


const getProductos = async ( req, res= response) => {
    const productos = await Producto.find().sort({nombre: 1});

    res.json({
        ok:true,
        productos: productos
    })
}

const crearProducto = async ( req, res= response) => {
    const producto = new Producto(req.body);
    let kardexResponse;
    try {
        //Verifica producto repetido
        const existeProducto = await Producto.findOne({nombre: producto.nombre});
        if(existeProducto) throw new Error(`El producto "${producto.nombre}" ya está registrado`);
        //Guarda producto
        const productoGuardado = await producto.save();
        //Verifica kardex repetido
        const existeKardex = await Kardex.findOne({ producto: productoGuardado.nombre });
        if(!existeKardex){
            kardexResponse = await crearKardex(productoGuardado.nombre);
        }
        res.json({
            ok: true,
            msg: `${productoGuardado.nombre} se guardó correctamente`,
            producto: productoGuardado,
            kardex: kardexResponse
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'No se pudo registrar el producto'
        })
    }
}

const editarProducto = async (req, res=response) => {
    const productoId = req.params.id;
    const productoEdit = req.body;
    try {
        const pEncontrado = await Producto.findById(productoId);
        if(!pEncontrado) throw new Error('El producto con ese id no existe');

        pEncontrado.nombre = productoEdit.nombre;
        // pEncontrado.codigo = productoEdit.codigo;
        const editado = await pEncontrado.save();

        res.json({
            ok: true,
            msg: `Se actualizaron los datos`,
            producto: editado
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'No se pudo actualizar el producto'
        })
    }
}

const eliminarProducto = async (req, res=response) => {
    const productoId = req.params.id;
    try {
        const producto = await Producto.findById(productoId);
        if(!producto) throw new Error('El producto con ese id no existe');

        await Producto.findByIdAndDelete(productoId);
        res.json({
            ok: true,
            msg: `Se eliminó ${producto.nombre}`
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'No se pudo eliminar el producto'
        })
    }
}

module.exports = {
    getProductos,
    crearProducto,
    editarProducto,
    eliminarProducto
}