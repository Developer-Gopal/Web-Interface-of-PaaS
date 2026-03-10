// src/components/Navbar.jsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const base =
    "relative px-2 py-1 transition-all duration-300 transform hover:scale-110 active:scale-95";

  const linkClass = ({ isActive }) =>
    `${base} ${
      isActive
        ? "text-yellow-500 font-semibold"
        : "text-black/70 hover:text-black"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/60 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-5 md:px-10">
        {/* Left: Brand */}
        <NavLink to="/demopage" className="text-md font-bold text-slate-900">
          SeeWise
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-sm md:flex">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          {/* <NavLink to="/details" className={linkClass}>
            How it works
          </NavLink> */}

          <NavLink to="/features" className={linkClass}>
            Features
          </NavLink>
          {/* <NavLink to="/about" className={linkClass}>
            About
          </NavLink> */}
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
        </nav>

        {/* Right buttons */}
        <div className="flex items-center gap-3">
          <NavLink to="/" className="hidden md:block">
            <button className="rounded-full bg-yellow-400 px-5 py-2 text-sm font-semibold text-black transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-xl active:scale-90">
              Try SmartLab
            </button>
          </NavLink>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen((p) => !p)}
            className="md:hidden rounded-xl p-2 hover:bg-black/5 active:scale-95 transition"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden px-6 pb-5">
          <div className="rounded-2xl border border-black/10 bg-white/80 backdrop-blur p-4 shadow-sm">
            <div className="flex flex-col gap-3 text-sm">
              <NavLink
                onClick={() => setOpen(false)}
                to="/demopage"
                className={linkClass}
              >
                Home
              </NavLink>
              <NavLink
                onClick={() => setOpen(false)}
                to="/details"
                className={linkClass}
              >
                How it works
              </NavLink>
              <NavLink
                onClick={() => setOpen(false)}
                to="/models"
                className={linkClass}
              >
                Models
              </NavLink>
              <NavLink
                onClick={() => setOpen(false)}
                to="/features"
                className={linkClass}
              >
                Features
              </NavLink>
              <NavLink
                onClick={() => setOpen(false)}
                to="/about"
                className={linkClass}
              >
                About
              </NavLink>
              <NavLink
                onClick={() => setOpen(false)}
                to="/contact"
                className={linkClass}
              >
                Contact
              </NavLink>

              <NavLink
                onClick={() => setOpen(false)}
                to="/demopage"
                className="pt-2"
              >
                <button className="w-full rounded-xl bg-yellow-400 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300 active:scale-95">
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
