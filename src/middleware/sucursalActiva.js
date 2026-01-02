import { Sucursal } from "../models/index.js";

const sucursalActiva = async (req, res, next) => {

    const { sucursal } = req;

    try {

        if (!sucursal.esta_activa) {
            const error = new Error('Sucursal esta inactiva');
            return res.status(403).json({
                msg: error.message
            })
        }

        if (!sucursal.esta_verificada) {
            const error = new Error('Sucursal no está Verificada');
            return res.status(403).json({
                msg: error.message
            })
        }

        next();

    } catch (e) {
        console.log(e);
        const error = new Error('Error Interno del SErvidor');
        return res.status(500).json({
            msg: error.message
        })
    }

}

export {
    sucursalActiva
}