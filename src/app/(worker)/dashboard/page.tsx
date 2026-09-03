import Link from "next/link";
import {
  User,
  Wallet,
  CreditCard,
  Smartphone,
  ArrowLeftRight,
  DollarSign,
  Plus,
  Minus,
  Receipt,
  ShoppingBag,
  TrendingUp,
  PiggyBank,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  Lock,
  ArrowUpRight,
  ArrowDownLeft,
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
  const netBalance = a.totalIncome - a.totalExpense;

  return (
    <div className="space-y-7">
      {/* ------------------------------------------------------------------ */}
      {/* 1. TOP APP BAR & HEADER BALANCE (Matching Reference Mockup Top Header) */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <span className="flex size-10.5 items-center justify-center rounded-full bg-sky-500 text-white shadow-md shadow-sky-500/20 font-bold">
            <User className="size-5" />
          </span>
          <div>
            <p className="font-mono text-xs font-semibold text-slate-400">Total Net Balance</p>
            <p className="font-display text-xl font-black text-slate-900">
              {formatINR(netBalance)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/connect"
            className="flex size-10 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm border border-slate-200/80 hover:bg-slate-50 transition"
          >
            <Wallet className="size-4.5" />
          </Link>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. 4 VIBRANT CIRCLE QUICK-ACTION BUTTONS (Matching Reference Mockup) */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-4 gap-3 text-center sm:gap-6">
        <Link href="/cash-income" className="group flex flex-col items-center gap-2">
          <span className="flex size-14 items-center justify-center rounded-full bg-[#10b981] text-white shadow-lg shadow-emerald-500/25 transition-transform group-hover:scale-105">
            <ArrowDownLeft className="size-6" />
          </span>
          <span className="text-[11.5px] font-semibold text-slate-700 leading-tight">
            Top-Up Payment
          </span>
        </Link>
        <Link href="/transactions" className="group flex flex-col items-center gap-2">
          <span className="flex size-14 items-center justify-center rounded-full bg-[#ff6b6b] text-white shadow-lg shadow-rose-500/25 transition-transform group-hover:scale-105">
            <Smartphone className="size-6" />
          </span>
          <span className="text-[11.5px] font-semibold text-slate-700 leading-tight">
            Mobile Payment
          </span>
        </Link>
        <Link href="/savings" className="group flex flex-col items-center gap-2">
          <span className="flex size-14 items-center justify-center rounded-full bg-[#3b82f6] text-white shadow-lg shadow-blue-500/25 transition-transform group-hover:scale-105">
            <ArrowLeftRight className="size-6" />
          </span>
          <span className="text-[11.5px] font-semibold text-slate-700 leading-tight">
            Money Transfer
          </span>
        </Link>
        <Link href="/connect" className="group flex flex-col items-center gap-2">
          <span className="flex size-14 items-center justify-center rounded-full bg-[#eab308] text-white shadow-lg shadow-yellow-500/25 transition-transform group-hover:scale-105">
            <DollarSign className="size-6" />
          </span>
          <span className="text-[11.5px] font-semibold text-slate-700 leading-tight">
            Make a Payment
          </span>
        </Link>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. VIRTUAL CARDS PREVIEW SECTION (Matching "Cards" in Mockup) */}
      {/* ------------------------------------------------------------------ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-display text-base font-bold text-slate-900">Cards</h3>
        </div>
        <div className="grid gap-3.5 sm:grid-cols-2">
          {/* Card 1: Primary Gig Earnings Wallet Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 p-5 text-white shadow-lg shadow-indigo-500/20">
            <div className="flex items-center justify-between">
              <span className="font-display text-xs font-black tracking-widest text-violet-200">
                VISA
              </span>
              <span className="font-mono text-xs font-medium text-violet-200">
                •••• •••• •••• 7895
              </span>
            </div>
            <div className="mt-4">
              <p className="font-display text-xl font-extrabold tracking-tight">
                {formatINR(a.totalIncome)}
              </p>
              <p className="text-[10.5px] font-medium text-violet-200 uppercase tracking-wider">
                Gig Earnings Account · Verified
              </p>
            </div>
          </div>

          {/* Card 2: Emergency & Savings Virtual Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 p-5 text-white shadow-lg shadow-rose-500/20">
            <div className="flex items-center justify-between">
              <span className="font-display text-xs font-black tracking-widest text-rose-100">
                Mastercard
              </span>
              <span className="font-mono text-xs font-medium text-rose-100">
                •••• •••• •••• 8456
              </span>
            </div>
            <div className="mt-4">
              <p className="font-display text-xl font-extrabold tracking-tight">
                {formatINR(a.currentSavings)}
              </p>
              <p className="text-[10.5px] font-medium text-rose-100 uppercase tracking-wider">
                Emergency Savings Fund
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 4. LATEST TRANSACTIONS (Matching "Latest transactions" in Mockup) */}
      {/* ------------------------------------------------------------------ */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-slate-900">
            Latest transactions
          </h3>
          <Link
            href="/transactions"
            className="text-xs font-bold text-rose-500 hover:text-rose-600 transition"
          >
            View all
          </Link>
        </div>

        <div className="space-y-2.5">
          {recentTxs.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 transition hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex size-10 items-center justify-center rounded-2xl ${
                    tx.type === "credit"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-sky-100 text-sky-600"
                  }`}
                >
                  {tx.type === "credit" ? (
                    <ArrowDownLeft className="size-5" />
                  ) : (
                    <ArrowLeftRight className="size-5" />
                  )}
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900">{tx.description}</p>
                  <p className="text-[11px] font-medium text-slate-400">
                    {formatDate(tx.date)} · {tx.category}
                  </p>
                </div>
              </div>
              <span
                className={`font-display text-sm font-bold ${
                  tx.type === "credit" ? "text-[#10b981]" : "text-slate-900"
                }`}
              >
                {tx.type === "credit" ? "+ " : "- "}
                {formatINR(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* 5. DEPOSITS SECTION (Matching "Deposits" & "Current deposits" in Mockup) */}
      {/* ------------------------------------------------------------------ */}
      <div className="space-y-3">
        <h3 className="font-display text-xl font-bold text-slate-900 px-1">Deposits</h3>
        <p className="text-xs text-slate-500 font-medium px-1 -mt-2">Current deposits</p>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Deposit 1 */}
          <Card className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-2xl font-black text-slate-900">
                  {formatINR(300000)}
                </p>
                <p className="text-[11px] font-medium text-slate-400">
                  Sep 1 - Mar 1, 2026
                </p>
              </div>
              <div className="text-right">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                  8%
                </span>
                <p className="mt-1 text-xs font-bold text-[#10b981]">+ {formatINR(6057)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <Link
                href="/savings"
                className="flex items-center justify-center rounded-2xl bg-[#38bdf8] py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-95 transition"
              >
                Top-Up
              </Link>
              <Link
                href="/savings"
                className="flex items-center justify-center rounded-2xl bg-[#10b981] py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-95 transition"
              >
                Withdrawal
              </Link>
            </div>
          </Card>

          {/* Deposit 2 */}
          <Card className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-2xl font-black text-slate-900">
                  {formatINR(150000)}
                </p>
                <p className="text-[11px] font-medium text-slate-400">
                  Sep 1, 2025 - Sep 1, 2026
                </p>
              </div>
              <div className="text-right">
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                  10%
                </span>
                <p className="mt-1 text-xs font-bold text-[#10b981]">+ {formatINR(15000)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <Link
                href="/savings"
                className="flex items-center justify-center rounded-2xl bg-[#ff6b6b] py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-95 transition"
              >
                Extend
              </Link>
              <Link
                href="/savings"
                className="flex items-center justify-center rounded-2xl bg-[#10b981] py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-95 transition"
              >
                Withdrawal
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 6. CURRENT MONEYBOXES (Matching "Current moneyboxes" in Mockup) */}
      {/* ------------------------------------------------------------------ */}
      <div className="space-y-3">
        <p className="text-xs text-slate-500 font-medium px-1">Current moneyboxes</p>
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <PiggyBank className="size-5" />
              </span>
              <p className="text-sm font-bold text-slate-900">Emergency & Equipment Vault</p>
            </div>
            <p className="font-display text-lg font-black text-slate-900">
              {formatINR(120000)}
            </p>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Saved so far</span>
              <span>{formatINR(65027)}</span>
            </div>
            <Progress value={54} tone="indigo" />
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <Link
              href="/savings"
              className="flex items-center justify-center rounded-2xl bg-[#38bdf8] py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-95 transition"
            >
              Top-Up
            </Link>
            <Link
              href="/savings"
              className="flex items-center justify-center rounded-2xl bg-[#10b981] py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-95 transition"
            >
              Withdrawal
            </Link>
          </div>
        </Card>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 7. FINANCIAL RESILIENCE SCORE METER */}
      {/* ------------------------------------------------------------------ */}
      <Card className="overflow-hidden !p-0">
        <div className="grid md:grid-cols-[280px_1fr]">
          <div className="flex flex-col items-center justify-center bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200/80 px-8 py-8 text-center">
            <p className="text-[11px] font-bold tracking-[0.16em] text-sky-600 uppercase">
              Financial Resilience Score
            </p>
            <div className="mt-4">
              <ScoreRing score={a.resilience.score} max={900} size={180} />
            </div>
            <p className="mt-3.5 text-sm font-bold text-sky-700">{a.resilience.band}</p>
            <p className="mt-1 max-w-48 text-[11px] leading-relaxed text-slate-500 font-medium">
              Prototype indicator based on your available data
            </p>
          </div>
          <div className="p-7">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-[16px] font-bold text-slate-900">
                Why this score
              </h3>
              <span className="rounded-full bg-sky-50 border border-sky-100 px-3 py-1 text-[10.5px] font-bold tracking-wide text-sky-700 uppercase">
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
                    <span className="font-extrabold text-sky-600">{f.value}/100</span>
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

      {/* ------------------------------------------------------------------ */}
      {/* 8. INCOME VS EXPENSES & CATEGORY BREAKDOWN */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader
            title="Expenses by Category"
            subtitle="Monthly breakdown of spend categories"
          />
          <div className="mt-2">
            <ExpenseDonut
              data={
                a.categoryBreakdown.length > 0
                  ? a.categoryBreakdown
                  : [
                      { name: "Groceries", value: 12214 },
                      { name: "Fuel & Transport", value: 3000 },
                      { name: "EMI Repayment", value: 1850 },
                      { name: "Savings", value: 2500 },
                    ]
              }
            />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Income vs Expenses (6 Months)"
            subtitle={`Income variability (CV): ${(a.cv * 100).toFixed(0)}%`}
          />
          <IncomeExpenseArea data={a.monthly} />
        </Card>
      </div>

      <PrototypeNote />
    </div>
  );
}
