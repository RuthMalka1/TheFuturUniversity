import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { loginUser, resetPasswordByPhone } from "../services/usersApi";
import {
  getPersonalRouteByRole,
  setAuthUser,
} from "../services/authStorage";

function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!phone.trim() || !password.trim()) {
      setStatusMessage("יש להזין טלפון וסיסמה.");
      return;
    }

    const result = await loginUser({
      phone: phone.trim(),
      password: password.trim(),
    });

    if (result && result._id && result.status) {
      setAuthUser(result);
      navigate(getPersonalRouteByRole(result.status));
      return;
    }

    setStatusMessage("פרטי ההתחברות אינם תקינים.");
  };

  const onSubmitReset = async (event) => {
    event.preventDefault();
    if (!phone.trim() || !newPassword.trim()) {
      setStatusMessage("יש להזין מספר טלפון וסיסמה חדשה.");
      return;
    }

    const result = await resetPasswordByPhone({
      phone: phone.trim(),
      newPassword: newPassword.trim(),
    });

    if (result && typeof result === "object" && result.success) {
      setStatusMessage(result.message || "הסיסמה עודכנה.");
      setResetMode(false);
      setPassword("");
      setNewPassword("");
      return;
    }

    if (result && typeof result === "object" && result.message) {
      setStatusMessage(result.message);
      return;
    }

    setStatusMessage("אירעה שגיאה. נסה שוב.");
  };

  const goToReset = () => {
    setResetMode(true);
    setPassword("");
    setNewPassword("");
    setStatusMessage("");
  };

  const backToLogin = () => {
    setResetMode(false);
    setNewPassword("");
    setStatusMessage("");
  };

  return (
    <div className="login-page">
      <div className="login-bg" aria-hidden="true">
        <span className="login-bg-blob login-bg-blob--1" />
        <span className="login-bg-blob login-bg-blob--2" />
        <span className="login-bg-blob login-bg-blob--3" />
        <span className="login-bg-blob login-bg-blob--4" />
        <span className="login-bg-grid" />
      </div>

      <main className="login-shell">
        <section className="card login-card login-card--glass">
          <div className="login-brand">
            <span className="login-brand-mark" aria-hidden="true">U</span>
            <h1>אוניברסיטת העתיד</h1>
            <p>
              {resetMode
                ? "איפוס סיסמה אישית למשתמשים רשומים"
                : "ברוכים השבים — הזדהו ונווט אתכם לאזור האישי המתאים"}
            </p>
          </div>

          {resetMode ? (
            <>
              <h2>איפוס סיסמה</h2>
              <p className="login-reset-hint">
                הזן את מספר הטלפון שעמו נרשמת למערכת ובחר סיסמה חדשה.
              </p>
              <form onSubmit={onSubmitReset} className="admin-form">
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  type="text"
                  placeholder="טלפון"
                  autoComplete="username"
                />
                <input
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  type="password"
                  placeholder="סיסמה חדשה"
                  autoComplete="new-password"
                />
                <button type="submit" className="primary-btn">
                  שמור סיסמה חדשה
                </button>
                <button type="button" className="login-reset-secondary" onClick={backToLogin}>
                  חזרה להתחברות
                </button>
              </form>
            </>
          ) : (
            <>
              <h2>כניסה</h2>
              <form onSubmit={onSubmit} className="admin-form">
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  type="text"
                  placeholder="טלפון"
                  autoComplete="username"
                />
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  placeholder="סיסמה"
                  autoComplete="current-password"
                />
                <button type="button" className="login-reset-link" onClick={goToReset}>
                  שכחת סיסמה / איפוס סיסמה
                </button>
                <button type="submit" className="primary-btn">
                  התחבר
                </button>
              </form>
            </>
          )}
          {statusMessage ? <p className="status-message">{statusMessage}</p> : null}
        </section>
      </main>
    </div>
  );
}


export default Login;
