import { validationResult } from "express-validator"


export const handleInputErrors = (req, res, next) => {
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        const mensajes = errores.array().map(error => error.msg);

        return res.status(400).json({
            errores: mensajes
        })
    }

    next()
}