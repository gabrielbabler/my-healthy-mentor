"use client";

import { useState } from "react";
import { Plus, Shield, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface AllowlistEntryItem {
  id: string;
  email: string;
}

export function AllowlistManager({
  initialEntries,
  currentMemberEmail,
}: {
  initialEntries: AllowlistEntryItem[];
  currentMemberEmail: string;
}) {
  const [entries, setEntries] = useState<AllowlistEntryItem[]>(initialEntries);
  const [emailInput, setEmailInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/allowlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao autorizar e-mail.");
        return;
      }
      setEntries((prev) => [...prev, data.entry]);
      setEmailInput("");
    } catch {
      setError("Falha de comunicação com o servidor.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(id: string) {
    setError(null);
    const res = await fetch("/api/allowlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Erro ao remover e-mail.");
      return;
    }
    setEntries((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">E-mails Autorizados</h2>
            <p className="text-xs text-on-surface-variant">
              Apenas contas Google nesta lista podem acessar o app.
            </p>
          </div>
        </div>

        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="email"
            required
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="convidado@gmail.com"
            className="flex-1 h-10 rounded-lg bg-surface-container-lowest border border-outline-variant/60 px-3 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Button type="submit" size="sm" className="h-10" disabled={submitting}>
            <Plus className="w-4 h-4" />
            <span>Adicionar</span>
          </Button>
        </form>

        {error && (
          <p className="text-xs text-error bg-error/10 border border-error/30 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <ul className="space-y-2">
          {entries.map((entry) => {
            const isSelf =
              entry.email.toLowerCase() === currentMemberEmail.toLowerCase();
            return (
              <li
                key={entry.id}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-surface-container-low text-xs"
              >
                <span className="truncate font-medium">{entry.email}</span>
                {isSelf ? (
                  <span className="text-[10px] font-semibold uppercase text-primary px-2 py-0.5 rounded bg-primary/10">
                    Você
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRemove(entry.id)}
                    className="p-1.5 rounded text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
                    title="Remover acesso"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
