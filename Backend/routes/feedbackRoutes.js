const express = require('express');
const api = express.Router();
const feedbackController = require('../controllers/feedbackController');

api.post('/feedback', feedbackController.createFeedback);
api.get('/getFeedback', feedbackController.getFeedback);
api.put('/updateFeedback/:id', feedbackController.updateFeedback);
api.delete('/deleteFeedback/:id', feedbackController.deleteFeedback);

module.exports = api;