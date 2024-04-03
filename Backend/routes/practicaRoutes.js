const express = require('express');
const api = express.Router();
const practicaController = require('../controllers/practicaController');
const exportController = require('../controllers/exportController');


api.post('/practica', practicaController.createPractica);
api.get('/getPractica',practicaController.getPractica);
api.delete('/deletePractica/:id', practicaController.deletePractica);
api.put('/updatePractica/:id', practicaController.updatePractica);
api.get('/exportPracticas', exportController.exportPractica);


module.exports = api;
