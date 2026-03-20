import { NavLink } from "react-router-dom";

const centerLinks = [
  { label: "Homepage", to: "/" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Analytics", to: "/analytics" },
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
];


const SocialIcons = ({ size = 18 }) => (
  <div className="flex items-center gap-3">
    <a
      href="#"
      aria-label="Facebook"
      className="text-black hover:opacity-60 transition-opacity"
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    </a>
    <a
      href="#"
      aria-label="X"
      className="text-black hover:opacity-60 transition-opacity"
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    </a>
    <a
      href="#"
      aria-label="Instagram"
      className="text-black hover:opacity-60 transition-opacity"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    </a>
    <a
      href="#"
      aria-label="LinkedIn"
      className="text-black hover:opacity-60 transition-opacity"
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    </a>
  </div>
);

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 20% 50%, #c8d0dc 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, #dde3ec 0%, transparent 50%), radial-gradient(ellipse at 60% 80%, #bcc6d4 0%, transparent 50%), linear-gradient(135deg, #e8ecf1 0%, #d0d8e4 40%, #c2cdd9 70%, #dae0e8 100%)",
      }}
    >
      {/* Diagonal light streak — mimics the prismatic glare in the reference image */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.45) 48%, rgba(255,255,255,0.15) 52%, transparent 65%)",
        }}
      />

      {/* Center block */}
      <div className="relative mx-auto">
        <div className="flex flex-col items-center gap-6 border border-gray-200 bg-white py-10 shadow-sm">


          <nav className="flex flex-wrap items-center justify-center gap-6">
            {centerLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="text-sm text-gray-600 transition-colors hover:text-black"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <SocialIcons size={20} />
        </div>
      </div>
    </footer>
  );
}
