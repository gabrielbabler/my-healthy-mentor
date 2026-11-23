import { eq } from "drizzle-orm";
import { db } from "@/db";
import { allowlistEntries } from "@/db/schema";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function parseEnvAllowedEmails(
  adminEmail = process.env.ADMIN_EMAIL,
  allowedEmails = process.env.ALLOWED_EMAILS
): string[] {
  const candidates = [
    adminEmail ?? "",
    ...(allowedEmails ?? "").split(","),
  ]
    .map(normalizeEmail)
    .filter((email) => email.length > 0 && email.includes("@"));

  return Array.from(new Set(candidates));
}

export function isAdminEmail(
  email: string,
  adminEmail = process.env.ADMIN_EMAIL
): boolean {
  if (!adminEmail) return false;
  return normalizeEmail(email) === normalizeEmail(adminEmail);
}

export async function isEmailAllowed(email: string): Promise<boolean> {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;

  if (parseEnvAllowedEmails().includes(normalized)) {
    return true;
  }

  const existing = await db
    .select({ id: allowlistEntries.id })
    .from(allowlistEntries)
    .where(eq(allowlistEntries.email, normalized))
    .limit(1);

  return existing.length > 0;
}
