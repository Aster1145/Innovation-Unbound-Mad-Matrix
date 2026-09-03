"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
  Legend,
} from "recharts";

const inrShort = (v: number) =>
  v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}k`;

const inrFull = (v: number) => `₹${Math.round(v).toLocaleString("en-IN")}`;

const tooltipStyle = {
  borderRadius: 14,
  border: "1px solid #e2e8f0",
  boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.08)",
  fontSize: 12,
  fontWeight: 600,
  padding: "10px 14px",
  backgroundColor: "#ffffff",
  color: "#0f172a",
};

export interface SeriesPoint {
  label: string;
  income: number;
  expense: number;
  savings: number;
}

export function IncomeExpenseArea({ data }: { data: SeriesPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="gi" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="ge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.22} />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={inrShort} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <Tooltip formatter={(v) => inrFull(Number(v))} contentStyle={tooltipStyle} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
        <Area name="Income" type="monotone" dataKey="income" stroke="#4f46e5" strokeWidth={2.8} fill="url(#gi)" />
        <Area name="Expenses" type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={2.2} fill="url(#ge)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function VolatilityBars({ data, avg }: { data: SeriesPoint[]; avg: number }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={inrShort} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <Tooltip formatter={(v) => inrFull(Number(v))} contentStyle={tooltipStyle} cursor={{ fill: "#eef2ff" }} />
        <ReferenceLine
          y={avg}
          stroke="#6366f1"
          strokeDasharray="5 4"
          label={{ value: `avg ${inrFull(avg)}`, position: "insideTopRight", fontSize: 10, fill: "#4f46e5", fontWeight: 700 }}
        />
        <Bar name="Monthly income" dataKey="income" radius={[8, 8, 0, 0]} maxBarSize={44}>
          {data.map((d, i) => (
            <Cell
              key={i}
              fill={d.income >= avg ? "#6366f1" : "#a5b4fc"}
              fillOpacity={0.9}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SavingsGrowth({ data }: { data: { label: string; saved: number; cumulative: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="gs" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={inrShort} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <Tooltip formatter={(v) => inrFull(Number(v))} contentStyle={tooltipStyle} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
        <Area name="Cumulative savings" type="monotone" dataKey="cumulative" stroke="#059669" strokeWidth={2.8} fill="url(#gs)" />
        <Bar name="Monthly deposit" dataKey="saved" fill="#a7f3d0" radius={[6, 6, 0, 0]} maxBarSize={26} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

const PIE_COLORS = ["#6366f1", "#10b981", "#f43f5e", "#f59e0b", "#8b5cf6", "#06b6d4", "#ec4899", "#3b82f6"];

export function ExpenseDonut({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={62}
          outerRadius={92}
          paddingAngle={3}
          strokeWidth={3}
          stroke="#fff"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => inrFull(Number(v))} contentStyle={tooltipStyle} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontWeight: 600 }} layout="vertical" align="right" verticalAlign="middle" />
      </PieChart>
    </ResponsiveContainer>
  );
}


