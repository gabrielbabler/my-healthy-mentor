import crypto from "crypto";
import { asc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { allowlistEntries } from "@/db/schema";
import { normalizeEmail } from "@/lib/allowlist";
import { getCurrentMember } from "@/lib/session";

const createAllowlistSchema = z.object({
  email: z.string().email("Informe um e-mail válido."),
});

const deleteAllowlistSchema = z.object({
  id: z.string().min(1),
});

export async function GET() {
  const member = await getCurrentMember();
  if (!member) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  if (member.role !== "admin") {
    return NextResponse.json({ error: "Acesso restrito." }, { status: 403 });
  }

  const entries = await db
    .select({
      id: allowlistEntries.id,
      email: allowlistEntries.email,
      createdAt: allowlistEntries.createdAt,
    })
    .from(allowlistEntries)
    .orderBy(asc(allowlistEntries.createdAt));

  return NextResponse.json({ entries });
}

export async function POST(request: NextRequest) {
  const member = await getCurrentMember();
  if (!member) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  if (member.role !== "admin") {
    return NextResponse.json({ error: "Acesso restrito." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createAllowlistSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "E-mail inválido." },
      { status: 400 }
    );
  }

  const email = normalizeEmail(parsed.data.email);

  const [inserted] = await db
    .insert(allowlistEntries)
    .values({
      id: crypto.randomUUID(),
      email,
      addedByMemberId: member.id,
    })
    .onConflictDoNothing({ target: allowlistEntries.email })
    .returning({
      id: allowlistEntries.id,
      email: allowlistEntries.email,
      createdAt: allowlistEntries.createdAt,
    });

  if (!inserted) {
    return NextResponse.json(
      { error: "Este e-mail já está autorizado." },
      { status: 409 }
    );
  }

  return NextResponse.json({ entry: inserted }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const member = await getCurrentMember();
  if (!member) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  if (member.role !== "admin") {
    return NextResponse.json({ error: "Acesso restrito." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = deleteAllowlistSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "ID inválido." },
      { status: 400 }
    );
  }

  const [target] = await db
    .select()
    .from(allowlistEntries)
    .where(eq(allowlistEntries.id, parsed.data.id))
    .limit(1);

  if (!target) {
    return NextResponse.json(
      { error: "Entrada não encontrada." },
      { status: 404 }
    );
  }

  if (normalizeEmail(target.email) === normalizeEmail(member.email)) {
    return NextResponse.json(
      { error: "Você não pode remover seu próprio e-mail." },
      { status: 400 }
    );
  }

  await db
    .delete(allowlistEntries)
    .where(eq(allowlistEntries.id, parsed.data.id));

  return NextResponse.json({ deleted: true });
}
