import crypto from "crypto";

const ADMIN_SECRET = process.env.ADMIN_JWT_SECRET || "ailys-super-secret-admin-key-2026";

export interface AdminSessionPayload {
  id: string;
  email: string;
  fullName: string;
  role: string;
  issuedAt: number;
  expiresAt: number;
}

export function createAdminToken(user: { id: string; email: string; fullName: string; role: string }): string {
  const payload: AdminSessionPayload = {
    ...user,
    issuedAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(data)
    .digest("base64url");

  return `${data}.${signature}`;
}

export function verifyAdminToken(token: string): AdminSessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [data, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", ADMIN_SECRET)
      .update(data)
      .digest("base64url");

    if (signature !== expectedSignature) return null;

    const payload: AdminSessionPayload = JSON.parse(
      Buffer.from(data, "base64url").toString("utf8")
    );

    if (Date.now() > payload.expiresAt) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
