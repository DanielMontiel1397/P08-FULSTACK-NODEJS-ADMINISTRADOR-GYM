import { DataTypes } from "sequelize";
import db from "../config/db.js";

import bcrypt from 'bcrypt';

const Sucursal = db.define('sucursales', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            len: [2, 100]
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false
    }, 
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true //Tiene que ser un formato de email
        }
    },
    newEmail: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
            isEmail: true //Tiene que ser un formato de email
        },
        defaultValue: null
    },
    is_activated: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    token: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
},{
    hooks: {
        beforeCreate: async function(sucursal){
            if(sucursal.password){
                const salt = await bcrypt.genSalt(10);
                sucursal.password = await bcrypt.hash(sucursal.password,salt);
            }
        },
        beforeUpdate: async function (sucursal) {
            if(sucursal.changed('password')){
                const salt = await bcrypt.genSalt(10);
                sucursal.password = await bcrypt.hash(sucursal.password, salt);
            }
        }
    },
    //Obtener solo información necesaria
    scopes: {
        eliminarInfo: {
            attributes: {
                exclude: ['password', 'token', 'createdAt', 'updatedAt', 'superAdminId', 'newEmail']
            }
        }
    }
});

//Comprobar Password
Sucursal.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

export default Sucursal;