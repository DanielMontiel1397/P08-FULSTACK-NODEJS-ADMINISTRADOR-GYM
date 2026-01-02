//Funcion para calcular fecha final
export function calcularFecha(inicio, membresia) {
    const comienzo = new Date(inicio);
    let final = new Date(comienzo);

    switch (membresia) {
        case 'semana':
            final.setDate(comienzo.getDate() + 7);
            break;

        case 'mes':
            final.setMonth(comienzo.getMonth() + 1);
            break;
        
        case 'anualidad':
            final.setFullYear(comienzo.getFullYear() + 1);
            break;
    }

    return final;
}