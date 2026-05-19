//לייבא את המודל לעמוד שלי
const Courses = require('../models/coursesModel');

const getAllCourses = async (req, res) => {
    try {
        const cours = await Courses.find().populate("subjectId", "name");
        res.status(200).send(cours);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

const getCoursByid = async (req, res) => {
    try {
        const cours = await Courses.findById(req.params.id);
        res.status(200).send(cours);
    }
    catch (err) {
        res.status(500).send(err);
    }
}


const addNewCours = async (req, res) => {
  try {
    const coursData = {
      ...req.body,
      coursImage: req.file ? req.file.filename : null, // שמירת שם הקובץ אם יש
    };
     
    console.log(coursData)

    const newcours = new Courses(coursData);
    await newcours.save();

    res.status(200).send(newcours);
  } catch (err) {
    res.status(500).send(err);
  }
};

const deletCours = async (req, res) => {

    try {
        const cours = await Courses.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: "cours delete", deletecours: cours })

    } catch (err) {
        res.status(500).send(err);
    }
}

const updateCours = async (req, res) => {
    try {
        const cours = await Courses.findByIdAndUpdate(req.params.id, { $set: { ...req.body } }, { new: true })
        res.status(200).send({ message: "cours updated", updatecours: cours })

    }
    catch (err) {
        res.status(500).send(err);
    }
}
module.exports = {
    getAllCourses,
    getCoursByid,
    addNewCours,
    deletCours,
    updateCours
}