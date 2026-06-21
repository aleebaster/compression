"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, Tag, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CartPage() {
  const {
    items,
    promoCode,
    discount,
    removeItem,
    updateQuantity,
    applyPromoCode,
    removePromoCode,
    getTotal,
    getShippingCost,
    getFinalTotal,
  } = useCartStore();

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");

  const subtotal = getTotal();
  const shipping = getShippingCost();
  const total = getFinalTotal();
  const discountAmount = (subtotal * discount) / 100;

  const handleApplyPromo = () => {
    setPromoError("");
    if (!promoInput.trim()) return;
    applyPromoCode(promoInput.trim());
    const store = useCartStore.getState();
    if (!store.promoCode) {
      setPromoError("Промокод не знайдено");
    } else {
      setPromoInput("");
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Ваш кошик порожній
            </h1>
            <p className="mt-2 text-gray-500">
              Додайте товари з каталогу, щоб оформити замовлення
            </p>
            <Link
              href="/catalog"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#E31837] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#c91430]"
            >
              ПЕРЕЙТИ ДО КАТАЛОГУ
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          ВАШ КОШИК
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
              <AnimatePresence initial={false}>
                {items.map((item) => {
                  const primaryImage = item.product.images.find(
                    (img) => img.isPrimary
                  ) || item.product.images[0];

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="flex gap-4 p-4 sm:gap-6 sm:p-6">
                        {/* Image */}
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-32 sm:w-32">
                          {primaryImage && (
                            <Image
                              src={primaryImage.url}
                              alt={
                                primaryImage.alt || item.product.name
                              }
                              fill
                              className="object-cover"
                              sizes="128px"
                            />
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                              {item.product.name}
                            </h3>
                            <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500 sm:text-sm">
                              {item.size && (
                                <span className="rounded-md bg-gray-100 px-2 py-0.5">
                                  {item.size}
                                </span>
                              )}
                              {item.color && (
                                <span className="rounded-md bg-gray-100 px-2 py-0.5">
                                  {item.color}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="mt-3 flex items-end justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center rounded-full border border-gray-200">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 sm:h-9 sm:w-9"
                                aria-label="Зменшити кількість"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium sm:w-10">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 sm:h-9 sm:w-9"
                                aria-label="Збільшити кількість"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-[#E31837]"
                                aria-label="Видалити"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                              <span className="text-sm font-bold text-gray-900 sm:text-base">
                                {formatPrice(
                                  item.product.price * item.quantity
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Promo Code */}
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Промокод
                </span>
              </div>
              {promoCode ? (
                <div className="flex items-center justify-between rounded-xl bg-green-50 px-4 py-3">
                  <span className="text-sm font-medium text-green-700">
                    {promoCode} — знижка {discount}%
                  </span>
                  <button
                    type="button"
                    onClick={removePromoCode}
                    className="text-sm text-green-700 underline hover:text-green-900"
                  >
                    Видалити
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value);
                        setPromoError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleApplyPromo();
                      }}
                      placeholder="Введіть промокод"
                      className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                    >
                      ЗАСТОСУВАТИ
                    </button>
                  </div>
                  {promoError && (
                    <p className="mt-2 text-xs text-[#E31837]">
                      {promoError}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Continue Shopping */}
            <Link
              href="/catalog"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-[#E31837]"
            >
              <ArrowLeft className="h-4 w-4" />
              ПРОДОВЖИТИ ПОКУПКИ
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                Підсумок замовлення
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Підсумок</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Знижка ({discount}%)</span>
                    <span className="font-medium">
                      -{formatPrice(discountAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Доставка</span>
                  <span className="font-medium text-gray-900">
                    {shipping === 0
                      ? "Безкоштовно"
                      : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400">
                    Безкоштовна доставка від {formatPrice(2000)}
                  </p>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-base font-bold text-gray-900">
                      Разом
                    </span>
                    <span className="text-base font-bold text-gray-900">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>
              <Link
                href="/checkout"
                className="mt-6 block w-full rounded-full bg-[#E31837] py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#c91430]"
              >
                ОФОРМИТИ ЗАМОВЛЕННЯ
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
