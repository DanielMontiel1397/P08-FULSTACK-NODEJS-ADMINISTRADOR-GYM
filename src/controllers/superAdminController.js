
import { Op } from "sequelize";
import emailConfirmarCuenta from "../helpers/emailConfirmarCuenta.js";
import generarToken from "../helpers/generarToken.js";
import { Cliente, Sucursal, SuperAdmin } from "../models/index.js";
import emailVerificarNuevoEmail from "../helpers/emailActualizarEmail.js";

//////FUNCIONALIDAD PARA SUCURSALES////
const crearSucursal = async (req, res) => {

    const { name, address, phone, email } = req.body;
    const idAdministrador = req.administrador.id;

    try {

        //Buscar si ya existe una sucursal con ese emal
        const sucursal = await Sucursal.findOne({
            where: {
                email: email
            }
        });

        if (sucursal) {
            const error = new Error('Ya existe una sucursal con este email');
            return res.status(409).json({
                msg: error.message
            })
        };

        //Creamos la Instancia de Sucursal
        const sucursalGuardada = await Sucursal.create({
            name,
            address,
            phone,
            email,
            token: generarToken(),
            superAdminId: idAdministrador
        });

        //Enviamos Email de Confirmación y creación de password (El Token se genera en el Modelo)
        await emailConfirmarCuenta({
            email: sucursalGuardada.email,
            token: sucursalGuardada.token,
            tipoUsuario: 'sucursal'
        })

        //Respondemos con mensaje de que revise su correo
        return res.status(201).json({
            msg: `Sucursal agregada correctamente. Revisar correo electronico ${sucursalGuardada.email}`
        })

    } catch (e) {
        console.log('Hubo un errro al agregar Sucursal: ', e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }
}

const obtenerSucursales = async (req, res) => {
    const idAdministrador = req.administrador.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    try {
        const resultado = await Sucursal.scope('eliminarInfo').findAndCountAll({
            where: {
                superAdminId: idAdministrador
            },
            limit: limit,
            offset: offset
        })

        return res.json({
            data: resultado.rows,
            paginacion: {
                pagina: page,
                limite: limit,
                totalPaginas: Math.ceil(resultado.count / limit),
                totalSucursales: resultado.count,
            }
        })
    } catch (e) {
        console.log('Hubo un error al obtener las Sucursales: ', e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }
}

const obtenerSucursalPorId = async (req, res) => {
    const { id: idSucursal } = req.params;
    const { id: idAdministrador } = req.administrador;

    try {

        const sucursal = await Sucursal.scope('eliminarInfo').findOne({
            where: {
                id: idSucursal,
                superAdminId: idAdministrador
            }
        });

        if (!sucursal) {
            const error = new Error('No se encontró ninguna Sucursal');
            return res.status(404).json({
                msg: error.message
            })
        }

        return res.json({
            data: sucursal,
            msg: 'Sucursal Obtenida Correctamente'
        })

    } catch (e) {
        console.log('Hubo un error al obtener la sucursal', e);
        const error = new Error('Error del servidor al obtener la sucursal');
        return res.status(500).json({
            msg: error.message
        })
    }
}

const actualizarSucursalPorId = async (req, res) => {
    const { id: idAdministrador } = req.administrador;
    const { id: idSucursal } = req.params;

    const { email, name, phone, address } = req.body;

    try {

        const sucursal = await Sucursal.scope('eliminarInfo').findOne({
            where: {
                id: idSucursal,
                superAdminId: idAdministrador
            }
        })

        if (!sucursal) {
            const error = new Error('No se encontró ninguna Sucursal');
            return res.status(404).json({
                msg: error.message
            })
        }

        //Si se edita el email verificar que no exista otra sucursal con este email
        if (sucursal.email !== email) {
            const sucursalEmail = await Sucursal.findOne({
                where: {
                    email: email,
                    id: { [Op.ne]: idSucursal }
                }
            })

            if (sucursalEmail) {
                const error = new Error('Ya hay una sucursal con este email, intente otro');
                return res.status(409).json({
                    msg: error.message
                })
            }

            //Creamos un nuevo token
            sucursal.token = generarToken();
            sucursal.email = email;
            sucursal.name = name;
            sucursal.phone = phone;
            sucursal.address = address;
            sucursal.is_verified = false;
            await sucursal.save()

            //Si es posible cambiar su email se le enviará otra vez el email de confirmación, se desconfirma la cuenta, el password sigue siendo el mismo
            await emailConfirmarCuenta({
                name,
                email,
                token: sucursal.token,
                tipoUsuario: 'sucursal'
            });

            return res.json({
                msg: 'Datos modificados, se necesita que vuelva a confirmar su email, revise la bandeja de entrada'
            });
        }

        //Si no se modifico el email cambiamos los demás campos
        sucursal.name = name;
        sucursal.phone = phone;
        sucursal.address = address;
        await sucursal.save()

        return res.json({
            msg: 'Datos modificados correctamente'
        })

    } catch (e) {
        console.log('Hubo un error al actualizar la sucursal', e);
        const error = new Error('Error del servidor al actualizar la sucursal');
        return res.status(500).json({
            msg: error.message
        })
    }
}

const activarDesactivarSucursal = async (req, res) => {
    const { id: idAdministrador } = req.administrador;
    const { id: idSucursal } = req.params;

    try {
        const sucursal = await Sucursal.scope('eliminarInfo').findOne({
            where: {
                id: idSucursal,
                superAdminId: idAdministrador
            }
        })

        if (!sucursal) {
            const error = new Error('No se encontró ninguna Sucursal');
            return res.status(404).json({
                msg: error.message
            })
        }

        sucursal.is_activated = !sucursal.is_activated;
        await sucursal.save();

        return res.json({
            msg: `Sucursal ${sucursal.is_activated ? 'activada' : 'desactivada'} correctamente`
        })

    } catch (e) {
        console.log('Hubo un error al actualizar la sucursal', e);
        const error = new Error('Error del servidor al actualizar la sucursal');
        return res.status(500).json({
            msg: error.message
        })
    }
}

//////FUNCIONALIDAD GENERAL////
const obtenerClientesPorSucursal = async (req, res) => {

    //Parametros de búsqueda
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { id: idAdministrador } = req.administrador;
    const { id: idSucursal } = req.params;

    try {

        const sucursal = await Sucursal.scope('eliminarInfo').findOne({
            where: {
                id: idSucursal,
                superAdminId: idAdministrador
            }
        });

        if (!sucursal) {
            const error = new Error('La sucursal no existe');
            return res.status(404).json({
                msg: error.message
            })
        };

        const resultado = await Cliente.scope('eliminarInfo').findAndCountAll({
            where: {
                sucursalId: idSucursal
            },
            order: [['id', 'ASC']],
            limit: limit,
            offset: offset
        })

        return res.json({
            data: {
                sucursal: {
                    id: sucursal.id,
                    name: sucursal.name,
                    administradorId: sucursal.superAdminId
                },
                clientes: resultado.rows
            },
            paginacion: {
                pagina: page,
                limite: limit,
                totalPaginas: Math.ceil(resultado.count / limit),
                totalClientes: resultado.count
            }
        })

    } catch (e) {
        console.log(`Hubo un error al obtener los clientes de la sucursal con id: ${idSucursal}`);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }

}

const obtenerTodosClientes = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit;

    const { id: idAdministrador } = req.administrador;

    try {

        const resultado = await Cliente.scope('eliminarInfo').findAndCountAll({
            include: [{
                model: Sucursal, as: 'sucursal',
                where: {
                    superAdminId: idAdministrador
                },
                attributes: ['id', 'name']
            }],
            limit: limit,
            offset: offset,
            order: [['name', 'ASC']],
        })

        return res.json({
            data: resultado.rows,
            paginacion: {
                pagina: page,
                limite: limit,
                totalPaginas: Math.ceil(resultado.count / limit),
                totalClientes: resultado.count
            }
        })

    } catch (e) {
        console.log('Hubo un error al obtener los clientes', e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }
}

//////FUNCIONALIDADES PROPIAS/////

const perfilAdministrador = async (req, res) => {

    //Extraemos el administrador del req autenticado
    const { id: idAdministrador } = req.administrador;

    try {
        const administrador = await SuperAdmin.scope('eliminarInfo').findByPk(idAdministrador);

        if (!administrador) {
            const error = new Error('No existe el administrador');
            return res.status(404).json({
                msg: error.message
            })
        }

        return res.json({
            data: {
                administrador: administrador
            },
            msg: 'Administrador obtenido correctamente'
        })
    } catch (e) {
        console.log('Error al obtener el perfil de administrador', e);
        const error = new Error('Error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }
}

const editarPerfilAdministrador = async (req, res) => {
    const { email } = req.body;
    const { id: idAdministrador } = req.administrador;
    try {

        const administrador = await SuperAdmin.scope('eliminarInfo').findByPk(idAdministrador);

        if (!administrador) {
            const error = new Error('No existe el administrador');
            return res.status(404).json({
                msg: error.message
            })
        }

        //Ver si el email es diferente
        if (email !== administrador.email) {
            const existeEmail = await SuperAdmin.findOne({
                where: {
                    email: email,
                    id: { [Op.ne]: idAdministrador }
                }
            });

            if (existeEmail) {
                const error = new Error('Ya existe un administrador con ese email');
                return res.status(409).json({
                    msg: error.message
                })
            };

            //Si no existe el email actualizamos email y enviamos un correo de verificación.

            administrador.token = generarToken();
            administrador.email = email;
            administrador.is_confirmed = false;
            await administrador.save()

            await emailVerificarNuevoEmail({
                email,
                token: administrador.token,
                tipoUsuario: 'administrador'
            })

            return res.json({
                msg: 'Email modificado, se necesita que vuelva a confirmar su email, revise la bandeja de entrada'
            })
        };

        return res.json({
            msg: 'No se realizaron cambios'
        })

    } catch (e) {
        console.log('Hubo un error al actualizar el Administrador', e);
        const error = new Error('Error del servidor al actualizar el Administrador');
        return res.status(500).json({
            msg: error.message
        })
    }
}

const confirmarCambioEmailAdministrador = async (req, res) => {
    const { token } = req.params;


    try {
        const administrador = await SuperAdmin.findOne({
            where: {
                token: token
            }
        });

        if (!administrador) {
            const error = new Error('Token invalido o ya utilizado');
            return res.status(404).json({
                msg: error.message
            })
        }

        administrador.token = null;
        administrador.is_confirmed = true;
        await administrador.save()

        return res.status(200).json({
            msg: 'Cuenta Confirmada, email actualizado correctamente'
        })
    } catch (e) {
        console.log('Error al Confirmar el nuevo email: ', e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }
}

/////DASHBOARD////
const dashboard = async (req, res) => {

    const { id: idAdministrador } = req.administrador;

    try {

        const sucursales = await Sucursal.scope('eliminarInfo').findAndCountAll({
            where: {
                superAdminId: idAdministrador
            }
        });

        const clientes = await Cliente.scope('eliminarInfo').findAndCountAll({
            include: [{
                model: Sucursal, as: 'sucursal',
                where: {
                    superAdminId: idAdministrador
                },
                attributes: ['id', 'name']
            }],
            order: [['name', 'ASC']]
        });

        const clientesActivos = await Cliente.scope('eliminarInfo').findAndCountAll({
            include: [{
                model: Sucursal, as: 'sucursal',
                where: {
                    superAdminId: idAdministrador
                },
                attributes: ['id', 'name']
            }],
            where: {
                is_activated: true
            },
            order: [['name', 'ASC']]
        })

        const clientesInactivos = await Cliente.scope('eliminarInfo').findAndCountAll({
            include: [{
                model: Sucursal, as: 'sucursal',
                where: {
                    superAdminId: idAdministrador
                },
                attributes: ['id', 'name']
            }],
            where: {
                is_activated: false
            },
            order: [['name', 'ASC']]
        })

        // Procesar datos en JavaScript
        const sucursalesConClientes = sucursales.rows.map(sucursal => {

            const clientesDeSucursal = clientes.rows.filter(cliente => cliente.sucursal.id === sucursal.id );

            const activosDeSucursal = clientesActivos.rows.filter( cliente => cliente.sucursal.id === sucursal.id );

            const inactivosDeSucursal = clientesInactivos.rows.filter( cliente => cliente.sucursal.id === sucursal.id );

            return {
                idSucursal: sucursal.id,
                nameSucursal: sucursal.name,
                clientes: {
                    total: clientesDeSucursal.length,
                    activos: activosDeSucursal.length,
                    inactivos: inactivosDeSucursal.length
                }
            };
        });

        return res.json({
            data: {
                resumen: {
                    totalSucursales: sucursales.count,
                    totalClientes: clientes.count,
                    clientesActivos: clientesActivos.count,
                    clientesInactivos: clientesInactivos.count
                },
                sucursales: sucursalesConClientes
            }
        });


    } catch (e) {
        console.log('Hubo un error al obtener la informacion general', e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }

}

export {
    crearSucursal,
    obtenerSucursales,
    obtenerSucursalPorId,
    actualizarSucursalPorId,
    activarDesactivarSucursal,
    obtenerClientesPorSucursal,
    obtenerTodosClientes,
    perfilAdministrador,
    editarPerfilAdministrador,
    confirmarCambioEmailAdministrador,
    dashboard
}