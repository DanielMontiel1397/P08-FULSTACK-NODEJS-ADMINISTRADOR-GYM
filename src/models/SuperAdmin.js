import { DataTypes } from 'sequelize';
import db from '../config/db.js'
import bcrypt from 'bcrypt'

const SuperAdmin = db.define('superAdmins', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true //Tiene que ser un formato de email
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    token: DataTypes.STRING,
    is_confirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
    },

    //Usar Hook para hashear Password. Esto se ejecuta antes de crear la instancia.
    {
        hooks: {
            beforeCreate: async function (administrador) {
                const salt = await bcrypt.genSalt(10); //Ronda de hasheo.
                administrador.password = await bcrypt.hash(administrador.password, salt); //Almacenamos el password hasheado.
            },
            beforeUpdate: async function (administrador) {
                if(administrador.changed('password')){
                    const salt = await bcrypt.genSalt(10);
                    administrador.password = await bcrypt.hash(administrador.password, salt);
                }
            }
        },
        scopes: {
            eliminarInfo: {
                attributes: {
                    exclude: ['password', 'token', 'is_confirmed']
                }
            }
        }

    });

//Comprobar Password
SuperAdmin.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

export default SuperAdmin;
