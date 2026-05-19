//לייבא את המודל לעמוד שלי
const Subject = require('../models/subjectModel');

const getAllSubjects = async (req, res) => {
    try {
        const subject = await Subject.find();
        res.status(200).send(subject);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

const getSubjectByid = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        res.status(200).send(subject);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

const addNewSubject = async (req, res) => {
    try {
        const newSubject = new Subject({ ...req.body });
        await newSubject.save();
        res.status(200).send(newSubject);
    }
    catch (err) {
        //אם נתקל בבעיה מחזיר את זה
        res.status(500).send(err);
    }
}
const deletSubject = async (req, res) => {

    try {
        const subject = await Subject.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: "subject delete", deletesubject: subject })

    } catch (err) {
        res.status(500).send(err);
    }
}

const updateSubject = async (req, res) => {
    try {
        const subject = await Subject.findByIdAndUpdate(req.params.id, { $set: { ...req.body } }, { new: true })
        res.status(200).send({ message: "subject updated", updateSubject: subject })

    }
    catch (err) {
        res.status(500).send(err);
    }
}
module.exports = {
    getAllSubjects,
    getSubjectByid,
    addNewSubject,
    deletSubject,
    updateSubject
}