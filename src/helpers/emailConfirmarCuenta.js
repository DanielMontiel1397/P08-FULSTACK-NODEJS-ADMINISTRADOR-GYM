import { transport } from "../config/configEmailNodemailer.js";
import dotenv from 'dotenv'

dotenv.config()

const emailConfirmarCuenta = async (datos)=> {
    const {email, token, tipoUsuario} = datos;

    const info = await transport.sendMail({
        from: '"AdministradorGimnasio.com" <no-reply@administradorgimnasio.com>',
        to: email,
        subject: "Confirma tu cuenta",
        text: "Confirma tu cuenta",
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                <h2 style="color: #2c3e50;">Confirma tu cuenta</h2>

                <p>Se ha creado una cuenta asociada al correo:</p>

                <p style="font-weight: bold;">${email}</p>

                <p>Para activar tu cuenta y crear tu contraseña, haz clic en el siguiente botón:</p>

                <div style="margin: 25px 0;">
                    <a href="${
                        tipoUsuario === 'administrador'
                            ? `${process.env.FRONTEND_URL}/confirmar-cuenta/verificar-email/${token}`
                            : `${process.env.FRONTEND_URL}/confirmar-cuenta/verificar-email/${token}`
                    }"
                    style="background: #27ae60; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
                        Confirmar mi cuenta
                    </a>
                </div>

                <p>Si tú no solicitaste esta cuenta, puedes ignorar este mensaje.</p>

                <p style="margin-top: 30px; font-size: 14px; color: #777;">
                    AdministradorGimnasio.com
                </p>
            </div>
        `

    })
    
    console.log("Mensaje Enviado: %s", info.messageId);
}

export default emailConfirmarCuenta;