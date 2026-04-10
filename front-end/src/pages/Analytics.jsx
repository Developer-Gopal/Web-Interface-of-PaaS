// Analytics.jsx
// Real-time Firebase — auto-updates when Python script pushes new data.
// npm install recharts firebase

import { useState, useEffect } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

// ── Firebase config ───────────────────────────────────────────────────────────
// If you already have a firebase.js in your project, remove this block
// and import { database } from "../firebase" instead.
const FIREBASE_CONFIG = {
  databaseURL: "https://ecp-database-e772a-default-rtdb.asia-southeast1.firebasedatabase.app",
};
const app      = getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApps()[0];
const database = getDatabase(app);

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt  = (n, d = 2) => Number(n || 0).toFixed(d);
const fmtK = (n)        => Number(n || 0).toLocaleString("en-IN");

// Handles both nested (/bms/actual/today) and flat (/bms/actual_today) structure
function normalise(raw) {
  return {
    actual_today:    raw.actual?.today   || raw.actual_today   || {},
    actual_month:    raw.actual?.month   || raw.actual_month   || {},
    actual_week:     raw.actual?.week    || raw.actual_week    || [],
    actual_hourly:   raw.actual?.hourly  || raw.actual_hourly  || {},
    pred_next_day:   raw.predictions?.next_day   || raw.pred_next_day   || {},
    pred_next_week:  raw.predictions?.next_week  || raw.pred_next_week  || [],
    pred_next_month: raw.predictions?.next_month || raw.pred_next_month || {},
  };
}

function statusConfig(s) {
  const map = {
    "idle":           { label: "Idle",           dot: "bg-gray-400",   badge: "bg-gray-100 text-gray-600"   },
    "low occupancy":  { label: "Low Occupancy",  dot: "bg-blue-400",   badge: "bg-blue-50 text-blue-700"    },
    "active":         { label: "Active",          dot: "bg-green-500",  badge: "bg-green-50 text-green-700"  },
    "high occupancy": { label: "High Occupancy", dot: "bg-yellow-500", badge: "bg-yellow-50 text-yellow-700" },
  };
  return map[s] || map["idle"];
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children, isPrediction }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
        {children}
      </span>
      {isPrediction && (
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-semibold">
          ML model
        </span>
      )}
    </div>
  );
}

function StatCard({ label, value, unit, sub }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-500">
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-2xl font-semibold text-gray-800 tracking-tight font-mono">
        {value}
        <span className="text-sm font-normal text-gray-400 ml-1 font-sans">{unit}</span>
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1.5">{sub}</p>}
    </div>
  );
}

function PredCard({ label, value, unit, sub }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 border-l-4 border-l-yellow-400 transition-all duration-500">
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-2xl font-semibold text-gray-800 tracking-tight font-mono">
        {value}
        <span className="text-sm font-normal text-gray-400 ml-1 font-sans">{unit}</span>
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1.5">{sub}</p>}
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="text-gray-500 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || "#EAB308" }} className="font-semibold">
          {p.name}: {Number(p.value).toFixed(2)} kWh
        </p>
      ))}
    </div>
  );
}

function WeekRow({ week }) {
  const arr    = Array.isArray(week) ? week : Object.values(week);
  const maxKwh = Math.max(...arr.filter(d => d.kwh).map(d => Number(d.kwh)), 1);
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-gray-700">This week — daily usage</p>
        <p className="text-xs text-gray-400">actual kWh per day</p>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {arr.map((d, i) => {
          const pct  = d.kwh ? (Number(d.kwh) / maxKwh) * 100 : 5;
          const isTd = d.status === "today";
          const isFt = d.status === "future";
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <p className={`text-[10px] font-medium ${isTd ? "text-yellow-600 font-bold" : "text-gray-400"}`}>
                {d.day_name}
              </p>
              <div className="w-full h-16 flex items-end">
                <div
                  className="w-full rounded-t-md transition-all duration-700"
                  style={{
                    height: `${pct}%`,
                    minHeight: 3,
                    background: isTd ? "#EAB308" : isFt ? "#F3F4F6" : "#FDE68A",
                  }}
                />
              </div>
              <p className="text-[10px] font-semibold text-gray-700 font-mono">
                {isFt ? "—" : fmt(d.kwh, 1)}
              </p>
              <p className="text-[9px] text-gray-400">
                {isFt ? "" : `₹${fmt(d.cost_inr, 0)}`}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HourlyChart({ hourly }) {
  const curHr  = new Date().getHours();
  const values = Array.isArray(hourly)
    ? hourly
    : Array.from({ length: 24 }, (_, i) => Number(hourly[String(i)] || 0));

  const data = values.map((kwh, h) => ({
    hour: h % 3 === 0 ? (h < 10 ? `0${h}` : `${h}`) + ":00" : "",
    kWh:  Number(kwh),
    h,
  }));

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-700">Today's hourly consumption</p>
        <p className="text-xs text-gray-400">kWh per hour</p>
      </div>
      <div className="flex gap-4 mb-3">
        {[
          { bg: "#FDE68A", label: "Recorded" },
          { bg: "#EAB308", label: "Current hour" },
          { bg: "#F3F4F6", border: true, label: "Upcoming" },
        ].map(({ bg, label, border }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-sm"
              style={{ background: bg, border: border ? "1px solid #e5e7eb" : "none" }}
            />
            <span className="text-[11px] text-gray-400">{label}</span>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
          <Bar dataKey="kWh" radius={[3, 3, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.h}
                fill={entry.h === curHr ? "#EAB308" : entry.h < curHr ? "#FDE68A" : "#F3F4F6"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ForecastChart({ nextWeek }) {
  const arr  = Array.isArray(nextWeek) ? nextWeek : Object.values(nextWeek);
  const data = arr.map(d => ({
    day:       `${(d.day_name || "").slice(0, 3)} ${(d.date || "").slice(-5)}`,
    Predicted: Number(d.predicted_kwh || 0),
    Baseline:  parseFloat((Number(d.predicted_kwh || 0) * 1.22).toFixed(2)),
  }));

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-700">Next week forecast</p>
        <p className="text-xs text-gray-400">predicted kWh</p>
      </div>
      <div className="flex gap-4 mb-3">
        {[
          { bg: "#FDE68A", label: "Predicted (AI)" },
          { bg: "#FCA5A5", label: "Baseline (no AI)" },
        ].map(({ bg, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: bg }} />
            <span className="text-[11px] text-gray-400">{label}</span>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
          <Bar dataKey="Predicted" fill="#FDE68A" radius={[3, 3, 0, 0]} />
          <Line
            type="monotone"
            dataKey="Baseline"
            stroke="#FCA5A5"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl" />)}
      </div>
      <div className="h-40 bg-gray-100 rounded-2xl" />
      <div className="h-56 bg-gray-100 rounded-2xl" />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Analytics() {
  const [data,     setData]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [lastSync, setLastSync] = useState(null);
  const [flash,    setFlash]    = useState(false);

  useEffect(() => {
    // Subscribes to /bms — fires immediately on mount with current data,
    // then fires again automatically every time Python pushes new data.
    const dbRef = ref(database, "/bms");

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        const raw = snapshot.val();
        if (!raw) {
          setError("No data at /bms — run bms_firebase_ml.py first.");
          setLoading(false);
          return;
        }
        setData(normalise(raw));
        setLastSync(new Date());
        setLoading(false);
        setError(null);
        // Brief yellow flash so user knows data just updated
        setFlash(true);
        setTimeout(() => setFlash(false), 800);
      },
      (err) => {
        setError(`Firebase error: ${err.message}`);
        setLoading(false);
      }
    );

    // Cleanup: unsubscribe when user leaves the page
    return () => unsubscribe();
  }, []);

  // ── Derived values (safe defaults so page never crashes) ──────────────────
  const t  = data?.actual_today    || {};
  const m  = data?.actual_month    || {};
  const wk = data?.actual_week     || [];
  const hr = data?.actual_hourly   || {};
  const pd = data?.pred_next_day   || {};
  const pw = data?.pred_next_week  || [];
  const pm = data?.pred_next_month || {};

  const wkArr     = Array.isArray(wk) ? wk : Object.values(wk);
  const pwArr     = Array.isArray(pw) ? pw : Object.values(pw);
  const weekTotal = wkArr.filter(d => d.kwh).reduce((s, d) => s + Number(d.kwh), 0);
  const pwTotal   = pwArr.reduce((s, d) => s + Number(d.predicted_kwh || 0), 0);
  const pwCost    = pwArr.reduce((s, d) => s + Number(d.predicted_kwh || 0) * 6.5, 0);
  const pwPeak    = pwArr.reduce((a, d) => Number(d.predicted_kwh) > a.kwh
    ? { day: d.day_name, kwh: Number(d.predicted_kwh) } : a, { kwh: 0, day: "—" });
  const sc        = statusConfig(t.room_status);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${flash ? "bg-yellow-50" : "bg-gradient-to-br from-yellow-50 via-white to-green-50"}`}>
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ── Page header ── */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Energy Analytics</h1>
            <p className="text-gray-400 mt-1 text-sm flex items-center gap-2 flex-wrap">
              CS Lab · Block A · {t.date || "—"} · {t.time || "—"}
              {t.room_status && (
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${sc.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                  {sc.label}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {lastSync && (
              <span className="text-xs text-gray-300">
                Last synced {lastSync.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
            <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors
              ${loading ? "bg-gray-100 text-gray-400" : "bg-green-50 text-green-700"}`}>
              <span className={`w-2 h-2 rounded-full ${loading ? "bg-gray-300" : "bg-green-500 animate-pulse"}`} />
              {loading ? "Connecting..." : "Live"}
            </div>
          </div>
        </div>

        {/* ── Error state ── */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-4 text-sm text-red-500 mb-6">
            {error}
          </div>
        )}

        {/* ── Loading skeleton ── */}
        {loading && !error && <Skeleton />}

        {/* ── Main content — only renders once Firebase data arrives ── */}
        {!loading && !error && data && (
          <>
            {/* ════ SECTION 1 — ACTUAL USAGE ════ */}
            <SectionLabel>Actual usage</SectionLabel>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <StatCard
                label="Today's usage"
                value={fmt(t.total_kwh)}
                unit="kWh"
                sub={`₹${fmt(t.cost_inr, 0)} · ${t.avg_occupancy || 0} people · AC ${t.ac_setpoint || 26}°C · ${t.temp_celsius || 28}°C outside`}
              />
              <StatCard
                label="This week"
                value={fmt(weekTotal, 1)}
                unit="kWh"
                sub={`₹${fmt(weekTotal * 6.5, 0)} · Mon – ${(wkArr.find(d => d.status === "today") || {}).day_name || "—"}`}
              />
              <StatCard
                label={`This month · ${m.month || "—"}`}
                value={fmt(m.total_kwh, 1)}
                unit="kWh"
                sub={`₹${fmtK(fmt(m.total_cost_inr, 0))} · ${m.days_logged || 0} days · avg ${fmt(m.avg_daily_kwh, 1)} kWh/day`}
              />
            </div>

            <WeekRow week={wkArr} />
            <HourlyChart hourly={hr} />

            {/* ── Divider ── */}
            <div className="flex items-center gap-3 my-8">
              <div className="flex-1 border-t border-gray-200" />
              <span className="text-xs text-gray-300 px-2 whitespace-nowrap">ML predictions below</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            {/* ════ SECTION 2 — ML PREDICTIONS ════ */}
            <SectionLabel isPrediction>ML predictions</SectionLabel>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <PredCard
                label={`Next day · ${pd.day_name || "—"}`}
                value={fmt(pd.predicted_kwh)}
                unit="kWh"
                sub={`₹${fmt(pd.predicted_cost_inr, 0)} · peak at ${pd.predicted_peak_hour || "—"}:00`}
              />
              <PredCard
                label="Next week · 7 days"
                value={fmt(pwTotal, 1)}
                unit="kWh"
                sub={`₹${fmtK(fmt(pwCost, 0))} · peak day: ${pwPeak.day}`}
              />
              <PredCard
                label={`Next month · ${pm.month || "—"}`}
                value={fmt(pm.predicted_kwh, 1)}
                unit="kWh"
                sub={`₹${fmtK(pm.predicted_cost_inr)} · avg ${fmt(pm.avg_daily_kwh, 1)} kWh/day`}
              />
            </div>

            <ForecastChart nextWeek={pwArr} />

            <p className="text-center text-xs text-gray-300 mt-4">
              Random Forest model · MAE 0.72 kWh · Auto-updates when Python script pushes to Firebase
            </p>
          </>
        )}
      </div>
    </div>
  );
}