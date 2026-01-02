import { DataTypes } from "sequelize";
import db from "../config/db.js";
import { calcularFecha } from "../helpers/calcularFechaMembresia.js";

const Cliente = db.define('clientes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            len: [2,100]
        }
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max:120
        }
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false
    }, 
    membership_type: {
        type: DataTypes.ENUM('semana','mes','anualidad'),
        allowNull: false
    },
    membership_start : {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    membership_end : {
        type: DataTypes.DATE,
        allowNull: true
    },
    is_activated: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    hooks: {
        //Hook para calcular la fecha de fin de membresia al crear cliente.
        beforeCreate:   function (cliente) {
            cliente.membership_end =  calcularFecha(cliente.membership_start, cliente.membership_type);
        },

        //Calcular fecha cuando se actualice un cliente
        beforeUpdate:  function(cliente) {
            
            if (cliente.changed('membership_type')){
                cliente.membership_end = calcularFecha(cliente.membership_start, cliente.membership_type);
            }
        }
    },
    scopes: {
        eliminarInfo: {
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'sucursalId']
            }
        }
    }
});




export default Cliente;