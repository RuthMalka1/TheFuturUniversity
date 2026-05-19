const mongoose = require("mongoose");

const noticesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: 1,
      max: 300,
    },
    content: {
      type: String,
      min: 1,
      max: 1000,
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Notices = mongoose.model("Notices", noticesSchema);

module.exports = Notices;
