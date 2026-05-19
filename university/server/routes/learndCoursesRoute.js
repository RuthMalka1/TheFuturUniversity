const express = require('express');
const learndCoursesController = require('../controllers/learndCoursesController');

const learndCoursesRouter = express.Router();

learndCoursesRouter.post('/',learndCoursesController.addNewLearndCours);
learndCoursesRouter.put('/:id',learndCoursesController.updateLearndCours);
learndCoursesRouter.get('/',learndCoursesController.getAllLearndCourses);
learndCoursesRouter.get('/:id',learndCoursesController.getLearndCoursByid);
learndCoursesRouter.delete('/:id',learndCoursesController.deletLearndCours)
module.exports = learndCoursesRouter;