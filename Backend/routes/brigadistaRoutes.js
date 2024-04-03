const express = require('express');
const api = express.Router();
const brigadistaController = require('../controllers/brigadistaController');
const exportController = require('../controllers/exportController');

api.post('/createBrigadista', brigadistaController.createBrigadista);
api.get('/getBrigadistas/:input?', brigadistaController.getBrigadistas);
api.get('/getBrigadistaByInput', brigadistaController.getBrigadistaByInput);
api.get('/getSpecificBrigadista/:id', brigadistaController.getSpecificBrigadista);
// api.get('/getByName', brigadistaController.getByName);
api.delete('/deleteBrigadista/:id', brigadistaController.deleteBrigadista);
api.put('/updateBrigadista/:id', brigadistaController.updateBrigadista);
api.get('/exportBrigadistas', exportController.exportBrigadista);


module.exports = api;