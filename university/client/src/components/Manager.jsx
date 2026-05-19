import { useEffect, useMemo, useState } from "react";
import "../App.css";
import { addUser, deleteUser, getManagementUsers, updateUser } from "../services/usersApi";
import {
  addCourse,
  deleteCourse,
  getAllCourses,
  updateCourse,
} from "../services/coursesApi";
import {
  addSubject,
  deleteSubject,
  getAllSubjects,
  updateSubject,
} from "../services/subjectApi";
import {
  addNotice,
  deleteNotice,
  getAllNotices,
  updateNotice,
} from "../services/noticesApi";
import { getAuthUser } from "../services/authStorage";

function Manager() {
  const authUser = getAuthUser();
  const [activeSection, setActiveSection] = useState("students");

  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentAge, setStudentAge] = useState("");
  const [studentCourseId, setStudentCourseId] = useState("");

  const [teacherName, setTeacherName] = useState("");
  const [teacherPhone, setTeacherPhone] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [teacherSubjectIds, setTeacherSubjectIds] = useState([]);

  const [subjectName, setSubjectName] = useState("");

  const [courseName, setCourseName] = useState("");
  const [courseContent, setCourseContent] = useState("");
  const [courseMeetings, setCourseMeetings] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeText, setNoticeText] = useState("");

  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [notices, setNotices] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [editingStudent, setEditingStudent] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingNotice, setEditingNotice] = useState(null);

  const [statusMessage, setStatusMessage] = useState("");
  const managerDisplayName = [authUser?.firstName, authUser?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  const splitName = (fullName) => {
    const [firstName, ...rest] = fullName.trim().split(" ");
    return {
      firstName,
      lastName: rest.join(" ") || "ללא",
    };
  };

  const displayOrDash = (value) => {
    if (value == null || String(value).trim() === "") return "—";
    return String(value).trim();
  };

  const coursesById = useMemo(
    () => Object.fromEntries(courses.map((course) => [course._id, course])),
    [courses]
  );

  const subjectsById = useMemo(
    () => Object.fromEntries(subjects.map((subject) => [subject._id, subject])),
    [subjects]
  );

  const sectionCards = [
    { key: "students", title: "תלמידים", count: students.length },
    { key: "teachers", title: "מורים", count: teachers.length },
    { key: "subjects", title: "מקצועות", count: subjects.length },
    { key: "courses", title: "קורסים", count: courses.length },
    { key: "notices", title: "הודעות", count: notices.length },
  ];

  const loadData = async () => {
    const [usersRes, coursesRes, subjectsRes, noticesRes] = await Promise.all([
      getManagementUsers(),
      getAllCourses(),
      getAllSubjects(),
      getAllNotices(),
    ]);

    if (Array.isArray(usersRes)) {
      setTeachers(usersRes.filter((user) => user.status === "teacher"));
      setStudents(usersRes.filter((user) => user.status === "student"));
    }

    if (Array.isArray(coursesRes)) {
      setCourses(coursesRes);
      if (!studentCourseId && coursesRes.length > 0) {
        setStudentCourseId(coursesRes[0]._id);
      }
    }

    if (Array.isArray(subjectsRes)) {
      setSubjects(subjectsRes);
      if (!selectedSubjectId && subjectsRes.length > 0) {
        setSelectedSubjectId(subjectsRes[0]._id);
      }
    }

    if (Array.isArray(noticesRes)) {
      setNotices(noticesRes);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onAddStudent = (event) => {
    event.preventDefault();
    if (!studentName.trim() || !studentPhone.trim() || !studentPassword.trim() || !studentAge || !studentCourseId) {
      setStatusMessage("יש למלא שם תלמיד, טלפון, סיסמה, גיל ומסלול.");
      return;
    }
    const { firstName, lastName } = splitName(studentName);

    addUser({
      firstName,
      lastName,
      phone: studentPhone.trim(),
      password: studentPassword.trim(),
      status: "student",
      age: Number(studentAge),
      courseId: studentCourseId,
    }).then((result) => {
      if (result && result._id) {
        setStudentName("");
        setStudentPhone("");
        setStudentPassword("");
        setStudentAge("");
        setStatusMessage("התלמיד נוסף בהצלחה.");
        loadData();
      } else {
        setStatusMessage("שגיאה בהוספת תלמיד.");
      }
    });
  };

  const onAddTeacher = (event) => {
    event.preventDefault();
    if (!teacherName.trim() || !teacherPhone.trim() || !teacherPassword.trim() || teacherSubjectIds.length === 0) {
      setStatusMessage("יש למלא שם מורה, טלפון, סיסמה ולבחור לפחות מקצוע אחד.");
      return;
    }
    const { firstName, lastName } = splitName(teacherName);

    addUser({
      firstName,
      lastName,
      phone: teacherPhone.trim(),
      password: teacherPassword.trim(),
      status: "teacher",
      subjectIds: teacherSubjectIds,
    }).then((result) => {
      if (result && result._id) {
        setTeacherName("");
        setTeacherPhone("");
        setTeacherPassword("");
        setTeacherSubjectIds([]);
        setStatusMessage("המורה נוסף בהצלחה.");
        loadData();
      } else {
        setStatusMessage("שגיאה בהוספת מורה.");
      }
    });
  };

  const onTeacherSubjectsChange = (event) => {
    const selectedValues = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setTeacherSubjectIds(selectedValues);
  };

  const onAddCourse = (event) => {
    event.preventDefault();
    if (!courseName.trim() || !selectedSubjectId) {
      setStatusMessage("יש למלא שם קורס ומקצוע.");
      return;
    }

    const formData = new FormData();
    formData.append("name", courseName.trim());
    formData.append("subjectId", selectedSubjectId);
    if (courseContent.trim()) {
      formData.append("content", courseContent.trim());
    }
    if (courseMeetings.trim()) {
      formData.append("numberMeetings", Number(courseMeetings));
    }

    addCourse(formData).then((result) => {
      if (result && result._id) {
        setCourseName("");
        setCourseContent("");
        setCourseMeetings("");
        setStatusMessage("הקורס נוסף בהצלחה.");
        loadData();
      } else {
        setStatusMessage("שגיאה בהוספת קורס.");
      }
    });
  };

  const onAddSubject = (event) => {
    event.preventDefault();
    if (!subjectName.trim()) {
      setStatusMessage("יש להזין שם מקצוע.");
      return;
    }

    addSubject({ name: subjectName.trim() }).then((result) => {
      if (result && result._id) {
        setSubjectName("");
        setStatusMessage("המקצוע נוסף בהצלחה.");
        loadData();
      } else {
        setStatusMessage("שגיאה בהוספת מקצוע.");
      }
    });
  };

  const onAddNotice = (event) => {
    event.preventDefault();
    if (!noticeTitle.trim()) {
      setStatusMessage("יש להזין כותרת להודעה.");
      return;
    }

    addNotice({
      title: noticeTitle.trim(),
      content: noticeText.trim(),
    }).then((result) => {
      if (result && result._id) {
        setNoticeTitle("");
        setNoticeText("");
        setStatusMessage("ההודעה פורסמה בהצלחה.");
        loadData();
      } else {
        setStatusMessage("שגיאה בפרסום הודעה.");
      }
    });
  };

  const onDeleteStudent = async (id) => {
    const result = await deleteUser(id);
    setStatusMessage(result?.message ? "התלמיד נמחק." : "שגיאה במחיקת תלמיד.");
    loadData();
  };

  const onDeleteTeacher = async (id) => {
    const result = await deleteUser(id);
    setStatusMessage(result?.message ? "המורה נמחק." : "שגיאה במחיקת מורה.");
    loadData();
  };

  const onDeleteSubject = async (id) => {
    const result = await deleteSubject(id);
    setStatusMessage(result?.message ? "המקצוע נמחק." : "שגיאה במחיקת מקצוע.");
    loadData();
  };

  const onDeleteCourse = async (id) => {
    const result = await deleteCourse(id);
    setStatusMessage(result?.message ? "הקורס נמחק." : "שגיאה במחיקת קורס.");
    loadData();
  };

  const onDeleteNotice = async (id) => {
    const result = await deleteNotice(id);
    setStatusMessage(result?.message ? "ההודעה נמחקה." : "שגיאה במחיקת הודעה.");
    loadData();
  };

  const onUpdateStudent = async (event) => {
    event.preventDefault();
    if (!editingStudent) return;
    const { firstName, lastName } = splitName(editingStudent.name);
    const result = await updateUser(editingStudent.id, {
      firstName,
      lastName,
      age: Number(editingStudent.age),
      courseId: editingStudent.courseId,
      status: "student",
    });
    setStatusMessage(result?.updateUser ? "פרטי התלמיד עודכנו." : "שגיאה בעדכון תלמיד.");
    setEditingStudent(null);
    loadData();
  };

  const onUpdateTeacher = async (event) => {
    event.preventDefault();
    if (!editingTeacher) return;
    const { firstName, lastName } = splitName(editingTeacher.name);
    const result = await updateUser(editingTeacher.id, {
      firstName,
      lastName,
      subjectIds: editingTeacher.subjectIds,
      status: "teacher",
    });
    setStatusMessage(result?.updateUser ? "פרטי המורה עודכנו." : "שגיאה בעדכון מורה.");
    setEditingTeacher(null);
    loadData();
  };

  const onUpdateSubject = async (event) => {
    event.preventDefault();
    if (!editingSubject) return;
    const result = await updateSubject(editingSubject.id, {
      name: editingSubject.name,
    });
    setStatusMessage(result?.updateSubject ? "המקצוע עודכן." : "שגיאה בעדכון מקצוע.");
    setEditingSubject(null);
    loadData();
  };

  const onUpdateCourse = async (event) => {
    event.preventDefault();
    if (!editingCourse) return;
    const result = await updateCourse(editingCourse.id, {
      name: editingCourse.name,
      content: editingCourse.content,
      numberMeetings: Number(editingCourse.numberMeetings),
      subjectId: editingCourse.subjectId,
    });
    setStatusMessage(result?.updatecours ? "הקורס עודכן." : "שגיאה בעדכון קורס.");
    setEditingCourse(null);
    loadData();
  };

  const onUpdateNotice = async (event) => {
    event.preventDefault();
    if (!editingNotice) return;
    const result = await updateNotice(editingNotice.id, {
      title: editingNotice.title,
      content: editingNotice.content,
    });
    setStatusMessage(result?.updateNotice ? "ההודעה עודכנה." : "שגיאה בעדכון הודעה.");
    setEditingNotice(null);
    loadData();
  };

  return (
    <div className="home-page">
      <main className="content-wrap">
        <section className={`card manager-hero manager-hero--${activeSection}`}>
          <h1>שלום המנהל {managerDisplayName || "יקר/ה"}</h1>
          <p>בחרו קטגוריה לניהול מלא של הרשומות: הוספה, עריכה ומחיקה.</p>
          {statusMessage ? <p className="status-message">{statusMessage}</p> : null}
        </section>

        <section className="card manager-sections-grid">
          {sectionCards.map((card) => (
            <button
              key={card.key}
              className={`manager-section-tile ${
                activeSection === card.key ? "active" : ""
              }`}
              onClick={() => setActiveSection(card.key)}
            >
              <h3>{card.title}</h3>
              <p>{card.count} רשומות</p>
            </button>
          ))}
        </section>

        {activeSection === "students" && (
          <section className="card manager-section-panel manager-section-panel--students">
            <h2>ניהול תלמידים</h2>
            <form onSubmit={onAddStudent} className="admin-form manager-inline-form">
              <input
                value={studentName}
                onChange={(event) => setStudentName(event.target.value)}
                type="text"
                placeholder="שם מלא"
              />
              <input
                value={studentPhone}
                onChange={(event) => setStudentPhone(event.target.value)}
                type="text"
                placeholder="טלפון"
              />
              <input
                value={studentPassword}
                onChange={(event) => setStudentPassword(event.target.value)}
                type="password"
                placeholder="סיסמה ראשונית"
              />
              <input
                value={studentAge}
                onChange={(event) => setStudentAge(event.target.value)}
                type="number"
                min="16"
                max="120"
                placeholder="גיל"
              />
              <select
                value={studentCourseId}
                onChange={(event) => setStudentCourseId(event.target.value)}
              >
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.name}
                  </option>
                ))}
              </select>
              <button type="submit" className="primary-btn">
                הוסף תלמיד
              </button>
            </form>

            {editingStudent && (
              <form onSubmit={onUpdateStudent} className="admin-form manager-edit-form">
                <h3>עריכת תלמיד</h3>
                <input
                  value={editingStudent.name}
                  onChange={(event) =>
                    setEditingStudent((prev) => ({ ...prev, name: event.target.value }))
                  }
                />
                <input
                  type="number"
                  value={editingStudent.age}
                  onChange={(event) =>
                    setEditingStudent((prev) => ({ ...prev, age: event.target.value }))
                  }
                />
                <select
                  value={editingStudent.courseId}
                  onChange={(event) =>
                    setEditingStudent((prev) => ({
                      ...prev,
                      courseId: event.target.value,
                    }))
                  }
                >
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))}
                </select>
                <div className="manager-actions-row">
                  <button className="primary-btn" type="submit">
                    שמירה
                  </button>
                  <button
                    className="ghost-btn"
                    type="button"
                    onClick={() => setEditingStudent(null)}
                  >
                    ביטול
                  </button>
                </div>
              </form>
            )}

            <h3 className="manager-table-title">רשימה וניהול תלמידים</h3>
            <p className="manager-table-hint">
              מספר הטלפון נשמר בעת הוספת התלמיד. אם חסר יוצג „—”.
            </p>
            <div className="manager-table-wrap">
              <table className="manager-table">
                <thead>
                  <tr>
                    <th>שם</th>
                    <th>טלפון</th>
                    <th>גיל</th>
                    <th>מסלול</th>
                    <th>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td>{student.firstName} {student.lastName}</td>
                      <td>{displayOrDash(student.phone)}</td>
                      <td>{student.age || "-"}</td>
                      <td>{student.courseId?.name || "-"}</td>
                      <td className="manager-actions-cell">
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() =>
                            setEditingStudent({
                              id: student._id,
                              name: `${student.firstName} ${student.lastName}`,
                              age: student.age || "",
                              courseId: student.courseId?._id || "",
                            })
                          }
                        >
                          ✏
                        </button>
                        <button
                          type="button"
                          className="icon-btn danger"
                          onClick={() => onDeleteStudent(student._id)}
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === "teachers" && (
          <section className="card manager-section-panel manager-section-panel--teachers">
            <h2>ניהול מורים</h2>
            <form onSubmit={onAddTeacher} className="admin-form manager-inline-form">
              <input
                value={teacherName}
                onChange={(event) => setTeacherName(event.target.value)}
                type="text"
                placeholder="שם מלא"
              />
              <input
                value={teacherPhone}
                onChange={(event) => setTeacherPhone(event.target.value)}
                type="text"
                placeholder="טלפון"
              />
              <input
                value={teacherPassword}
                onChange={(event) => setTeacherPassword(event.target.value)}
                type="password"
                placeholder="סיסמה ראשונית"
              />
              <select multiple value={teacherSubjectIds} onChange={onTeacherSubjectsChange}>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              <button type="submit" className="primary-btn">
                הוסף מורה
              </button>
            </form>

            {editingTeacher && (
              <form onSubmit={onUpdateTeacher} className="admin-form manager-edit-form">
                <h3>עריכת מורה</h3>
                <input
                  value={editingTeacher.name}
                  onChange={(event) =>
                    setEditingTeacher((prev) => ({ ...prev, name: event.target.value }))
                  }
                />
                <select
                  multiple
                  value={editingTeacher.subjectIds}
                  onChange={(event) =>
                    setEditingTeacher((prev) => ({
                      ...prev,
                      subjectIds: Array.from(
                        event.target.selectedOptions,
                        (option) => option.value
                      ),
                    }))
                  }
                >
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                <div className="manager-actions-row">
                  <button className="primary-btn" type="submit">
                    שמירה
                  </button>
                  <button className="ghost-btn" type="button" onClick={() => setEditingTeacher(null)}>
                    ביטול
                  </button>
                </div>
              </form>
            )}

            <h3 className="manager-table-title">רשימה וניהול מורים</h3>
            <p className="manager-table-hint">
              מספר הטלפון נשמר בעת הוספת המורה. אם חסר יוצג „—”.
            </p>
            <div className="manager-table-wrap">
              <table className="manager-table">
                <thead>
                  <tr>
                    <th>שם</th>
                    <th>טלפון</th>
                    <th>מקצועות</th>
                    <th>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher._id}>
                      <td>{teacher.firstName} {teacher.lastName}</td>
                      <td>{displayOrDash(teacher.phone)}</td>
                      <td>
                        {Array.isArray(teacher.subjectIds) && teacher.subjectIds.length > 0
                          ? teacher.subjectIds.map((subject) => subject.name).join(", ")
                          : "-"}
                      </td>
                      <td className="manager-actions-cell">
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() =>
                            setEditingTeacher({
                              id: teacher._id,
                              name: `${teacher.firstName} ${teacher.lastName}`,
                              subjectIds: Array.isArray(teacher.subjectIds)
                                ? teacher.subjectIds.map((subject) => subject._id)
                                : [],
                            })
                          }
                        >
                          ✏
                        </button>
                        <button
                          type="button"
                          className="icon-btn danger"
                          onClick={() => onDeleteTeacher(teacher._id)}
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === "subjects" && (
          <section className="card manager-section-panel manager-section-panel--subjects">
            <h2>ניהול מקצועות</h2>
            <form onSubmit={onAddSubject} className="admin-form manager-inline-form">
              <input
                value={subjectName}
                onChange={(event) => setSubjectName(event.target.value)}
                type="text"
                placeholder="שם מקצוע"
              />
              <button type="submit" className="primary-btn">
                הוסף מקצוע
              </button>
            </form>

            {editingSubject && (
              <form onSubmit={onUpdateSubject} className="admin-form manager-edit-form">
                <h3>עריכת מקצוע</h3>
                <input
                  value={editingSubject.name}
                  onChange={(event) =>
                    setEditingSubject((prev) => ({ ...prev, name: event.target.value }))
                  }
                />
                <div className="manager-actions-row">
                  <button className="primary-btn" type="submit">
                    שמירה
                  </button>
                  <button className="ghost-btn" type="button" onClick={() => setEditingSubject(null)}>
                    ביטול
                  </button>
                </div>
              </form>
            )}

            <h3 className="manager-table-title">רשימה וניהול מקצועות</h3>
            <div className="manager-table-wrap">
              <table className="manager-table">
                <thead>
                  <tr>
                    <th>שם מקצוע</th>
                    <th>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subject) => (
                    <tr key={subject._id}>
                      <td>{subject.name}</td>
                      <td className="manager-actions-cell">
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() => setEditingSubject({ id: subject._id, name: subject.name })}
                        >
                          ✏
                        </button>
                        <button
                          type="button"
                          className="icon-btn danger"
                          onClick={() => onDeleteSubject(subject._id)}
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === "courses" && (
          <section className="card manager-section-panel manager-section-panel--courses">
            <h2>ניהול קורסים</h2>
            <form onSubmit={onAddCourse} className="admin-form manager-inline-form">
              <select
                value={selectedSubjectId}
                onChange={(event) => setSelectedSubjectId(event.target.value)}
              >
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              <input
                value={courseName}
                onChange={(event) => setCourseName(event.target.value)}
                type="text"
                placeholder="שם קורס"
              />
              <input
                value={courseContent}
                onChange={(event) => setCourseContent(event.target.value)}
                type="text"
                placeholder="תיאור קורס"
              />
              <input
                value={courseMeetings}
                onChange={(event) => setCourseMeetings(event.target.value)}
                type="number"
                min="1"
                placeholder="מספר מפגשים"
              />
              <button type="submit" className="primary-btn">
                הוסף קורס
              </button>
            </form>

            {editingCourse && (
              <form onSubmit={onUpdateCourse} className="admin-form manager-edit-form">
                <h3>עריכת קורס</h3>
                <input
                  value={editingCourse.name}
                  onChange={(event) =>
                    setEditingCourse((prev) => ({ ...prev, name: event.target.value }))
                  }
                />
                <input
                  value={editingCourse.content}
                  onChange={(event) =>
                    setEditingCourse((prev) => ({ ...prev, content: event.target.value }))
                  }
                />
                <input
                  type="number"
                  min="1"
                  value={editingCourse.numberMeetings}
                  onChange={(event) =>
                    setEditingCourse((prev) => ({
                      ...prev,
                      numberMeetings: event.target.value,
                    }))
                  }
                />
                <select
                  value={editingCourse.subjectId}
                  onChange={(event) =>
                    setEditingCourse((prev) => ({ ...prev, subjectId: event.target.value }))
                  }
                >
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                <div className="manager-actions-row">
                  <button className="primary-btn" type="submit">
                    שמירה
                  </button>
                  <button className="ghost-btn" type="button" onClick={() => setEditingCourse(null)}>
                    ביטול
                  </button>
                </div>
              </form>
            )}

            <h3 className="manager-table-title">רשימה וניהול קורסים</h3>
            <div className="manager-table-wrap">
              <table className="manager-table">
                <thead>
                  <tr>
                    <th>שם קורס</th>
                    <th>מקצוע</th>
                    <th>מפגשים</th>
                    <th>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id}>
                      <td>{course.name}</td>
                      <td>{subjectsById[course.subjectId]?.name || "-"}</td>
                      <td>{course.numberMeetings || "-"}</td>
                      <td className="manager-actions-cell">
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() =>
                            setEditingCourse({
                              id: course._id,
                              name: course.name,
                              content: course.content || "",
                              numberMeetings: course.numberMeetings || "",
                              subjectId: course.subjectId || "",
                            })
                          }
                        >
                          ✏
                        </button>
                        <button
                          type="button"
                          className="icon-btn danger"
                          onClick={() => onDeleteCourse(course._id)}
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === "notices" && (
          <section className="card manager-section-panel manager-section-panel--notices">
            <h2>ניהול הודעות</h2>
            <form onSubmit={onAddNotice} className="admin-form manager-inline-form">
              <input
                value={noticeTitle}
                onChange={(event) => setNoticeTitle(event.target.value)}
                type="text"
                placeholder="כותרת הודעה"
              />
              <textarea
                value={noticeText}
                onChange={(event) => setNoticeText(event.target.value)}
                placeholder="תוכן הודעה"
                rows={2}
              />
              <button type="submit" className="primary-btn">
                פרסם הודעה
              </button>
            </form>

            {editingNotice && (
              <form onSubmit={onUpdateNotice} className="admin-form manager-edit-form">
                <h3>עריכת הודעה</h3>
                <input
                  value={editingNotice.title}
                  onChange={(event) =>
                    setEditingNotice((prev) => ({ ...prev, title: event.target.value }))
                  }
                />
                <textarea
                  rows={3}
                  value={editingNotice.content}
                  onChange={(event) =>
                    setEditingNotice((prev) => ({ ...prev, content: event.target.value }))
                  }
                />
                <div className="manager-actions-row">
                  <button className="primary-btn" type="submit">
                    שמירה
                  </button>
                  <button className="ghost-btn" type="button" onClick={() => setEditingNotice(null)}>
                    ביטול
                  </button>
                </div>
              </form>
            )}

            <h3 className="manager-table-title">רשימה וניהול הודעות</h3>
            <div className="manager-table-wrap">
              <table className="manager-table">
                <thead>
                  <tr>
                    <th>כותרת</th>
                    <th>תוכן</th>
                    <th>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {notices.map((notice) => (
                    <tr key={notice._id}>
                      <td>{notice.title}</td>
                      <td>{notice.content || "-"}</td>
                      <td className="manager-actions-cell">
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() =>
                            setEditingNotice({
                              id: notice._id,
                              title: notice.title,
                              content: notice.content || "",
                            })
                          }
                        >
                          ✏
                        </button>
                        <button
                          type="button"
                          className="icon-btn danger"
                          onClick={() => onDeleteNotice(notice._id)}
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default Manager;
