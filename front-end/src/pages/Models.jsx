import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Status badge component
function StatusBadge({ status }) {
  const config = {
    active: {
      dot: "bg-green-500",
      ring: "bg-green-100",
      text: "text-green-700",
      label: "Active",
    },
    inactive: {
      dot: "bg-red-400",
      ring: "bg-red-50",
      text: "text-red-600",
      label: "Inactive",
    },
    checking: {
      dot: "bg-yellow-400",
      ring: "bg-yellow-50",
      text: "text-yellow-700",
      label: "Checking",
    },
  }[status] ?? {
    dot: "bg-gray-400",
    ring: "bg-gray-100",
    text: "text-gray-600",
    label: "Unknown",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.ring} ${config.text}`}
    >
      <span className={`relative flex h-2 w-2`}>
        {status === "active" && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${config.dot}`}
        />
      </span>
      {config.label}
    </span>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [models, setModels] = useState([
    {
      id: 1,
      name: "John McCarthy Lab",
      date: "10 Mar 2026",
      zones: [],
      tunnelUrl: "https://doll-track-spine-diary.trycloudflare.com",
    },
    {
      id: 2,
      name: "Bill Gates Lab",
      date: "10 Mar 2026",
      zones: [],
      tunnelUrl: "https://bill-gates-lab.trycloudflare.com",
    },
    {
      id: 3,
      name: "MT Block Lab",
      date: "10 Mar 2026",
      zones: [],
      tunnelUrl: "https://mt-block-lab.trycloudflare.com",
    },
    {
      id: 4,
      name: "CSE Cyber Lab",
      date: "10 Mar 2026",
      zones: [],
      tunnelUrl: "https://cse-cyber-lab.trycloudflare.com",
    },
    {
      id: 5,
      name: "Computer Science Lab",
      date: "10 Mar 2026",
      zones: [],
      tunnelUrl: "https://computer-science-lab.trycloudflare.com",
    },
    {
      id: 6,
      name: "IT Dept Lab",
      date: "10 Mar 2026",
      zones: [],
      tunnelUrl: "https://it-dept-lab.trycloudflare.com",
    },
  ]);

  // Separate status map: { [id]: "active" | "inactive" | "checking" }
  const [statuses, setStatuses] = useState(() =>
    Object.fromEntries([1, 2, 3, 4, 5, 6].map((id) => [id, "checking"])),
  );

  // Check a single model's status
  const checkStatus = useCallback(async (model) => {
    if (!model.tunnelUrl) return;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const res = await fetch(`${model.tunnelUrl}/status`, {
        method: "GET",
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const data = await res.json();
      setStatuses((prev) => ({
        ...prev,
        [model.id]: data.running ? "active" : "inactive",
      }));
    } catch {
      setStatuses((prev) => ({ ...prev, [model.id]: "inactive" }));
    }
  }, []);

  // Poll all models every 10 seconds
  useEffect(() => {
    // Initial check
    models.forEach(checkStatus);

    const interval = setInterval(() => {
      models.forEach(checkStatus);
    }, 10000);

    return () => clearInterval(interval);
  }, [models, checkStatus]);

  useEffect(() => {
    if (location.state?.newModel) {
      const incomingModel = location.state.newModel;
      setModels((prev) => {
        const alreadyExists = prev.some((m) => m.id === incomingModel.id);
        if (alreadyExists) return prev;
        return [
          ...prev,
          { ...incomingModel, tunnelUrl: incomingModel.tunnelUrl || "" },
        ];
      });
      setStatuses((prev) => ({ ...prev, [incomingModel.id]: "checking" }));
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, navigate, location.pathname]);

  const startModel = async (model) => {
    try {
      setStatuses((prev) => ({ ...prev, [model.id]: "checking" }));
      const response = await fetch(`${model.tunnelUrl}/start-model`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: model.id,
          name: model.name,
          zones: model.zones,
        }),
      });
      const data = await response.json();
      console.log(`Start response from ${model.name}:`, data);
      // Re-check status after starting
      setTimeout(() => checkStatus(model), 2000);
    } catch (error) {
      console.error(`Error starting ${model.name}:`, error);
      setStatuses((prev) => ({ ...prev, [model.id]: "inactive" }));
    }
  };

  const stopModel = async (model) => {
    try {
      const response = await fetch(`${model.tunnelUrl}/stop-model`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: model.id, name: model.name }),
      });
      const data = await response.json();
      console.log(`Stop response from ${model.name}:`, data);
      setStatuses((prev) => ({ ...prev, [model.id]: "inactive" }));
    } catch (error) {
      console.error(`Error stopping ${model.name}:`, error);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen overflow-hidden font-sans py-6 sm:py-8 md:py-10"
    >
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-slate-50 via-white to-slate-50" />
      <div className="pointer-events-none absolute -top-24 -left-24 -z-10 h-64 w-64 rounded-full bg-yellow-300/30 blur-3xl sm:h-80 sm:w-80" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 -z-10 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl sm:h-96 sm:w-96" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mb-6 text-center sm:mb-8 sm:text-left"
        >
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
            Your Saved Models
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Manage your saved zone configurations.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8"
        >
          {models.map((model) => {
            const status = statuses[model.id] ?? "checking";
            return (
              <motion.div
                key={model.id}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="relative flex flex-col items-center rounded-xl border border-slate-200 bg-white/70 p-5 sm:p-6 md:p-8 shadow-md backdrop-blur ring-1 ring-white/20 transition hover:shadow-xl"
              >
                {/* Status badge — top right */}
                <div className="absolute top-3 right-3">
                  <StatusBadge status={status} />
                </div>

                <div className="text-center">
                  <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                    {model.name}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Created on {model.date}
                  </p>
                  <div className="mt-2 break-all text-[11px] text-slate-400">
                    {model.tunnelUrl}
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startModel(model)}
                    disabled={status === "active"}
                    className="w-full rounded-xl bg-yellow-300 px-5 py-1.5 text-sm text-black hover:bg-green-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed sm:w-auto"
                  >
                    Start
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => stopModel(model)}
                    disabled={status === "inactive"}
                    className="w-full rounded-xl bg-yellow-300 px-5 py-1.5 text-sm text-black hover:bg-red-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed sm:w-auto"
                  >
                    Stop
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}
