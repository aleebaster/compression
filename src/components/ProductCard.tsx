"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, Eye } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice, getAverageRating } from "@/lib/data";
import { useCartStore } from "@/lib/store";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  const rating = getAverageRating(product.reviews);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={`/product/${product.slug}`} className="block group">
        <div
          className="relative rounded-xl overflow-hidden bg-white transition-all duration-400"
          style={{
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDuration: "0.4s",
          }}
        >
          {/* Hover lift applied via group-hover */}
          <style>{`
            .product-card-hover:hover {
              transform: translateY(-8px);
              box-shadow:
                0 20px 40px -12px rgba(0, 0, 0, 0.15),
                0 8px 16px -8px rgba(0, 0, 0, 0.1);
            }
          `}</style>
          <div className="product-card-hover transition-all duration-400 rounded-xl"
            style={{
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              transitionDuration: "0.4s",
            }}
          >
            {/* Image container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
              <Image
                src={product.images[0]?.url || "/placeholder.png"}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-108"
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                {product.isNew && (
                  <span className="inline-flex items-center rounded-full bg-[#2563EB] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
                    Новинка
                  </span>
                )}
                {discount > 0 && (
                  <span className="inline-flex items-center rounded-full bg-[#E31837] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
                    Акція -{discount}%
                  </span>
                )}
              </div>

              {/* Quick view overlay */}
              <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out z-10">
                <div className="flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-gray-900 shadow-lg hover:bg-white transition-colors">
                  <Eye className="h-4 w-4" />
                  Швидкий перегляд
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
              {/* Brand & category */}
              <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider font-medium">
                <span>{product.brand?.name}</span>
                <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                <span>{product.category?.name}</span>
              </div>

              {/* Name */}
              <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#E31837] transition-colors duration-300">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3.5 w-3.5 ${
                        star <= Math.round(rating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                {product.reviews.length > 0 && (
                  <span className="text-xs text-gray-400">
                    ({product.reviews.length})
                  </span>
                )}
              </div>

              {/* Size preview */}
              <div className="flex items-center gap-1 pt-0.5">
                {product.sizes?.slice(0, 6).map((size) => (
                  <span
                    key={size.id}
                    className="inline-flex items-center justify-center h-6 min-w-[24px] rounded-md border border-gray-200 bg-gray-50 px-1 text-[10px] font-medium text-gray-500"
                  >
                    {size.name}
                  </span>
                ))}
                {product.sizes && product.sizes.length > 6 && (
                  <span className="text-[10px] text-gray-400 ml-0.5">
                    +{product.sizes.length - 6}
                  </span>
                )}
              </div>

              {/* Price + Add to cart */}
              <div className="flex items-end justify-between pt-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.oldPrice && product.oldPrice > product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(product.oldPrice)}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleAddToCart}
                  className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-[#E31837] text-white shadow-sm hover:bg-[#c91430] active:scale-95 transition-all duration-200"
                  aria-label="Додати до кошика"
                >
                  <ShoppingCart className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
