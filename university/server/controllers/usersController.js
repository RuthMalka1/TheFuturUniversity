//לייבא את המודל לעמוד שלי
const User = require('../models/usersModel');
const bcrypt = require('bcryptjs');

const isBcryptHash = (value) => typeof value === 'string' && /^\$2[aby]\$/.test(value);

const hashPasswordIfNeeded = async (value) => {
    if (!value) return value;
    if (isBcryptHash(value)) return value;
    return bcrypt.hash(String(value), 10);
};

/** רשימה כללית – ללא hash וללא סיסמה ראשונית plaintext (זמין לכל ממשק בקליינט) */
const getAllUsers = async (req, res) => {
    try {
        const user = await User.find()
            .select('-password -initialPasswordPlain')
            .populate('courseId', 'name')
            .populate('subjectIds', 'name');
        res.status(200).send(user);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

/** למסך הניהול – טלפון ושאר פרטים; ללא גיבוב וללא סיסמה בטקסט */
const getManagementUsersList = async (req, res) => {
    try {
        const user = await User.find()
            .select('-password -initialPasswordPlain')
            .populate('courseId', 'name')
            .populate('subjectIds', 'name');
        res.status(200).send(user);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

const getUserByid = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password -initialPasswordPlain')
            .populate('courseId', 'name')
            .populate('subjectIds', 'name');
        res.status(200).send(user);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

const addNewUser = async (req, res) => {
    try {
        const payload = { ...req.body };
        if (payload.password !== undefined && payload.password !== null) {
            const plain = String(payload.password).trim();
            payload.initialPasswordPlain = plain;
            payload.password = plain ? await hashPasswordIfNeeded(plain) : payload.password;
        }
        const newuser = new User(payload);
        await newuser.save();
        const safe = newuser.toObject();
        delete safe.password;
        delete safe.initialPasswordPlain;
        res.status(200).send(safe);
    }
    catch (err) {
        //אם נתקל בבעיה מחזיר את זה
        res.status(500).send(err);
    }
}

const loginUser = async (req, res) => {
    try {
        const { phone, password } = req.body;
        if (!phone || !password) {
            return res.status(400).send({ message: "phone and password are required" });
        }

        const user = await User.findOne({ phone: phone.trim() })
            .populate('courseId', 'name')
            .populate('subjectIds', 'name');

        if (!user) {
            return res.status(401).send({ message: "invalid credentials" });
        }

        let isValidPassword = false;
        if (isBcryptHash(user.password)) {
            isValidPassword = await bcrypt.compare(password.trim(), user.password);
        } else {
            isValidPassword = String(user.password || "") === password.trim();
        }

        if (!isValidPassword) {
            return res.status(401).send({ message: "invalid credentials" });
        }

        res.status(200).send({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            status: user.status,
            age: user.age,
            phone: user.phone,
            courseId: user.courseId,
            subjectIds: user.subjectIds
        });
    } catch (err) {
        res.status(500).send(err);
    }
}

const resetPasswordByPhone = async (req, res) => {
    try {
        const { phone, newPassword } = req.body;
        if (!phone || newPassword === undefined || newPassword === null) {
            return res.status(400).send({ message: "יש להזין מספר טלפון וסיסמה חדשה" });
        }
        const trimmedPhone = phone.trim();
        const trimmedPw = String(newPassword).trim();
        if (!trimmedPhone || !trimmedPw) {
            return res.status(400).send({ message: "יש להזין מספר טלפון וסיסמה חדשה" });
        }

        const user = await User.findOne({ phone: trimmedPhone });
        if (!user) {
            return res.status(404).send({ message: "לא נמצא משתמש עם מספר טלפון זה" });
        }
        if (!["student", "teacher"].includes(user.status)) {
            return res.status(403).send({
                message:
                    "איפוס הסיסמה זמין לתלמידים ולמורים בלבד. למנהלים יש התחברות קבועה במערכת.",
            });
        }

        user.password = await bcrypt.hash(trimmedPw, 10);
        user.initialPasswordPlain = trimmedPw;
        await user.save();
        res.status(200).send({
            success: true,
            message: "הסיסמה עודכנה בהצלחה. ניתן להתחבר עכשיו.",
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

const deletUser = async (req, res) => {

    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: "user delete", deleteuser: user })

    } catch (err) {
        res.status(500).send(err);
    }
}

const updateUser = async (req, res) => {
    try {
        const payload = { ...req.body };
        if (payload.password !== undefined && payload.password !== null && String(payload.password).trim()) {
            const plain = String(payload.password).trim();
            payload.initialPasswordPlain = plain;
            payload.password = await hashPasswordIfNeeded(plain);
        }
        const user = await User.findByIdAndUpdate(req.params.id, { $set: payload }, { new: true })
            .populate('courseId', 'name')
            .populate('subjectIds', 'name');
        const plainUser = typeof user?.toObject === 'function' ? user.toObject() : user;
        if (plainUser) delete plainUser.password;
        res.status(200).send({ message: "user updated", updateUser: plainUser })

    }
    catch (err) {
        res.status(500).send(err);
    }
}
module.exports = {
    getAllUsers,
    getManagementUsersList,
    getUserByid,
    addNewUser,
    loginUser,
    resetPasswordByPhone,
    deletUser,
    updateUser
}