const AUTH_KEY = "authUser";

export const setAuthUser = (user) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
};

export const getAuthUser = () => {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
};

export const clearAuthUser = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const getPersonalRouteByRole = (role) => {
  const normalizedRole = String(role || "").toLowerCase();
  if (normalizedRole === "manager" || normalizedRole === "admin") return "/manager";
  if (normalizedRole === "teacher") return "/teacher";
  return "/student";
};
