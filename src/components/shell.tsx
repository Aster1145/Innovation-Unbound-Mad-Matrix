"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Landmark, LogOut, Menu, X, Home, ArrowLeftRight, PieChart, User } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

export function AppShell({
  userName,
  roleLabel,
  nav,
  children,
}: {
  userName: string;
  roleLabel: string;
  nav: NavItem[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const primary = nav.slice(0, 4);

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-800">
      {/* ------- Desktop sidebar ------- */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200/80 bg-white/95 backdrop-blur-xl md:flex shadow-sm">
        <Link href="/" className="flex items-center gap-2.5 px-5 pt-6 pb-7">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200">
            <Landmark className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[16px] font-bold tracking-tight text-slate-900">
              FinancialBridge
            </span>
            <span className="block text-[10.5px] font-bold tracking-[0.14em] text-indigo-600 uppercase">
              {roleLabel}
            </span>
          </span>
        </Link>
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-3.5 pb-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition-all ${
                isActive(item.href)
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "text-slate-600 hover:bg-indigo-50/70 hover:text-indigo-950"
              }`}
            >
              <span
                className={`[&>svg]:size-[19px] ${
                  isActive(item.href) ? "text-white" : "text-slate-400"
                }`}
              >
                {item.icon}
              </span>
              {item.label}
              {isActive(item.href) && (
                <span className="ml-auto size-2 rounded-full bg-white opacity-80" />
              )}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-2.5 border border-slate-200/60">
            <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 font-display text-xs font-bold text-white shadow-sm">
              {userName
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-900">{userName}</p>
              <p className="text-[10px] font-medium text-indigo-600">{roleLabel}</p>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ------- Mobile top bar ------- */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-xl md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8.5 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-sm">
            <Landmark className="size-4" />
          </span>
          <span className="font-display text-sm font-bold tracking-tight text-slate-900">
            FinancialBridge
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-[11px] font-bold text-indigo-700">
            {userName.split(" ")[0]}
          </span>
          <button
            onClick={() => setMenuOpen(true)}
            className="rounded-xl bg-slate-100 p-2 text-slate-700 hover:bg-slate-200"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      {/* ------- Mobile slide-over menu ------- */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-72 flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-indigo-600 font-display text-xs font-bold text-white">
                  {userName
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div>
                  <p className="font-display text-sm font-bold text-slate-900">{userName}</p>
                  <p className="text-[11px] font-medium text-indigo-600">{roleLabel}</p>
                </div>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1.5 overflow-y-auto p-3.5">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold ${
                    isActive(item.href)
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-indigo-50"
                  }`}
                >
                  <span
                    className={`[&>svg]:size-[19px] ${
                      isActive(item.href) ? "text-white" : "text-slate-400"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-slate-100 p-3.5">
              <button
                onClick={logout}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-100"
              >
                <LogOut className="size-4" /> Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------- Content ------- */}
      <main className="px-4 pt-5 pb-32 sm:px-6 md:pl-72 md:pr-8 md:pt-7 md:pb-12 lg:pr-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>

      {/* ------- Mobile bottom floating pill navigation bar ------- */}
      <div className="fixed inset-x-0 bottom-4 z-40 px-4 md:hidden">
        <nav className="mx-auto flex max-w-md items-center justify-around rounded-full border border-slate-200/90 bg-white/95 px-3 py-2.5 shadow-xl shadow-slate-900/10 backdrop-blur-xl">
          {primary.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 rounded-full px-3 py-1.5 transition-all ${
                  active
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-indigo-600"
                }`}
              >
                <span className="[&>svg]:size-4.5">{item.icon}</span>
                <span className="text-[10px] font-bold tracking-tight">
                  {item.label.split(" ")[0]}
                </span>
              </Link>
            );
          })}
          <button
            onClick={() => setMenuOpen(true)}
            className={`flex flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-slate-500 transition-all hover:text-indigo-600 ${
              menuOpen ? "bg-indigo-600 text-white" : ""
            }`}
          >
            <Menu className="size-4.5" />
            <span className="text-[10px] font-bold tracking-tight">More</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

