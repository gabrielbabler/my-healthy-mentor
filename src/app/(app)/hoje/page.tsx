import Link from "next/link";
import { Dumbbell, Send, Sparkles, Utensils } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { requireMember } from "@/lib/session";
import { formatPtBrDate } from "@/lib/utils";

export default async function HojePage() {
  const member = await requireMember();
  const firstName = member.name.split(" ")[0] ?? member.name;
  const todayLabel = formatPtBrDate(new Date());

  return (
    <div className="space-y-4 py-2">
      {/* Greeting Header */}
      <section className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
            {todayLabel}
          </span>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-[11px] text-on-surface-variant">
            <Send className="w-3 h-3 text-primary" />
            <span>
              {member.telegramChatId
                ? "Telegram conectado"
                : "Telegram não conectado"}
            </span>
          </div>
        </div>

        <div className="flex items-baseline justify-between gap-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Olá, {firstName}
          </h1>
          <Link
            href="/perfil"
            className="text-[11px] font-semibold text-primary px-2.5 py-1 rounded-md bg-primary/10 hover:bg-primary/15 transition-colors"
          >
            Configurar Perfil
          </Link>
        </div>
      </section>

      {/* Phase 1 Onboarding / Setup Prompt */}
      <Card className="bg-surface-container-high border-primary/25">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1 min-w-0">
            <p className="text-sm font-semibold">
              Ambiente pronto para o seu plano
            </p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Na próxima fase você preencherá seu Perfil de Saúde e ativará seu
              Plano de Dieta e Treino (gerado por IA ou importado do Gemini).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Treino de Hoje Skeleton */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                Treino de Hoje
              </p>
              <h2 className="text-base font-semibold">
                Nenhum plano de treino ativo
              </h2>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant">
            Quando um Plano de Treino estiver ativo, você verá aqui os
            exercícios do dia, o botão &ldquo;Trocar treino de hoje&rdquo; e os
            controles rápidos de adesão (Feito / Descanso / Pulei).
          </p>
        </CardContent>
      </Card>

      {/* Dieta de Hoje Skeleton */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                Dieta de Hoje
              </p>
              <h2 className="text-base font-semibold">
                Nenhum plano alimentar ativo
              </h2>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant">
            Suas metas diárias (kcal, proteínas, carboidratos, gorduras e água),
            refeições e adesão rápida (100% / Adaptada / Fora) aparecerão aqui.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
