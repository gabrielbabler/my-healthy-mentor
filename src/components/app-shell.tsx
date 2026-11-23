"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  CalendarCheck,
  ClipboardList,
  MessageSquare,
  Moon,
  Send,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export interface AppShellMember {
  id: string;
  name: string;
  email: string;
  image: string | null;
  telegramChatId: string | null;
}

const NAV_ITEMS = [
  { href: "/hoje", label: "Hoje", icon: CalendarCheck },
  { href: "/planos", label: "Planos", icon: ClipboardList },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/evolucao", label: "Evolução", icon: Activity },
  { href: "/perfil", label: "Perfil", icon: User },
] as const;

export function AppShell({
  member,
  children,
}: {
  member: AppShellMember;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const isTelegramConnected = Boolean(member.telegramChatId);

  const activeNav =
    NAV_ITEMS.find((item) => pathname.startsWith(item.href)) ?? NAV_ITEMS[0];

  return (
    <div className="min-h-dvh bg-surface text-on-surface flex flex-col md:flex-row">
      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-surface-container-low border-r border-outline-variant/50 z-40">
        <div className="h-16 px-5 flex items-center gap-3 border-b border-outline-variant/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icon.svg"
            alt="My Healthy Mentor"
            className="w-8 h-8 rounded-lg flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-bold tracking-tight truncate">
              My Healthy Mentor
            </p>
            <p className="text-[11px] text-on-surface-variant uppercase tracking-wider">
              Coach Pessoal
            </p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-outline-variant/40 space-y-2">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container text-xs">
            <span className="flex items-center gap-2 text-on-surface-variant">
              <Send className="w-3.5 h-3.5 text-primary" />
              Telegram
            </span>
            <span
              className={cn(
                "font-semibold",
                isTelegramConnected ? "text-primary" : "text-tertiary"
              )}
            >
              {isTelegramConnected ? "Conectado" : "Pendente"}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            <span>Tema: {theme === "dark" ? "Escuro" : "Claro"}</span>
            {theme === "dark" ? (
              <Moon className="w-3.5 h-3.5" />
            ) : (
              <Sun className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Fixed Top Header */}
      <header className="md:hidden fixed top-0 inset-x-0 z-50 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/40 pt-safe">
        <div className="h-14 px-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icon.svg"
              alt="My Healthy Mentor"
              className="w-7 h-7 rounded-lg flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">
                My Healthy Mentor
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
                {activeNav.label}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/perfil"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-[11px] font-semibold"
              title={
                isTelegramConnected
                  ? "Telegram conectado"
                  : "Conectar Telegram em Perfil"
              }
            >
              <Send
                className={cn(
                  "w-3 h-3",
                  isTelegramConnected ? "text-primary" : "text-tertiary"
                )}
              />
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  isTelegramConnected
                    ? "bg-primary animate-pulse"
                    : "bg-tertiary"
                )}
              />
            </Link>

            <Link
              href="/perfil"
              className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden flex items-center justify-center border border-outline-variant/50"
            >
              {member.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-on-surface-variant" />
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 md:pl-64 pt-16 md:pt-6 pb-safe md:pb-8">
        <div className="max-w-3xl mx-auto px-4 md:px-8">{children}</div>
      </main>

      {/* Mobile Fixed 5-Tab Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-surface-container-low/95 backdrop-blur-xl border-t border-outline-variant/50 pb-[env(safe-area-inset-bottom,0px)]">
        <div className="grid grid-cols-5 h-16">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-colors",
                  active
                    ? "text-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
