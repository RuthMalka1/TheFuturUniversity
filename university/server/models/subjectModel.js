//mongoose לייבא את ספרית
const mongoose = require('mongoose');

//יצירת הסכמה  
const subjectSchema = new mongoose.Schema({
    // subjectId: {
    //     type: String,
    //     minlength: 3
    // },
    name: {
        type: String,
        min: 1,
        max: 300
    },
   
})

//למסד הנתונים הגדרת המודל עצמו
const Subject = mongoose.model('Subject', subjectSchema);
//ייצוא של המודל
module.exports = Subject;