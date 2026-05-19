//mongoose לייבא את ספרית
const mongoose = require('mongoose');

//יצירת הסכמה 
const learndCoursesSchema = new mongoose.Schema({
    // learndCoursId: {
    //     type: String,
    //     minlength: 3
    // },
    coursId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    users: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Users',
        required: true
    },
    weekDay: {
        type: String,
    },
    startCoursDate: {
        type: Date,

    },
    endCoursDate: {
        type: Date,
    },
    status: {
        type: String,
        min: 1,
        max: 300
    },

})

//למסד הנתונים הגדרת המודל עצמו
const LearndCourses = mongoose.model('LearndCourses', learndCoursesSchema);
//ייצוא של המודל
module.exports = LearndCourses;