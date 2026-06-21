"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Truck, CreditCard, RotateCcw } from "lucide-react";

export default function DeliveryPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Доставка та оплата
          </h1>

          {/* Free delivery banner */}
          <div className="mt-8 rounded-2xl bg-gradient-to-r from-[#E31837] to-[#B8142D] p-6 text-white sm:p-8">
            <div className="flex items-center gap-4">
              <Truck className="h-10 w-10 shrink-0" />
              <div>
                <h2 className="text-xl font-bold">Безкоштовна доставка</h2>
                <p className="mt-1 text-white/90">
                  При замовленні від 2 000 ₴ доставка по Україні безкоштовна!
                </p>
              </div>
            </div>
          </div>

          {/* Nova Poshta */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">
              Нова Пошта
            </h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-700">Тип доставки</th>
                    <th className="px-4 py-3 font-medium text-gray-700">Термін</th>
                    <th className="px-4 py-3 font-medium text-gray-700">Вартість</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Відділення</td>
                    <td className="px-4 py-3 text-gray-600">1–3 дні</td>
                    <td className="px-4 py-3 text-gray-600">від 65 ₴</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Поштомат</td>
                    <td className="px-4 py-3 text-gray-600">1–3 дні</td>
                    <td className="px-4 py-3 text-gray-600">від 50 ₴</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Кур&apos;єр</td>
                    <td className="px-4 py-3 text-gray-600">1–2 дні</td>
                    <td className="px-4 py-3 text-gray-600">від 85 ₴</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Ukrposhta */}
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">
              Укрпошта
            </h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-700">Тип доставки</th>
                    <th className="px-4 py-3 font-medium text-gray-700">Термін</th>
                    <th className="px-4 py-3 font-medium text-gray-700">Вартість</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Відділення</td>
                    <td className="px-4 py-3 text-gray-600">3–5 днів</td>
                    <td className="px-4 py-3 text-gray-600">від 45 ₴</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Кур&apos;єр</td>
                    <td className="px-4 py-3 text-gray-600">2–4 дні</td>
                    <td className="px-4 py-3 text-gray-600">від 70 ₴</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Payment */}
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">Способи оплати</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-gray-200 p-5">
                <CreditCard className="h-6 w-6 shrink-0 text-[#E31837]" />
                <div>
                  <h3 className="font-semibold text-gray-900">LiqPay</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Онлайн-оплата карткою Visa, Mastercard, Apple Pay, Google Pay через LiqPay.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-gray-200 p-5">
                <CreditCard className="h-6 w-6 shrink-0 text-[#E31837]" />
                <div>
                  <h3 className="font-semibold text-gray-900">Monobank</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Швидка онлайн-оплата через Mono без комісії.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Return policy */}
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">Повернення та обмін</h2>
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-gray-200 p-5">
              <RotateCcw className="h-6 w-6 shrink-0 text-[#E31837]" />
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  Відповідно до Закону України &laquo;Про захист прав споживачів&raquo;, Ви маєте
                  право повернути або обміняти товар на протязі <strong>14 днів</strong> з моменту
                  отримання замовлення.
                </p>
                <p>
                  Товар повинен бути без слідів використання, зберігати оригінальну упаковку та
                  бирки. Для оформлення повернення зверніться до нас за телефоном або електронною
                  поштою.
                </p>
                <p>
                  Гроші повертаються на картку протягом <strong>3–5 робочих днів</strong> після
                  отримання повернення.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
