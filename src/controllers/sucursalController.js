import emailVerificarNuevoEmail from "../helpers/emailActualizarEmail.js";
import generarToken from "../helpers/generarToken.js";
import { Cliente, Sucursal } from "../models/index.js";

//Gestion de Perfil

const perfil = async (req, res) => {
    const { id: idSucursal } = req.sucursal;

    try {
        const sucursal = await Sucursal.scope('eliminarInfo').findByPk(idSucursal);

        if (!sucursal) {
            const error = new Error('La sucursal no existe');
            return res.status(404).json({
                msg: error.message
            })

        };

        return res.json({
            data: {
                sucursal: sucursal
            },
            msg: 'Sucursal Obtenida Correctamente'
        })
    } catch (e) {
        console.log('Error al obtener perfil de sucursal', e);;
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }
}

const actualizarPerfil = async (req, res) => {

    const { name, email, address, phone } = req.body;
    const { id: idSucursal } = req.sucursal;
    let mensajeRespuesta;
    try {

        //Verificamos si la sucursal existe
        const sucursal = await Sucursal.findByPk(idSucursal);

        if (!sucursal) {
            const error = new Error('La sucursal no existe');
            return res.status(404).json({
                msg: error.message
            })

        };

        //Verificamos si se modifico el email
        if (email !== sucursal.email) {

            //Buscamos si el email nuevo ya existe
            const existeEmail = await Sucursal.findOne({
                where: {
                    email: email
                }
            });

            if (existeEmail) {
                const error = new Error('Email ya usado');
                return res.status(409).json({
                    msg: error.message
                })
            };

            //Si no existe enviamos email de confirmacion
            sucursal.token = generarToken();
            sucursal.newEmail = email;
            await sucursal.save();

            await emailVerificarNuevoEmail({
                email,
                token: sucursal.token,
                name: sucursal.name,
                tipoUsuario: 'sucursal'
            });

            mensajeRespuesta = 'Verifica el correo electronico para confirmar email'

        } else {
            mensajeRespuesta = 'Datos actualizados correctamente'
        }

        await sucursal.update({ name, address, phone })

        await sucursal.reload();

        return res.json({
            data: {
                sucursal
            },
            msg: mensajeRespuesta
        })

    } catch (e) {
        console.log('Error al actualizar perfil de sucursal', e);;
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }

}

const dashboard = async (req, res) => {
    const { id: idSucursal } = req.sucursal;

    try {

        const [
            clientesTotales,
            clientesActivos,
            clientesInactivos,
            clientesSemana,
            clientesMes,
            clientesAnualidad
        ] = await Promise.all([
            Cliente.count({where: {sucursalId: idSucursal}}),
            Cliente.count({where: {sucursalId: idSucursal, is_activated: true}}),
            Cliente.count({where: {sucursalId: idSucursal, is_activated: false}}),
            Cliente.count({where: {sucursalId: idSucursal, membership_type: 'semana'}}),
            Cliente.count({where: {sucursalId: idSucursal, membership_type: 'mes'}}),
            Cliente.count({where: {sucursalId: idSucursal, membership_type: 'anualidad'}})
        ])


        return res.json({
            data: {
                resumen: {
                    clientesTotales: clientesTotales,
                    clientesActivos: clientesActivos,
                    clientesInactivos: clientesInactivos,
                    tipo_membresia: {
                        semana: clientesSemana,
                        mes: clientesMes,
                        year: clientesAnualidad
                    }
                }
            },
            msg: 'Dashboard obtenido correctamente'
        })
    } catch (e) {
        console.log('Hubo un error al obtener la informacion general', e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }
}

export {
    perfil,
    actualizarPerfil,
    dashboard
}