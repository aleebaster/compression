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

export async function GET() {
  return NextResponse.json(mockOrders);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const orderNumber = `ORD-${String(Math.floor(Math.random() * 9000) + 1000)}`;

  return NextResponse.json({
    success: true,
    orderNumber,
    message: "Замовлення успішно створено",
    order: {
      id: orderNumber,
      status: "PENDING",
      ...body,
      createdAt: new Date().toISOString(),
    },
  });
}
