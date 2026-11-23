"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { signIn } from "@/lib/auth-client";

function LoginContent() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    errorParam
      ? "Acesso restrito a convidados. Verifique se seu e-mail do Google está na lista de autorizados."
      : null
  );

  async function handleGoogleSignIn() {
    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await signIn.social({
        provider: "google",
        callbackURL: "/hoje",
      });
      if (result?.error) {
        setErrorMessage(
          result.error.message ??
            "Não foi possível entrar. Acesso restrito a convidados."
        );
        setLoading(false);
      }
    } catch {
      setErrorMessage("Erro ao iniciar login com o Google. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-surface text-on-surface flex items-center justify-center p-4">
      <Card className="relative w-full max-w-md overflow-hidden p-6 md:p-8 shadow-xl">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <CardContent className="p-0 flex flex-col items-center text-center relative z-10 space-y-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-surface-container-lowest p-3 shadow-lg flex items-center justify-center border border-outline-variant/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icon.svg"
                alt="My Healthy Mentor"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="absolute -bottom-1.5 -right-2 px-2 py-0.5 rounded bg-primary text-on-primary text-[10px] font-bold uppercase tracking-wider">
              Beta
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              My Healthy Mentor
            </h1>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Seu mentor pessoal de dieta, treino e evolução física integrado ao
              Telegram.
            </p>
          </div>

          {errorMessage && (
            <div className="w-full rounded-lg bg-error/10 border border-error/30 p-3 text-xs text-error text-left">
              {errorMessage}
            </div>
          )}

          <Button
            type="button"
            size="lg"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"
              />
            </svg>
            <span>{loading ? "Conectando..." : "Entrar com Google"}</span>
          </Button>

          <div className="flex items-center gap-2 text-xs text-on-surface-variant pt-1">
            <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
            <span>Acesso restrito a e-mails autorizados (convidados).</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-surface flex items-center justify-center text-sm text-on-surface-variant">
          Carregando...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
