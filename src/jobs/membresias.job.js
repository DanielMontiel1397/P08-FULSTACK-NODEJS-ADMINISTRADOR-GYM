import cron from 'node-cron';
import { Cliente } from '../models/index.js';
import { Op } from 'sequelize';

const updateCliente = async () => {
    try {
        await Cliente.update(
            {
                is_activated: false
            },
            {
                where: {
                    membership_end: {
                        [Op.lt]: new Date()
                    },
                    is_activated: true
                }
            }
        );

        console.log('Membresías vencidas actualizadas');
    } catch (error) {
        console.error('Error al actualizar membresías:', error);
    }
};

cron.schedule("0 1 * * *", updateCliente);