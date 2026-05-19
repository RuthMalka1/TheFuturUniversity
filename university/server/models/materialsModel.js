//mongoose לייבא את ספרית
const mongoose = require('mongoose');

//יצירת הסכמה 
const materialsSchema = new mongoose.Schema({
    // materialId: {
    //     type: String,
    //     minlength: 3
    // },
    courslId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: true
    },
    teacherlId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    files: {
        files: [String],
    },
    anaunseDate: {
        type: Date,
    },
})

//למסד הנתונים הגדרת המודל עצמו
const Materials = mongoose.model('Materials', materialsSchema);
//ייצוא של המודל
module.exports = Materials;