import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }
    const products = await prisma.product.findMany({
      include: {
        images: true,
        sizes: true,
        colors: true,
        category: true,
        brand: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }
    const body = await request.json();
    const { images, sizes, colors, ...productData } = body;

    const product = await prisma.product.create({
      data: {
        ...productData,
        images: images ? { create: images } : undefined,
        sizes: sizes ? { create: sizes } : undefined,
        colors: colors ? { create: colors } : undefined,
      },
      include: {
        images: true,
        sizes: true,
        colors: true,
        category: true,
        brand: true,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
