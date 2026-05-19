//mongoose לייבא את ספרית
const mongoose = require('mongoose');

//יצירת הסכמה 
const usersSchema = new mongoose.Schema({
    // userId: {
    //     type: String,
    //     minlength: 3
    // },
    firstName: {
        type: String,
        min: 1,
        max: 300
    },
    lastName: {
        type: String,
        min: 1,
        max: 300

    },
    birthDate: {
        type: Date,
    },
    password: {
        type: String,
        min: 1,
        max: 300

    },
    profileImage: {
        type: String,

    },
    adress: {
        type: String,
        min: 1,
        max: 300

    },
    phone: {
        type: String,
        min: 1,
        max: 300

    },
    /** עותק טקסטואלי להצגה במסך הניהול בלבד; שדה `password` נשמר עם גיבוב לכניסה */
    initialPasswordPlain: {
        type: String,
        max: 300,
    },
    status: {
        type: String,
        enum: ['manager', 'admin', 'teacher', 'student'],
        required: true
    },
    age: {
        type: Number,
        min: 1,
        max: 120
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses'
    },
    subjectIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }],

})

//למסד הנתונים הגדרת המודל עצמו
const Users = mongoose.model('Users', usersSchema);
//ייצוא של המודל
module.exports = Users;