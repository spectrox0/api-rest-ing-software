// Cargamos el módulo de express para poder crear rutas
var express = require('express');

// Cargamos el controlador
var UserController = require('../controllers/user');
// Llamamos al router
var api = express.Router();


// Creamos una ruta para los métodos que tenemos en nuestros controladores

api.get('/user', UserController.getCurrentUser);
api.post('/register' , UserController.createUser);
api.post('/login', UserController.login);
api.put('/user/:id', UserController.updateUser);

// Exportamos la configuración
module.exports = api;