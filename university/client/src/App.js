import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import Manager from "./components/Manager";
import Teacher from "./components/Teacher";
import Student from "./components/Student";
import Login from "./components/Login";
import {
  clearAuthUser,
  getAuthUser,
  getPersonalRouteByRole,
} from "./services/authStorage";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [appReady, setAppReady] = useState(false);
  const user = getAuthUser();
  const isAuthenticated = !!user;

  const personalRoute = useMemo(
    () => getPersonalRouteByRole(user?.status),
    [user?.status]
  );

  useEffect(() => {
    clearAuthUser();
    if (location.pathname !== "/login") {
      navigate("/login", { replace: true });
    }
    setAppReady(true);
  }, []);

  if (!appReady) return null;

  const onLogout = () => {
    clearAuthUser();
    navigate("/login");
  };

  const TopNav = () => {
    if (!isAuthenticated || location.pathname === "/login") return null;
    return (
      <header className="top-nav app-main-nav">
        <div className="brand">אוניברסיטת העתיד</div>
        <div className="profile-actions">
          <button className="ghost-btn" onClick={() => navigate("/home")}>
            דף הבית
          </button>
          <button className="ghost-btn" onClick={() => navigate(personalRoute)}>
            האזור האישי שלי
          </button>
          <button className="ghost-btn" onClick={onLogout}>
            התנתקות
          </button>
        </div>
      </header>
    );
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
  };

  const RoleRoute = ({ allowedRoles, children }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    const role = String(user?.status || "").toLowerCase();
    if (!allowedRoles.includes(role)) return <Navigate to={personalRoute} replace />;
    return children;
  };

  return (
    <>
      <TopNav />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager"
          element={
            <RoleRoute allowedRoles={["manager", "admin"]}>
              <Manager />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <RoleRoute allowedRoles={["teacher"]}>
              <Teacher />
            </RoleRoute>
          }
        />
        <Route
          path="/student"
          element={
            <RoleRoute allowedRoles={["student"]}>
              <Student />
            </RoleRoute>
          }
        />
        <Route
          path="/"
          element={
            <Navigate
              to={isAuthenticated ? personalRoute : "/login"}
              replace
            />
          }
        />
        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated ? personalRoute : "/login"}
              replace
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
