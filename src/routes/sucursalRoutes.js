import express from 'express';
import { sucursalAutenticado } from '../middleware/protegerRutaSucursal.js';
import { actualizarPerfil, dashboard, perfil, verificarSucursal } from '../controllers/sucursalController.js';
import { validarAddress, validarEditarPerfilSucursal, validarEmail, validarName, validarPhone } from '../helpers/validaciones.js';
import { handleInputErrors } from '../middleware/validarBody.js';

const router = express.Router();

//Gestión Perfil
router.get('/perfil',
    sucursalAutenticado,
    perfil
)

router.patch('/perfil',
    sucursalAutenticado,
    validarEditarPerfilSucursal,
    handleInputErrors,
    actualizarPerfil
)

router.get('/inicio',
    sucursalAutenticado,
    dashboard
)

//RUTA SUCURSAL VERIFICAR AUTENTICACION
router.get('/verificar',
    sucursalAutenticado,
    verificarSucursal
)
export default router;