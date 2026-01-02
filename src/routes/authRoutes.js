import express from 'express';
import {body} from 'express-validator'
import { loginSuperAdmin, loginSucursal, olvidarPasswordAdministrador, olvidarPasswordSucursal, comprobarTokenSucursal, nuevoPasswordSucursal, comprobarTokenAdministrador, nuevoPasswordAdministrador, confirmarSucursal, crearPasswordSucursal, nuevoEmailSucursal } from '../controllers/authController.js';
import { handleInputErrors } from '../middleware/validarBody.js';

const router = express.Router();

///////Rutas para hacer Login///////

    //Administrador
router.post('/superadmin/login', 
    body('email')
        .notEmpty().withMessage('El campo email es obligatorio'),
    body('email')
        .isEmail().withMessage('No es un Email válido'),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria'),
    handleInputErrors,
    loginSuperAdmin);

    //Sucursal
router.post('/sucursal/login', 
    body('email')
        .notEmpty().withMessage('El campo email es obligatorio'),
    body('email')
        .isEmail().withMessage('No es un Email válido'),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria'),
    handleInputErrors,
    loginSucursal);


//////RUTAS PARA ENVIO DE EMAIL PARA OLVIDAR PASSWORD

    //Administrador
router.post('/superadmin/olvidar-password',  
    body('email')
        .notEmpty().withMessage('El campo email es obligatorio'),
    body('email')
        .isEmail().withMessage('No es un Email válido'),
    handleInputErrors,
    olvidarPasswordAdministrador);

    //Sucursal
router.post('/sucursal/olvidar-password', 
    body('email')
        .notEmpty().withMessage('El campo email es obligatorio'),
    body('email')
        .isEmail().withMessage('No es un Email válido'),
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
    body('password')
        .notEmpty().withMessage('La Contraseña no puede ir vacia')
        .isLength({min: 6}).withMessage('La Contraseña debe tener al menos 6 caracteres'),
    handleInputErrors,
    nuevoPasswordAdministrador);
    
    //Sucursal
router.post('/sucursal/resetear-password/:token', 
    body('password')
        .notEmpty().withMessage('La Contraseña no puede ir vacia')
        .isLength({min: 6}).withMessage('La Contraseña debe tener al menos 6 caracteres'),
    handleInputErrors,
    nuevoPasswordSucursal);


/////RUTAS PARA CONFIRMAR SUCURSAL/////
router.get('/sucursal/confirmar-cuenta/:token', confirmarSucursal);

////RUTA PARA CREAR CONTRASEÑA DE SUCURSAL////
router.post('/sucursal/crear-password/:token', 
    body('password')
        .notEmpty().withMessage('La Contraseña no puede ir vacia')
        .isLength({min: 6}).withMessage('La Contraseña debe tener al menos 6 caracteres'),
    handleInputErrors,
    crearPasswordSucursal)

/////RUTAS PARA CUANDO SE ACTUALIZA UN EMAIL

//SUCURSAL
router.get('/sucursal/validar-nuevo-email/:token', nuevoEmailSucursal)


export default router;