import { Cliente, Sucursal } from "../models/index.js";


const crearCliente = async (req, res) => {
    const { id: idSucursal } = req.sucursal;
    const { name, age, phone, membership_type } = req.body;

    try {

        //Comprobamos si ya existe un cliente con el mismo número de telefono
        const existeCliente = await Cliente.findOne({

            where: {
                phone: phone,
                sucursalId: idSucursal
            }
        });

        if (existeCliente) {
            const error = new Error('Ya existe un cliente con ese número de teléfono');
            return res.status(409).json({
                msg: error.message
            })
        }

        //Creamos el cliente
        const cliente = await Cliente.create({
            name,
            age,
            phone,
            membership_type,
            sucursalId: idSucursal
        });

        const clienteRespuesta = await Cliente.scope('eliminarInfo').findByPk(cliente.id)

        return res.json({
            data: {
                cliente: clienteRespuesta
            },
            msg: 'Cliente creado correctamente'
        })

    } catch (e) {
        console.log('Hubo un problema al crear el cliente: ', e);
        const error = new Error('Error del servidor');
        return res.status(500).json({
            msg: error.message
        })
    }

}

const obtenerClientesPorSucursal = async (req, res) => {

    const { id: idSucursal } = req.sucursal;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const sucursal = await Sucursal.scope('eliminarInfo').findByPk(idSucursal)
        const clientes = await Cliente.scope('eliminarInfo').findAndCountAll({
            where: {
                sucursalId: idSucursal
            },
            limit,
            offset
        });

        return res.json({
            data: {
                sucursal: sucursal,
                
                clientes: clientes.rows
            },
            paginacion: {
                limite: limit,
                pagina: page,
                totalPaginas: Math.ceil(clientes.count / limit),
                totalClientes: clientes.count,
            },
            msg: 'Clientes obtenidos correctamente'
        })
    } catch (e) {
        console.log('Hubo un problema al obtener los clientes: ', e);
        const error = new Error('Error del servidor');
        return res.status(500).json({
            msg: error.message
        })
    }

}

const obtenerCliente = async (req, res) => {

    const { id: idCliente } = req.params;
    const { id: idSucursal } = req.sucursal;

    try {
        const cliente = await Cliente.scope('eliminarInfo').findOne({
            where: {
                id: idCliente,
                sucursalId: idSucursal
            }
        })

        if (!cliente) {
            const error = new Error('El cliente no existe');
            return res.status(404).json({
                msg: error.message
            })
        }

        return res.json({
            data: {
                cliente: cliente
            },
            msg: 'Cliente obtenido correctamente'
        })
    } catch (e) {
        console.log('Hubo un error al obtener el cliente: ', e);
        const error = new Error('Error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }

}

const actualizarCliente = async (req, res) => {

    const { name, age, phone, membership_type } = req.body;
    const { id: idCliente } = req.params;
    const { id: idSucursal } = req.sucursal;

    try {

        const cliente = await Cliente.scope('eliminarInfo').findOne({
            where: {
                id: idCliente,
                sucursalId: idSucursal
            }
        })

        if (!cliente) {
            const error = new Error('El cliente no existe');
            return res.status(404).json({
                msg: error.message
            })
        }

        if (req.body.phone && req.body.phone !== cliente.phone) {
            const existePhone = await Cliente.findOne({
                where: {
                    phone: req.body.phone,
                    sucursalId: idSucursal,
                    id: { [Op.ne]: idCliente }
                }
            });

            if (existePhone) {
                return res.status(409).json({
                    msg: 'Ya existe otro cliente con ese número de teléfono'
                });
            }
        }

        await cliente.update({
            name,
            age,
            phone,
            membership_type
        });
        await cliente.reload({ scope: 'eliminarInfo' });

        return res.json({
            data: {
                cliente: cliente
            },
            msg: 'Cliente actualizado correctamente'
        })
    } catch (e) {
        console.log('Hubo un error al actualizar  al cliente: ', e);
        const error = new Error('Error del servidor');
        return res.status(500).json({
            msg: error.message
        })
    }

}

const eliminarCliente = async (req, res) => {

    const { id: idCliente } = req.params;
    const { id: idSucursal } = req.sucursal;

    try {
        const cliente = await Cliente.scope('eliminarInfo').findOne({
            where: {
                id: idCliente,
                sucursalId: idSucursal
            }
        })

        if (!cliente) {
            const error = new Error('El cliente no existe');
            return res.status(404).json({
                msg: error.message
            })
        }

        await cliente.update({
            is_activated: false
        });

        return res.json({
            msg: 'Cliente eliminado correctamente'
        })
    } catch (e) {
        console.log('Hubo un error al eliminar al cliente: ', e);
        const error = new Error('Error del servidor');
        return res.status(500).json({
            msg: error.message
        })
    }

}

const renovarMembresia = async (req, res) => {
    const { membership_type } = req.body;
    const { id: idCliente } = req.params;
    const { id: idSucursal } = req.sucursal;


    try {
        const cliente = await Cliente.scope('eliminarInfo').findOne({
            where: {
                id: idCliente,
                sucursalId: idSucursal
            }
        })

        if (!cliente) {
            const error = new Error('El cliente no existe');
            return res.status(404).json({
                msg: error.message
            })
        }

        //verificar que sigue activo
        if (!cliente.is_activated) {
            const error = new Error('Aún no termina la membresia del cliente');
            return res.status(409).json({
                msg: error.message
            })
        }

        await cliente.update({
            membership_start: new Date(),
            membership_type
        });
        await cliente.reload({ scope: 'eliminarInfo' });

        return res.json({
            data: {
                cliente: cliente
            },
            msg: 'Membresia actualizada correctamente'
        })
    } catch (e) {
        console.log('Hubo un error al actualizar la membresia del cliente: ', e);
        const error = new Error('Error del servidor');
        return res.status(500).json({
            msg: error.message
        })
    }
}

export {
    crearCliente,
    obtenerClientesPorSucursal,
    obtenerCliente,
    actualizarCliente,
    eliminarCliente,
    renovarMembresia
}