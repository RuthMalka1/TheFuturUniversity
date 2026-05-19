const express = require('express');
const tasksController = require('../controllers/tasksController');

const tasksRouter = express.Router();

tasksRouter.post('/',tasksController.addNewTask);
tasksRouter.put('/:id',tasksController.updateTask);
tasksRouter.get('/',tasksController.getAllTasks);
tasksRouter.get('/:id',tasksController.getTaskByid);
tasksRouter.delete('/:id',tasksController.deletTask)
module.exports = tasksRouter;