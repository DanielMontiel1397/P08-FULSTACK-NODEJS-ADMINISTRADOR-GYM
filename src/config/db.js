import Sequelize  from "sequelize";
import dotenv from 'dotenv'

//CONEXION A VARIABLES DE ENTORNO
dotenv.config();

// Nueva instacia de Sequelize con la base de datos a cuál conectarnos.
const db = new Sequelize(process.env.BD_NAME,process.env.BD_USER,process.env.BD_PASS,{
    host: process.env.BD_HOST,
    port: process.env.BD_PORT,
    dialect: 'mysql',
    define: {
        timestamps: true
    },
    pool: {
        max: 5, //Máximo 5 conexiones simultaneas
        min: 0,
        acquire: 30000, //Tiempo máximo para obtener conexión.
        idle: 10000
    }
}); 

export default db;