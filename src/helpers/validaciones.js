import { body, param, query } from "express-validator";

export const validarName = body("name")
                            .trim()
                            .notEmpty().withMessage("El nombre es obligatorio")
                            .isLength({ min: 2, max: 100 }).withMessage("El nombre debe tener entre 2 y 100 caracteres");

export const validarPasswordLogin = body('password')
                                        .notEmpty().withMessage('La contraseña es obligatoria')

export const validarPasswordCrearRecuperar = body('password')
                                                .notEmpty().withMessage('La Contraseña no puede ir vacia')
                                                .isLength({min: 6}).withMessage('La Contraseña debe tener al menos 6 caracteres');

export const validarAddress = body("address")
                                .optional()
                                .trim()
                                .isLength({ min: 5, max: 255 }).withMessage("La dirección debe tener entre 5 y 255 caracteres")
                                .isString().withMessage("La dirección debe ser texto válido");

export const validarPhone = body("phone")
                                .notEmpty().withMessage("El teléfono es obligatorio")
                                .matches(/^[0-9+\-\s]+$/).withMessage("El teléfono solo puede contener números, espacios, y símbolos + -")
                                .isLength({ max: 20 }).withMessage("El teléfono no puede exceder 20 caracteres");

export const validarEmail = body("email")
                                .trim()
                                .notEmpty().withMessage("El email es obligatorio")
                                .isEmail().withMessage("Email inválido");

export const validarAge = body('age')
                                .notEmpty().withMessage("La edad es obligatoria")
                                .isInt({ min: 1, max: 120 }).withMessage("La edad debe ser un número entero entre 1 y 120");

export const validarMembershipType = body('membership_type')
                                        .notEmpty().withMessage("El tipo de membresía es obligatorio")
                                        .isIn(['semana','mes','anualidad']).withMessage("El tipo de membresía no es válido");


export const validarIdParam = param("id")
                                .optional()
                                .isInt({ min: 1 }).withMessage("El Parámetro debe ser un número entero valido");



//VALIDAR QUERYS
export const validarPaginacion = [
                                query('page')
                                    .optional()
                                    .isInt({min: 1}).withMessage('La pagina debe ser un número entero mayor a 0'),
                                query('limit')
                                    .optional()
                                    .isInt({ min: 1, max: 100 }).withMessage('El límite debe estar entre 1 y 100')
                                ];
                                
//VALIDACIONES PARA EDICIÓN DE PERFIL SUCURSAL
export const validarEditarPerfilSucursal = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("El nombre debe tener entre 2 y 100 caracteres"),
    body("email")
        .optional()
        .trim()
        .isEmail().withMessage("Email inválido"),
    body("address")
        .optional()
        .trim()
        .isLength({ min: 5, max: 255 }).withMessage("La dirección debe tener entre 5 y 255 caracteres")
        .isString().withMessage("La dirección debe ser texto válido"),
    body("phone")
        .optional()
        .matches(/^[0-9+\-\s]+$/).withMessage("El teléfono solo puede contener números, espacios, y símbolos + -")
        .isLength({ max: 20 }).withMessage("El teléfono no puede exceder 20 caracteres")
];


//VALIDACIONES PARA EDICION DE CLIENTES
export const validarEditarCliente = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("El nombre debe tener entre 2 y 100 caracteres"),

    body("age")
        .optional()
        .isInt({ min: 1, max: 120 }).withMessage("La edad debe ser un número entero entre 1 y 120"),

    body("phone")
        .optional()
        .matches(/^[0-9+\-\s]+$/).withMessage("El teléfono solo puede contener números, espacios, y símbolos + -")
        .isLength({ max: 20 }).withMessage("El teléfono no puede exceder 20 caracteres"),

    body("membership_type")
        .optional()
        .isIn(["semana", "mes", "anualidad"]).withMessage("El tipo de membresía no es válido")
];