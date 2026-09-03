import type { ReactNode } from "react";
import Link from "next/link";
import { ShieldAlert, Info } from "lucide-react";

/* ------------------------------ Cards ------------------------------ */

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={`card p-6 ${className}`}>{children}</div>;
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div>
        <h3 className="font-display text-[16px] font-bold tracking-tight text-slate-900">
          {title}
        </h3>
        {subtitle && <p className="mt-0.5 text-xs font-medium text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ------------------------------ Typography ------------------------------ */

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500 font-medium">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/* ------------------------------ Stats ------------------------------ */

export function Stat({
  label,
  value,
  sub,
  icon,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: ReactNode;
  tone?: "default" | "good" | "warn" | "bad";
}) {
  const toneText =
    tone === "good"
      ? "text-emerald-600"
      : tone === "warn"
        ? "text-amber-600"
        : tone === "bad"
          ? "text-rose-600"
          : "text-slate-900";
  return (
    <div className="card p-5 transition-all hover:border-indigo-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold tracking-[0.08em] text-slate-400 uppercase">
          {label}
        </p>
        {icon && <span className="text-indigo-500">{icon}</span>}
      </div>
      <p className={`mt-2 font-display text-xl font-extrabold tracking-tight sm:text-2xl ${toneText}`}>
        {value}
      </p>
      {sub && <p className="mt-1 text-xs leading-snug font-medium text-slate-500">{sub}</p>}
    </div>
  );
}

/* ------------------------------ Badges ------------------------------ */

const badgeTones: Record<string, string> = {
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  amber: "bg-amber-50 text-amber-700 ring-amber-600/25",
  rose: "bg-rose-50 text-rose-700 ring-rose-600/20",
  slate: "bg-slate-100 text-slate-700 ring-slate-500/20",
  sky: "bg-sky-50 text-sky-700 ring-sky-600/20",
  indigo: "bg-indigo-50 text-indigo-700 ring-indigo-600/20 border border-indigo-100",
  purple: "bg-purple-50 text-purple-700 ring-purple-600/20 border border-purple-100",
};

export function Badge({
  tone = "indigo",
  children,
  dot = true,
}: {
  tone?: keyof typeof badgeTones;
  children: ReactNode;
  dot?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ring-1 ring-inset ${badgeTones[tone]}`}
    >
      {dot && <span className="size-1.5 rounded-full bg-current opacity-80" />}
      {children}
    </span>
  );
}

export function VerificationBadge({ status }: { status: string }) {
  if (status === "verified") return <Badge tone="emerald">Verified</Badge>;
  if (status === "rejected") return <Badge tone="rose">Rejected</Badge>;
  return <Badge tone="amber">Unverified</Badge>;
}

export function ConfidenceBadge({ band }: { band: string }) {
  if (band === "high") return <Badge tone="emerald">High confidence</Badge>;
  if (band === "medium") return <Badge tone="amber">Medium confidence</Badge>;
  return <Badge tone="rose">Low confidence</Badge>;
}

/* ------------------------------ Progress ------------------------------ */

export function Progress({
  value,
  tone = "indigo",
  className = "",
}: {
  value: number; // 0-100
  tone?: "indigo" | "purple" | "emerald" | "amber" | "rose" | "sky";
  className?: string;
}) {
  const bar =
    tone === "indigo"
      ? "from-indigo-600 via-indigo-500 to-violet-500"
      : tone === "purple"
        ? "from-violet-600 to-purple-500"
        : tone === "emerald"
          ? "from-emerald-500 to-teal-400"
          : tone === "amber"
            ? "from-amber-500 to-orange-400"
            : tone === "rose"
              ? "from-rose-500 to-orange-400"
              : "from-sky-500 to-cyan-400";
  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full bg-slate-100 ${className}`}>
      <div
        className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${bar}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

/* ------------------------------ Score ring ------------------------------ */

export function ScoreRing({
  score,
  max = 900,
  size = 190,
  stroke = 14,
  dark = false,
}: {
  score: number;
  max?: number;
  size?: number;
  stroke?: number;
  dark?: boolean;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(1, score / max) : 0;
  const id = `sr-${size}-${dark ? "d" : "l"}`;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={dark ? "rgba(255,255,255,0.12)" : "#e2e8f0"}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`font-display font-black tracking-tight ${
            dark ? "text-white" : "text-slate-900"
          }`}
          style={{ fontSize: size * 0.22 }}
        >
          {score}
        </span>
        <span
          className={`text-xs font-bold ${dark ? "text-indigo-200" : "text-indigo-600"}`}
        >
          out of {max}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------ Disclaimers ------------------------------ */

export function PrototypeNote({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex gap-3.5 rounded-2xl border border-indigo-200/80 bg-indigo-50/70 ${
        compact ? "p-3.5" : "p-4.5"
      }`}
    >
      <ShieldAlert className="mt-0.5 size-4.5 shrink-0 text-indigo-600" />
      <p className="text-xs leading-relaxed text-indigo-950 font-medium">
        <span className="font-bold">Prototype indicator — not a credit score.</span>{" "}
        The Financial Resilience Score is a hackathon prototype. It is{" "}
        <span className="font-bold">not a CIBIL score</span> and not issued by any
        credit bureau. It must never be treated as a guarantee of loan approval.
      </p>
    </div>
  );
}

export function InfoNote({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3.5 rounded-2xl border border-indigo-200/80 bg-indigo-50/80 p-4.5">
      <Info className="mt-0.5 size-4.5 shrink-0 text-indigo-600" />
      <p className="text-xs leading-relaxed text-indigo-950 font-medium">{children}</p>
    </div>
  );
}

/* ------------------------------ Empty state ------------------------------ */

export function EmptyState({
  icon,
  title,
  body,
  actionHref,
  actionLabel,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
        {icon}
      </div>
      <h3 className="mt-4 font-display text-base font-bold text-slate-900">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-slate-500 font-medium">{body}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-6 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

/* ------------------------------ Buttons ------------------------------ */

export function LinkButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
}) {
  const cls =
    variant === "primary"
      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700"
      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50";
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-2xl px-4.5 py-2.5 text-sm font-bold transition ${cls}`}
    >
      {children}
    </Link>
  );
}

/* ------------------------------ Tables ------------------------------ */

export function Th({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <th
      className={`px-4.5 py-3 text-left text-[11px] font-bold tracking-[0.08em] whitespace-nowrap text-slate-400 uppercase ${className}`}
    >
      {children}
    </th>
  );
}

export function Td({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return <td className={`px-4.5 py-3.5 text-sm font-medium text-slate-700 ${className}`}>{children}</td>;
}


