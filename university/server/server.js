require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/usersModel');

const coursesRouter = require('./routes/coursesRoute');
const learndCoursesRouter = require('./routes/learndCoursesRoute');
const marksRouter = require('./routes/marksRoute');
const materialsRouter = require('./routes/materialsRoute');
const responsRouter = require('./routes/responsRoute');
const studentTaskRouter = require('./routes/studentTaskRoute'); 
const subjectRouter = require('./routes/subjectRoute');
const tasksRouter = require('./routes/tasksRoute');
const usersRouter = require('./routes/usersRoute');
const noticesRouter = require('./routes/noticesRoute');

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is missing. Add it to server/.env (see .env.example).");
    process.exit(1);
}

const ensureDefaultManager = async () => {
    const managerPhone = process.env.MANAGER_PHONE || "12345";
    const managerPassword = process.env.MANAGER_PASSWORD || "000";
    const existingManager = await User.findOne({
        status: { $in: ['manager', 'admin'] }
    });

    const hashedPassword = await bcrypt.hash(managerPassword, 10);

    if (!existingManager) {
        await User.create({
            firstName: "System",
            lastName: "Manager",
            phone: managerPhone,
            password: hashedPassword,
            status: "manager"
        });
        console.log(`🔐 default manager created: ${managerPhone}`);
        return;
    }

    existingManager.phone = managerPhone;
    existingManager.password = hashedPassword;
    if (!['manager', 'admin'].includes(existingManager.status)) {
        existingManager.status = 'manager';
    }
    await existingManager.save();
    console.log(`🔐 default manager credentials ensured for: ${managerPhone}`);
}

app.get('/health', (req, res) => {
    const ready = mongoose.connection.readyState === 1;
    res.status(ready ? 200 : 503).json({
        ok: ready,
        database: ready ? "connected" : "not connected",
        mongoReadyState: mongoose.connection.readyState,
    });
});

app.use('/courses', coursesRouter)
app.use('/learndCourses', learndCoursesRouter)
app.use('/marks', marksRouter)
app.use('/materials', materialsRouter)
app.use('/respons', responsRouter)
app.use('/studentTask', studentTaskRouter)
app.use('/subject', subjectRouter)
app.use('/task', tasksRouter)
app.use('/users', usersRouter)
app.use('/notices', noticesRouter)

async function start() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✨ חיבור למסד הנתונים הושלם (MongoDB).");
        const dbName = mongoose.connection.db?.databaseName;
        if (dbName) console.log("   שם בסיס:", dbName);
        await ensureDefaultManager();
    } catch (err) {
        console.error("❌ לא ניתן להתחבר ל-MongoDB — לכן לא תתאפשר שמירה של נתונים.");
        console.error("   סיבה:", err.message);
        console.error("   • ב-Windows: הפעילו את השירות \"MongoDB Server\" (שירותים) או הפעילו את MongoDB Compass וודאו שהחיבור עובד ל־localhost:27017.");
        console.error("   • אחרי שMongoDB רץ, הריצו שוב: npm start בתיקיית server.");
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`server is running in port : http://localhost:${PORT}`);
        console.log(`   בדיקת חיבור: http://localhost:${PORT}/health`);
    });
}

start();
