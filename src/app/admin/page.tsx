"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Plus,
  Eye,
  Clock,
} from "lucide-react";
import { useAdminProducts, useAdminOrders } from "@/lib/admin-store";
import { formatPrice } from "@/lib/data";

const statusColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-yellow-100 text-yellow-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  NEW: "Нове",
  PROCESSING: "Обробка",
  SHIPPED: "Відправлено",
  DELIVERED: "Доставлено",
  CANCELLED: "Скасовано",
};

export default function AdminDashboard() {
  const { products } = useAdminProducts();
  const { orders } = useAdminOrders();

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter((o) => o.status !== "CANCELLED")
      .reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = orders.filter((o) => o.status === "NEW").length;

    return [
      {
        label: "Всього товарів",
        value: totalProducts.toString(),
        icon: Package,
        color: "bg-blue-500",
      },
      {
        label: "Замовлення",
        value: totalOrders.toString(),
        icon: ShoppingCart,
        color: "bg-[#E31837]",
      },
      {
        label: "Дохід",
        value: formatPrice(totalRevenue),
        icon: DollarSign,
        color: "bg-green-500",
      },
      {
        label: "Очікують",
        value: pendingOrders.toString(),
        icon: Clock,
        color: "bg-yellow-500",
      },
    ];
  }, [products, orders]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [orders]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Останні замовлення
            </h2>
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-[#E31837] hover:underline"
            >
              Переглянути всі
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase text-gray-500">
                  <th className="px-6 py-3">Замовлення</th>
                  <th className="px-6 py-3">Клієнт</th>
                  <th className="px-6 py-3">Сума</th>
                  <th className="px-6 py-3">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {order.firstName} {order.lastName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {formatPrice(order.total)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          statusColors[order.status]
                        }`}
                      >
                        {statusLabels[order.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Швидкі дії
            </h2>
            <div className="space-y-3">
              <Link
                href="/admin/products/new"
                className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm font-medium text-gray-700 hover:border-[#E31837] hover:bg-red-50 hover:text-[#E31837] transition-all"
              >
                <Plus className="h-5 w-5" />
                Додати товар
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm font-medium text-gray-700 hover:border-[#E31837] hover:bg-red-50 hover:text-[#E31837] transition-all"
              >
                <Eye className="h-5 w-5" />
                Переглянути замовлення
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm font-medium text-gray-700 hover:border-[#E31837] hover:bg-red-50 hover:text-[#E31837] transition-all"
              >
                <Package className="h-5 w-5" />
                Управління товарами
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Дохід</h2>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex h-48 items-end gap-2">
              {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map(
                (height, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-[#E31837] to-[#FF2D4B] opacity-80 hover:opacity-100 transition-opacity"
                    style={{ height: `${height}%` }}
                  />
                )
              )}
            </div>
            <div className="mt-3 flex justify-between text-xs text-gray-400">
              <span>Січ</span>
              <span>Лют</span>
              <span>Бер</span>
              <span>Кві</span>
              <span>Тра</span>
              <span>Чер</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
