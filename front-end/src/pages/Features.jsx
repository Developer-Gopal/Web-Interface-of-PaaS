import React from "react";
import { motion } from "framer-motion";
import img1 from "../assets/features/image1.png";
import img2 from "../assets/features/image2.png";
import img3 from "../assets/features/image3.png";

const FEATURES = [
  {
    tag: "Mobile Control",
    title: "Control workspace appliances using your mobile",
    desc: "Turn appliances ON/OFF remotely and view current status from a simple mobile-friendly interface. Useful for faculty and lab administrators to manage devices without being physically present.",
    bullets: [
      "Remote ON/OFF control",
      "Live appliance status view",
      "Manage multiple devices from one screen",
      "Quick access for faculty/admin",
    ],
    image: img1,
  },
  {
    tag: "Security",
    title: "Digital Watchdog for off-hours protection",
    desc: "During non-working hours, the system helps monitor workspace activity and appliance usage, reducing energy wastage and preventing unauthorized usage.",
    bullets: [
      "Off-hours monitoring support",
      "Detect unusual activity patterns",
      "Helps prevent unnecessary power usage",
      "Safer workspace management after hours",
    ],
    image: img2,
  },
  {
    tag: "Automation",
    title: "AI & Manual control modes",
    desc: "Switch between AI-assisted automation and manual control anytime. This provides flexibility: automation when possible, and full human control when required.",
    bullets: [
      "AI mode for automatic control (based on conditions)",
      "Manual mode from mobile dashboard",
      "Easy mode switching",
      "Reliable control with human override",
    ],
    image: img3,
  },
];

const FAQS = [
  {
    q: "What can I control using this system?",
    a: "You can control common computer lab appliances such as lights, fans, and other connected devices (based on your hardware setup).",
  },
  {
    q: "Can I use manual control anytime?",
    a: "Yes. Manual control is always available, so you can override or operate devices whenever needed.",
  },
  {
    q: "What is “Digital Watchdog”?",
    a: "It is off-hours monitoring support that helps check unusual activity and reduces power wastage when the lab is closed.",
  },
];

export default function FeaturesPage() {
  return (
    <motion.div
      initial={{ y: 100 }}
      whileInView={{ y: 0 }}
      exit={{ y: -100 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative min-h-screen overflow-hidden text-[#1b1b1b]"
    >
      {/* ✅ SAME GRADIENT AS LANDING PAGE */}
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-slate-50 via-white to-slate-50" />

      {/* ✅ top-left color blob */}
      <div className="pointer-events-none absolute -top-24 -left-24 -z-10 h-80 w-80 rounded-full bg-yellow-300/30 blur-3xl" />

      {/* ✅ bottom-right color blob */}
      <div className="pointer-events-none absolute -bottom-24 -right-24 -z-10 h-96 w-96 rounded-full bg-emerald-300/25 blur-3xl" />

      {/* ✅ optional: same subtle grid like landing */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35]" />

      <div className="mx-auto">
        {/* HERO */}
        <section className="px-6 py-10 md:px-12 md:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h1
              initial={{ y: 100 }}
              whileInView={{ y: 0 }}
              exit={{ y: -100 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-semibold tracking-tight md:text-5xl"
            >
              Manage Your Workspace with Simple Smart Control
            </motion.h1>

            <motion.p
              initial={{ y: 100 }}
              whileInView={{ y: 0 }}
              exit={{ y: -100 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-4 text-sm leading-relaxed text-black/70 md:text-base"
            >
              Control workspace appliances via mobile, protect the lab during
              off-hours, and switch between AI automation and manual operation —
              built as a practical demo for real lab environments.
            </motion.p>
          </div>

          {/* Section divider title */}
          <div className="mt-10 text-center">
            <motion.div
              initial={{ y: 100 }}
              whileInView={{ y: 0 }}
              exit={{ y: -100 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center rounded-full border border-black/10 bg-white/70 px-4 py-1 text-xs font-semibold text-black/70 backdrop-blur"
            >
              Features Overview
            </motion.div>

            <motion.h2
              initial={{ y: 100 }}
              whileInView={{ y: 0 }}
              exit={{ y: -100 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-4 text-xl font-semibold md:text-2xl"
            >
              Empower workspace Management with These Benefits
            </motion.h2>
          </div>

          {/* features part*/}
          <div className="mt-10 space-y-10 md:mt-12">
            {FEATURES.map((f, idx) => {
              const reverse = idx % 2 === 1;
              return (
                <motion.div
                  initial={{ y: 100 }}
                  whileInView={{ y: 0 }}
                  exit={{ y: -100 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  key={f.title}
                  className={[
                    "grid items-center gap-8 rounded-3xl bg-[#fbfaf8]/80 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur md:grid-cols-2 md:p-10",
                    reverse ? "md:[&>*:first-child]:order-2" : "",
                  ].join(" ")}
                >
                  {/* Text */}
                  <div>
                    <motion.div
                      initial={{ y: 100 }}
                      whileInView={{ y: 0 }}
                      exit={{ y: -100 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                      className="inline-flex rounded-full bg-[#f2e7e2] px-3 py-1 text-xs font-semibold text-[#7a2e1d]"
                    >
                      {f.tag}
                    </motion.div>

                    <motion.h3
                      initial={{ y: 100 }}
                      whileInView={{ y: 0 }}
                      exit={{ y: -100 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                      className="mt-4 text-2xl font-semibold tracking-tight"
                    >
                      {f.title}
                    </motion.h3>

                    <motion.p
                      initial={{ y: 100 }}
                      whileInView={{ y: 0 }}
                      exit={{ y: -100 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                      className="mt-3 text-sm leading-relaxed text-black/70"
                    >
                      {f.desc}
                    </motion.p>

                    <motion.ul
                      initial={{ y: 100 }}
                      whileInView={{ y: 0 }}
                      exit={{ y: -100 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                      className="mt-5 space-y-2 text-sm text-black/70"
                    >
                      {f.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <span className="mt-1.5 h-2 w-2 rounded-full bg-[#7a2e1d]" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </motion.ul>
                  </div>

                  {/* Image */}
                  <div className="flex justify-center">
                    <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-black/10 bg-white/80 shadow-sm backdrop-blur">
                      <div className="absolute inset-0 bg-linear-to-br from-[#f6ece7] via-white to-[#f2f0ee]" />
                      <motion.div
                        initial={{ y: 100 }}
                        whileInView={{ y: 0 }}
                        exit={{ y: -100 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="relative p-4"
                      >
                        <img
                          src={f.image}
                          alt={f.title}
                          className="h-64 w-full rounded-xl object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* FAQ */}
          <div className="mt-14 grid gap-10 md:grid-cols-2">
            <div>
              <motion.h3
                initial={{ y: 100 }}
                whileInView={{ y: 0 }}
                exit={{ y: -100 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-xl font-semibold"
              >
                Frequently Asked Questions
              </motion.h3>
              <motion.p
                initial={{ y: 100 }}
                whileInView={{ y: 0 }}
                exit={{ y: -100 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mt-2 text-sm text-black/70"
              >
                Most common questions about the current demo features.
              </motion.p>
            </div>

            <div className="space-y-3 overflow-visible">
              {FAQS.map((item) => (
                <motion.div
                  key={item.q}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="overflow-visible"
                >
                  <details className="rounded-2xl border border-black/10 bg-white/70 p-5 shadow-sm backdrop-blur">
                    <summary className="cursor-pointer select-none text-sm font-semibold text-black/80">
                      {item.q}
                    </summary>
                    <p className="mt-3 text-sm text-black/70">{item.a}</p>
                  </details>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
