const express = require('express');
const uploadMiddleware  = require('../Middleware/uploadMiddleware');
const coursRouter = express.Router();

const {
  getAllCourses,
  getCoursByid,
  addNewCours,
  deletCours,
  updateCours,
} = require("../controllers/coursesController");

// POST להוספת קורס עם Middleware של העלאת קובץ
coursRouter.post("/", uploadMiddleware, addNewCours);

// PUT לעדכון קורס
coursRouter.put('/:id', updateCours);

// GET כל הקורסים
coursRouter.get('/', getAllCourses);

// GET קורס לפי מזהה
coursRouter.get('/:id', getCoursByid);

// DELETE למחיקת קורס
coursRouter.delete('/:id', deletCours);

module.exports = coursRouter;