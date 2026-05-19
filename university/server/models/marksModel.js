//mongoose לייבא את ספרית
const mongoose = require('mongoose');

//יצירת הסכמה 
const marksSchema = new mongoose.Schema({
    // markId: {
    //     type: String,
    //     minlength: 3
    // },
    coursId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    mark: {
        type: Number,

    },
})

//למסד הנתונים הגדרת המודל עצמו
const Marks = mongoose.model('Marks', marksSchema);
//ייצוא של המודל
module.exports = Marks;