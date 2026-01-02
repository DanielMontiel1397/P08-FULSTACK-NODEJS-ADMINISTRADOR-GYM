import generarToken from "../helpers/generarToken.js";

const sucursales = [
    {
        name: 'Sucursal Juarez',
        username: 'avosJuarez',
        password: '123456',
        address: '',
        phone: '4521021397',
        email: 'avosJuarez@gmail.com',
        superAdminId: 1,
        token: generarToken()
    },
    {
        name: 'Sucursal Viñedos',
        username: 'avosViñedos',
        password: '123456',
        address: '',
        phone: '4521509874',
        email: 'avosViniedos@gmail.com',
        superAdminId: 1,
        token: generarToken()
    },
    {
        name: 'Sucursal Casa del Niño',
        username: 'avosCasa',
        password: '123456',
        address: '',
        phone: '4521276393',
        email: 'avosCasa@gmail.com',
        superAdminId: 1,
        token: generarToken()
    },
];

export default sucursales;