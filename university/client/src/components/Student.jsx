import { useEffect, useMemo, useState } from "react";
import "../App.css";
import { getAllUsers } from "../services/usersApi";
import { getAllSubjects } from "../services/subjectApi";
import { getAllMarks } from "../services/marksApi";
import { getAllCourses } from "../services/coursesApi";
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

function Student() {
  const authUser = getAuthUser();
  const [student, setStudent] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [marks, setMarks] = useState([]);

  const [activeTeacherChatId, setActiveTeacherChatId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [messageText, setMessageText] = useState("");
  const [responses, setResponses] = useState([]);
  const [seenVersion, setSeenVersion] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  const loadMessages = async () => {
    const responsesRes = await getAllResponses();
    if (Array.isArray(responsesRes)) {
      setResponses(responsesRes);
    }
  };

  useEffect(() => {
    const loadStudentData = async () => {
      const [usersRes, subjectsRes, marksRes, coursesRes, responsesRes] = await Promise.all([
        getAllUsers(),
        getAllSubjects(),
        getAllMarks(),
        getAllCourses(),
        getAllResponses(),
      ]);

      let resolvedProfile = null;

      if (Array.isArray(usersRes)) {
        const allTeachers = usersRes.filter((user) => user.status === "teacher");
        const allStudents = usersRes.filter((user) => user.status === "student");

        setTeachers(allTeachers);
        resolvedProfile =
          allStudents.find((item) => item._id === authUser?._id) ||
          (authUser?.status === "student" ? authUser : null);
        setStudent(resolvedProfile || null);

        if (allTeachers.length > 0) {
          setActiveTeacherChatId((current) => current || allTeachers[0]._id);
        }
      }

      if (Array.isArray(subjectsRes)) {
        setSubjects(subjectsRes);
      }

      if (Array.isArray(marksRes)) {
        setMarks(marksRes);
      }

      if (Array.isArray(coursesRes)) {
        setCourses(coursesRes);

        const defaultCourse = resolvedProfile?.courseId?._id || resolvedProfile?.courseId;
        const selectedCourseId = defaultCourse || coursesRes[0]?._id;
        const matchingCourse = coursesRes.find(
          (course) => course._id === selectedCourseId
        );

        if (matchingCourse?.subjectId) {
          setSelectedSubjectId(matchingCourse.subjectId);
        }
      }

      if (Array.isArray(responsesRes)) {
        setResponses(responsesRes);
      }
    };

    loadStudentData();
  }, [authUser?._id]);

  const studentMarks = useMemo(() => {
    if (!student?._id) return [];

    return marks.filter((mark) => mark.studentId === student._id);
  }, [marks, student]);

  const marksBySubject = useMemo(() => {
    const courseById = Object.fromEntries(courses.map((course) => [course._id, course]));
    const subjectById = Object.fromEntries(
      subjects.map((subject) => [subject._id, subject.name])
    );

    return studentMarks
      .map((mark) => {
        const course = courseById[mark.coursId];
        const subjectName = course ? subjectById[course.subjectId] || "מקצוע לא ידוע" : "מקצוע לא ידוע";

        return {
          id: mark._id,
          subjectId: course?.subjectId || "",
          subjectName,
          courseName: course?.name || "קורס לא ידוע",
          grade: mark.mark,
        };
      })
      .filter((item) =>
        selectedSubjectId ? item.subjectId === selectedSubjectId : true
      );
  }, [studentMarks, courses, subjects, selectedSubjectId]);

  const conversationMessages = useMemo(() => {
    if (!student?._id || !activeTeacherChatId) return [];
    return responses
      .filter(
        (item) =>
          item.studentId === student._id && item.teacherId === activeTeacherChatId
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [activeTeacherChatId, responses, student]);

  const chatList = useMemo(() => {
    if (!student?._id) return [];

    return teachers
      .map((teacher) => {
      const thread = responses
        .filter(
          (item) => item.studentId === student._id && item.teacherId === teacher._id
        )
        .sort((a, b) => getMessageTime(a.date) - getMessageTime(b.date));

      const lastMessage = thread[thread.length - 1] || null;
      const seenKey = `studentSeen:${student._id}:${teacher._id}`;
      const seenAt = Number(localStorage.getItem(seenKey) || 0);
      const unreadMessages = thread.filter(
        (item) => item.senderRole === "teacher" && getMessageTime(item.date) > seenAt
      );
      const unreadCount = unreadMessages.length;
      const lastIncomingMessage = unreadMessages[unreadMessages.length - 1] || null;

      return {
        teacher,
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
  }, [responses, seenVersion, student, teachers]);

  useEffect(() => {
    if (!student?._id || !activeTeacherChatId || conversationMessages.length === 0) return;
    const lastIncoming = [...conversationMessages]
      .reverse()
      .find((item) => item.senderRole === "teacher");
    if (!lastIncoming) return;

    const seenKey = `studentSeen:${student._id}:${activeTeacherChatId}`;
    localStorage.setItem(seenKey, String(getMessageTime(lastIncoming.date)));
    setSeenVersion((value) => value + 1);
  }, [activeTeacherChatId, conversationMessages, student]);

  const onSendMessage = async (event) => {
    event.preventDefault();

    if (!activeTeacherChatId || !messageText.trim()) {
      setStatusMessage("יש לבחור שיחה מהרשימה ולכתוב תוכן להודעה.");
      return;
    }

    if (!student?._id) {
      setStatusMessage("לא נמצא פרופיל תלמיד התואם למשתמש המחובר.");
      return;
    }

    const result = await addRespons({
      studentId: student._id,
      teacherId: activeTeacherChatId,
      senderRole: "student",
      content: messageText.trim(),
      date: new Date().toISOString(),
    });

    if (result && result._id) {
      setStatusMessage("ההודעה נשלחה למורה בהצלחה.");
      await loadMessages();
    } else {
      setStatusMessage("אירעה שגיאה בשליחת ההודעה.");
    }
    setMessageText("");
  };

  const onClearConversation = async () => {
    if (!student?._id || !activeTeacherChatId) return;
    const isConfirmed = window.confirm("למחוק את כל ההודעות בצ'אט הזה?");
    if (!isConfirmed) return;

    const result = await clearConversationResponses({
      studentId: student._id,
      teacherId: activeTeacherChatId,
    });

    if (result && typeof result.deletedCount === "number") {
      const seenKey = `studentSeen:${student._id}:${activeTeacherChatId}`;
      localStorage.setItem(seenKey, "0");
      setSeenVersion((value) => value + 1);
      await loadMessages();
      setStatusMessage("הצ'אט נוקה מהודעות.");
    } else {
      setStatusMessage("אירעה שגיאה בניקוי הצ'אט.");
    }
  };

  const averageGrade = marksBySubject.length
    ? Math.round(
        marksBySubject.reduce((sum, item) => sum + Number(item.grade || 0), 0) /
          marksBySubject.length
      )
    : 0;
  const studentDisplayName = [authUser?.firstName, authUser?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  const activeChatTeacher = teachers.find((teacher) => teacher._id === activeTeacherChatId);
  const chatHeaderName = activeChatTeacher
    ? [activeChatTeacher.firstName, activeChatTeacher.lastName].filter(Boolean).join(" ")
    : "בחרו שיחה מהרשימה";
  const chatHeaderInitials = activeChatTeacher
    ? nameInitials(activeChatTeacher.firstName, activeChatTeacher.lastName)
    : "…";

  return (
    <div className="home-page">
      <main className="content-wrap">
        <section className="card manager-hero manager-hero--students">
          <h1>שלום התלמיד {studentDisplayName || "יקר/ה"}</h1>
          {!student ? <p>לא נמצא פרופיל תלמיד התואם לחשבון שלך.</p> : null}
          {statusMessage ? <p className="status-message">{statusMessage}</p> : null}
        </section>

        <section className="stats-grid">
          <article className="stat-card">
            <h3>{teachers.length}</h3>
            <p>מורים זמינים להתכתבות</p>
          </article>
          <article className="stat-card">
            <h3>{marksBySubject.length}</h3>
            <p>ציונים להצגה</p>
          </article>
          <article className="stat-card">
            <h3>{averageGrade}</h3>
            <p>ממוצע ציונים</p>
          </article>
        </section>

        <section className="card manager-section-panel manager-section-panel--students">
          <h2>ציונים לפי מקצוע</h2>
          <select
            value={selectedSubjectId}
            onChange={(event) => setSelectedSubjectId(event.target.value)}
          >
            <option value="">כל המקצועות</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.name}
              </option>
            ))}
          </select>

          <ul className="simple-list">
            {marksBySubject.length === 0 ? (
              <li>אין ציונים להצגה עבור הבחירה הנוכחית.</li>
            ) : (
              marksBySubject.map((item) => (
                <li key={item.id}>
                  {item.subjectName} | {item.courseName} | ציון: {item.grade}
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="card manager-section-panel manager-section-panel--teachers">
          <h2>הודעות עם מורים</h2>
          <div className="chat-shell chat-shell--whatsapp">
            <aside className="chat-sidebar">
              {chatList.length === 0 ? (
                <p className="chat-sidebar-empty">אין עדיין שיחות.</p>
              ) : (
                chatList.map(({ teacher, lastMessage, unreadCount, lastIncomingAt }) => (
                  <button
                    key={teacher._id}
                    type="button"
                    className={`chat-contact ${
                      activeTeacherChatId === teacher._id ? "active" : ""
                    }`}
                    onClick={() => {
                      setActiveTeacherChatId(teacher._id);
                      if (lastIncomingAt) {
                        const seenKey = `studentSeen:${student?._id}:${teacher._id}`;
                        localStorage.setItem(seenKey, String(lastIncomingAt));
                        setSeenVersion((value) => value + 1);
                      }
                    }}
                  >
                    <span className="chat-contact-avatar" aria-hidden="true">
                      {nameInitials(teacher.firstName, teacher.lastName)}
                    </span>
                    <span className="chat-contact-body">
                      <span className="chat-contact-top">
                        <strong>
                          {teacher.firstName} {teacher.lastName}
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
                  <div className="chat-wa-status">מורה</div>
                </div>
              </header>
              <div className="chat-messages">
                {!activeTeacherChatId ? (
                  <p className="chat-empty">בחר/י שיחה מהרשימה כדי לפתוח את הצ'אט.</p>
                ) : conversationMessages.length === 0 ? (
                  <p className="chat-empty">אין הודעות בהתכתבות זו.</p>
                ) : (
                  conversationMessages.map((item) => (
                    <div
                      key={item._id}
                      className={`chat-bubble ${
                        item.senderRole === "student" ? "outgoing" : "incoming"
                      }`}
                    >
                      <p>{item.content}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={onSendMessage} className="chat-compose">
                <div className="chat-compose-field">
                  <textarea
                    rows={1}
                    value={messageText}
                    onChange={(event) => setMessageText(event.target.value)}
                    placeholder="הודעה"
                    disabled={!activeTeacherChatId}
                  />
                </div>
                <button
                  type="button"
                  className="chat-clear-btn"
                  onClick={onClearConversation}
                  disabled={!activeTeacherChatId}
                  title="מחיקת כל ההודעות בצ'אט"
                >
                  נקה
                </button>
                <button
                  type="submit"
                  className="chat-send-btn"
                  disabled={!activeTeacherChatId}
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

export default Student;