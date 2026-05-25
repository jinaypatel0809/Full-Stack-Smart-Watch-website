import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // true jyare sudi token verify na thay

  // ── App load — token verify karo backend par ──────────────
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("fastrack_token");

      // Token j nathi — direct logout state
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Backend par token verify karo — /api/auth/me
        const res = await fetch(`${API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          // Token valid — user set karo
          setUser(data.user);
          // localStorage update karo (fresh data)
          localStorage.setItem("fastrack_user", JSON.stringify(data.user));
        } else {
          // Token invalid / expired — clear karo
          localStorage.removeItem("fastrack_token");
          localStorage.removeItem("fastrack_user");
          setUser(null);
        }
      } catch {
        // Network error — localStorage fallback vaaparo
        const savedUser = localStorage.getItem("fastrack_user");
        if (savedUser) {
          try { setUser(JSON.parse(savedUser)); } catch { setUser(null); }
        }
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  // ── User Signup ───────────────────────────────────────────
  const signup = async (name, email, password) => {
    const res = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Signup failed");
    localStorage.setItem("fastrack_token", data.token);
    localStorage.setItem("fastrack_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  // ── User Login ────────────────────────────────────────────
  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    localStorage.setItem("fastrack_token", data.token);
    localStorage.setItem("fastrack_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  // ── Admin Signup ──────────────────────────────────────────
  const adminSignup = async (name, email, password) => {
    const res = await fetch(`${API_URL}/admin/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Admin signup failed");
    localStorage.setItem("fastrack_token", data.token);
    localStorage.setItem("fastrack_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  // ── Admin Login ───────────────────────────────────────────
  const adminLogin = async (email, password) => {
    const res = await fetch(`${API_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Admin login failed");
    localStorage.setItem("fastrack_token", data.token);
    localStorage.setItem("fastrack_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  // ── Logout ────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("fastrack_token");
    localStorage.removeItem("fastrack_user");
    setUser(null);
  };

  const isLoggedIn = !!user;
  const isAdmin    = user?.role === "admin";

  // Loading hoy tyare children render na karo — flicker avoid
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 900, fontSize: "28px", color: "#111", letterSpacing: "-1px" }}>
              fastrack
            </span>
            <svg width="20" height="26" viewBox="0 0 22 28" fill="none">
              <polygon points="13,0 0,16 9,16 9,28 22,12 13,12" fill="#F47A20" />
            </svg>
          </div>
          <svg className="animate-spin w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, isLoggedIn, isAdmin, signup, login, adminSignup, adminLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}