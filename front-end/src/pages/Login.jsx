import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const reveal = {
  hidden: { opacity: 0, y: 30 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay },
  }),
};

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password.trim()) {
      setError("Enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("https://api.gopalkris.me/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("smartlab_token", data.token);
      localStorage.setItem(
        "smartlab_user",
        JSON.stringify({ email: form.email }),
      );

      navigate("/dashboard");
    } catch (error) {
      setError("Couldn't connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-linear-to-b from-slate-50 via-white to-slate-50 text-[#1b1b1b]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-yellow-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-emerald-300/25 blur-3xl" />

      <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col items-center justify-center px-4">
        <motion.div
          custom={0.05}
          variants={reveal}
          initial="hidden"
          animate="show"
          className="mb-8 flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-1.5 text-[13px] text-black/65 shadow-sm backdrop-blur"
        >
          <span className="font-medium text-[#1b1b1b]">Admin access only</span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c4b0ff] text-[11px] text-white">
            →
          </span>
        </motion.div>

        <motion.div
          custom={0.12}
          variants={reveal}
          initial="hidden"
          animate="show"
          className="mb-3 text-center"
        >
          <h1
            className="font-normal leading-[1.1] tracking-tight"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.4rem, 5vw, 3.4rem)",
            }}
          >
            <span className="relative inline-block">
              Login
              {/* <span
                className="pointer-events-none absolute -left-1 -right-1"
                style={{
                  bottom: "6px",
                  height: "15px",
                  border: "2px solid #e8c840",
                  borderRadius: "50%",
                  transform: "rotate(-2deg)",
                }}
              /> */}
            </span>{" "}
            to Your Account
          </h1>
        </motion.div>

        <motion.p
          custom={0.2}
          variants={reveal}
          initial="hidden"
          animate="show"
          className="mb-8 text-center text-sm leading-relaxed text-black/55"
        >
          Sign in to view your dashboard, check model status, and manage your
          workspace controls.
        </motion.p>

        <motion.form
          custom={0.28}
          variants={reveal}
          initial="hidden"
          animate="show"
          onSubmit={handleLogin}
          className="w-full space-y-3"
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={updateField}
            className="w-full rounded-sm border border-black/10 bg-white/70 px-6 py-4 text-[14px] outline-none transition-all duration-200 placeholder:text-black/30 focus:border-black/25 focus:bg-white focus:ring-2 focus:ring-black/5"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={updateField}
            className="w-full rounded-sm border border-black/10 bg-white/70 px-6 py-4 text-[14px] outline-none transition-all duration-200 placeholder:text-black/30 focus:border-black/25 focus:bg-white focus:ring-2 focus:ring-black/5"
          />

          {error && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-[13px] text-red-500"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-between rounded-sm bg-yellow-400 px-6 py-4 text-[15px] text-black shadow-sm transition-all duration-200 hover:bg-green-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span>{loading ? "Signing in..." : "Login to Dashboard"}</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-base font-bold text-[#1b1b1b] shadow-sm">
              →
            </span>
          </button>
        </motion.form>
      </div>
    </div>
  );
}
