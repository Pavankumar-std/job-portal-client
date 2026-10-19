
import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAuthLoading(false);
      return;
    }

    api.get("/auth/me")
      .then((res) => setUser(res.data.user || res.data))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setAuthLoading(false));
  }, []);

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    const token = res.data.token || res.data.accessToken;

    if (!token) throw new Error("Login response did not contain a token.");

    localStorage.setItem("token", token);
    const currentUser = res.data.user || res.data.data?.user || null;
    setUser(currentUser);

    if (!currentUser) {
      try {
        const me = await api.get("/auth/me");
        setUser(me.data.user || me.data);
      } catch {
        // Keep the token; the protected API will report any auth issue.
      }
    }

    return res.data;
  }

  async function register(name, email, password) {
    return api.post("/auth/register", { name, email, password });
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  async function refreshUser() {
    const res = await api.get("/auth/me");
    setUser(res.data.user || res.data);
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, authLoading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
