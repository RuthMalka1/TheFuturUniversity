import { useEffect, useMemo, useState } from "react";
import "../App.css";
import { getAllUsers } from "../services/usersApi";
import { getAllCourses } from "../services/coursesApi";
import { addMaterial, getAllMaterials } from "../services/materialsApi";
import { addMark } from "../services/marksApi";
import {
  addRespons,
  clearConversationResponses,
  getAllResponses,
} from "../services/responsApi";
import { getAuthUser } from "../services/authStorage";

const getMessageTime = (value) => {
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

const nameInitials = (firstName, lastName) => {
  const a = String(firstName || "").trim().charAt(0);
  const b = String(lastName || "").trim().charAt(0);
  const s = `${a}${b}`.toUpperCase();
  return s || "?";
};

function Teacher() {
  const authUser = getAuthUser();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [responses, setResponses] = useState([]);
  const [seenVersion, setSeenVersion] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  const [selectedCourseForMaterial, setSelectedCourseForMaterial] = useState("");
  const [materialFile, setMaterialFile] = useState(null);

  const [selectedCourseForMark, setSelectedCourseForMark] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [activeStudentChatId, setActiveStudentChatId] = useState("");
  const [markValue, setMarkValue] = useState("");
  const [teacherReply, setTeacherReply] = useState("");
  const [markFeedback, setMarkFeedback] = useState(null);

  const students = useMemo(
    () => users.filter((user) => user.status === "student"),
    [users]
  );

  const loadData = async () => {
    const [usersRes, coursesRes, materialsRes, responsesRes] = await Promise.all([
      getAllUsers(),
      getAllCourses(),
      getAllMaterials(),
      getAllResponses(),
    ]);

    if (Array.isArray(usersRes)) {
      setUsers(usersRes);
      const studentList = usersRes.filter((user) => user.status === "student");
      if (!selectedStudentId && studentList.length > 0) {
        setSelectedStudentId(studentList[0]._id);
      }
      if (studentList.length > 0) {
        setActiveStudentChatId((current) => current || studentList[0]._id);
      }
    }

    if (Array.isArray(coursesRes)) {
      setCourses(coursesRes);
      if (!selectedCourseForMaterial && coursesRes.length > 0) {
        setSelectedCourseForMaterial(coursesRes[0]._id);
      }
      if (!selectedCourseForMark && coursesRes.length > 0) {
        setSelectedCourseForMark(coursesRes[0]._id);
      }
    }

    if (Array.isArray(materialsRes)) {
      setMaterials(materialsRes);
    }

    if (Array.isArray(responsesRes)) {
      setResponses(responsesRes);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!markFeedback || markFeedback.variant !== "success") return undefined;
    const timer = setTimeout(() => setMarkFeedback(null), 5000);
    return () => clearTimeout(timer);
  }, [markFeedback]);

  const onAddMaterial = async (event) => {
    event.preventDefault();
    const teacherId = authUser?._id;
    if (!teacherId || !selectedCourseForMaterial || !materialFile) {
      return;
    }

    const formData = new FormData();
    formData.append("teacherlId", teacherId);
    formData.append("courslId", selectedCourseForMaterial);
    formData.append("anaunseDate", new Date().toISOString());
    formData.append("materialFile", materialFile);

    const result = await addMaterial(formData);

    if (result && result._id) {
      setMaterialFile(null);
      event.target.reset();
      setStatusMessage("החומר נוסף בהצלחה.");
      loadData();
    } else {
      setStatusMessage("שגיאה בהוספת חומר.");
    }
  };

  const onAddMark = async (event) => {
    event.preventDefault();
    if (!selectedCourseForMark || !selectedStudentId || !markValue) return;

    const result = await addMark({
      coursId: selectedCourseForMark,
      studentId: selectedStudentId,
      mark: Number(markValue),
    });

    if (result && result._id) {
      setMarkValue("");
      setMarkFeedback({ variant: "success", text: "הציון נשמר בהצלחה." });
      loadData();
    } else {
      setMarkFeedback({ variant: "error", text: "שגיאה בשמירת הציון." });
    }
  };

  const teacherId = authUser?._id || "";

  const conversationMessages = useMemo(() => {
    if (!teacherId || !activeStudentChatId) return [];
    return responses
      .filter(
        (item) =>
          item.teacherId === teacherId && item.studentId === activeStudentChatId
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [activeStudentChatId, responses, teacherId]);

  const studentChats = useMemo(() => {
    if (!teacherId) return [];
    return students
      .map((student) => {
      const thread = responses
        .filter(
          (item) =>
            item.teacherId === teacherId && item.studentId === student._id
        )
        .sort((a, b) => getMessageTime(a.date) - getMessageTime(b.date));
      const lastMessage = thread[thread.length - 1] || null;
      const seenKey = `teacherSeen:${teacherId}:${student._id}`;
      const seenAt = Number(localStorage.getItem(seenKey) || 0);
      const unreadMessages = thread.filter(
        (item) => item.senderRole === "student" && getMessageTime(item.date) > seenAt
      );
      const unreadCount = unreadMessages.length;
      const lastIncomingMessage = unreadMessages[unreadMessages.length - 1] || null;
      return {
        student,
        lastMessage,
        unreadCount,
        lastIncomingAt: lastIncomingMessage ? getMessageTime(lastIncomingMessage.date) : 0,
      };
      })
      .sort((a, b) => {
        if (!!b.unreadCount !== !!a.unreadCount) {
          return b.unreadCount - a.unreadCount;
        }
        return getMessageTime(b.lastMessage?.date) - getMessageTime(a.lastMessage?.date);
      });
  }, [responses, seenVersion, teacherId, students]);

  useEffect(() => {
    if (!teacherId || !activeStudentChatId || conversationMessages.length === 0) return;
    const lastIncoming = [...conversationMessages]
      .reverse()
      .find((item) => item.senderRole === "student");
    if (!lastIncoming) return;
    const seenKey = `teacherSeen:${teacherId}:${activeStudentChatId}`;
    localStorage.setItem(seenKey, String(getMessageTime(lastIncoming.date)));
    setSeenVersion((value) => value + 1);
  }, [activeStudentChatId, conversationMessages, teacherId]);

  const onSendReply = async (event) => {
    event.preventDefault();
    if (!teacherId || !activeStudentChatId || !teacherReply.trim()) {
      setStatusMessage("יש לבחור שיחה מהרשימה ולכתוב הודעת תגובה.");
      return;
    }

    const result = await addRespons({
      studentId: activeStudentChatId,
      teacherId: teacherId,
      senderRole: "teacher",
      content: teacherReply.trim(),
      date: new Date().toISOString(),
    });

    if (result && result._id) {
      setTeacherReply("");
      setStatusMessage("התגובה נשלחה לתלמיד בהצלחה.");
      loadData();
    } else {
      setStatusMessage("אירעה שגיאה בשליחת תגובה.");
    }
  };

  const onClearConversation = async () => {
    if (!teacherId || !activeStudentChatId) return;
    const isConfirmed = window.confirm("למחוק את כל ההודעות בצ'אט הזה?");
    if (!isConfirmed) return;

    const result = await clearConversationResponses({
      studentId: activeStudentChatId,
      teacherId,
    });

    if (result && typeof result.deletedCount === "number") {
      const seenKey = `teacherSeen:${teacherId}:${activeStudentChatId}`;
      localStorage.setItem(seenKey, "0");
      setSeenVersion((value) => value + 1);
      loadData();
      setStatusMessage("הצ'אט נוקה מהודעות.");
    } else {
      setStatusMessage("אירעה שגיאה בניקוי הצ'אט.");
    }
  };

  const authTeacherName = [authUser?.firstName, authUser?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const teacherDisplayName = authTeacherName;

  const activeChatStudent = students.find((item) => item._id === activeStudentChatId);
  const chatHeaderName = activeChatStudent
    ? [activeChatStudent.firstName, activeChatStudent.lastName].filter(Boolean).join(" ")
    : "בחרו שיחה מהרשימה";
  const chatHeaderInitials = activeChatStudent
    ? nameInitials(activeChatStudent.firstName, activeChatStudent.lastName)
    : "…";

  return (
    <div className="home-page">
      <main className="content-wrap">
        <section className="card manager-hero manager-hero--teachers">
          <h1>שלום המורה {teacherDisplayName || "יקר/ה"}</h1>
          <p>
            בעמוד זה המורה יכול להעלות חומרים לקורסים ולתת ציונים לתלמידים על
            בסיס נתונים אמיתיים מהמערכת.
          </p>
          {statusMessage ? <p className="status-message">{statusMessage}</p> : null}
        </section>

        <section className="stats-grid">
          <article className="stat-card">
            <h3>{courses.length}</h3>
            <p>קורסים פעילים במערכת</p>
          </article>
          <article className="stat-card">
            <h3>{students.length}</h3>
            <p>תלמידים זמינים</p>
          </article>
          <article className="stat-card">
            <h3>{responses.length}</h3>
            <p>הודעות בהתכתבויות</p>
          </article>
        </section>

        <section className="card manager-section-panel manager-section-panel--teachers admin-grid">
          <article className="admin-panel">
            <h2>העלאת חומר לתלמידים</h2>
            <form onSubmit={onAddMaterial} className="admin-form">
              <select
                value={selectedCourseForMaterial}
                onChange={(event) => setSelectedCourseForMaterial(event.target.value)}
              >
                {courses.length === 0 ? (
                  <option value="">אין קורסים במערכת</option>
                ) : (
                  courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))
                )}
              </select>

              <input
                onChange={(event) => setMaterialFile(event.target.files?.[0] || null)}
                type="file"
              />
              <button type="submit" className="primary-btn">
                העלאת חומר
              </button>
            </form>

            <ul className="simple-list">
              {materials.map((material) => (
                <li key={material._id}>
                  קורס: {material.courslId} | קבצים:{" "}
                  {material.files?.files?.join(", ") || "ללא"}
                </li>
              ))}
            </ul>
          </article>

          <article className="admin-panel">
            <h2>רישום ציונים לתלמידים</h2>
            <form onSubmit={onAddMark} className="admin-form">
              <select
                value={selectedCourseForMark}
                onChange={(event) => setSelectedCourseForMark(event.target.value)}
              >
                {courses.length === 0 ? (
                  <option value="">אין קורסים במערכת</option>
                ) : (
                  courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))
                )}
              </select>

              <select
                value={selectedStudentId}
                onChange={(event) => setSelectedStudentId(event.target.value)}
              >
                {students.length === 0 ? (
                  <option value="">אין תלמידים במערכת</option>
                ) : (
                  students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.firstName} {student.lastName}
                    </option>
                  ))
                )}
              </select>

              <input
                value={markValue}
                onChange={(event) => setMarkValue(event.target.value)}
                type="number"
                min="0"
                max="100"
                placeholder="ציון"
              />
              <button type="submit" className="primary-btn">
                שמירת ציון
              </button>
            </form>

            {markFeedback ? (
              <p
                className={`teacher-mark-feedback teacher-mark-feedback--${markFeedback.variant}`}
                role="status"
              >
                {markFeedback.text}
              </p>
            ) : null}
          </article>
        </section>

        <section className="card manager-section-panel manager-section-panel--students">
          <h2>צ'אטים עם תלמידים</h2>

          <div className="chat-shell chat-shell--whatsapp">
            <aside className="chat-sidebar">
              {studentChats.length === 0 ? (
                <p className="chat-sidebar-empty">אין שיחות להצגה.</p>
              ) : (
                studentChats.map(({ student, lastMessage, unreadCount, lastIncomingAt }) => (
                  <button
                    key={student._id}
                    type="button"
                    className={`chat-contact ${
                      activeStudentChatId === student._id ? "active" : ""
                    }`}
                    onClick={() => {
                      setActiveStudentChatId(student._id);
                      if (lastIncomingAt) {
                        const seenKey = `teacherSeen:${teacherId}:${student._id}`;
                        localStorage.setItem(seenKey, String(lastIncomingAt));
                        setSeenVersion((value) => value + 1);
                      }
                    }}
                  >
                    <span className="chat-contact-avatar" aria-hidden="true">
                      {nameInitials(student.firstName, student.lastName)}
                    </span>
                    <span className="chat-contact-body">
                      <span className="chat-contact-top">
                        <strong>
                          {student.firstName} {student.lastName}
                        </strong>
                        {unreadCount > 0 ? (
                          <span className="chat-unread-badge">{unreadCount}</span>
                        ) : null}
                      </span>
                      <span className="chat-contact-preview">
                        {lastMessage?.content || "אין הודעות עדיין"}
                      </span>
                    </span>
                  </button>
                ))
              )}
            </aside>

            <div className="chat-main">
              <header className="chat-wa-header">
                <div className="chat-wa-avatar" aria-hidden="true">
                  {chatHeaderInitials}
                </div>
                <div className="chat-wa-header-info">
                  <div className="chat-wa-name">{chatHeaderName}</div>
                  <div className="chat-wa-status">תלמיד</div>
                </div>
              </header>
              <div className="chat-messages">
                {!activeStudentChatId ? (
                  <p className="chat-empty">בחר/י שיחה מהרשימה כדי לפתוח את הצ'אט.</p>
                ) : conversationMessages.length === 0 ? (
                  <p className="chat-empty">אין הודעות בהתכתבות זו.</p>
                ) : (
                  conversationMessages.map((item) => (
                    <div
                      key={item._id}
                      className={`chat-bubble ${
                        item.senderRole === "teacher" ? "outgoing" : "incoming"
                      }`}
                    >
                      <p>{item.content}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={onSendReply} className="chat-compose">
                <div className="chat-compose-field">
                  <textarea
                    rows={1}
                    value={teacherReply}
                    onChange={(event) => setTeacherReply(event.target.value)}
                    placeholder="הודעה"
                    disabled={!activeStudentChatId}
                  />
                </div>
                <button
                  type="button"
                  className="chat-clear-btn"
                  onClick={onClearConversation}
                  disabled={!activeStudentChatId}
                  title="מחיקת כל ההודעות בצ'אט"
                >
                  נקה
                </button>
                <button
                  type="submit"
                  className="chat-send-btn"
                  disabled={!activeStudentChatId}
                  aria-label="שליחת הודעה"
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Teacher;
