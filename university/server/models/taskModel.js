//mongoose לייבא את ספרית
const mongoose = require('mongoose');

//יצירת הסכמה 
const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        min: 1,
        max: 300
    },
    coursId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: true
    },
    anaunseDate: {
        type: Date,
    },
    givenDate: {
        type: Date,
    },
})

//למסד הנתונים הגדרת המודל עצמו
const Task = mongoose.model('Task', taskSchema);
//ייצוא של המודל
module.exports = Task;