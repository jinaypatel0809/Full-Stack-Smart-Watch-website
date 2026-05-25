import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminLogin(form.email, form.password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ── Admin UI: Dark / professional theme (completely different from user login) ──
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)" }}
    >
      <div className="w-full max-w-md">

        {/* ── Admin Badge ── */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-700 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-orange-500/30">
            <svg width="36" height="36" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-black tracking-tight">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">Fastrack Dashboard Access</p>
        </div>

        {/* ── Card ── */}
        <div className="bg-gray-900 rounded-3xl shadow-2xl border border-gray-800 overflow-hidden">
          <div className="px-8 py-8">

            {error && (
              <div className="mb-5 bg-red-950/60 border border-red-800 text-red-400 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 tracking-widest uppercase">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="admin@fastrack.com"
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 tracking-widest uppercase">
                  Password
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder-gray-600"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-1 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-60 text-white font-black text-sm py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-orange-500/25"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Authenticating...
                  </span>
                ) : "Access Dashboard →"}
              </button>
            </div>

            {/* New admin signup link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              New admin?{" "}
              <Link
                to="/admin/signup"
                className="text-orange-400 font-bold hover:text-orange-300 hover:underline transition-colors"
              >
                Create Admin Account
              </Link>
            </p>

            <div className="mt-5 pt-5 border-t border-gray-800 text-center">
              <Link to="/" className="text-xs text-gray-700 hover:text-gray-400 transition-colors flex items-center justify-center gap-1">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M19 12H5M12 5l-7 7 7 7"/>
                </svg>
                Back to Store
              </Link>
            </div>
          </div>
        </div>

        {/* Security note */}
        <p className="text-center text-xs text-gray-700 mt-4">
          🔒 Secured Admin Portal — Authorized Access Only
        </p>
      </div>
    </div>
  );
}