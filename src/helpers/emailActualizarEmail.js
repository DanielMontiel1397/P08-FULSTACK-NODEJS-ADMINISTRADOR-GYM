import { transport } from "../config/configEmailNodemailer.js";
import dotenv from 'dotenv';

dotenv.config();

const emailVerificarNuevoEmail = async (datos) => {
    const { email, token, tipoUsuario, name = 'Administrador' } = datos;

    const info = await transport.sendMail({
        from: '"AdministradorGimnasio.com" <no-reply@administradorgimnasio.com>',
        to: email,
        subject: "Verificación de tu nuevo correo electrónico",
        text: "Verifica tu nuevo correo electrónico",
        html: `
                <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                    <h2 style="color: #2c3e50;">Verifica tu nuevo correo</h2>

                    <p>Hola <strong>${name}</strong>,</p>

                    <p>Recibimos una solicitud para actualizar el correo electrónico asociado a tu cuenta.</p>

                    <p>Tu nuevo correo registrado es:</p>
                    <p style="font-weight: bold;">${email}</p>

                    <p>Para confirmar este cambio y mantener la seguridad de tu cuenta, por favor verifica tu correo haciendo clic en el siguiente botón:</p>

                    <div style="margin: 25px 0;">
                        <a href="${
                            tipoUsuario === 'administrador'
                                ? `${process.env.FRONTEND_URL}/confirmar-cuenta/verificar-email/${token}`
                                : `${process.env.FRONTEND_URL}/api/auth/sucursal/validar-nuevo-email/${token}`
                        }"
                        style="background: #2980b9; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
                            Verificar mi nuevo correo
                        </a>
                    </div>

                    <p>Si tú no realizaste esta solicitud, te recomendamos cambiar tu contraseña y contactar al administrador.</p>

                    <p style="margin-top: 30px; font-size: 14px; color: #777;">
                        AdministradorGimnasio.com
                    </p>
                </div>
            `
    });

    console.log("Mensaje enviado: %s", info.messageId);
};

export default emailVerificarNuevoEmail;
