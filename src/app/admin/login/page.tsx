"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { LogIn, Package, Eye, EyeOff } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-store";
import Logo from "@/components/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Заповніть всі поля");
      return;
    }

    const success = login(email, password);
    if (success) {
      toast.success("Вхід виконано успішно!");
      router.push("/admin");
    } else {
      setError("Невірний email або пароль");
      toast.error("Невірний email або пароль");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#E31837]">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <Logo size="lg" />
              <span className="text-lg font-medium text-gray-500">Admin</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Увійдіть до панелі управління
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@compex.ua"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#E31837] focus:bg-white focus:ring-1 focus:ring-[#E31837]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 pr-10 text-sm text-gray-900 outline-none transition-colors focus:border-[#E31837] focus:bg-white focus:ring-1 focus:ring-[#E31837]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#E31837] px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#B5122C]"
            >
              <LogIn className="h-4 w-4" />
              Увійти
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
