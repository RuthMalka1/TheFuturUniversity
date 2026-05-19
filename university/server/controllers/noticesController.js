const Notices = require("../models/noticesModel");

const getAllNotices = async (req, res) => {
  try {
    const notices = await Notices.find().sort({ publishDate: -1, createdAt: -1 });
    res.status(200).send(notices);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getNoticeById = async (req, res) => {
  try {
    const notice = await Notices.findById(req.params.id);
    res.status(200).send(notice);
  } catch (err) {
    res.status(500).send(err);
  }
};

const addNewNotice = async (req, res) => {
  try {
    const newNotice = new Notices({ ...req.body });
    await newNotice.save();
    res.status(200).send(newNotice);
  } catch (err) {
    res.status(500).send(err);
  }
};

const deleteNotice = async (req, res) => {
  try {
    const notice = await Notices.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "notice delete", deleteNotice: notice });
  } catch (err) {
    res.status(500).send(err);
  }
};

const updateNotice = async (req, res) => {
  try {
    const notice = await Notices.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body } },
      { new: true }
    );
    res.status(200).send({ message: "notice updated", updateNotice: notice });
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  getAllNotices,
  getNoticeById,
  addNewNotice,
  deleteNotice,
  updateNotice,
};
