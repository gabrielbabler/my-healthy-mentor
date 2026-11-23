import { ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PlanosPage() {
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
          Prescrição & Versões
        </p>
        <h1 className="text-2xl font-bold tracking-tight">Planos</h1>
      </div>

      <Card>
        <CardContent className="p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <ClipboardList className="w-6 h-6" />
          </div>
          <h2 className="text-base font-semibold">
            Dieta, Treino e Importação por Texto
          </h2>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
            Em breve (Fase 2): gere rascunhos com IA a partir do seu Perfil de
            Saúde, cole conversas do Gemini em &ldquo;Importar por Texto&rdquo;,
            edite refeições/exercícios e aprove propostas de ajuste com histórico
            de versões.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
