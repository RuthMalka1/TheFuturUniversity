/**
 * כתובת שרת ה-API (Node + Express + MongoDB):
 *
 * • הלקוח (React) תמיד רץ על פורט אחר מהשרת — בדרך כלל 3000 מול 5000. זה נורמלי.
 * • הנתונים מהמסד מגיעים רק דרך השרת בפורט 5000 (לא דרך 3000).
 *
 * בפיתוח (npm start ב-client, פורט 3000):
 *   API_BASE_URL ריק → axios קורא ל-/subject, /courses וכו' על אותו host כמו הדף,
 *   וה-proxy ב-package.json מעביר ל-http://127.0.0.1:5000.
 *
 * מכתובת רשת (למשל http://10.0.0.15:3000) זה עדיין עובד — ה-proxy רץ על המחשב שלך.
 *
 * production: הגדר REACT_APP_API_URL לכתובת המלאה של ה-API.
 */
const trimTrailingSlash = (url) => url.replace(/\/$/, "");

export const API_BASE_URL = (() => {
  const fromEnv = process.env.REACT_APP_API_URL?.trim();
  if (fromEnv) {
    return trimTrailingSlash(fromEnv);
  }
  if (typeof window === "undefined") {
    return "http://localhost:5000";
  }
  const { hostname, port, protocol } = window.location;
  // Local Create React App dev server (uses package.json proxy)
  if (port === "3000" || hostname === "localhost" || hostname === "127.0.0.1") {
    return "";
  }
  // Hosted static site (e.g. Render) — API must come from REACT_APP_API_URL at build time
  console.warn(
    "REACT_APP_API_URL is not set. Set it in Render → Environment before building the client."
  );
  return "";
})();
