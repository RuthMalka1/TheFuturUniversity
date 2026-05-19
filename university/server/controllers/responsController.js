//לייבא את המודל לעמוד שלי
const Respons = require('../models/responsModel');

const getAllResponses = async (req, res) => {
    try {
        const respons = await Respons.find().sort({ date: 1 });
        res.status(200).send(respons);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

const getResponsByid = async (req, res) => {
    try {
        const respons = await Respons.findById(req.params.id);
        if (!respons) {
            return res.status(404).send({ message: 'respons not found' });
        }
        res.status(200).send(respons);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

const addNewRespons = async (req, res) => {
    try {
        const { studentId, teacherId, senderRole, content, date } = req.body;

        if (!studentId || !teacherId || !senderRole || !content?.trim()) {
            return res.status(400).send({ message: 'studentId, teacherId, senderRole and content are required' });
        }

        const newrespons = new Respons({
            studentId,
            teacherId,
            senderRole,
            content: content.trim(),
            date: date || new Date()
        });
        await newrespons.save();
        res.status(200).send(newrespons);
    }
    catch (err) {
        //אם נתקל בבעיה מחזיר את זה
        res.status(500).send(err);
    }
}
const deletRespons = async (req, res) => {

    try {
        const respons = await Respons.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: "respons delete", deleterespons: respons })

    } catch (err) {
        res.status(500).send(err);
    }
}

const clearConversation = async (req, res) => {
    try {
        const { studentId, teacherId } = req.body;
        if (!studentId || !teacherId) {
            return res.status(400).send({ message: "studentId and teacherId are required" });
        }

        const result = await Respons.deleteMany({ studentId, teacherId });
        res.status(200).send({
            message: "conversation cleared",
            deletedCount: result.deletedCount
        });
    } catch (err) {
        res.status(500).send(err);
    }
}

const updateRespons = async (req, res) => {
    try {
        const respons = await Respons.findByIdAndUpdate(req.params.id, { $set: { ...req.body } }, { new: true })
        if (!respons) {
            return res.status(404).send({ message: "respons not found" })
        }
        res.status(200).send({ message: "respons updated", updaterespons: respons })

    }
    catch (err) {
        res.status(500).send(err);
    }
}
module.exports = {
    getAllResponses,
    getResponsByid,
    addNewRespons,
    deletRespons,
    clearConversation,
    updateRespons
}