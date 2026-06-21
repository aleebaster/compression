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
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

async function updateOrder(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }
    const { id } = await params;
    const body = await request.json();
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: body.status,
        trackingNumber: body.trackingNumber,
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return updateOrder(request, context);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return updateOrder(request, context);
}
