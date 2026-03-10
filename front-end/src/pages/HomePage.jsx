import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  async function startModel() {
    try {
      const res = await fetch("http://127.0.0.1:8000/start-model", {
        method: "POST",
      });
      const data = await res.json();
      alert(data.status);
    } catch (err) {
      alert("Failed to start model");
    }
  }

  async function stopModel() {
    try {
      const res = await fetch("http://127.0.0.1:8000/stop-model", {
        method: "POST",
      });
      const data = await res.json();
      alert(data.status);
    } catch (err) {
      alert("Failed to stop model");
    }
  }

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      exit={{ y: -100 }}
      className=""
    >
      <div className="mx-auto overflow-hidden min-h-screen bg-white">
        <main className="relative z-10 h-full flex flex-col justify-center px-6 md:px-10 md:mt-14 mt-8">
          <div className="pointer-events-none absolute -top-24 -left-24 -z-10 h-80 w-80 rounded-full bg-yellow-300/30 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 -right-24 -z-10 h-96 w-96 rounded-full bg-emerald-300/25 blur-3xl" />

          <div className="mx-auto flex max-w-3xl justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-black/70 shadow-sm">
              Mobile control • Watchdog • AI/Manual
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-black/10 text-[11px]">
                ↗
              </span>
            </span>
          </div>
          <h1 className="mx-auto mt-6 max-w-4xl text-center text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl md:text-6xl">
            Create smarter workspace control <br className="hidden md:block" />
            with AI and manage seamlessly
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-black/60 sm:text-base">
            Control workspace appliances using your mobile, enable a digital
            watchdog for off-hours, and switch between AI automation and manual
            control whenever required.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-2xl bg-yellow-300 px-6 py-3 text-black hover:bg-purple-500 hover:text-white transform-all duration-300 active:scale-95 transform hover:scale-110  hover:-translate-1 hover:shadow-xl"
            >
              Get Started ↗
            </button>
          </div>
        </main>
      </div>
    </motion.div>
  );
}
