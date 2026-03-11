import { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, LogIn } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("smartlab_token")
  );

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("smartlab_token"));
  }, [location]);

  const getLinkClass = ({ isActive }) =>
    [
      "px-2 py-1 text-sm transition-colors duration-200",
      isActive
        ? "text-yellow-500 font-medium"
        : "text-black/70 hover:text-black",
    ].join(" ");

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("smartlab_token");
    localStorage.removeItem("smartlab_user");
    setIsLoggedIn(false);
    closeMenu();
    navigate("/login");
  };

  const handleLogin = () => {
    closeMenu();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/60 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-5 md:px-10">
        <NavLink
          to="/"
          className="text-base font-bold text-slate-900"
          onClick={closeMenu}
        >
          SeeWise
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={getLinkClass}>Home</NavLink>
          <NavLink to="/dashboard" className={getLinkClass}>Dashboard</NavLink>
          <NavLink to="/features" className={getLinkClass}>Features</NavLink>
          <NavLink to="/contact" className={getLinkClass}>Contact</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-500 hover:text-white hover:border-red-500"
            >
              <LogOut size={15} />
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="hidden md:flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white hover:border-blue-600"
            >
              <LogIn size={15} />
              Login
            </button>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 transition hover:bg-black/5 md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="px-6 pb-5 md:hidden">
          <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3">
              <NavLink to="/" className={getLinkClass} onClick={closeMenu}>
                Home
              </NavLink>
              <NavLink to="/dashboard" className={getLinkClass} onClick={closeMenu}>
                Dashboard
              </NavLink>
              <NavLink to="/features" className={getLinkClass} onClick={closeMenu}>
                Features
              </NavLink>
              <NavLink to="/contact" className={getLinkClass} onClick={closeMenu}>
                Contact
              </NavLink>

              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-500 hover:text-white"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                >
                  <LogIn size={15} />
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}