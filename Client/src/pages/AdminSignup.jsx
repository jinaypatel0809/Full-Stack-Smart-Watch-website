import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminSignup() {
  const { adminSignup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      return setError("Passwords do not match.");
    }
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    setLoading(true);
    try {
      await adminSignup(form.name, form.email, form.password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ── Admin UI: Dark / professional theme ──
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)" }}
    >
      <div className="w-full max-w-md">

        {/* ── Admin Badge ── */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-700 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-orange-500/30">
            <svg width="36" height="36" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          </div>
          <h1 className="text-white text-2xl font-black tracking-tight">Create Admin Account</h1>
          <p className="text-gray-500 text-sm mt-1">Fastrack Dashboard Registration</p>
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

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 tracking-widest uppercase">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Admin Name"
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 tracking-widest uppercase">
                  Admin Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
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
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 tracking-widest uppercase">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
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
                    Creating Account...
                  </span>
                ) : "Register Admin →"}
              </button>
            </div>

            {/* Already have account */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Already have admin access?{" "}
              <Link
                to="/admin/login"
                className="text-orange-400 font-bold hover:text-orange-300 hover:underline transition-colors"
              >
                Login
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