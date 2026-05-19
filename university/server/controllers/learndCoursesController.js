//לייבא את המודל לעמוד שלי
const LearndCourses = require('../models/learndCourses');

const getAllLearndCourses = async (req, res) => {
    try {
        const learndCours = await LearndCourses.find();
        res.status(200).send(learndCours);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

const getLearndCoursByid = async (req, res) => {
    try {
        const learndCours = await LearndCourses.findById(req.params.id);
        res.status(200).send(learndCours);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

const addNewLearndCours = async (req, res) => {
    try {
        const newlearndCours = new LearndCourses({ ...req.body });
        await newlearndCours.save();
        res.status(200).send(newlearndCours);
    }
    catch (err) {
        //אם נתקל בבעיה מחזיר את זה
        res.status(500).send(err);
    }
}
const deletLearndCours = async (req, res) => {

    try {
        const learndCours = await LearndCourses.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: "learndCours delete", deletelearndCours: learndCours })

    } catch (err) {
        res.status(500).send(err);
    }
}

const updateLearndCours = async (req, res) => {
    try {
        const learndCours = await LearndCourses.findByIdAndUpdate(req.params.id, { $set: { ...req.body } }, { new: true })
        res.status(200).send({ message: "learndCours updated", updatelearndCours: learndCours })

    }
    catch (err) {
        res.status(500).send(err);
    }
}
module.exports = {
    getAllLearndCourses,
    getLearndCoursByid,
    addNewLearndCours,
    deletLearndCours,
    updateLearndCours
}