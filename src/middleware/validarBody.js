import { validationResult } from "express-validator"


export const handleInputErrors = (req, res, next) => {
    const errores = validationResult(req);

    if(!errores.isEmpty()){

        const erroresFormateados = errores.array().map(error => ({
            path: error.path,
            msg: error.msg
        }))

        return res.status(400).json({
            errors: erroresFormateados
        })
    }

    next()
}