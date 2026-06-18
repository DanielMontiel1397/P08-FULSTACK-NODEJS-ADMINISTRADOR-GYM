import express from 'express';
import { sucursalAutenticado } from '../middleware/protegerRutaSucursal.js';
import { validarAge, validarEditarCliente, validarIdParam, validarMembershipType, validarName, validarPaginacion, validarPhone } from '../helpers/validaciones.js';
import { handleInputErrors } from '../middleware/validarBody.js';
import { actualizarCliente, crearCliente, eliminarCliente, obtenerCliente, obtenerClientesPorSucursal, renovarMembresia } from '../controllers/clientesController.js';

const router = express.Router();

router.post('/crear-cliente',
    sucursalAutenticado,
    validarName,
    validarAge,
    validarPhone,
    validarMembershipType,
    handleInputErrors,
    crearCliente
);

router.get('/', 
    sucursalAutenticado, 
    validarPaginacion,
    handleInputErrors,
    obtenerClientesPorSucursal
);

router.get('/:id', 
    sucursalAutenticado,
    validarIdParam,
    handleInputErrors,
    obtenerCliente
);

router.patch('/:id',
    sucursalAutenticado,
    validarEditarCliente,
    handleInputErrors,
    actualizarCliente
)

router.patch('/:id/membresia', 
    sucursalAutenticado,
    validarIdParam,
    validarMembershipType,
    handleInputErrors,
    renovarMembresia
)

router.delete('/:id',
    sucursalAutenticado,
    validarIdParam,
    handleInputErrors,
    eliminarCliente
)

export default router;