import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  let filtered = [...products];

  const category = searchParams.get("category");
  if (category) {
    filtered = filtered.filter((p) => p.category.slug === category);
  }

  const gender = searchParams.get("gender");
  if (gender) {
    filtered = filtered.filter((p) => p.gender === gender);
  }

  const search = searchParams.get("search");
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  const minPrice = searchParams.get("minPrice");
  if (minPrice) {
    filtered = filtered.filter((p) => p.price >= Number(minPrice));
  }

  const maxPrice = searchParams.get("maxPrice");
  if (maxPrice) {
    filtered = filtered.filter((p) => p.price <= Number(maxPrice));
  }

  const sort = searchParams.get("sort");
  if (sort === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === "newest") {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sort === "popular") {
    filtered.sort((a, b) => b.reviews.length - a.reviews.length);
  }

  return NextResponse.json(filtered);
}
