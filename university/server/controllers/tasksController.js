//לייבא את המודל לעמוד שלי
const Task = require('../models/taskModel');

const getAllTasks = async (req, res) => {
    try {
        const task = await Task.find();
        res.status(200).send(task);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

const getTaskByid = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        res.status(200).send(task);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

const addNewTask = async (req, res) => {
    try {
        const newtask = new Task({ ...req.body });
        await newtask.save();
        res.status(200).send(newtask);
    }
    catch (err) {
        //אם נתקל בבעיה מחזיר את זה
        res.status(500).send(err);
    }
}
const deletTask = async (req, res) => {

    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: "task delete", deletetask: task })

    } catch (err) {
        res.status(500).send(err);
    }
}

const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, { $set: { ...req.body } }, { new: true })
        res.status(200).send({ message: "task updated", updatetask: task })

    }
    catch (err) {
        res.status(500).send(err);
    }
}
module.exports = {
    getAllTasks,
    getTaskByid,
    addNewTask,
    deletTask,
    updateTask
}