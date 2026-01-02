import { SuperAdmin, Sucursal } from "../models/index.js";
import generarJWT from "../helpers/generarJWT.js";
import generarToken from "../helpers/generarToken.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";


const loginSuperAdmin = async (req, res) => {

    const { email, password } = req.body;

    try {

        //Validamos si existe correo
        const superAdmin = await SuperAdmin.findOne({
            where: {
                email: email
            }
        });

        if (!superAdmin) {
            const error = new Error('Email o Contraseña incorrectos');
            return res.status(401).json({
                msg: error.message
            })
        };

        //Comprobar Password
        if (!superAdmin.verificarPassword(password)) {
            const error = Error('Email o Contraseña incorrectos');
            return res.status(401).json({
                msg: error.message
            })
        }

        /*
        if (!superAdmin.is_confirmed) {
            const error = new Error('Tu Cuenta no ha sido confirmada');
            return res.status(403).json({
                msg: error.message
            })
        }
*/
        const superAdminResponse = await SuperAdmin.scope('eliminarInfo').findByPk(superAdmin.id);

        //Autenticar Super Administrador
        return res.json({
            data: {
                token: generarJWT(superAdmin.id),
                usuario: superAdminResponse
            },
            msg: 'Administrador autenticado correctamente'
        })
    } catch (e) {
        console.log('Error al autenticar al Administrador: ', e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }


}

const loginSucursal = async (req, res) => {

    const { email, password } = req.body;

    try {

        //Validar si el correo Existe
        const sucursal = await Sucursal.findOne({
            where: {
                email: email
            }
        });


        if (!sucursal) {
            const error = new Error('Email o Contraseña incorrectos');
            return res.status(401).json({
                msg: error.message
            })
        }

        //Comprobar si la sucursal esta confirmada
        if (!sucursal.is_verified) {
            const error = new Error('Tu Cuenta no ha sido confirmada');
            return res.status(403).json({
                msg: error.message
            })
        }

        //Comprobar si esta activa
        if (!sucursal.is_activated) {
            const error = new Error('Tu Cuenta se encuentra Suspendida');
            return res.status(403).json({
                msg: error.message
            })
        }

        //Comprobar password
        if (!sucursal.verificarPassword(password)) {
            const error = new Error('Email o Contraseña incorrectos');
            return res.status(401).json({
                msg: error.message
            })
        }

        const sucursalResponse = await Sucursal.scope('eliminarInfo').findByPk(sucursal.id);

        //Si es correcto Autenticamos al Usuario
        return res.json({
            data: {
                token: generarJWT(sucursal.id),
                usuario: sucursalResponse
            },
            msg: 'Sucursal autenticada correctamente'
        })
    } catch (e) {
        console.log('Error al autenticar la Sucursal: ', e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }


}

///SECCION OLVIDAR PASSWORD ADMINISTRADOR
const olvidarPasswordAdministrador = async (req, res) => {

    //Obtenemos el email de quien quiere recuperar la contraseña
    const { email } = req.body;

    try {
        //Comprobar si el email existe
        const existeAdmin = await SuperAdmin.findOne({
            where: {
                email: email
            }
        })

        if (!existeAdmin) {
            const error = new Error('El Administrador no existe');
            return res.status(200).json({
                msg: error.message
            })
        }

        existeAdmin.token = generarToken();
        await existeAdmin.save();

        //Enviar email de olvidar-password
        emailOlvidePassword({
            email,
            token: existeAdmin.token,
            tipoUsuario: 'administrador'
        })

        return res.json({
            msg: 'Hemos enviado un Email con las Instrucciones'
        })

    } catch (e) {
        console.log('Error al recuperar la contraseña del Administrador: ', e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }


}

const comprobarTokenAdministrador = async (req, res) => {

    //Obtener token
    const { token } = req.params;

    try {
        //Comprobar El Token
        const tokenValido = await SuperAdmin.findOne({
            where: {
                token: token
            }
        });

        if (!tokenValido) {
            const error = new Error('Token no válido');
            return res.status(400).json({
                msg: error.message
            })
        }

        //Si el Token es Valido
        return res.json({
            msg: 'Token válido, Administrador existe'
        })
    } catch (e) {
        console.log('Error al intentar validar el token: ', e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }

}

const nuevoPasswordAdministrador = async (req, res) => {

    const { token } = req.params;
    const { password } = req.body;

    try {
        //Validar Token
        const administrador = await SuperAdmin.findOne({
            where: {
                token: token
            }
        });

        if (!administrador) {
            const error = new Error('Token no válido');
            return res.status(400).json({
                msg: error.message
            })
        }

        //Borrar Token
        administrador.token = null;
        administrador.password = password;

        await administrador.save();

        res.json({
            msg: 'Contraseña modificada correctamente'
        });

    } catch (e) {
        console.log('Error al crear nueva contraseña: ', e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }


}

//SECCION OLVIDAR PASSWORD SUCURSALES
const olvidarPasswordSucursal = async (req, res) => {

    const { email } = req.body;

    try {
        //Comprobar si existe Sucursal
        const existeSucursal = await Sucursal.findOne({
            where: {
                email: email
            }
        });

        if (!existeSucursal) {
            const error = new Error('La Sucursal no Existe');
            return res.status(200).json({
                msg: error.message
            })
        };

        //Crear nuevo Token
        existeSucursal.token = generarToken();
        await existeSucursal.save()
   
        //Enviar email de olvidar-password
        emailOlvidePassword({
            email,
            token: existeSucursal.token,
            tipoUsuario: 'sucursal'
        })
       
        return res.json({
            msg: 'Hemos Enviado un Email con las Instrucciones'
        })
    } catch (e) {
        console.log('Error al validar sucursal: ', e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }

}

const comprobarTokenSucursal = async (req, res) => {

    const { token } = req.params;

    try {
        //Comprobamos si existe
        const tokenValido = await Sucursal.findOne({
            where: {
                token: token
            }
        });

        if (!tokenValido) {
            const error = new Error('Token no válido');
            return res.status(400).json({
                msg: error.message
            })
        };

        //Si el token es válido
        return res.json({
            msg: 'Token válido, Sucursal existe'
        })
    } catch (e) {
        console.log('Error al intentar validar el token: ', e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }


}

const nuevoPasswordSucursal = async (req, res) => {

    const { token } = req.params;
    const { password } = req.body;

    try {
        //comprobar token
        const sucursal = await Sucursal.findOne({
            where: {
                token: token
            }
        });

        if (!sucursal) {
            const error = new Error('Token no válido');
            return res.status(400).json({
                msg: error.message
            })
        }

        sucursal.token = null;
        sucursal.password = password;
        await sucursal.save();

        res.json({
            msg: 'La Contraseña se modifico Correctamente'
        })
    } catch (e) {
        console.log('Error al crear nueva contraseña: ', e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }


}

const confirmarSucursal = async (req, res) => {

    const { token } = req.params;

    try {
        const sucursalEncontrada = await Sucursal.findOne({
            where: {
                token: token
            }
        });

        if (!sucursalEncontrada) {
            const error = new Error('Token invalido o ya utilizado');
            return res.status(404).json({
                msg: error.message
            })
        };

        return res.status(200).json({
            msg: 'Cuenta Confirmada Correctamente'
        });

    } catch (e) {
        console.log('Error al Confirmar la cuenta: ', e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }
}

const crearPasswordSucursal = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        //comprobar token
        const sucursal = await Sucursal.findOne({
            where: {
                token: token
            }
        });

        if (!sucursal) {
            const error = new Error('Token no válido');
            return res.status(400).json({
                msg: error.message
            })
        }

        sucursal.password = password;
        sucursal.is_verified = true;
        sucursal.token = null;

        await sucursal.save();

        res.json({
            msg: 'La Contraseña se Agrego Correctamente'
        })
    } catch (e) {
        console.log('Error al crear nueva contraseña: ', e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }
}

//////CONTROLADORES PARA CUANDO SE ACTUALIZA EL EMAIL
const nuevoEmailSucursal = async (req, res) => {
    const {token} = req.params;

    try {
        const sucursal = await Sucursal.scope('eliminarInfo').findOne({
            where: {
                token: token
            }
        });

        if (!sucursal) {
            const error = new Error('Token no válido');
            return res.status(400).json({
                msg: error.message
            })
        };

        sucursal.token = null;
        sucursal.email = sucursal.newEmail;
        sucursal.newEmail = null;

        await sucursal.save();

        return res.json({
            msg: 'Email actualizado correctamente'
        })
        

    } catch (e) {
        console.log('Error al actualizar Email: ', e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }
}


export {
    loginSuperAdmin,
    loginSucursal,
    olvidarPasswordAdministrador,
    comprobarTokenAdministrador,
    nuevoPasswordAdministrador,
    olvidarPasswordSucursal,
    comprobarTokenSucursal,
    nuevoPasswordSucursal,
    confirmarSucursal,
    crearPasswordSucursal,
    nuevoEmailSucursal
}