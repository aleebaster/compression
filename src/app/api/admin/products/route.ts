import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/data";

export async function GET() {
  try {
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newProduct = {
      id: `p${Date.now()}`,
      ...body,
      isActive: body.isActive ?? true,
      inStock: body.inStock ?? true,
      stockQty: body.stockQty ?? 0,
      reviews: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    products.push(newProduct);
    console.log("[PRODUCT] Created:", newProduct);
    return NextResponse.json(newProduct, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
