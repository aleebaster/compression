import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

async function updateReview(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }
    const { id } = await params;
    const body = await request.json();
    const review = await prisma.review.update({
      where: { id },
      data: {
        isApproved: body.isApproved,
      },
      include: {
        user: true,
        product: true,
      },
    });
    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return updateReview(request, context);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return updateReview(request, context);
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
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
