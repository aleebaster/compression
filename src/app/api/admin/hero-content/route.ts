import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }
    const items = await prisma.heroContent.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch hero content" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }
    const body = await request.json();
    const item = await prisma.heroContent.create({
      data: {
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        buttonText: body.buttonText,
        buttonLink: body.buttonLink,
        position: body.position || "center",
        textColor: body.textColor || "#FFFFFF",
        textShadow: body.textShadow ?? false,
        isActive: body.isActive ?? true,
        order: body.order ?? 0,
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create hero content" }, { status: 500 });
  }
}
