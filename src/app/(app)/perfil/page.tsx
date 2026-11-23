import { asc } from "drizzle-orm";
import { Clock, Send, User } from "lucide-react";
import { AllowlistManager } from "@/components/allowlist-manager";
import { PerfilControls } from "@/components/perfil-controls";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/db";
import { allowlistEntries } from "@/db/schema";
import { requireMember } from "@/lib/session";

export default async function PerfilPage() {
  const member = await requireMember();

  const entries =
    member.role === "admin"
      ? await db
          .select({
            id: allowlistEntries.id,
            email: allowlistEntries.email,
          })
          .from(allowlistEntries)
          .orderBy(asc(allowlistEntries.createdAt))
      : [];

  return (
    <div className="space-y-4 py-2">
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
          Membro & Configurações
        </p>
        <h1 className="text-2xl font-bold tracking-tight">Perfil</h1>
      </div>

      {/* Member Identity Card */}
      <Card>
        <CardContent className="p-4 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-surface-container-high overflow-hidden flex items-center justify-center border border-outline-variant/50 flex-shrink-0">
            {member.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-on-surface-variant" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold truncate">{member.name}</p>
              {member.role === "admin" && (
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-primary/15 text-primary">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant truncate">
              {member.email}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Telegram & Schedule Summary */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <Send className="w-4 h-4 text-primary" />
              Telegram
            </span>
            <span className="text-xs font-semibold text-tertiary">
              {member.telegramChatId ? "Conectado" : "Integração na Fase 3"}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Fuso horário padrão
            </span>
            <span className="font-medium text-on-surface">
              {member.timezone}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Theme & Sign Out */}
      <PerfilControls />

      {/* Allowlist Management (Admin Only) */}
      {member.role === "admin" && (
        <AllowlistManager
          initialEntries={entries}
          currentMemberEmail={member.email}
        />
      )}
    </div>
  );
}
