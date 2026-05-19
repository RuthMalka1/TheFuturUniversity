const express = require('express');
const subjectController = require('../controllers/subjectController');

const subjectRouter = express.Router();

subjectRouter.post('/',subjectController.addNewSubject);
subjectRouter.put('/:id',subjectController.updateSubject);
subjectRouter.get('/',subjectController.getAllSubjects);
subjectRouter.get('/:id',subjectController.getSubjectByid);
subjectRouter.delete('/:id',subjectController.deletSubject)
module.exports = subjectRouter;