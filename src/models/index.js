import SuperAdmin from "./SuperAdmin.js";
import Sucursal from "./Sucursal.js";
import Cliente from "./Cliente.js";

SuperAdmin.hasMany(Sucursal, {foreignKey: 'superAdminId', as: 'sucursal'}); //Un super admin puede tener varias sucursales.
Sucursal.belongsTo(SuperAdmin, {foreignKey: 'superAdminId', as: 'superadmin'}); // Sucursal pernece a un SuperAdmin

Sucursal.hasMany(Cliente, {foreignKey: 'sucursalId', as: 'cliente'});
Cliente.belongsTo(Sucursal, {foreignKey: 'sucursalId', as: 'sucursal'});

export {
    SuperAdmin,
    Sucursal,
    Cliente
}