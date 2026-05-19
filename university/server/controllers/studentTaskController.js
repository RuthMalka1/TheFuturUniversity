//לייבא את המודל לעמוד שלי
const StudentTask = require('../models/studentTaskModel');

const getAllStudentTasks = async (req, res) => {
    try {
        const studentTask = await StudentTask.find();
        res.status(200).send(studentTask);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

const getStudentTaskByid = async (req, res) => {
    try {
        const studentTask = await StudentTask.findById(req.params.id);
        res.status(200).send(studentTask);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

const addNewStudentTask = async (req, res) => {
    try {
        const newstudentTask = new StudentTask({ ...req.body });
        await newstudentTask.save();
        res.status(200).send(newstudentTask);
    }
    catch (err) {
        //אם נתקל בבעיה מחזיר את זה
        res.status(500).send(err);
    }
}
const deletStudentTask = async (req, res) => {

    try {
        const studentTask = await StudentTask.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: "studentTask delete", deletestudentTask: studentTask })

    } catch (err) {
        res.status(500).send(err);
    }
}

const updateStudentTask = async (req, res) => {
    try {
        const studentTask = await StudentTask.findByIdAndUpdate(req.params.id, { $set: { ...req.body } }, { new: true })
        res.status(200).send({ message: "studentTask updated", updatestudentTask: studentTask })

    }
    catch (err) {
        res.status(500).send(err);
    }
}
module.exports = {
    getAllStudentTasks,
    getStudentTaskByid,
    addNewStudentTask,
    deletStudentTask,
    updateStudentTask
}