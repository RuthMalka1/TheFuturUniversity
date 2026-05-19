//לייבא את המודל לעמוד שלי
const Mark = require('../models/marksModel');

const getAllMarks = async (req, res) => {
    try {
        const mark = await Mark.find();
        res.status(200).send(mark);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

const getMarkByid = async (req, res) => {
    try {
        const mark = await Mark.findById(req.params.id);
        res.status(200).send(mark);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

const addNewMark = async (req, res) => {
    try {
        const newmark = new Mark({ ...req.body });
        await newmark.save();
        res.status(200).send(newmark);
    }
    catch (err) {
        //אם נתקל בבעיה מחזיר את זה
        res.status(500).send(err);
    }
}
const deletMark = async (req, res) => {

    try {
        const mark = await Mark.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: "mark delete", deletemark: mark })

    } catch (err) {
        res.status(500).send(err);
    }
}

const updateMark = async (req, res) => {
    try {
        const mark = await Mark.findByIdAndUpdate(req.params.id, { $set: { ...req.body } }, { new: true })
        res.status(200).send({ message: "mark updated", updatemark: mark })

    }
    catch (err) {
        res.status(500).send(err);
    }
}
module.exports = {
    getAllMarks,
    getMarkByid,
    addNewMark,
    deletMark,
    updateMark
}