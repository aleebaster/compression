"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle,
  CreditCard,
  Smartphone,
  ArrowLeft,
  Package,
} from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const checkoutSchema = z.object({
  firstName: z.string().min(1, "Введіть ім'я"),
  lastName: z.string().optional(),
  phone: z
    .string()
    .min(1, "Введіть номер телефону")
    .regex(/^\+38\d{10}$/, "Невірний формат. Приклад: +380XXXXXXXXX"),
  email: z.string().email("Невірний формат email").optional().or(z.literal("")),
  city: z.string().min(1, "Введіть місто"),
  deliveryMethod: z.string().min(1, "Оберіть спосіб доставки"),
  address: z.string().optional(),
  comment: z.string().optional(),
  paymentMethod: z.string().min(1, "Оберіть спосіб оплати"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const deliveryMethods = [
  { value: "nova_poshta отделение", label: "Нова Пошта — відділення" },
  { value: "nova_poshta поштомат", label: "Нова Пошта — поштомат" },
  { value: "ukrposhta", label: "Укрпошта" },
];

const paymentMethods = [
  {
    value: "liqpay",
    label: "LiqPay",
    description: "Картка, Apple Pay, Google Pay",
    icon: CreditCard,
  },
  {
    value: "monobank",
    label: "Monobank",
    description: "Оплата через Mono",
    icon: Smartphone,
  },
];

export default function CheckoutPage() {
  const {
    items,
    discount,
    getTotal,
    getShippingCost,
    getFinalTotal,
    clearCart,
  } = useCartStore();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const subtotal = getTotal();
  const shipping = getShippingCost();
  const total = getFinalTotal();
  const discountAmount = (subtotal * discount) / 100;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryMethod: "nova_poshta отделение",
      paymentMethod: "liqpay",
    },
  });

  const selectedDelivery = watch("deliveryMethod");
  const selectedPayment = watch("paymentMethod");

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const num = Math.floor(10000 + Math.random() * 90000).toString();
    setOrderNumber(num);
    setIsSubmitted(true);
    clearCart();
  };

  if (isSubmitted) {
    return (
      <>
        <Header />
        <main className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.2,
              }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
            >
              <CheckCircle className="h-10 w-10 text-green-600" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900">
              Замовлення #{orderNumber} оформлено!
            </h1>
            <p className="mt-3 max-w-md text-gray-500">
              Дякуємо за покупку! Ми зв&apos;яжемося з вами найближчим часом
              для підтвердження замовлення.
            </p>
            <Link
              href="/catalog"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#E31837] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#c91430]"
            >
              ПОВЕРНУТИСЯ ДО КАТАЛОГУ
            </Link>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-4">
          <div className="text-center">
            <Package className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h1 className="text-xl font-bold text-gray-900">
              Кошик порожній
            </h1>
            <p className="mt-2 text-gray-500">
              Додайте товари перед оформленням замовлення
            </p>
            <Link
              href="/catalog"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#E31837] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#c91430]"
            >
              ПЕРЕЙТИ ДО КАТАЛОГУ
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/cart"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-[#E31837]"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад до кошика
        </Link>

        <h1 className="mb-8 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          ОФОРМЛЕННЯ ЗАМОВЛЕННЯ
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-8 lg:grid-cols-3"
        >
          {/* Form Fields */}
          <div className="space-y-6 lg:col-span-2">
            {/* Contact Info */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Контактні дані
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Ім&apos;я *
                  </label>
                  <input
                    type="text"
                    {...register("firstName")}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                    placeholder="Введіть ім'я"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-[#E31837]">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Прізвище
                  </label>
                  <input
                    type="text"
                    {...register("lastName")}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                    placeholder="Введіть прізвище"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                    placeholder="+380XXXXXXXXX"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-[#E31837]">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                    placeholder="email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-[#E31837]">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Доставка
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Місто *
                  </label>
                  <input
                    type="text"
                    {...register("city")}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                    placeholder="Введіть місто"
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-[#E31837]">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Спосіб доставки *
                  </label>
                  <div className="space-y-2">
                    {deliveryMethods.map((method) => (
                      <label
                        key={method.value}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                          selectedDelivery === method.value
                            ? "border-[#E31837] bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          value={method.value}
                          {...register("deliveryMethod")}
                          className="h-4 w-4 accent-[#E31837]"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {method.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.deliveryMethod && (
                    <p className="mt-1 text-xs text-[#E31837]">
                      {errors.deliveryMethod.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Адреса / номер відділення
                  </label>
                  <input
                    type="text"
                    {...register("address")}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                    placeholder="Введіть адресу або номер відділення"
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Спосіб оплати
              </h2>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <label
                    key={method.value}
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border px-4 py-4 transition-colors ${
                      selectedPayment === method.value
                        ? "border-[#E31837] bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      value={method.value}
                      {...register("paymentMethod")}
                      className="h-4 w-4 accent-[#E31837]"
                    />
                    <method.icon className="h-5 w-5 text-gray-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        {method.label}
                      </span>
                      <p className="text-xs text-gray-500">
                        {method.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              {errors.paymentMethod && (
                <p className="mt-2 text-xs text-[#E31837]">
                  {errors.paymentMethod.message}
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Коментар до замовлення
              </h2>
              <textarea
                {...register("comment")}
                rows={3}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                placeholder="Додаткові побажання до замовлення..."
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                Ваше замовлення
              </h2>

              {/* Items */}
              <div className="mb-4 max-h-64 space-y-3 overflow-y-auto">
                <AnimatePresence initial={false}>
                  {items.map((item) => {
                    const primaryImage = item.product.images.find(
                      (img) => img.isPrimary
                    ) || item.product.images[0];

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3"
                      >
                        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          {primaryImage && (
                            <Image
                              src={primaryImage.url}
                              alt={primaryImage.alt || item.product.name}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          )}
                        </div>
                        <div className="flex flex-1 justify-between">
                          <div>
                            <p className="text-xs font-medium text-gray-900 line-clamp-1">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.size && `${item.size} · `}
                              {item.color && `${item.color} · `}
                              ×{item.quantity}
                            </p>
                          </div>
                          <span className="text-xs font-medium text-gray-900">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-gray-200 pt-4 text-sm">
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 block w-full rounded-full bg-[#E31837] py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#c91430] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "ОБРОБКА..." : "ПІДТВЕРДИТИ ЗАМОВЛЕННЯ"}
              </button>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
