import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
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
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* ── Header (Orange theme - User) ── */}
        <div className="bg-orange-500 px-8 py-8 text-center">
          <Link to="/" className="inline-flex items-center gap-1 mb-4">
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                fontWeight: 900,
                fontSize: "28px",
                color: "#fff",
                letterSpacing: "-1px",
              }}
            >
              fastrack
            </span>
            <svg width="20" height="26" viewBox="0 0 22 28" fill="none">
              <polygon points="13,0 0,16 9,16 9,28 22,12 13,12" fill="#fff" />
            </svg>
          </Link>
          <h2 className="text-white text-xl font-black tracking-wide">
            Welcome Back!
          </h2>
          <p className="text-orange-100 text-sm mt-1">Login to your account</p>
        </div>

        {/* ── Form ── */}
        <div className="px-8 py-8">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 tracking-wide uppercase">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 tracking-wide uppercase">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-black text-sm py-3.5 rounded-full transition-colors active:scale-95"
            >
              {loading ? "Logging in..." : "Login →"}
            </button>
          </form>

          {/* Signup link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-orange-500 font-bold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}