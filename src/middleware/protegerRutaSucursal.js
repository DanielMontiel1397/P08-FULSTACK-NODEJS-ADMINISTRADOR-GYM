import jwt from 'jsonwebtoken';
import { Sucursal } from '../models/index.js'

const sucursalAutenticado = async (req, res, next) => {

    let { authorization: token } = req.headers;

    if (token && token.startsWith('Bearer')) {

        try {
          
            let tokenLimpio = token.split(' ')[1];

            const decoded = jwt.verify(tokenLimpio, process.env.JWT_SECRET);

            req.sucursal = await Sucursal.scope('eliminarInfo').findByPk(decoded.id);

            return next();

        } catch (e) {
            const error = new Error('Token no Válido');
            return res.status(403).json({
                msg: error.message
            });
        }

    } else {

        const error = new Error('Token no Válido o inexistente');
        return res.status(403).json({
            msg: error.message
        });
    }

};

export {
    sucursalAutenticado
}