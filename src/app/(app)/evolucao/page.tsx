import { Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function EvolucaoPage() {
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
          Check-ins & Fotos Locais
        </p>
        <h1 className="text-2xl font-bold tracking-tight">Evolução</h1>
      </div>

      <Card>
        <CardContent className="p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Activity className="w-6 h-6" />
          </div>
          <h2 className="text-base font-semibold">
            Peso em Jejum e Comparador de Fotos
          </h2>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
            Em breve (Fase 4): acompanhe seu gráfico de peso, envie check-ins
            semanais e compare fotos lado a lado armazenadas exclusivamente no
            seu servidor.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
