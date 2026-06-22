"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AccountPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">
            {isLogin ? "Увійдіть до облікового запису" : "Створити обліковий запис"}
          </h1>

          <form className="mt-8 space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Ім&apos;я
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Ваше ім'я"
                  className="mt-1 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-[#E31837] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E31837]"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Електронна пошта
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="mt-1 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-[#E31837] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E31837]"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                placeholder="Ваш пароль"
                className="mt-1 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-[#E31837] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E31837]"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#E31837] py-3 text-base font-semibold text-white transition-colors hover:bg-[#c0142f]"
            >
              {isLogin ? "Увійти" : "Зареєструватися"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? "Немає облікового запису?" : "Вже є обліковий запис?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-[#E31837] hover:underline"
            >
              {isLogin ? "Зареєструватися" : "Увійти"}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
