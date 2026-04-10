import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Animations
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Status Badge
function StatusBadge({ status }) {
  const config = {
    active: {
      dot: "bg-green-500",
      ring: "bg-green-100",
      text: "text-green-700",
      label: "Active",
    },
    idle: {
      dot: "bg-yellow-400",
      ring: "bg-yellow-50",
      text: "text-yellow-700",
      label: "Idle",
    },
  }[status] || {
    dot: "bg-gray-400",
    ring: "bg-gray-100",
    text: "text-gray-600",
    label: "Unknown",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.ring} ${config.text}`}
    >
      <span className="relative flex h-2 w-2">
        {status === "active" && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${config.dot}`} />
      </span>
      {config.label}
    </span>
  );
}

// Metric Card
function MetricCard({ title, value, unit, icon, loading }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      className="rounded-xl border border-slate-200 bg-white/70 p-6 md:p-14 shadow-md backdrop-blur ring-1 ring-white/20 hover:shadow-xl transition"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-slate-500">{title}</h3>
        <span className="text-xl">{icon}</span>
      </div>

      <div className="mt-4 flex items-center justify-center min-h-10">
        {loading ? (
          // 🔄 Loading spinner
          <div className="h-6 w-6 border-2 border-yellow-300 border-t-transparent rounded-full animate-spin" />
        ) : value === null ? (
          // ❌ No data
          <span className="text-slate-400 text-lg">--</span>
        ) : (
          // ✅ Data
          <h2 className="text-2xl font-bold text-slate-900">
            {value}{" "}
            <span className="text-sm font-medium text-slate-500">
              {unit}
            </span>
          </h2>
        )}
      </div>
    </motion.div>
  );
}

export default function MonitoringDashboard() {
  // Separate states
  const [occupancy, setOccupancy] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [power, setPower] = useState(null);
  const [energy, setEnergy] = useState(null);

  const [loading, setLoading] = useState({
    occupancy: true,
    temperature: true,
    humidity: true,
    power: true,
    energy: true,
  });

  // Base API (replace later with Firebase endpoints)
  const BASE_URL = "https://www.firebaseapi/";

  // Reusable fetch function
  const fetchMetric = async (endpoint, setter, key) => {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`);
      const result = await res.json();

      setter(result?.value ?? null);
    } catch (err) {
      console.error(`${endpoint} error`, err);
      setter(null);
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchMetric("occupancy", setOccupancy, "occupancy");
    fetchMetric("temperature", setTemperature, "temperature");
    fetchMetric("humidity", setHumidity, "humidity");
    fetchMetric("power", setPower, "power");
    fetchMetric("energy", setEnergy, "energy");

    // Polling every 5 sec
    const interval = setInterval(() => {
      fetchMetric("occupancy", setOccupancy, "occupancy");
      fetchMetric("temperature", setTemperature, "temperature");
      fetchMetric("humidity", setHumidity, "humidity");
      fetchMetric("power", setPower, "power");
      fetchMetric("energy", setEnergy, "energy");
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Dynamic status
  const status =
    occupancy === null
      ? "idle"
      : occupancy > 0
      ? "active"
      : "idle";

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen font-sans py-8"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-slate-50 via-white to-slate-50" />
      <div className="absolute -top-24 -left-24 -z-10 h-72 w-72 rounded-full bg-yellow-300/30 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 -z-10 h-80 w-80 rounded-full bg-emerald-300/25 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Monitoring Dashboard
          </h1>
          <p className="text-slate-600 mt-2">
            Real-time lab monitoring & energy insights
          </p>
        </motion.div>

        {/* Status */}
        <motion.div variants={fadeUp} className="mb-6 flex items-center gap-3">
          <h2 className="text-lg font-semibold text-slate-800">
            Room Status:
          </h2>
          <StatusBadge status={status} />
        </motion.div>

        {/* Metrics */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <MetricCard
            title="Occupancy"
            value={occupancy}
            unit="people"
            icon="👥"
            loading={loading.occupancy}
          />

          <MetricCard
            title="Temperature"
            value={temperature}
            unit="°C"
            icon="🌡️"
            loading={loading.temperature}
          />

          <MetricCard
            title="Humidity"
            value={humidity}
            unit="%"
            icon="💧"
            loading={loading.humidity}
          />

          <MetricCard
            title="Live Power"
            value={power}
            unit="W"
            icon="⚡"
            loading={loading.power}
          />

          <MetricCard
            title="Energy Consumption"
            value={energy}
            unit="kWh"
            icon="🔋"
            loading={loading.energy}
          />
        </motion.div>
      </div>
    </motion.section>
  );
}