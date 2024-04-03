const express = require('express');
const api = express.Router();
const cuadrillaController = require('../controllers/cuadrillaController');
const exportController = require('../controllers/exportController');



api.post('/cuadrilla', cuadrillaController.createCuadrilla);
api.get('/getCuadrilla', cuadrillaController.getCuadrilla);
api.get('/getCuadrillaID/:id', cuadrillaController.getCuadrillaID);
api.put('/updateCuadrilla/:id', cuadrillaController.updateCuadrilla);
api.delete('/deleteCuadrilla/:id', cuadrillaController.deleteCuadrilla);
api.get('/exportCuadrilla', exportController.exportCuadrilla);
api.get('/exportCuadrilla/:id', exportController.exportCuadrillabyID);
api.put('/removeBrigadista/:id', cuadrillaController.removeBrigadistaFromCuadrilla);


module.exports = api;