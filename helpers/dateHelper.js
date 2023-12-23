
const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const obtenerNombreMes = (fecha) => {
    const indiceMes = fecha.getMonth();
    const nombreMes = meses[indiceMes];

    return nombreMes;
};

const obtenerNumMes = (mes) => {
    const numMes = meses.findIndex((m) => m.toLowerCase() === mes.toLowerCase());
    return numMes + 1;
};

const obtenerNombreMesAnterior = (fecha) => {
    const indiceMes = fecha.getMonth();
    const nombreMes = meses[indiceMes];

    return nombreMes;
};

const obtenerAnio = (fecha) => {
    return fecha.getFullYear();
};

module.exports = {
    obtenerNombreMes,
    obtenerNumMes,
    obtenerNombreMesAnterior,
    obtenerAnio,
}