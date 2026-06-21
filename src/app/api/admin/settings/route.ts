import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }
    const settings = await prisma.settings.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach((s: { key: string; value: string }) => { settingsMap[s.key] = s.value; });
    return NextResponse.json(settingsMap);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }
    const { settings } = await request.json();
    const upserts = Object.entries(settings).map(([key, value]) =>
      prisma!.settings.upsert({
        where: { key },
        update: { value: value as string },
        create: { key, value: value as string },
      })
    );
    await Promise.all(upserts);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
