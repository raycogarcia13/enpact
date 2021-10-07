exports.days = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
];

const cantDaysMonth = (mes, anno) => {
    let cant;
    switch (mes) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            cant = 31;
            break;
        case 4:
        case 6:
        case 9:
        case 11:
            cant = 30;
            break;
        case 2:
            if (anno % 100 == 0) {
                cant = (anno % 400 == 0) ? 29 : 28;
            } else
                cant = (anno % 4 == 0) ? 29 : 28
            break;
    }
    return cant;
}
exports.cantDaysMonth = cantDaysMonth;
// dia de la semana
exports.dayOfWeek = (dt) => {
    let fecha = new Date(dt);
    return fecha.getDay();
}
// horas de un día
const countHourDayP = (dt) => {
    let fecha = new Date(dt);
    let d = fecha.getDay();
    let cant;
    switch (d) {
        case 5:
            cant = 8;
            break;
        case 6:
        case 0:
            cant = 0;
            break;
        default:
            cant = 9;
            break;
    }
    return cant;
}
exports.countHourDayP = countHourDayP

exports.countHourMonth = (mes, anno) => {
    let cantMont = cantDaysMonth(mes, anno);
    if (!cantMont)
        return null;
    let cant = 0;
    for (let i = 1; i <= cantMont; i++) {
        let date = new Date(anno + '/' + mes + '/' + i);
        cant += countHourDayP(date);
    }
    return cant;
}

