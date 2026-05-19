const express = require('express');
const responsController = require('../controllers/responsController');

const responsRouter = express.Router();

responsRouter.post('/',responsController.addNewRespons);
responsRouter.post('/clear', responsController.clearConversation);
responsRouter.put('/:id',responsController.updateRespons);
responsRouter.get('/',responsController.getAllResponses);
responsRouter.get('/:id',responsController.getResponsByid);
responsRouter.delete('/:id',responsController.deletRespons)
module.exports = responsRouter;