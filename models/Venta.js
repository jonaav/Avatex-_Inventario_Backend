const { Schema, model } = require("mongoose");


const VentaSchema = Schema ({
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
})


VentaSchema.method('toJSON', function(){
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
})


module.exports = model('Venta', VentaSchema);