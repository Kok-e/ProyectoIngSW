const express = require('express');
const api = express.Router();
const nodemailer = require('../requeriments/nodemailer.js');

api.get('/enviar-correo-cuadrilla-practica/:id', nodemailer.enviarCorreoACuadrillaDePractica);

module.exports = api;