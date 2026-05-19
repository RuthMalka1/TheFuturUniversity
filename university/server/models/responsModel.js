//mongoose לייבא את ספרית
const mongoose = require('mongoose');

//יצירת הסכמה 
const responsSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    senderRole: {
        type: String,
        enum: ['student', 'teacher'],
        required: true
    },
    content: {
        type: String,
        min: 1
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false })

//למסד הנתונים הגדרת המודל עצמו
const Respons = mongoose.model('Respons', responsSchema);
//ייצוא של המודל
module.exports = Respons;