import jwt from 'jsonwebtoken';
import { SuperAdmin } from '../models/index.js'

const protegerRutaAdministrador = async (req, res, next) => {
    
    const { authorization: tokenHeader } = req.headers;
    if (tokenHeader && tokenHeader.startsWith('Bearer')) {
        
        try {
           
            //Extraer Berer
            const token = tokenHeader.split(' ')[1];
    
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const administrador = await SuperAdmin.scope('eliminarInfo').findByPk(decoded.id);
 
            if (!administrador) {
                const error = new Error('Token no Válido o inexistente');
                return res.status(403).json({
                    msg: error.message
                });
            } else {
                req.administrador = administrador;
            }

            return next()

        } catch (e) {
            console.log('Error al verificar el token: ', e);
            const error = new Error('Error al verificar el token: ');
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
    protegerRutaAdministrador

}