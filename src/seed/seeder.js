import db from '../config/db.js'

import {SuperAdmin, Sucursal, Cliente} from '../models/index.js'

//Datos de Seeder
import superAdminData from './superAdmin.js';
import sucursalData from './sucursales.js';
import clientesData from './clientes.js';

const importarDatos = async () => {

    try {
        //Autenticar DB
        await db.authenticate();

        //Generar las columnas
        await db.sync({force: true});

        //Insertar los datos
        for(const admin of superAdminData){
            await SuperAdmin.create(admin)
        };
        console.log('SUPER ADMINISTRADORES CARGADOS CORRECTAMENTE');

        for(const sucursal of sucursalData) {
            await Sucursal.create(sucursal)
        };
        console.log('SUCURSALES CARGADOS CORRECTAMENTE');
        
        for(const cliente of clientesData){
            await Cliente.create(cliente)
        }
        console.log('CLIENTES CARGADOS CORRECTAMENTE');

        console.log('Datos IMPORTADOS CORRECTAMENTE');
        process.exit();

    } catch (error) {
        console.log(error);
        process.exit(1)
    }

}

const eliminarDatos = async ()=> {
    try {
        await db.sync({force: true});
        console.log('Datos ELIMINADOS CORRECTAMENTE');
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

if(process.argv[2] === "-i"){
    importarDatos()
}

if(process.argv[2] === "-e"){
    eliminarDatos();
}