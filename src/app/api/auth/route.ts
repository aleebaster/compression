import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "compression-store-super-secret-key-2026";

const ADMIN_USER = {
  id: "1",
  email: "boleksandr096@gmail.com",
  password: "cJ7siL9vpK",
  name: "Admin",
  role: "SUPER_ADMIN",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
      const token = jwt.sign(
        { id: ADMIN_USER.id, email: ADMIN_USER.email, name: ADMIN_USER.name, role: ADMIN_USER.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const response = NextResponse.json({
        user: { id: ADMIN_USER.id, email: ADMIN_USER.email, name: ADMIN_USER.name, role: ADMIN_USER.role },
        token,
      });

      response.cookies.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      name: string;
      role: string;
    };

    return NextResponse.json({
      user: { id: decoded.id, email: decoded.email, name: decoded.name, role: decoded.role },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
