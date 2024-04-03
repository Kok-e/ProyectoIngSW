const express = require('express');
const api = express.Router();
const requirements = require('../requeriments/addComments');


api.get('/addComentario/:id', requirements.addComentario);

module.exports = api;