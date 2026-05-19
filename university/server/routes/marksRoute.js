const express = require('express');
const markController = require('../controllers/markController');

const markRouter = express.Router();

markRouter.post('/',markController.addNewMark);
markRouter.put('/:id',markController.updateMark);
markRouter.get('/',markController.getAllMarks);
markRouter.get('/:id',markController.getMarkByid);
markRouter.delete('/:id',markController.deletMark)
module.exports = markRouter;