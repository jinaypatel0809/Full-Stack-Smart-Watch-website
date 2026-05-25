import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { label: "WATCHES", to: "/watches" },
  { label: "SMART WATCHES", to: "/smart-watches" },
  { label: "VYB BY FASTRACK", to: "/vyb" },
  { label: "SALE", to: "/sale" },
  { label: "GIFTING", to: "/gifting" },
  { label: "ACCESSORIES", to: "/accessories" },
  { label: "MORE", to: "/more" },
];

function FastrackLogo({ onClick }) {
  return (
    <Link to="/" className="flex items-center gap-1 select-none" onClick={onClick}>
      <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 900, fontSize: "26px", color: "#111", letterSpacing: "-1px" }}>
        fastrack
      </span>
      <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
        <polygon points="13,0 0,16 9,16 9,28 22,12 13,12" fill="#F47A20" />
      </svg>
    </Link>
  );
}

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, setCartOpen } = useCart();
  const { isLoggedIn, user, logout } = useAuth();

  const closeMobile = () => setMobileOpen(false);
  const toggleMobile = () => setMobileOpen(prev => !prev);

  // Logout kare to login page pe redirect
  const handleLogout = () => {
    logout();
    navigate("/login");
    closeMobile();
  };

  return (
    <nav className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between h-16">
        <FastrackLogo onClick={closeMobile} />

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map(({ label, to }) => (
            <li key={to}>
              <Link
                to={to}
                className={`text-xs font-bold tracking-widest pb-1 border-b-2 transition-colors duration-150 ${
                  pathname === to
                    ? "text-orange-500 border-orange-500"
                    : "text-gray-800 border-transparent hover:text-orange-500 hover:border-orange-400"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-3 text-gray-700">

          {/* Search */}
          <button className="hover:text-orange-500 transition-colors hidden sm:block">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>

          {/* ── USER ICON / LOGOUT ICON ──
              - Login nathi thayo: User icon dikhay → click kare to /login
              - Login thayo che: Logout icon dikhay → click kare to logout + /login redirect
          */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              title={`Logout (${user?.name})`}
              className="hover:text-red-500 transition-colors hidden sm:block relative group"
            >
              {/* Logout (door open) icon */}
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              {/* Tooltip */}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Logout
              </span>
            </button>
          ) : (
            // User (person) icon → Login page open thay
            <Link
              to="/login"
              title="Login / Sign Up"
              className="hover:text-orange-500 transition-colors hidden sm:block relative group"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              {/* Tooltip */}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Login
              </span>
            </Link>
          )}

          {/* ── ADMIN DASHBOARD ICON ──
              Dashboard (grid) icon → Admin Login page open thay
          */}
          <Link
            to="/admin/login"
            title="Admin Dashboard"
            className="hover:text-orange-500 transition-colors hidden sm:block relative group"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            {/* Tooltip */}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Admin
            </span>
          </Link>

          {/* Heart / Wishlist */}
          <button className="hover:text-orange-500 transition-colors hidden sm:block">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative hover:text-orange-500 transition-colors"
            aria-label="Open cart"
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>

          {/* Store */}
          <button className="hover:text-orange-500 transition-colors hidden sm:block">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 ml-1"
            onClick={toggleMobile}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <span className="block w-5 h-0.5 bg-gray-800 rounded-full transition-all duration-300 origin-center"
              style={{ transform: mobileOpen ? "rotate(45deg) translateY(6px)" : "none" }} />
            <span className="block w-5 h-0.5 bg-gray-800 rounded-full transition-all duration-300"
              style={{ opacity: mobileOpen ? 0 : 1 }} />
            <span className="block w-5 h-0.5 bg-gray-800 rounded-full transition-all duration-300 origin-center"
              style={{ transform: mobileOpen ? "rotate(-45deg) translateY(-6px)" : "none" }} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: mobileOpen ? `${(navLinks.length + 3) * 56}px` : "0px", opacity: mobileOpen ? 1 : 0 }}
      >
        <div className="border-t border-gray-100 bg-white">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={closeMobile}
              className={`flex items-center justify-between px-5 py-4 border-b border-gray-100 text-xs font-bold tracking-widest transition-colors duration-150 ${
                pathname === to ? "text-orange-500 bg-orange-50" : "text-gray-800 hover:text-orange-500 hover:bg-gray-50"
              }`}
            >
              <span>{label}</span>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                className={pathname === to ? "text-orange-400" : "text-gray-300"}>
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          ))}

          {/* Mobile: User login / logout */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between px-5 py-4 border-b border-gray-100 text-xs font-bold tracking-widest text-red-500 hover:bg-red-50"
            >
              <span>LOGOUT ({user?.name})</span>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          ) : (
            <Link to="/login" onClick={closeMobile}
              className="flex items-center justify-between px-5 py-4 border-b border-gray-100 text-xs font-bold tracking-widest text-gray-800 hover:text-orange-500 hover:bg-gray-50"
            >
              <span>LOGIN / SIGNUP</span>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>
          )}

          {/* Mobile: Admin Dashboard */}
          <Link to="/admin/login" onClick={closeMobile}
            className="flex items-center justify-between px-5 py-4 text-xs font-bold tracking-widest text-gray-800 hover:text-orange-500 hover:bg-gray-50"
          >
            <span>ADMIN DASHBOARD</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}