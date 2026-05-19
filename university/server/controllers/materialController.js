//לייבא את המודל לעמוד שלי
const Material = require('../models/materialsModel');

const getAllMaterials = async (req, res) => {
    try {
        const material = await Material.find();
        res.status(200).send(material);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

const getMaterialByid = async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
        res.status(200).send(material);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

const addNewMaterial = async (req, res) => {
    try {
        const materialData = {
            ...req.body,
            files: {
                files: req.file ? [req.file.filename] : [],
            },
            anaunseDate: req.body.anaunseDate || new Date(),
        };

        const newmaterial = new Material(materialData);
        await newmaterial.save();
        res.status(200).send(newmaterial);
    }
    catch (err) {
        //אם נתקל בבעיה מחזיר את זה
        res.status(500).send(err);
    }
}
const deletMaterial = async (req, res) => {

    try {
        const material = await Material.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: "material delete", deletematerial: material })

    } catch (err) {
        res.status(500).send(err);
    }
}

const updateMaterial = async (req, res) => {
    try {
        const material = await Material.findByIdAndUpdate(req.params.id, { $set: { ...req.body } }, { new: true })
        res.status(200).send({ message: "material updated", updatematerial: material })

    }
    catch (err) {
        res.status(500).send(err);
    }
}
module.exports = {
    getAllMaterials,
    getMaterialByid,
    addNewMaterial,
    deletMaterial,
    updateMaterial
}