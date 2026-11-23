import { describe, expect, it } from "vitest";
import {
  isAdminEmail,
  normalizeEmail,
  parseEnvAllowedEmails,
} from "../allowlist";

describe("allowlist helpers", () => {
  it("normalizes email whitespace and casing", () => {
    expect(normalizeEmail("  User@Gmail.com \n")).toBe("user@gmail.com");
  });

  it("parses and deduplicates ADMIN_EMAIL and ALLOWED_EMAILS", () => {
    const result = parseEnvAllowedEmails(
      "Admin@Gmail.com",
      "tester1@gmail.com, admin@gmail.com, invalid-email,  Tester2@Gmail.com "
    );

    expect(result).toEqual([
      "admin@gmail.com",
      "tester1@gmail.com",
      "tester2@gmail.com",
    ]);
  });

  it("detects admin email case-insensitively", () => {
    expect(isAdminEmail("Gabriel@Gmail.com", "gabriel@gmail.com")).toBe(true);
    expect(isAdminEmail("other@gmail.com", "gabriel@gmail.com")).toBe(false);
    expect(isAdminEmail("other@gmail.com", undefined)).toBe(false);
  });
});
