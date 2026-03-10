import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const getLinkClass = ({ isActive }) =>
    [
      "px-2 py-1 text-sm transition-colors duration-200",
      isActive ? "text-yellow-500 font-medium" : "text-black/70 hover:text-black",
    ].join(" ");

  const closeMenu = () => setMenuOpen(false);

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
          <NavLink to="/" className={getLinkClass}>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={getLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/features" className={getLinkClass}>
            Features
          </NavLink>
          <NavLink to="/contact" className={getLinkClass}>
            Contact
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <NavLink to="/" className="hidden md:block">
            <button className="rounded-full bg-yellow-400 px-5 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300">
              Try SmartLab
            </button>
          </NavLink>

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
              <NavLink
                to="/dashboard"
                className={getLinkClass}
                onClick={closeMenu}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/features"
                className={getLinkClass}
                onClick={closeMenu}
              >
                Features
              </NavLink>
              <NavLink
                to="/contact"
                className={getLinkClass}
                onClick={closeMenu}
              >
                Contact
              </NavLink>

              <NavLink to="/" onClick={closeMenu} className="pt-2">
                <button className="w-full rounded-xl bg-yellow-400 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300">
                  Try SmartLab
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}