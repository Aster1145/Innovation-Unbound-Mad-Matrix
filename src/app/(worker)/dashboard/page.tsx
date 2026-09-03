import Link from "next/link";
import {
  TrendingUp,
  Wallet,
  PiggyBank,
  Sparkles,
  Link2,
  Banknote,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowRight,
  BadgeCheck,
  PlusCircle,
  MinusCircle,
  ArrowLeftRight,
  QrCode,
  Bell,
  Calendar,
  Receipt,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import { buildWorkerAnalytics } from "@/lib/data";
import { generateInsights } from "@/lib/insights";
import { formatINR, WORKER_TYPES, formatDate } from "@/lib/format";
import {
  Card,
  CardHeader,
  Stat,
  Progress,
  ScoreRing,
  PrototypeNote,
  EmptyState,
  Badge,
  ConfidenceBadge,
} from "@/components/ui";
import { IncomeExpenseArea, ExpenseDonut } from "@/components/charts";

export default async function WorkerDashboard() {
  const user = await requireUser("worker");
  const a = await buildWorkerAnalytics(user.id);

  if (!a.hasData) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
          Namaste, {user.name.split(" ")[0]}
        </h1>
        <EmptyState
          icon={<Wallet className="size-6" />}
          title="Let's build your financial identity"
          body="Connect a demo financial account to import your transaction history, or record your first cash income. Your Financial Resilience Score will appear here once data is available."
          actionHref="/connect"
          actionLabel="Connect a demo account"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/cash-income" className="card flex items-center gap-3 p-4 transition hover:border-indigo-300">
            <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Banknote className="size-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-slate-900">Record cash income</span>
              <span className="block text-xs text-slate-500">Log a daily wage in seconds</span>
            </span>
          </Link>
          <Link href="/settings" className="card flex items-center gap-3 p-4 transition hover:border-indigo-300">
            <span className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <BadgeCheck className="size-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-slate-900">Complete your profile</span>
              <span className="block text-xs text-slate-500">Work type, city, history</span>
            </span>
          </Link>
        </div>
      </div>
    );
  }

  const insights = generateInsights({
    monthlyIncome: a.monthly.map((m) => ({ key: m.key, total: m.income })),
    monthlyExpense: a.monthly.map((m) => ({ key: m.key, total: m.expense })),
    savingsRate: a.savingsRate,
    unverifiedCount: a.income.filter((i) => i.status === "unverified").length,
    verifiedCount: a.income.filter((i) => i.status === "verified").length,
    emergencyProgress: a.emergencyTarget > 0 ? a.currentSavings / a.emergencyTarget : 0,
    incomeConfidence: a.confidence.score,
    lastMonthIncome: a.monthly.at(-1)?.income ?? 0,
    avgIncome: a.avgIncome,
  }).slice(0, 3);

  const unverified = a.income.filter((i) => i.status === "unverified");
  const recentTxs = a.txs.slice(0, 5);
  const lastMonth = a.monthly.at(-1);

  return (
    <div className="space-y-7">
      {/* Top Mobile/App Bar Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-7 sm:p-9 text-white shadow-xl shadow-indigo-950/20">
        <div className="absolute top-0 right-0 size-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex size-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-display font-bold text-base shadow-sm">
                {user.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="text-xs font-bold text-indigo-200">Namaste, {user.name.split(" ")[0]}</p>
                <p className="text-[12px] font-medium text-slate-400">{WORKER_TYPES[a.profile?.workerType ?? "gig"]}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/15 shadow-sm">
                <Calendar className="size-3.5" /> August ▾
              </span>
              <button className="flex size-9.5 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white hover:bg-white/20 transition">
                <Bell className="size-4.5" />
              </button>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-300">Total Balance</p>
            <h2 className="mt-1 font-display text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              {formatINR(a.totalIncome - a.totalExpense)}
            </h2>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/10 p-4.5 backdrop-blur-md border border-white/15">
              <p className="text-xs font-bold text-indigo-200">Income</p>
              <p className="mt-1 font-display text-xl font-bold text-emerald-400">
                +{formatINR(lastMonth?.income ?? a.avgIncome)}
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4.5 backdrop-blur-md border border-white/15">
              <p className="text-xs font-bold text-indigo-200">Expenses</p>
              <p className="mt-1 font-display text-xl font-bold text-rose-400">
                -{formatINR(lastMonth?.expense ?? a.avgExpense)}
              </p>
            </div>
          </div>

          {/* Quick Action Pill Buttons */}
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 text-center">
            <Link href="/cash-income" className="flex flex-col items-center justify-center rounded-2xl bg-white/10 py-3.5 px-3 backdrop-blur-md border border-white/15 transition-all hover:bg-white/20 hover:scale-[1.02] shadow-sm">
              <PlusCircle className="size-5 text-white" />
              <span className="mt-1.5 text-xs font-bold text-white">Add Income</span>
            </Link>
            <Link href="/transactions" className="flex flex-col items-center justify-center rounded-2xl bg-white/10 py-3.5 px-3 backdrop-blur-md border border-white/15 transition-all hover:bg-white/20 hover:scale-[1.02] shadow-sm">
              <MinusCircle className="size-5 text-white" />
              <span className="mt-1.5 text-xs font-bold text-white">Add Expense</span>
            </Link>
            <Link href="/savings" className="flex flex-col items-center justify-center rounded-2xl bg-white/10 py-3.5 px-3 backdrop-blur-md border border-white/15 transition-all hover:bg-white/20 hover:scale-[1.02] shadow-sm">
              <ArrowLeftRight className="size-5 text-white" />
              <span className="mt-1.5 text-xs font-bold text-white">Transfer</span>
            </Link>
            <Link href="/connect" className="flex flex-col items-center justify-center rounded-2xl bg-white/10 py-3.5 px-3 backdrop-blur-md border border-white/15 transition-all hover:bg-white/20 hover:scale-[1.02] shadow-sm">
              <QrCode className="size-5 text-white" />
              <span className="mt-1.5 text-xs font-bold text-white">Scan Receipt</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Unverified nudge */}
      {unverified.length > 0 && (
        <div className="flex items-start gap-4 rounded-3xl border border-amber-200/90 bg-amber-50/80 p-5 shadow-sm">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900">
              {unverified.length} income record{unverified.length > 1 ? "s" : ""} awaiting verification
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-600 font-medium">
              Self-reported income has low confidence. Ask your employer to confirm it on
              FinancialBridge to raise your Income Confidence Score.
            </p>
          </div>
          <Link href="/income" className="shrink-0 rounded-2xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700">
            Review
          </Link>
        </div>
      )}

      {/* Cohesive Score Hero */}
      <Card className="overflow-hidden !p-0">
        <div className="grid md:grid-cols-[280px_1fr]">
          <div className="flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 via-indigo-50/40 to-slate-50 border-b md:border-b-0 md:border-r border-slate-200/80 px-8 py-8 text-center">
            <p className="text-[11px] font-bold tracking-[0.16em] text-indigo-600 uppercase">
              Financial Resilience Score
            </p>
            <div className="mt-4">
              <ScoreRing score={a.resilience.score} max={900} size={180} />
            </div>
            <p className="mt-3.5 text-sm font-bold text-indigo-700">{a.resilience.band}</p>
            <p className="mt-1 max-w-48 text-[11px] leading-relaxed text-slate-500 font-medium">
              Prototype indicator based on your available data
            </p>
          </div>
          <div className="p-7">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-[16px] font-bold text-slate-900">
                Why this score
              </h3>
              <span className="rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-[10.5px] font-bold tracking-wide text-indigo-700 uppercase">
                Transparent model
              </span>
            </div>
            <div className="mt-5 space-y-4">
              {a.resilience.factors.map((f) => (
                <div key={f.key}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">
                      {f.label}
                      <span className="ml-1.5 text-[10px] font-semibold text-slate-400">
                        {Math.round(f.weight * 100)}%
                      </span>
                    </span>
                    <span className="font-extrabold text-indigo-600">{f.value}/100</span>
                  </div>
                  <Progress
                    value={f.value}
                    tone={f.value >= 75 ? "indigo" : f.value >= 55 ? "amber" : "rose"}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Category breakdown + Income Confidence */}
      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader
            title="Expenses by Category"
            subtitle="Monthly breakdown of essential vs non-essential spend"
          />
          <div className="mt-2">
            <ExpenseDonut data={a.categoryBreakdown.length > 0 ? a.categoryBreakdown : [
              { name: "Salary", value: 12214 },
              { name: "Freelancing", value: 300 },
              { name: "Investment", value: 1500 },
              { name: "Farming", value: 800 },
              { name: "Rental", value: 2000 },
            ]} />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            {a.categoryBreakdown.map((cat) => (
              <span key={cat.name} className="rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-[11px] font-bold text-indigo-700">
                {cat.name}: {formatINR(cat.value)}
              </span>
            ))}
          </div>
        </Card>

        {/* Confidence & Adaptive Savings Tips */}
        <div className="space-y-4">
          <Card className="flex items-center gap-5">
            <div className="relative flex size-20 shrink-0 items-center justify-center">
              <svg viewBox="0 0 80 80" className="size-20 -rotate-90">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                <circle
                  cx="40" cy="40" r="34" fill="none"
                  stroke={a.confidence.score >= 85 ? "#6366f1" : a.confidence.score >= 60 ? "#f59e0b" : "#f43f5e"}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={2 * Math.PI * 34 * (1 - a.confidence.score / 100)}
                />
              </svg>
              <span className="absolute font-display text-lg font-bold text-slate-900">
                {a.confidence.score}%
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-[0.06em] text-slate-400 uppercase">
                Income Confidence
              </p>
              <div className="mt-1"><ConfidenceBadge band={a.confidence.band} /></div>
              <Link href="/income" className="mt-2 inline-flex items-center gap-1 text-[11.5px] font-bold text-indigo-600 hover:text-indigo-700">
                Why confidence score matters <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </Card>

          <Stat
            label="Avg. monthly income"
            value={formatINR(a.avgIncome)}
            sub={`Range ${formatINR(a.minIncome)} – ${formatINR(a.maxIncome)}`}
            icon={<TrendingUp className="size-5" />}
          />
          <Stat
            label="Current savings"
            value={formatINR(a.currentSavings)}
            sub={`Savings rate ${(a.savingsRate * 100).toFixed(1)}% of income`}
            icon={<PiggyBank className="size-5" />}
          />
        </div>
      </div>

      {/* Recent Transactions List */}
      <Card>
        <CardHeader
          title="Recent Transactions"
          subtitle="Consented imports & verified income entries"
          action={
            <Link href="/transactions" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700">
              View all <ArrowRight className="size-3.5" />
            </Link>
          }
        />
        <div className="divide-y divide-slate-100">
          {recentTxs.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3.5">
                <span className={`flex size-10.5 items-center justify-center rounded-2xl ${
                  tx.type === "credit" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600"
                }`}>
                  {tx.type === "credit" ? <PlusCircle className="size-5" /> : <Receipt className="size-5" />}
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900">{tx.description}</p>
                  <p className="text-xs font-medium text-slate-400">{formatDate(tx.date)} · {tx.category}</p>
                </div>
              </div>
              <span className={`font-display text-sm font-bold ${
                tx.type === "credit" ? "text-emerald-600" : "text-slate-900"
              }`}>
                {tx.type === "credit" ? "+" : "-"}{formatINR(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Income vs Expenses Chart */}
      <Card>
        <CardHeader
          title="Income vs Expenses — Last 6 Months"
          subtitle={`Income variability (CV): ${(a.cv * 100).toFixed(0)}% · Volatile but real earnings`}
        />
        <IncomeExpenseArea data={a.monthly} />
      </Card>

      {/* Insights preview */}
      <Card>
        <CardHeader
          title="AI Financial Insights"
          subtitle="Responsible, data-based observations — not guaranteed advice"
          action={
            <Link href="/insights" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700">
              View all <ArrowRight className="size-3.5" />
            </Link>
          }
        />
        <div className="grid gap-3.5 md:grid-cols-3">
          {insights.map((ins) => (
            <div
              key={ins.title}
              className={`rounded-2xl border p-4.5 ${
                ins.type === "warning"
                  ? "border-amber-200 bg-amber-50/80"
                  : ins.type === "positive"
                    ? "border-indigo-200 bg-indigo-50/80"
                    : "border-slate-200 bg-slate-50/80"
              }`}
            >
              <p className="flex items-center gap-2 text-[13.5px] font-bold text-slate-900">
                {ins.type === "warning" ? (
                  <AlertTriangle className="size-4.5 text-amber-600" />
                ) : ins.type === "positive" ? (
                  <CheckCircle2 className="size-4.5 text-indigo-600" />
                ) : (
                  <Info className="size-4.5 text-slate-600" />
                )}
                {ins.title}
              </p>
              <p className="mt-2 line-clamp-4 text-xs leading-relaxed font-medium text-slate-600">{ins.body}</p>
            </div>
          ))}
        </div>
      </Card>

      <PrototypeNote />
    </div>
  );
}


