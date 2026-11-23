import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET() {
  try {
    await db.execute(sql`SELECT 1`);
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[health] Database check failed:", error);
    return NextResponse.json(
      { status: "error", message: "Banco de dados indisponível" },
      { status: 503 }
    );
  }
}
