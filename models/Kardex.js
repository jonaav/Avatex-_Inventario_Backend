const { Schema, model } = require("mongoose");
const { obtenerNombreMes } = require("../helpers/dateHelper");


const KardexSchema = Schema({
    producto: {
        type: String,
        required: true,
    },
    fecha: {
        type: Date,
        required: true,
    },
    mes: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    costo: {
        type: Number,
        required: true,
    },
    ventas: {
        type: Number,
        required: true,
    },
    compras: {
        type: Number,
        required: true,
    },
    saldo: {
        type: Number,
        required: true,
    },
})

KardexSchema.method('calcularSaldo', function(){
    this.saldo = this.compras - this.ventas;
})

KardexSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
})

KardexSchema.method('nuevoKardex', function (nombre) {
    const fechaActual = new Date();
    this.producto = nombre;
    this.fecha = fechaActual;
    this.mes = obtenerNombreMes(fechaActual);
    this.year = fechaActual.getFullYear();
    this.costo = 0;
    this.ventas = 0;
    this.compras = 0;
    this.saldo = 0;
})

KardexSchema.method('renuevaKardex', function (kdx, mes, year) {
    this.producto = kdx.producto;
    this.fecha = kdx.fecha;
    this.mes = mes;
    this.year = year;
    this.costo = kdx.costo;
    this.ventas = 0;
    this.compras = 0;
    this.saldo = kdx.saldo;
})

module.exports = model('Kardex', KardexSchema);