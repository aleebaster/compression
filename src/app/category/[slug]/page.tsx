"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Home, PackageOpen } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/lib/data";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const category = categories.find((c) => c.slug === slug);
  const subcategory = !category
    ? categories.flatMap((c) => c.children || []).find((c) => c.slug === slug)
    : null;
  const activeCategory = category || (subcategory ? categories.find((c) => c.id === subcategory.parentId) : null);

  const categoryProducts = useMemo(() => {
    if (subcategory) {
      return products.filter((p) => p.category?.slug === subcategory.slug);
    }
    if (!activeCategory) return [];
    const childSlugs = activeCategory.children?.map((c) => c.slug) || [];
    return products.filter(
      (p) =>
        p.category?.slug === activeCategory.slug ||
        childSlugs.includes(p.category?.slug || "")
    );
  }, [slug, category, subcategory, activeCategory]);

  if (!activeCategory) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <PackageOpen className="mx-auto h-16 w-16 text-gray-300" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Категорію не знайдено</h1>
          <p className="mt-2 text-gray-500">Ця категорія не існує</p>
          <Link
            href="/catalog"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#E31837] px-6 py-3 text-sm font-medium text-white hover:bg-[#C41430] transition-colors"
          >
            Перейти до каталогу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#E31837] transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            {subcategory && (
              <>
                <Link href={`/category/${activeCategory.slug}`} className="hover:text-[#E31837] transition-colors">
                  {activeCategory.name}
                </Link>
                <ChevronRight className="h-3.5 w-3.5" />
              </>
            )}
            <span className="font-medium text-gray-900">
              {subcategory ? subcategory.name : activeCategory.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="bg-[#111111] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {subcategory ? subcategory.name : activeCategory.name}
            </h1>
            {activeCategory.description && !subcategory && (
              <p className="mt-3 text-base text-white/60 sm:text-lg">
                {activeCategory.description}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Subcategories */}
        {category && category.children && category.children.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Підкатегорії</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {category.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/category/${child.slug}`}
                  className="group rounded-xl border border-gray-200 bg-white p-4 text-center transition-all hover:border-[#E31837] hover:shadow-md"
                >
                  <span className="text-sm font-medium text-gray-700 group-hover:text-[#E31837] transition-colors">
                    {child.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Товари ({categoryProducts.length})
          </h2>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {categoryProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <PackageOpen className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">Товарів у цій категорії поки немає</p>
            <Link
              href="/catalog"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#E31837] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#C41430] transition-colors"
            >
              Переглянути каталог
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
