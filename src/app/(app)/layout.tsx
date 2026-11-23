import { AppShell } from "@/components/app-shell";
import { requireMember } from "@/lib/session";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const member = await requireMember();

  return (
    <AppShell
      member={{
        id: member.id,
        name: member.name,
        email: member.email,
        image: member.image,
        telegramChatId: member.telegramChatId,
      }}
    >
      {children}
    </AppShell>
  );
}
