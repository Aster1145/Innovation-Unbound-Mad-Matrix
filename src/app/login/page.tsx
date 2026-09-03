import Link from "next/link";
import { Landmark, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/actions";

const DEMO_ACCOUNTS = [
  { role: "Worker", email: "ravi@demo.com" },
  { role: "Worker 2", email: "meena@demo.com" },
  { role: "Employer", email: "employer@demo.com" },
  { role: "Partner Bank", email: "bank@demo.com" },
];

export default function LoginPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
      {/* Brand panel */}
      <div className="hero-mesh relative hidden flex-col justify-between bg-slate-950 p-10 lg:flex">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20">
            <Landmark className="size-5" />
          </span>
          <span className="font-display text-[16px] font-bold tracking-tight text-white">
            Gig FinancialBridge
          </span>
        </Link>
        <div>
          <h1 className="font-display text-4xl leading-[1.08] font-bold tracking-tight text-white">
            Your income may be informal.{" "}
            <span className="text-gradient">Your financial identity shouldn&rsquo;t be invisible.</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-indigo-200">
            Sign in to explore the worker, employer and partner-bank experiences with
            fully synthetic demo data.
          </p>
        </div>
        <div className="rounded-3xl border border-white/15 bg-white/5 p-5 backdrop-blur-xl">
          <p className="text-[11px] font-bold tracking-[0.16em] text-indigo-200 uppercase">
            Demo accounts · password <span className="text-indigo-300">demo123</span>
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((a) => (
              <div key={a.email} className="rounded-2xl bg-white/10 px-3.5 py-2.5 backdrop-blur-md border border-white/10">
                <p className="text-[11px] font-bold text-slate-200">{a.role}</p>
                <p className="font-mono text-[11.5px] font-bold text-indigo-300">{a.email}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-slate-50 px-5 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white">
              <Landmark className="size-4.5" />
            </span>
            <span className="font-display text-sm font-bold text-slate-900">Gig FinancialBridge</span>
          </Link>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Sign in to your FinancialBridge account.
          </p>
          <div className="card mt-6 p-7 border-slate-200/80 shadow-md">
            <LoginForm />
          </div>
          <p className="mt-5 text-center text-sm text-slate-500 font-medium">
            New here?{" "}
            <Link href="/register" className="font-bold text-indigo-600 hover:text-indigo-700">
              Create an account
            </Link>
          </p>
          <p className="mt-6 flex items-start justify-center gap-1.5 text-center text-[11.5px] leading-relaxed text-slate-400 font-medium">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-indigo-500" />
            This prototype never asks for real banking passwords, PINs or OTPs.
          </p>
        </div>
      </div>
    </div>
  );
}


