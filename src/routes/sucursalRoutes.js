import express from 'express';
import { sucursalAutenticado } from '../middleware/protegerRutaSucursal.js';
import { actualizarPerfil, dashboard, perfil } from '../controllers/sucursalController.js';
import { validarAddress, validarEmail, validarName, validarPhone } from '../helpers/validaciones.js';
import { handleInputErrors } from '../middleware/validarBody.js';

const router = express.Router();

//Gestión Perfil
router.get('/perfil',
    sucursalAutenticado,
    perfil
)

router.patch('/perfil',
    sucursalAutenticado,
    validarName,
    validarAddress,
    validarPhone,
    validarEmail,
    handleInputErrors,
    actualizarPerfil
)

router.get('/inicio',
    sucursalAutenticado,
    dashboard
)


export default router;