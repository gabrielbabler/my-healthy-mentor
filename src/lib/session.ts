import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { members } from "@/db/schema";
import { auth } from "./auth";

export type AuthenticatedMember = typeof members.$inferSelect;

export async function getCurrentMember(): Promise<AuthenticatedMember | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  const [member] = await db
    .select()
    .from(members)
    .where(eq(members.id, session.user.id))
    .limit(1);

  return member ?? null;
}

export async function requireMember(): Promise<AuthenticatedMember> {
  const member = await getCurrentMember();
  if (!member) {
    redirect("/login");
  }
  return member;
}
