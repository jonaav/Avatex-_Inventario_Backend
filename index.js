const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');


const port = process.env.PORT;

//Crear Srv
const app = express();

//Llamar BD
dbConnection();


/************* MIDDLEWARES ******************/

//Directorio Público
app.use(express.static('public'));

//Cors
app.use(cors());

//Lectura y parseo del body Req
app.use(express.json());

//Rutas
app.use('/api/inventario', require('./routes/inventario'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/proveedores', require('./routes/proveedores'));
app.use('/api/compras', require('./routes/compras'));
app.use('/api/ventas', require('./routes/ventas'));
app.use('/api/documentos', require('./routes/documentos'));


app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

//Excuchar peticiones
app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`)
});