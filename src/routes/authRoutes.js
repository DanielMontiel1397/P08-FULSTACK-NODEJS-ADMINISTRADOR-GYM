import express from 'express';
import {body} from 'express-validator'
import { loginSuperAdmin, loginSucursal, olvidarPasswordAdministrador, olvidarPasswordSucursal, comprobarTokenSucursal, nuevoPasswordSucursal, comprobarTokenAdministrador, nuevoPasswordAdministrador, confirmarSucursal, crearPasswordSucursal, nuevoEmailSucursal } from '../controllers/authController.js';
import { handleInputErrors } from '../middleware/validarBody.js';
import { validarEmail, validarPasswordCrearRecuperar, validarPasswordLogin } from '../helpers/validaciones.js';

const router = express.Router();

//SWAGGER
/**
 * @openapi
 * /api/auth/superadmin/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login del superadministrador
 *     description: Autenticación del superadministrador y generación de JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@gym.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT de autenticación
 *       401:
 *         description: Credenciales inválidas
 *       422:
 *         description: Error de validación
 */



///////Rutas para hacer Login///////

    //Administrador
router.post('/superadmin/login', 
    validarEmail,
    validarPasswordLogin,
    handleInputErrors,
    loginSuperAdmin);

    //Sucursal
router.post('/sucursal/login', 
    validarEmail,
    validarPasswordLogin,
    handleInputErrors,
    loginSucursal);


//////RUTAS PARA ENVIO DE EMAIL PARA OLVIDAR PASSWORD

    //Administrador
router.post('/superadmin/olvidar-password',  
    validarEmail,
    handleInputErrors,
    olvidarPasswordAdministrador);

    //Sucursal
router.post('/sucursal/olvidar-password', 
    validarEmail,
    handleInputErrors,
    olvidarPasswordSucursal);

///////LEER TOKEN DE LA URL PARA VERIFICAR QUE EL TOKEN ES VALIDO////

    //Administrador
router.get('/superadmin/verificar-token/:token',  comprobarTokenAdministrador);

    //Sucursal
router.get('/sucursal/verificar-token/:token',  comprobarTokenSucursal);

////////GENERAR NUEVO PASSWORD////

    //Administrador
router.post('/superadmin/resetear-password/:token', 
    validarPasswordCrearRecuperar,
    handleInputErrors,
    nuevoPasswordAdministrador);
    
    //Sucursal
router.post('/sucursal/resetear-password/:token', 
    validarPasswordCrearRecuperar,
    handleInputErrors,
    nuevoPasswordSucursal);


/////RUTAS PARA CONFIRMAR SUCURSAL/////
router.get('/sucursal/confirmar-cuenta/:token', confirmarSucursal);

////RUTA PARA CREAR CONTRASEÑA DE SUCURSAL////
router.post('/sucursal/crear-password/:token', 
    validarPasswordCrearRecuperar,
    handleInputErrors,
    crearPasswordSucursal)

/////RUTAS PARA CUANDO SE ACTUALIZA UN EMAIL

//SUCURSAL
router.get('/sucursal/validar-nuevo-email/:token', nuevoEmailSucursal)


export default router;