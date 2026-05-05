import { transport } from "../config/configEmailNodemailer.js";
import dotenv from 'dotenv'
dotenv.config()

const emailConfirmarCuenta = async (datos) => {
    const { email, token, tipoUsuario, mode } = datos;
    
    // Determinar el subject y contenido según el caso
    let subject = '';
    let titulo = '';
    let mensaje = '';
    let textoBoton = '';
    let url = '';
    
    if (tipoUsuario === 'administrador') {
        // Caso: Administrador cambia su email
        subject = 'Confirma tu nuevo correo';
        titulo = 'Confirma tu nuevo correo electrónico';
        mensaje = `Se ha solicitado un cambio de correo electrónico para tu cuenta de administrador. Tu nuevo correo será: <strong>${email}</strong>`;
        textoBoton = 'Confirmar nuevo correo';
        url = `${process.env.FRONTEND_URL}/auth/confirmar-cuenta/${token}`;
        
    } else if (tipoUsuario === 'sucursal' && mode === 'crear') {
        // Caso: Crear nueva sucursal
        subject = 'Crea tu contraseña - Nueva cuenta';
        titulo = 'Bienvenido al sistema';
        mensaje = `Se ha creado una cuenta de sucursal asociada al correo: <strong>${email}</strong><br><br>Para activar tu cuenta, debes crear tu contraseña de acceso.`;
        textoBoton = 'Crear mi contraseña';
        url = `${process.env.FRONTEND_URL}/confirmar-cuenta/crear-password/${token}`;

        console.log('Creando nueva contraseña se necesita password');
        
    } else if (tipoUsuario === 'sucursal' && mode === 'edit') {
        // Caso: Sucursal cambia su email
        subject = 'Confirma tu nuevo correo';
        titulo = 'Confirma tu nuevo correo electrónico';
        mensaje = `Se ha solicitado un cambio de correo electrónico para tu cuenta. Tu nuevo correo será: <strong>${email}</strong>`;
        textoBoton = 'Confirmar nuevo correo';
        url = `${process.env.FRONTEND_URL}/confirmar-cuenta/verificar-email/${token}`;
        
    } else {
        // Caso por defecto (no debería llegar aquí)
        subject = 'Confirma tu cuenta';
        titulo = 'Confirma tu cuenta';
        mensaje = `Se ha creado una cuenta asociada al correo: <strong>${email}</strong>`;
        textoBoton = 'Confirmar mi cuenta';
        url = `${process.env.FRONTEND_URL}/auth/confirmar-cuenta/${token}`;
    }
    
    const info = await transport.sendMail({
        from: '"AdministradorGimnasio.com" <no-reply@administradorgimnasio.com>',
        to: email,
        subject: subject,
        text: subject,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                <h2 style="color: #2c3e50;">${titulo}</h2>
                <p>${mensaje}</p>
                <div style="margin: 25px 0;">
                    <a href="${url}"
                    style="background: #27ae60; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        ${textoBoton}
                    </a>
                </div>
                <p style="color: #555; margin-top: 20px;">
                    Si tú no solicitaste esta acción, puedes ignorar este mensaje.
                </p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
                <p style="font-size: 14px; color: #777;">
                    AdministradorGimnasio.com
                </p>
            </div>
        `
    });
    
    console.log("Mensaje Enviado: %s", info.messageId);
}

export default emailConfirmarCuenta;