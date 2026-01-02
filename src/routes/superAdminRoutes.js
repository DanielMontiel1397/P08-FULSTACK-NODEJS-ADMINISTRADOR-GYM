import express from 'express';

import { activarDesactivarSucursal, confirmarCambioEmailAdministrador, actualizarSucursalPorId, crearSucursal, dashboard, editarPerfilAdministrador, obtenerClientesPorSucursal, obtenerSucursales, obtenerSucursalPorId, obtenerTodosClientes, perfilAdministrador } from '../controllers/superAdminController.js';

import { protegerRutaAdministrador } from '../middleware/protegerRutaAdmin.js';
import { handleInputErrors } from '../middleware/validarBody.js';
import { validarAddress, validarEmail, validarIdParam, validarName, validarPaginacion, validarPhone } from '../helpers/validaciones.js';

const router = express.Router();

///RUTA DASHBOARD PRINCIPAL///
router.get('/inicio', 
    protegerRutaAdministrador,
    dashboard);

////RUTAS PARA SUCURSALES////

router.post('/crear-sucursal',
    protegerRutaAdministrador, 
    validarName,
    validarAddress,
    validarPhone,
    validarEmail,
    handleInputErrors,
    crearSucursal);

router.get('/sucursales', 
    protegerRutaAdministrador,
    ...validarPaginacion,
    handleInputErrors,
    obtenerSucursales);

router.get('/sucursales/:id', 
    protegerRutaAdministrador,
    validarIdParam,
    handleInputErrors,
    obtenerSucursalPorId);

router.put('/sucursales/:id', 
    protegerRutaAdministrador,
    validarName,
    validarAddress,
    validarPhone,
    validarEmail,
    validarIdParam,
    handleInputErrors,
    actualizarSucursalPorId);

router.patch('/sucursales/:id', 
    protegerRutaAdministrador,
    validarIdParam,
    handleInputErrors,
    activarDesactivarSucursal);

////RUTAS GENERALES////
router.get('/sucursal/:id/clientes', 
    protegerRutaAdministrador,
    validarIdParam,
    ...validarPaginacion,
    handleInputErrors,
    obtenerClientesPorSucursal);

router.get('/clientes', 
    protegerRutaAdministrador,
    ...validarPaginacion,
    obtenerTodosClientes);

////RUTAS PROPIAS///
router.get('/perfil', 
    protegerRutaAdministrador,
    perfilAdministrador);

router.put('/perfil', 
    protegerRutaAdministrador,
    validarEmail,
    handleInputErrors,
    editarPerfilAdministrador);


////RUTAS COMPROBAR CAMBIO EMAIL////
router.get('/verificar-nuevo-email/:token', confirmarCambioEmailAdministrador)

export default router;