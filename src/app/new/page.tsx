"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, SlidersHorizontal, X } from "lucide-react";
import { products, formatPrice } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

const sortOptions = [
  { value: "newest", label: "Спочатку нові" },
  { value: "price-asc", label: "Ціна: від дешевих" },
  { value: "price-desc", label: "Ціна: від дорогих" },
  { value: "popular", label: "Популярні" },
];

export default function NewArrivalsPage() {
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  const newProducts = useMemo(() => {
    let filtered = products.filter((p) => p.isNew || p.isFeatured);

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category?.slug === selectedCategory);
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortBy) {
      case "price-asc":
        return [...filtered].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...filtered].sort((a, b) => b.price - a.price);
      case "popular":
        return [...filtered].sort((a, b) => b.reviews.length - a.reviews.length);
      default:
        return filtered;
    }
  }, [sortBy, selectedCategory, priceRange]);

  const hasFilters = selectedCategory || priceRange[0] > 0 || priceRange[1] < 10000;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-[#111111] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/80">
              <Sparkles className="h-4 w-4 text-[#E31837]" />
              Новинки
            </div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Нові надходження
            </h1>
            <p className="mt-3 text-base text-white/60 sm:text-lg">
              Останні оновлення нашого каталогу
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-[#E31837] hover:text-[#E31837] transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Фільтри
            </button>
            {hasFilters && (
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setPriceRange([0, 10000]);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-[#E31837] hover:bg-red-100 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Очистити
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {newProducts.length} товарів
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 rounded-xl border border-gray-200 bg-white p-6"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Категорія
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                >
                  <option value="">Всі категорії</option>
                  <option value="men">Чоловічий</option>
                  <option value="kids">Дитячий</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Ціна: {formatPrice(priceRange[0])} — {formatPrice(priceRange[1])}
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                    placeholder="Від"
                  />
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                    placeholder="До"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Products Grid */}
        {newProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {newProducts.map((product, i) => (
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
            <Sparkles className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">Новинок поки немає</p>
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
