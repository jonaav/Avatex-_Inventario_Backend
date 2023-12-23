const { Schema, model } = require("mongoose");

const CompraSchema = Schema ({
    factura: {
        type: String,
        required: false
    },
    proveedor: {
        type: String,
        required: true
    },
    productos: {
        type: Array,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    pagado: {
        type: String,
        default: 'NO',
        required: true
    },
    urlFactura: {
        type: String,
        required: false
    },
})


CompraSchema.method('toJSON', function(){
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
})


module.exports = model('Compra', CompraSchema);