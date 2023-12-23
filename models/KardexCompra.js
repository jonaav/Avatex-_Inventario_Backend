const { Schema, model } = require("mongoose");


const KardexCompraSchema = Schema({
    fecha: {
        type: Date,
        required: true,
    },
    cantidad: {
        type: Number,
        required: true,
    },
    costo: {
        type: Number,
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
    idCompra: {
        type: String,
        required: true,
    },
    idKardex: {
        type: String,
        required: true,
    },
})

KardexCompraSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
})


module.exports = model('KardexCompra', KardexCompraSchema);