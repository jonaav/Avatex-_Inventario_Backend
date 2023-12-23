
const { response } = require('express');
const { validationResult } = require('express-validator');

const validarCampos = (req, res = response, next) => {
    //Manejo de errores
    const errors = validationResult( req );

    if(!errors.isEmpty()) {
        // Accede al primer error y extrae el mensaje
        const primerError = Object.values(errors.mapped())[0];
        const mensajeDeError = primerError.msg;
        return res.status(400).json({
            ok:false,
            msg: mensajeDeError,
            errors: errors.mapped()
        })
    }

    next();
}


module.exports = {
    validarCampos
}