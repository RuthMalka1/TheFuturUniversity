import { useEffect, useMemo, useState } from "react";
import "../App.css";
import { getAllNotices } from "../services/noticesApi";
import { getAllCourses } from "../services/coursesApi";
import { getAllSubjects } from "../services/subjectApi";

const SUBJECT_CARD_THEMES = ["t0", "t1", "t2", "t3", "t4", "t5"];

const RECOMMENDATIONS_PER_PAGE = 3;

const HOME_PAGE_RECOMMENDATIONS = [
  {
    id: 1,
    name: "נועה א.",
    role: "סטודנטית למדעי המחשב",
    text: "המרצים זמינים, החומר ברור, והאווירה בקמפוס מאוד תומכת.",
  },
  {
    id: 2,
    name: "יואב ש.",
    role: "סטודנט להנדסת תוכנה",
    text: "לוח האירועים עוזר להתעדכן במה שקורה, והקורסים מעודכנים ומעשיים.",
  },
  {
    id: 3,
    name: "מיכל ר.",
    role: "בוגרת תואר ראשון",
    text: "השילוב בין תרגול, פרויקטים וליווי אישי נתן לי ביטחון מקצועי.",
  },
  {
    id: 4,
    name: "דניאל ל.",
    role: "סטודנטית לכלכלה וניהול",
    text: "הקורסים משלבים תיאוריה עם תרגול אמיתי, ויש תמיכה מצוינת מהסגל.",
  },
  {
    id: 5,
    name: "איתי כ.",
    role: "סטודנט למדעי הנתונים",
    text: "אהבתי במיוחד את המעבדות ואת הפרויקטים המעשיים שמכינים לשוק העבודה.",
  },
  {
    id: 6,
    name: "שירה מ.",
    role: "סטודנטית לתקשורת",
    text: "האווירה בקמפוס נעימה מאוד, ויש הרבה פעילויות שמוסיפות לחוויית הלימודים.",
  },
];

function Home() {
  const campusHighlights = [
    "ספרייה מרכזית פתוחה עד שעות הערב",
    "מעבדות חדשנות ומרחבי מחקר מתקדמים",
    "מרכז קריירה עם ליווי אישי לסטודנטים",
    "קהילה פעילה עם עשרות מועדונים ויוזמות",
  ];

  const quickStats = [
    { id: 1, label: "סטודנטים פעילים", value: "12,000+" },
    { id: 2, label: "פקולטות ובתי ספר", value: "8" },
    { id: 3, label: "תוכניות לימוד", value: "60+" },
    { id: 4, label: "שיתופי פעולה בתעשייה", value: "150+" },
  ];

  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [boardEvents, setBoardEvents] = useState([]);
  const [recommendationPage, setRecommendationPage] = useState(0);
  const [catalogLoadError, setCatalogLoadError] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      setCatalogLoadError(null);
      const [subjectsRes, coursesRes, noticesRes] = await Promise.all([
        getAllSubjects(),
        getAllCourses(),
        getAllNotices(),
      ]);

      const subjectsOk = Array.isArray(subjectsRes);
      const coursesOk = Array.isArray(coursesRes);

      if (subjectsOk) setSubjects(subjectsRes);
      else setSubjects([]);
      if (coursesOk) setCourses(coursesRes);
      else setCourses([]);

      if (!subjectsOk && !coursesOk) {
        setCatalogLoadError(
          "לא ניתן לטעון מקצועות וקורסים. הפעילו את שרת ה־backend (פורט 5000) ונסו שוב — אם נכנסים מכתובת רשת, עדכנו שהבקשות עוברות דרך ה־proxy."
        );
      } else if (!subjectsOk) {
        setCatalogLoadError("לא ניתן לטעון את רשימת המקצועות מהשרת.");
      } else if (!coursesOk) {
        setCatalogLoadError("לא ניתן לטעון את רשימת הקורסים מהשרת.");
      }

      if (Array.isArray(noticesRes)) {
        setBoardEvents(noticesRes);
      }
    };

    loadHomeData();
  }, []);

  const { subjectRows, orphanCourses } = useMemo(() => {
    const bySubject = {};
    subjects.forEach((s) => {
      bySubject[String(s._id)] = [];
    });
    const orphans = [];
    courses.forEach((course) => {
      const sid =
        course.subjectId && typeof course.subjectId === "object" && course.subjectId._id
          ? String(course.subjectId._id)
          : course.subjectId != null
            ? String(course.subjectId)
            : null;
      if (sid != null && Object.prototype.hasOwnProperty.call(bySubject, sid)) {
        bySubject[sid].push(course);
      } else {
        orphans.push(course);
      }
    });
    orphans.sort((a, b) => (a.name || "").localeCompare(b.name || "", "he"));
    const rows = [...subjects]
      .sort((a, b) => (a.name || "").localeCompare(b.name || "", "he"))
      .map((subject) => ({
        subject,
        courses: (bySubject[String(subject._id)] || []).sort((a, b) =>
          (a.name || "").localeCompare(b.name || "", "he")
        ),
      }));
    return { subjectRows: rows, orphanCourses: orphans };
  }, [subjects, courses]);

  const recommendationPagesCount = Math.max(
    1,
    Math.ceil(HOME_PAGE_RECOMMENDATIONS.length / RECOMMENDATIONS_PER_PAGE)
  );

  const visibleRecommendations = useMemo(() => {
    const from = recommendationPage * RECOMMENDATIONS_PER_PAGE;
    const to = from + RECOMMENDATIONS_PER_PAGE;
    return HOME_PAGE_RECOMMENDATIONS.slice(from, to);
  }, [recommendationPage]);

  const boardEventsView = useMemo(
    () => boardEvents.slice(0, 6),
    [boardEvents]
  );

  const getBoardDate = (event) => {
    const rawDate = event?.createdAt || event?.date;
    if (!rawDate) return "עדכון חדש";
    const parsed = new Date(rawDate);
    if (Number.isNaN(parsed.getTime())) return "עדכון חדש";
    return parsed.toLocaleDateString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const onNextRecommendations = () => {
    setRecommendationPage((current) =>
      current + 1 >= recommendationPagesCount ? 0 : current + 1
    );
  };

  const onPrevRecommendations = () => {
    setRecommendationPage((current) =>
      current - 1 < 0 ? recommendationPagesCount - 1 : current - 1
    );
  };

  return (
    <div className="home-page home-page--landing">
      <main className="content-wrap">
        <section className="hero-section card">
          <span className="hero-badge">קמפוס אקדמי מוביל בישראל</span>
          <h1>לומדים היום, מובילים מחר</h1>
          <p>
            אוניברסיטת העתיד משלבת מצוינות אקדמית, מחקר פורץ דרך וחוויית קמפוס
            עשירה. כאן תמצאו מסלולי לימוד מתקדמים, קהילה תומכת והזדמנויות לפיתוח
            אישי ומקצועי.
          </p>
          <div className="hero-cta">
            <button className="primary-btn">מידע על הרשמה</button>
            <a className="ghost-btn hero-secondary-btn" href="#subjects-catalog">
              מפת קורסים והמקצועות
            </a>
          </div>
        </section>

        <section className="stats-grid">
          {quickStats.map((item) => (
            <article key={item.id} className="stat-card">
              <h3>{item.value}</h3>
              <p>{item.label}</p>
            </article>
          ))}
        </section>

        <section
          id="subjects-catalog"
          className="card home-subjects-showcase"
          aria-labelledby="heading-subjects-catalog"
        >
          <header className="home-subjects-showcase-head">
            <span className="home-subjects-kicker">מפת לימודים</span>
            <h2 id="heading-subjects-catalog">מקצועות וקורסים</h2>
            <p>
              כל המקצועות שנוספו למערכת מוצגים כאן, עם רשימה מלאה של הקורסים
              בכל תחום.
            </p>
          </header>

          {catalogLoadError ? (
            <p className="home-catalog-error">{catalogLoadError}</p>
          ) : null}

          {!catalogLoadError && !subjects.length && !courses.length ? (
            <p className="home-subjects-empty">אין עדיין מקצועות או קורסים במערכת.</p>
          ) : !catalogLoadError ? (
            <div className="subject-hub-grid">
              {subjectRows.map(({ subject, courses: topicCourses }, index) => (
                <article
                  key={subject._id}
                  className={`subject-hub-card subject-hub-card--${
                    SUBJECT_CARD_THEMES[index % SUBJECT_CARD_THEMES.length]
                  }`}
                >
                  <header className="subject-hub-card__head">
                    <h3>{subject.name || "מקצוע ללא שם"}</h3>
                    <span className="subject-hub-card__badge">
                      {topicCourses.length > 0
                        ? `${topicCourses.length} קורסים`
                        : "אין קורסים עדיין"}
                    </span>
                  </header>
                  <div className="subject-hub-card__body">
                    {topicCourses.length === 0 ? (
                      <p className="subject-hub-card__muted">
                        מקצוע זה טרם כולל קורסים. המנהל יכול להוסיף קורסים מהממשק
                        הניהולי.
                      </p>
                    ) : (
                      <ul className="subject-hub-courses">
                        {topicCourses.map((course) => (
                          <li key={course._id} className="subject-hub-course-pill">
                            <span className="subject-hub-course-pill__dot" aria-hidden />
                            <span>{course.name || "קורס ללא שם"}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              ))}

              {orphanCourses.length > 0 ? (
                <article className="subject-hub-card subject-hub-card--torphan">
                  <header className="subject-hub-card__head subject-hub-card__head--muted">
                    <h3>קורסים ללא קישור למקצוע</h3>
                    <span className="subject-hub-card__badge">{orphanCourses.length} קורסים</span>
                  </header>
                  <div className="subject-hub-card__body">
                    <ul className="subject-hub-courses">
                      {orphanCourses.map((course) => (
                        <li key={course._id} className="subject-hub-course-pill">
                          <span className="subject-hub-course-pill__dot" aria-hidden />
                          <span>{course.name || "קורס ללא שם"}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ) : null}
            </div>
          ) : null}
        </section>

        <section
          id="about-university"
          className="card home-about-showcase"
          aria-labelledby="heading-about-university"
        >
          <header className="home-about-showcase__head">
            <span className="home-about-showcase__kicker">ידע · מחקר · קהילה</span>
            <h2 id="heading-about-university">על האוניברסיטה</h2>
            <p className="home-about-showcase__lead">
              האוניברסיטה נוסדה בשנת 1995 וממוקמת במרכז הארץ, עם גישה נוחה לרכבת
              ולתחבורה ציבורית. הקמפוס מציע סביבת לימודים חדשנית המשלבת טכנולוגיה,
              מחקר, חיי חברה ושירותי תמיכה לאורך כל התואר.
            </p>
          </header>

          <div className="home-about-showcase__faculty">
            <span className="home-about-showcase__faculty-label">פקולטות ותחומי לימוד</span>
            <p className="home-about-showcase__faculty-text">
              <strong className="home-about-showcase__faculty-strong">
                פקולטות מובילות:
              </strong>{" "}
              מדעי המחשב, הנדסה, עסקים, מדעי החברה ומדעי הרוח.
            </p>
          </div>

          <div className="home-about-showcase__grid-wrap">
            <h3 className="home-about-showcase__subheading">מה מחכה לך בקמפוס</h3>
            <ul className="home-about-showcase__grid" role="list">
              {campusHighlights.map((item, index) => (
                <li
                  key={item}
                  className={`home-about-showcase__tile home-about-showcase__tile--${
                    SUBJECT_CARD_THEMES[index % SUBJECT_CARD_THEMES.length]
                  }`}
                >
                  <span className="home-about-showcase__tile-glow" aria-hidden />
                  <span className="home-about-showcase__tile-text">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="card recommendations-section">
          <div className="section-header-row">
            <h2>המלצות תלמידים</h2>
            {recommendationPagesCount > 1 ? (
              <div className="carousel-controls">
                <button
                  type="button"
                  className="ghost-btn carousel-btn"
                  onClick={onPrevRecommendations}
                >
                  הקודם
                </button>
                <span className="carousel-page-indicator">
                  {recommendationPage + 1}/{recommendationPagesCount}
                </span>
                <button
                  type="button"
                  className="ghost-btn carousel-btn"
                  onClick={onNextRecommendations}
                >
                  הבא
                </button>
              </div>
            ) : null}
          </div>
          <div className="recommendations-grid">
            {visibleRecommendations.map((item) => (
              <article key={item.id} className="recommendation-item">
                <span className="recommendation-accent" />
                <h3>{item.name}</h3>
                <p className="recommendation-role">{item.role}</p>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          {recommendationPagesCount > 1 ? (
            <div className="carousel-dots" aria-label="דפדוף בהמלצות">
              {Array.from({ length: recommendationPagesCount }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`carousel-dot ${index === recommendationPage ? "active" : ""}`}
                  onClick={() => setRecommendationPage(index)}
                  aria-label={`עמוד המלצות ${index + 1}`}
                />
              ))}
            </div>
          ) : null}
        </section>

        <section className="home-columns home-board-single">
          <article
            id="notices-board"
            className="card home-board-showcase"
            aria-labelledby="heading-notices-board"
          >
            <header className="home-board-showcase-head">
              <span className="home-board-kicker">עדכונים מהקמפוס</span>
              <h2 id="heading-notices-board">לוח מודעות ואירועים</h2>
              <p>
                הודעות, מפגשים וחדשות מהאוניברסיטה — מעוצבות כדי שתתעדכנו במבט אחד.
              </p>
            </header>

            <div className="home-board-grid">
              {boardEvents.length === 0 ? (
                <article className="board-notice-card board-notice-card--empty">
                  <h3>אין עדיין הודעות בלוח</h3>
                  <p>כשהמנהל יפרסם מודעות, הן יופיעו כאן בכרטיסים צבעוניים.</p>
                </article>
              ) : (
                boardEventsView.map((event, index) => {
                  const rawDt = event?.createdAt || event?.date;
                  const parsedDt =
                    rawDt != null ? new Date(rawDt) : null;
                  const isoAttr =
                    parsedDt && !Number.isNaN(parsedDt.getTime())
                      ? parsedDt.toISOString()
                      : undefined;
                  return (
                  <article
                    key={event._id}
                    className={`board-notice-card board-notice-card--${
                      SUBJECT_CARD_THEMES[index % SUBJECT_CARD_THEMES.length]
                    }`}
                  >
                    <header className="board-notice-card__ribbon">
                      <span className="board-notice-card__badge">#{index + 1}</span>
                      <time className="board-notice-card__date" dateTime={isoAttr}>
                        {getBoardDate(event)}
                      </time>
                    </header>
                    <div className="board-notice-card__body">
                      <h3>{event.title}</h3>
                      <p>{event.content || "ללא תוכן נוסף"}</p>
                    </div>
                  </article>
                );
                })
              )}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default Home;
