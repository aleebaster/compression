import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }
    const { id } = await params;
    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }
    return NextResponse.json(banner);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch banner" }, { status: 500 });
  }
}

async function updateBanner(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }
    const { id } = await params;
    const body = await request.json();
    const data: Record<string, unknown> = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.subtitle !== undefined) data.subtitle = body.subtitle;
    if (body.description !== undefined) data.description = body.description;
    if (body.buttonText !== undefined) data.buttonText = body.buttonText;
    if (body.link !== undefined) data.link = body.link;
    if (body.isActive !== undefined) data.isActive = body.isActive;
    if (body.order !== undefined) data.order = body.order;
    if (body.mode !== undefined) data.mode = body.mode;
    if (body.useTextContent !== undefined) data.useTextContent = body.useTextContent;
    if (body.desktopImage !== undefined) data.desktopImage = body.desktopImage;
    if (body.tabletImage !== undefined) data.tabletImage = body.tabletImage;
    if (body.mobileImage !== undefined) data.mobileImage = body.mobileImage;
    if (body.objectFit !== undefined) data.objectFit = body.objectFit;
    if (body.positionX !== undefined) data.positionX = body.positionX;
    if (body.positionY !== undefined) data.positionY = body.positionY;
    if (body.objectPosition !== undefined) data.objectPosition = body.objectPosition;
    if (body.scale !== undefined) data.scale = body.scale;
    if (body.width !== undefined) data.width = body.width;
    if (body.height !== undefined) data.height = body.height;
    if (body.maxWidth !== undefined) data.maxWidth = body.maxWidth;
    if (body.maxHeight !== undefined) data.maxHeight = body.maxHeight;
    if (body.aspectRatio !== undefined) data.aspectRatio = body.aspectRatio;
    if (body.fullWidth !== undefined) data.fullWidth = body.fullWidth;
    if (body.fullHeight !== undefined) data.fullHeight = body.fullHeight;
    if (body.margin !== undefined) data.margin = body.margin;
    if (body.padding !== undefined) data.padding = body.padding;
    if (body.overlay !== undefined) data.overlay = body.overlay;
    const banner = await prisma.banner.update({ where: { id }, data });
    return NextResponse.json(banner);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return updateBanner(request, context);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return updateBanner(request, context);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }
    const { id } = await params;
    await prisma.banner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}
