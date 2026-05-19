const multer = require("multer");
const path = require("path");

// הגדרת מיקום ושם הקובץ שיישמרו
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // ודאי שקיימת תיקייה uploads בפרויקט
  },
  filename: function (req, file, cb) {
    // שם ייחודי לקובץ - timestamp + סיומת מקורית
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// הגדרת ה-Multer עם הגדרות האחסון
const upload = multer({ storage: storage });

// מייצאים את המידלוואר, פה בחרנו להעלות קובץ יחיד בשם 'coursImage'
module.exports = upload.single("coursImage");