const express = require("express");
const noticesController = require("../controllers/noticesController");

const noticesRouter = express.Router();

noticesRouter.post("/", noticesController.addNewNotice);
noticesRouter.put("/:id", noticesController.updateNotice);
noticesRouter.get("/", noticesController.getAllNotices);
noticesRouter.get("/:id", noticesController.getNoticeById);
noticesRouter.delete("/:id", noticesController.deleteNotice);

module.exports = noticesRouter;
