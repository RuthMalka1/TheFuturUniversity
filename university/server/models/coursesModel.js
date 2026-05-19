//mongoose לייבא את ספרית
const mongoose = require('mongoose');

//יצירת הסכמה  
const coursesSchema = new mongoose.Schema({
    // coursId: {
    //     type: String,
    //     minlength: 3
    // },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    name: {
        type: String,
        min: 1, 
        max: 300

    },
    numberMeetings: {
        type: Number,
    },
    content: {
        type: String,
        min: 1,

    },
    coursImage: {
        type: String,

    },

})

//למסד הנתונים הגדרת המודל עצמו
const Courses = mongoose.model('Courses', coursesSchema);
//ייצוא של המודל
module.exports = Courses;