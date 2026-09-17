import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("ailys_admin_token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const session = verifyAdminToken(token);
  if (!session) {
    return NextResponse.json({ authenticated: false, error: "Session expirée ou invalide" }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.id,
      email: session.email,
      fullName: session.fullName,
      role: session.role,
    },
  });
}
