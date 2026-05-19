//mongoose לייבא את ספרית
const mongoose = require('mongoose');

//יצירת הסכמה 
const studentTaskSchema = new mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    content: {
        type: String,
        min: 1,

    },
    file: {
        type: String,
    },
    date: {
        type: Date,

    },
    mark: {
        type: String,
        min: 1,
        max: 300
    },
})

//למסד הנתונים הגדרת המודל עצמו
const StudentTask = mongoose.model('StudentTask', studentTaskSchema);
//ייצוא של המודל
module.exports = StudentTask;