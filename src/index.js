import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'

import db from './config/db.js'
import './models/index.js'

import autentificacionRoutes from './routes/authRoutes.js'
import superAdminRoutes from './routes/superAdminRoutes.js'
import sucursalesRoutes from './routes/sucursalRoutes.js';
import clientesRoutes from './routes/clienteRoutes.js';

dotenv.config()

const app = express(); //Acceder a función de express

//////MANEJO DE CORS////
const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, callback) {
        //Permitir peticiones sin origin (POSTMAN)
        if(!origin){
            return callback(null, true)
        }

        if(dominiosPermitidos.indexOf(origin) !== -1){
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    }
}

app.use(cors(corsOptions))

/////////CONECTAR BASE DE DATOS////////

const conectarDB = async () => {
    try {
        
        await db.authenticate();
        //await db.sync({ force: true });
        await db.sync();
        console.log('Conexión Exitosa a la BASE DE DATOS');

    } catch(e) {

        console.log(`Hubo un error: \n ${e}`);
        process.exit(1);

    }
}

conectarDB();

//////VALIDAR LECTURA DE FORMULARIOS/////
app.use(express.json());

/////////MANEJAR RUTAS///////////

    //Ruta par Autentificar
app.use('/api/auth', autentificacionRoutes);

    //Ruta para Super Administrador
app.use('/api/superAdministrador', superAdminRoutes);

    //Rutas para sucursales
app.use('/api/sucursal', sucursalesRoutes);

    //Rutas para clientes
app.use('/api/clientes', clientesRoutes);

////////INICIAR SERVIDOR////////

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor funcionando en el puerto: ${port}`);
})