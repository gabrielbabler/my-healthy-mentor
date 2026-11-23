import { APIError, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { isAdminEmail, isEmailAllowed, normalizeEmail } from "./allowlist";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.APP_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
      user: schema.members,
    },
  }),
  user: {
    modelName: "members",
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "member",
        input: false,
      },
      timezone: {
        type: "string",
        required: false,
        defaultValue: "America/Sao_Paulo",
      },
      telegramChatId: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const email = normalizeEmail(user.email);
          const allowed = await isEmailAllowed(email);
          if (!allowed) {
            throw new APIError("FORBIDDEN", {
              message:
                "Acesso restrito a convidados. Este e-mail não está autorizado.",
            });
          }

          return {
            data: {
              ...user,
              email,
              role: isAdminEmail(email) ? "admin" : "member",
            },
          };
        },
      },
    },
    session: {
      create: {
        before: async (sessionData) => {
          const [member] = await db
            .select({
              id: schema.members.id,
              email: schema.members.email,
              role: schema.members.role,
            })
            .from(schema.members)
            .where(eq(schema.members.id, sessionData.userId))
            .limit(1);

          if (!member) {
            throw new APIError("UNAUTHORIZED", {
              message: "Membro não encontrado.",
            });
          }

          const allowed = await isEmailAllowed(member.email);
          if (!allowed) {
            throw new APIError("FORBIDDEN", {
              message:
                "Acesso restrito a convidados. Este e-mail não está autorizado.",
            });
          }

          if (isAdminEmail(member.email) && member.role !== "admin") {
            await db
              .update(schema.members)
              .set({ role: "admin", updatedAt: new Date() })
              .where(eq(schema.members.id, member.id));
          }

          return { data: sessionData };
        },
      },
    },
  },
});
