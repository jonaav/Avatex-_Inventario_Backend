const { Schema, model } = require("mongoose");


const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: true,
    },
    // codigo: {
    //     type: String,
    //     required: false,
    // }
});

ProductoSchema.method('toJSON', function(){
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
})


module.exports = model('Producto', ProductoSchema);
