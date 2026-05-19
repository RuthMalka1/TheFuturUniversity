const express = require('express');
const studentTaskController = require('../controllers/studentTaskController');

const studentTaskRouter = express.Router();

studentTaskRouter.post('/',studentTaskController.addNewStudentTask);
studentTaskRouter.put('/:id',studentTaskController.updateStudentTask);
studentTaskRouter.get('/',studentTaskController.getAllStudentTasks);
studentTaskRouter.get('/:id',studentTaskController.getStudentTaskByid);
studentTaskRouter.delete('/:id',studentTaskController.deletStudentTask)
module.exports = studentTaskRouter;