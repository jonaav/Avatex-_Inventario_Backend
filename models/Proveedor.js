const { Schema, model } = require("mongoose");




const ProveedorSchema = Schema ({
    nombre: {
        type: String,
        required: true
    },
    numCuenta: {
        type: String,
        required: false
    },
    banco: {
        type: String,
        required: false
    },
})


ProveedorSchema.method('toJSON', function(){
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
})


module.exports = model('Proveedor', ProveedorSchema);