"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";

export function PerfilControls() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
      router.push("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        type="button"
        variant="secondary"
        className="flex-1 justify-between"
        onClick={toggleTheme}
      >
        <span>Aparência: {theme === "dark" ? "Modo Escuro" : "Modo Claro"}</span>
        {theme === "dark" ? (
          <Moon className="w-4 h-4 text-primary" />
        ) : (
          <Sun className="w-4 h-4 text-tertiary" />
        )}
      </Button>

      <Button
        type="button"
        variant="destructive"
        className="sm:w-auto"
        onClick={handleSignOut}
        disabled={signingOut}
      >
        <LogOut className="w-4 h-4" />
        <span>{signingOut ? "Saindo..." : "Sair da conta"}</span>
      </Button>
    </div>
  );
}
