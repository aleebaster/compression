"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronRight,
  Home,
  PackageOpen,
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products, brands } from "@/lib/data";
import type { Product } from "@/lib/types";

type SortKey = "popular" | "price-asc" | "price-desc" | "newest" | "rating";

interface Filters {
  gender: string;
  minPrice: string;
  maxPrice: string;
  sizes: string[];
  colors: string[];
  brands: string[];
}

const genderOptions = [
  { value: "", label: "Всі" },
  { value: "MEN", label: "Чоловічий" },
  { value: "WOMEN", label: "Жіночий" },
  { value: "KIDS", label: "Дитячий" },
  { value: "THERMAL", label: "Термобілизна" },
];

const sizeOptions = ["S", "M", "L", "XL", "XXL"];

const availableColors = Array.from(
  new Map(
    products.flatMap((p) => p.colors).map((c) => [c.hex, c])
  ).values()
);

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "popular", label: "За популярністю" },
  { value: "price-asc", label: "Ціна: від дешевших" },
  { value: "price-desc", label: "Ціна: від дорогих" },
  { value: "newest", label: "Новинки" },
  { value: "rating", label: "За рейтингом" },
];

function getRatingAvg(p: Product): number {
  const approved = p.reviews.filter((r) => r.isApproved);
  if (approved.length === 0) return 0;
  return approved.reduce((s, r) => s + r.rating, 0) / approved.length;
}

export default function CatalogPage() {
  const [filters, setFilters] = useState<Filters>({
    gender: "",
    minPrice: "",
    maxPrice: "",
    sizes: [],
    colors: [],
    brands: [],
  });
  const [sort, setSort] = useState<SortKey>("popular");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const toggleSize = (size: string) => {
    setFilters((f) => ({
      ...f,
      sizes: f.sizes.includes(size)
        ? f.sizes.filter((s) => s !== size)
        : [...f.sizes, size],
    }));
  };

  const toggleColor = (hex: string) => {
    setFilters((f) => ({
      ...f,
      colors: f.colors.includes(hex)
        ? f.colors.filter((c) => c !== hex)
        : [...f.colors, hex],
    }));
  };

  const toggleBrand = (id: string) => {
    setFilters((f) => ({
      ...f,
      brands: f.brands.includes(id)
        ? f.brands.filter((b) => b !== id)
        : [...f.brands, id],
    }));
  };

  const clearFilters = () => {
    setFilters({
      gender: "",
      minPrice: "",
      maxPrice: "",
      sizes: [],
      colors: [],
      brands: [],
    });
  };

  const hasActiveFilters =
    filters.gender !== "" ||
    filters.minPrice !== "" ||
    filters.maxPrice !== "" ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.brands.length > 0;

  const filtered = useMemo(() => {
    let result = products.filter((p) => p.isActive);

    if (filters.gender === "THERMAL") {
      result = result.filter((p) => p.categoryId === "4");
    } else if (filters.gender) {
      result = result.filter((p) => p.gender === filters.gender);
    }

    if (filters.minPrice) {
      const min = parseFloat(filters.minPrice);
      if (!isNaN(min)) result = result.filter((p) => p.price >= min);
    }
    if (filters.maxPrice) {
      const max = parseFloat(filters.maxPrice);
      if (!isNaN(max)) result = result.filter((p) => p.price <= max);
    }

    if (filters.sizes.length > 0) {
      result = result.filter((p) =>
        filters.sizes.some((s) => p.sizes.some((ps) => ps.name === s))
      );
    }

    if (filters.colors.length > 0) {
      result = result.filter((p) =>
        filters.colors.some((c) => p.colors.some((pc) => pc.hex === c))
      );
    }

    if (filters.brands.length > 0) {
      result = result.filter((p) => p.brandId && filters.brands.includes(p.brandId));
    }

    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result = [...result].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "rating":
        result = [...result].sort(
          (a, b) => getRatingAvg(b) - getRatingAvg(a)
        );
        break;
      default:
        result = [...result].sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
        });
    }

    return result;
  }, [filters, sort]);

  const activeFilterBadges: { key: string; label: string; onRemove: () => void }[] = [];

  if (filters.gender) {
    const opt = genderOptions.find((g) => g.value === filters.gender);
    activeFilterBadges.push({
      key: "gender",
      label: opt?.label || filters.gender,
      onRemove: () => setFilters((f) => ({ ...f, gender: "" })),
    });
  }
  if (filters.minPrice) {
    activeFilterBadges.push({
      key: "minPrice",
      label: `Від ${filters.minPrice} ₴`,
      onRemove: () => setFilters((f) => ({ ...f, minPrice: "" })),
    });
  }
  if (filters.maxPrice) {
    activeFilterBadges.push({
      key: "maxPrice",
      label: `До ${filters.maxPrice} ₴`,
      onRemove: () => setFilters((f) => ({ ...f, maxPrice: "" })),
    });
  }
  filters.sizes.forEach((s) => {
    activeFilterBadges.push({
      key: `size-${s}`,
      label: s,
      onRemove: () => toggleSize(s),
    });
  });
  filters.colors.forEach((hex) => {
    const c = availableColors.find((ac) => ac.hex === hex);
    activeFilterBadges.push({
      key: `color-${hex}`,
      label: c?.name || hex,
      onRemove: () => toggleColor(hex),
    });
  });
  filters.brands.forEach((id) => {
    const b = brands.find((br) => br.id === id);
    activeFilterBadges.push({
      key: `brand-${id}`,
      label: b?.name || id,
      onRemove: () => toggleBrand(id),
    });
  });

  const filterContent = (
    <div className="space-y-6">
      {/* Category / Gender */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Категорія
        </h3>
        <div className="space-y-2">
          {genderOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <span
                className={`flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 transition-colors ${
                  filters.gender === opt.value
                    ? "border-[#E31837] bg-[#E31837]"
                    : "border-gray-300 group-hover:border-[#E31837]"
                }`}
              >
                {filters.gender === opt.value && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </span>
              <input
                type="radio"
                name="gender"
                value={opt.value}
                checked={filters.gender === opt.value}
                onChange={() =>
                  setFilters((f) => ({
                    ...f,
                    gender: f.gender === opt.value ? "" : opt.value,
                  }))
                }
                className="sr-only"
              />
              <span className="text-sm text-gray-700 group-hover:text-[#E31837] transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Ціна
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Від"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters((f) => ({ ...f, minPrice: e.target.value }))
            }
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
          />
          <span className="text-gray-400">—</span>
          <input
            type="number"
            placeholder="До"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters((f) => ({ ...f, maxPrice: e.target.value }))
            }
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
          />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Розмір
        </h3>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`inline-flex h-9 min-w-[36px] items-center justify-center rounded-lg border px-3 text-sm font-medium transition-all ${
                filters.sizes.includes(size)
                  ? "border-[#E31837] bg-[#E31837] text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-[#E31837] hover:text-[#E31837]"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Колір
        </h3>
        <div className="flex flex-wrap gap-3">
          {availableColors.map((color) => (
            <button
              key={color.hex}
              onClick={() => toggleColor(color.hex)}
              title={color.name}
              className={`relative h-8 w-8 rounded-full border-2 transition-all ${
                filters.colors.includes(color.hex)
                  ? "border-[#E31837] ring-2 ring-[#E31837]/20 scale-110"
                  : "border-gray-200 hover:border-gray-400"
              }`}
              style={{ backgroundColor: color.hex }}
            >
              {filters.colors.includes(color.hex) && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke={color.hex === "#FFFFFF" ? "#000" : "#FFF"}
                    strokeWidth="2.5"
                  >
                    <path
                      d="M5 10l3 3 7-7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Бренд
        </h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label
              key={brand.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <span
                className={`flex h-4.5 w-4.5 items-center justify-center rounded border-2 transition-colors ${
                  filters.brands.includes(brand.id)
                    ? "border-[#E31837] bg-[#E31837]"
                    : "border-gray-300 group-hover:border-[#E31837]"
                }`}
              >
                {filters.brands.includes(brand.id) && (
                  <svg
                    className="h-3 w-3 text-white"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path
                      d="M5 10l3 3 7-7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <input
                type="checkbox"
                checked={filters.brands.includes(brand.id)}
                onChange={() => toggleBrand(brand.id)}
                className="sr-only"
              />
              <span className="text-sm text-gray-700 group-hover:text-[#E31837] transition-colors">
                {brand.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear all */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-[#E31837] hover:text-[#E31837]"
        >
          Очистити всі фільтри
        </button>
      )}
    </div>
  );

  return (
    <>
      <Header />

      <main className="flex-1 bg-white">
        {/* Page header */}
        <div className="border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link href="/" className="flex items-center gap-1 hover:text-[#E31837] transition-colors">
                <Home className="h-3.5 w-3.5" />
                Головна
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-gray-900 font-medium">Каталог</span>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">
              КАТАЛОГ
            </h1>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile filter toggle + sort */}
          <div className="flex items-center justify-between gap-4 mb-6 lg:hidden">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-[#E31837] hover:text-[#E31837] transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Фільтри
            </button>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 rounded-xl border border-gray-100 bg-[#F9FAFB] p-6">
                <h2 className="mb-6 text-base font-bold text-gray-900">
                  Фільтри
                </h2>
                {filterContent}
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Desktop sort bar */}
              <div className="hidden lg:flex items-center justify-between mb-6">
                <p className="text-sm text-gray-500">
                  Знайдено{" "}
                  <span className="font-semibold text-gray-900">
                    {filtered.length}
                  </span>{" "}
                  {filtered.length === 1
                    ? "товар"
                    : filtered.length >= 2 && filtered.length <= 4
                    ? "товари"
                    : "товарів"}
                </p>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-10 text-sm font-medium text-gray-700 outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Active filter badges */}
              {activeFilterBadges.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  {activeFilterBadges.map((badge) => (
                    <span
                      key={badge.key}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#E31837]/20 bg-[#E31837]/5 px-3 py-1.5 text-xs font-medium text-[#E31837]"
                    >
                      {badge.label}
                      <button
                        onClick={badge.onRemove}
                        className="ml-0.5 rounded-full p-0.5 hover:bg-[#E31837]/10 transition-colors"
                        aria-label={`Видалити фільтр ${badge.label}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={clearFilters}
                    className="text-xs text-gray-500 hover:text-[#E31837] underline underline-offset-2 transition-colors"
                  >
                    Очистити все
                  </button>
                </div>
              )}

              {/* Mobile product count */}
              <div className="lg:hidden mb-4">
                <p className="text-sm text-gray-500">
                  Знайдено{" "}
                  <span className="font-semibold text-gray-900">
                    {filtered.length}
                  </span>{" "}
                  {filtered.length === 1
                    ? "товар"
                    : filtered.length >= 2 && filtered.length <= 4
                    ? "товари"
                    : "товарів"}
                </p>
              </div>

              {/* Product grid or empty state */}
              {filtered.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {filtered.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                    <PackageOpen className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Нічого не знайдено
                  </h3>
                  <p className="mb-6 max-w-sm text-sm text-gray-500">
                    Спробуйте змінити параметри фільтрації або очистити всі
                    фільтри для перегляду усіх товарів.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#E31837] px-6 py-3 text-sm font-semibold text-white hover:bg-[#c91430] transition-colors"
                  >
                    Очистити фільтри
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[70] flex w-full max-w-sm flex-col bg-[#F9FAFB] shadow-2xl lg:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
                <h2 className="text-lg font-bold text-gray-900">Фільтри</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-200 transition-colors"
                  aria-label="Закрити фільтри"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-6">
                {filterContent}
              </div>

              <div className="border-t border-gray-200 px-4 py-4">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full rounded-lg bg-[#E31837] px-6 py-3 text-sm font-semibold text-white hover:bg-[#c91430] transition-colors"
                >
                  Показати результат ({filtered.length})
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
