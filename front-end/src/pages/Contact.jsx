import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    msg: "",
    ok: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, msg: "", ok: false });

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to send");

      setStatus({ loading: false, msg: "Message sent ✅", ok: true });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setStatus({ loading: false, msg: err.message, ok: false });
    }
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen overflow-hidden"
    >
      {/* my custom landing page color gradient*/}
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-slate-50 via-white to-slate-50" />

      {/* top-left blob */}
      <div className="pointer-events-none absolute -top-24 -left-24 -z-10 h-80 w-80 rounded-full bg-yellow-300/30 blur-3xl" />

      {/* bottom-right blob */}
      <div className="pointer-events-none absolute -bottom-24 -right-24 -z-10 h-96 w-96 rounded-full bg-emerald-300/25 blur-3xl" />

      {/* subtle grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35]" />

      <div className="grid mx-auto min-h-screen max-w-6xl md:grid-cols-2">
        {/* left side box*/}
        <div className="relative px-6 py-10 md:px-10 md:py-14">
          <motion.h1
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-extrabold leading-[0.95] tracking-tight md:text-7xl"
          >
            Let’s get <br /> in touch
          </motion.h1>

          <motion.p
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-10 text-xl font-semibold leading-tight text-black/90"
          >
            Don’t be afraid to <br />
            say hello with us!
          </motion.p>

          <div className="mt-12 space-y-8 text-sm text-black/70">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-black/50">
                Phone
              </p>
              <p className="mt-1 font-medium text-black/80">+91 73973 81024</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-black/50">
                Email
              </p>
              <p className="mt-1 font-medium text-black/80">
                skyknightsofficial.com
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-black/50">
                Office
              </p>
              <p className="mt-1 font-medium text-black/80">
                KCG College of Technology, <br />
                Chennai, Tamil Nadu
              </p>
            </div>
          </div>
        </div>

        {/* right side box */}
        <div className="relative px-6 py-10 md:px-10 md:py-12">
          <div className="mt-10 rounded-2xl bg-black p-7 text-white shadow-2xl">
            <h2 className="text-lg font-semibold">Contact</h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input
                  label="Name"
                  name="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input
                  label="Phone"
                  name="phone"
                  placeholder="+91 ..."
                  value={form.phone}
                  onChange={handleChange}
                />
                <Input
                  label="Subject"
                  name="subject"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-xs text-white/60">
                  Tell us what you’re interested in
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="mt-2 w-full resize-none border-b border-white/20 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-yellow-300"
                  rows={3}
                  placeholder="Write your message..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={status.loading}
                className="w-full bg-yellow-300 py-4 text-sm font-semibold text-black hover:brightness-95 disabled:opacity-70"
              >
                {status.loading ? "Sending..." : "Send to us"}
              </button>

              {status.msg && (
                <p
                  className={`text-sm ${status.ok ? "text-green-400" : "text-red-400"}`}
                >
                  {status.msg}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Input({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="text-xs text-white/60">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-2 w-full border-b border-white/20 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-yellow-300"
        required={name === "name" || name === "email"}
      />
    </div>
  );
}
