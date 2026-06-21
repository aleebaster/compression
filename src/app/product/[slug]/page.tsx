"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ChevronRight,
  Minus,
  Plus,
  Check,
  Truck,
  Shield,
  RotateCcw,
  Heart,
  Share2,
} from "lucide-react";
import { products, formatPrice, getAverageRating } from "@/lib/data";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const product = products.find((p) => p.slug === slug);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.colors[0]?.id || ""
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product?.sizes.find((s) => s.inStock)?.id || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">(
    "description"
  );
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const { addItem } = useCartStore();

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 pt-20">
          <div className="mx-auto max-w-7xl px-4 py-20 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Товар не знайдено</h1>
            <p className="mt-4 text-gray-600">
              Вибачте, але товар, який ви шукаєте, не існує або був видалений.
            </p>
            <Link
              href="/catalog"
              className="mt-8 inline-block rounded-lg bg-[#E31837] px-6 py-3 text-white transition-colors hover:bg-[#c41430]"
            >
              Повернутися до каталогу
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const averageRating = getAverageRating(product.reviews);
  const discountPercent = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    const size = product.sizes.find((s) => s.id === selectedSize);
    const color = product.colors.find((c) => c.id === selectedColor);

    for (let i = 0; i < quantity; i++) {
      addItem(product, size?.name, color?.name);
    }

    toast.success("Товар додано до кошика!", {
      position: "bottom-right",
      duration: 3000,
      style: {
        background: "#10B981",
        color: "#fff",
      },
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = "/cart";
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const tabs = [
    { id: "description" as const, label: "Опис" },
    { id: "specs" as const, label: "Характеристики" },
    { id: "reviews" as const, label: `Відгуки (${product.reviews.length})` },
  ];

  const specs = [
    { label: "Бренд", value: product.brand?.name || "—" },
    { label: "Категорія", value: product.category.name },
    { label: "Стать", value: product.gender },
    { label: "Наявність", value: product.inStock ? "В наявності" : "Немає в наявності" },
    { label: "Кількість на складі", value: `${product.stockQty} шт.` },
    { label: "Розміри", value: product.sizes.map((s) => s.name).join(", ") },
    { label: "Кольори", value: product.colors.map((c) => c.name).join(", ") },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-20">
        {/* Breadcrumb */}
        <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-[#E31837] transition-colors">
                Головна
              </Link>
            </li>
            <li><ChevronRight className="h-3 w-3" /></li>
            <li>
              <Link href="/catalog" className="hover:text-[#E31837] transition-colors">
                Каталог
              </Link>
            </li>
            <li><ChevronRight className="h-3 w-3" /></li>
            <li>
              <Link
                href={`/category/${product.category.slug}`}
                className="hover:text-[#E31837] transition-colors"
              >
                {product.category.name}
              </Link>
            </li>
            <li><ChevronRight className="h-3 w-3" /></li>
            <li className="text-gray-900 font-medium truncate max-w-[200px]">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Product Section */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <motion.div
                className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-lg cursor-crosshair"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative h-full w-full"
                  >
                    <Image
                      src={product.images[selectedImage]?.url || "/placeholder.jpg"}
                      alt={product.images[selectedImage]?.alt || product.name}
                      fill
                      className="object-cover transition-transform duration-200"
                      style={
                        isZoomed
                          ? {
                              transform: "scale(1.5)",
                              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                            }
                          : {}
                      }
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Sale Badge */}
                {product.isSale && discountPercent > 0 && (
                  <div className="absolute left-4 top-4 rounded-lg bg-[#E31837] px-3 py-1 text-sm font-bold text-white">
                    -{discountPercent}%
                  </div>
                )}

                {/* New Badge */}
                {product.isNew && (
                  <div className="absolute right-4 top-4 rounded-lg bg-emerald-500 px-3 py-1 text-sm font-bold text-white">
                    NEW
                  </div>
                )}
              </motion.div>

              {/* Thumbnail Strip */}
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === index
                        ? "border-[#E31837] shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || `${product.name} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Brand */}
              {product.brand && (
                <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
                  {product.brand.name}
                </p>
              )}

              {/* Name */}
              <h1 className="text-3xl font-bold text-gray-900 lg:text-4xl">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {averageRating > 0
                    ? `${averageRating.toFixed(1)} (${product.reviews.length} відгуків)`
                    : "Немає відгуків"}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>

              {/* Short Description */}
              {product.shortDesc && (
                <p className="text-gray-600 leading-relaxed">{product.shortDesc}</p>
              )}

              {/* Color Selector */}
              {product.colors.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">
                    Колір:{" "}
                    <span className="font-normal text-gray-600">
                      {product.colors.find((c) => c.id === selectedColor)?.name}
                    </span>
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color.id)}
                        className={`relative h-10 w-10 rounded-full border-2 transition-all ${
                          selectedColor === color.id
                            ? "border-gray-900 scale-110 shadow-lg"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {selectedColor === color.id && (
                          <Check
                            className={`absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 ${
                              color.hex === "#FFFFFF" ? "text-gray-900" : "text-white"
                            }`}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">Розмір</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => size.inStock && setSelectedSize(size.id)}
                        disabled={!size.inStock}
                        className={`min-w-[48px] rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
                          selectedSize === size.id
                            ? "border-[#E31837] bg-[#E31837] text-white"
                            : size.inStock
                            ? "border-gray-200 text-gray-700 hover:border-gray-400"
                            : "border-gray-100 text-gray-300 cursor-not-allowed line-through"
                        }`}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-900">Кількість</h3>
                <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-12 w-12 items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="flex h-12 w-12 items-center justify-center font-semibold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQty, quantity + 1))}
                    className="flex h-12 w-12 items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                    disabled={quantity >= product.stockQty}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full rounded-xl bg-[#E31837] py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-[#c41430] hover:shadow-xl active:scale-[0.98]"
                >
                  ДОДАТИ ДО КОШИКА
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full rounded-xl border-2 border-gray-900 py-4 text-lg font-bold text-gray-900 transition-all hover:bg-gray-900 hover:text-white active:scale-[0.98]"
                >
                  КУПИТИ ЗАРАЗ
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="h-5 w-5 text-[#E31837]" />
                  <span>Дихаючий матеріал</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-5 w-5 text-[#E31837]" />
                  <span>Компресія м&apos;язів</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <RotateCcw className="h-5 w-5 text-[#E31837]" />
                  <span>Відведення вологи</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#E31837] transition-colors">
                  <Heart className="h-5 w-5" />
                  <span>До обраного</span>
                </button>
                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#E31837] transition-colors">
                  <Share2 className="h-5 w-5" />
                  <span>Поділитися</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white shadow-lg">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                    activeTab === tab.id ? "text-[#E31837]" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E31837]"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6 lg:p-8">
              <AnimatePresence mode="wait">
                {activeTab === "description" && (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {product.description}
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === "specs" && (
                  <motion.div
                    key="specs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <table className="w-full">
                      <tbody>
                        {specs.map((spec, index) => (
                          <tr
                            key={spec.label}
                            className={index % 2 === 0 ? "bg-gray-50" : ""}
                          >
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 w-1/3">
                              {spec.label}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {spec.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}

                {activeTab === "reviews" && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {product.reviews.length === 0 ? (
                      <div className="py-12 text-center">
                        <p className="text-gray-500">
                          Ще немає відгуків. Будьте першим, хто залишить відгук!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {product.reviews.map((review) => (
                          <div
                            key={review.id}
                            className="rounded-lg border border-gray-100 p-6"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700">
                                  {review.user.name?.charAt(0) || "U"}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {review.user.name || "Анонім"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString("uk-UA")}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            {review.title && (
                              <h4 className="mt-3 font-semibold text-gray-900">
                                {review.title}
                              </h4>
                            )}
                            <p className="mt-2 text-gray-600">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold text-gray-900">Схожі товари</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:gap-6">
              {relatedProducts.map((relatedProduct) => {
                const relatedAvgRating = getAverageRating(relatedProduct.reviews);
                const relatedDiscount = relatedProduct.oldPrice
                  ? Math.round(
                      ((relatedProduct.oldPrice - relatedProduct.price) /
                        relatedProduct.oldPrice) *
                        100
                    )
                  : 0;

                return (
                  <Link
                    key={relatedProduct.id}
                    href={`/product/${relatedProduct.slug}`}
                    className="group"
                  >
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-xl"
                    >
                      <div className="relative aspect-square overflow-hidden bg-gray-100">
                        <Image
                          src={relatedProduct.images[0]?.url || "/placeholder.jpg"}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {relatedProduct.isSale && relatedDiscount > 0 && (
                          <div className="absolute left-2 top-2 rounded bg-[#E31837] px-2 py-0.5 text-xs font-bold text-white">
                            -{relatedDiscount}%
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        {relatedProduct.brand && (
                          <p className="text-xs font-medium uppercase text-gray-400">
                            {relatedProduct.brand.name}
                          </p>
                        )}
                        <h3 className="mt-1 text-sm font-semibold text-gray-900 line-clamp-2">
                          {relatedProduct.name}
                        </h3>
                        <div className="mt-2 flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= Math.round(relatedAvgRating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(relatedProduct.price)}
                          </span>
                          {relatedProduct.oldPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              {formatPrice(relatedProduct.oldPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
