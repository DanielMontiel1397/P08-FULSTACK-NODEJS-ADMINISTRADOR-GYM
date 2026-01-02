import { transport } from "../config/configEmailNodemailer.js";
import dotenv from 'dotenv'

dotenv.config()

const emailOlvidePassword = async (datos)=> {
    const {email, token, tipoUsuario} = datos;
    
    const info = await transport.sendMail({
        from: '"AdministradorGimnasio.com" <no-reply@administradorgimnasio.com>',
        to: email,
        subject: "Reestablece tú contraseña",
        text: "Reestablece tú contraseña",
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                <h2 style="color: #2c3e50;">Reestablecer contraseña</h2>

                <p>Recibiste este mensaje porque se solicitó reestablecer la contraseña de la cuenta asociada al correo:</p>

                <p style="font-weight: bold;">${email}</p>

                <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>

                <div style="margin: 25px 0;">
                    <a href="${tipoUsuario === 'administrador' 
                        ? `${process.env.FRONTEND_URL}/api/auth/superadmin/verificar-token/${token}` 
                        : `${process.env.FRONTEND_URL}/api/auth/sucursal/verificar-token/${token}` }" 
                    style="background: #3498db; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
                        Reestablecer contraseña
                    </a>
                </div>

                <p>Si tú no solicitaste este cambio, puedes ignorar este mensaje.</p>

                <p style="margin-top: 30px; font-size: 14px; color: #777;">
                    AdministradorGimnasio.com
                </p>
            </div>
        `
    })

    console.log("Mensaje Enviado: %s", info.messageId);
}

export default emailOlvidePassword;