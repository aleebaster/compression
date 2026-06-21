import { NextRequest, NextResponse } from "next/server";

const mockOrders = [
  {
    id: "ORD-001",
    status: "DELIVERED",
    total: 2798,
    items: [
      { productId: "p1", name: "Компресійна футболка Pro Max", quantity: 1, price: 1299, size: "L", color: "Чорний" },
      { productId: "p3", name: "Рашгард Pro Compression", quantity: 1, price: 1499, size: "M", color: "Чорний" },
    ],
    createdAt: "2026-05-15T10:30:00Z",
  },
  {
    id: "ORD-002",
    status: "SHIPPED",
    total: 1199,
    items: [
      { productId: "p4", name: "Жіночі компресійні легінси Flex", quantity: 1, price: 1199, size: "S", color: "Чорний" },
    ],
    createdAt: "2026-06-01T14:20:00Z",
  },
];

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = mockOrders.find((o) => o.id === id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const order = mockOrders.find((o) => o.id === id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (body.status) {
      order.status = body.status;
    }
    console.log(`[ORDER] Updated ${id}:`, order);
    return NextResponse.json(order);
  } catch {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
