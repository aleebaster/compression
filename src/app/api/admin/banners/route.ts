import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }
    const banners = await prisma.banner.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }
    const body = await request.json();
    const banner = await prisma.banner.create({
      data: {
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        buttonText: body.buttonText,
        link: body.link,
        isActive: body.isActive ?? true,
        order: body.order ?? 0,
        mode: body.mode ?? "image_only",
        useTextContent: body.useTextContent ?? false,
        desktopImage: body.desktopImage,
        tabletImage: body.tabletImage,
        mobileImage: body.mobileImage,
        objectFit: body.objectFit ?? "cover",
        positionX: body.positionX ?? 0,
        positionY: body.positionY ?? 0,
        objectPosition: body.objectPosition ?? "center",
        scale: body.scale ?? 1,
        width: body.width ?? { desktop: "100%", tablet: "100%", mobile: "100%" },
        height: body.height ?? { desktop: 750, tablet: 650, mobile: 500 },
        maxWidth: body.maxWidth ?? { desktop: 1440, tablet: 768, mobile: 375 },
        maxHeight: body.maxHeight ?? { desktop: 900, tablet: 800, mobile: 700 },
        aspectRatio: body.aspectRatio ?? { desktop: "auto", tablet: "auto", mobile: "auto" },
        fullWidth: body.fullWidth ?? { desktop: true, tablet: true, mobile: true },
        fullHeight: body.fullHeight ?? { desktop: false, tablet: false, mobile: false },
        margin: body.margin ?? {
          desktop: { desktop: 0, tablet: 0, mobile: 0 },
          tablet: { desktop: 0, tablet: 0, mobile: 0 },
          mobile: { desktop: 0, tablet: 0, mobile: 0 },
        },
        padding: body.padding ?? {
          desktop: { desktop: 0, tablet: 0, mobile: 0 },
          tablet: { desktop: 0, tablet: 0, mobile: 0 },
          mobile: { desktop: 0, tablet: 0, mobile: 0 },
        },
        overlay: body.overlay ?? {
          enabled: false,
          color: "#000000",
          opacity: 0.5,
          gradientEnabled: false,
          gradientDirection: "to bottom",
        },
      },
    });
    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}
