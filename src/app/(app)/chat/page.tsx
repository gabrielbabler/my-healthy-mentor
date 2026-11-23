import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ChatPage() {
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
          Sincronizado com Telegram
        </p>
        <h1 className="text-2xl font-bold tracking-tight">Chat com Mentor</h1>
      </div>

      <Card>
        <CardContent className="p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h2 className="text-base font-semibold">
            Conversa contínua Web + Telegram
          </h2>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
            Em breve (Fase 3): converse aqui ou pelo Telegram com memória
            estruturada do seu perfil, planos ativos, adesão recente e notas do
            dia.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
