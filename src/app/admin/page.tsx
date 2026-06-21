"use client";

import Link from "next/link";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  Plus,
  Eye,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const stats = [
  {
    label: "Всього товарів",
    value: "156",
    change: "+12%",
    trend: "up",
    icon: Package,
    color: "bg-blue-500",
  },
  {
    label: "Замовлення",
    value: "89",
    change: "+8%",
    trend: "up",
    icon: ShoppingCart,
    color: "bg-[#E31837]",
  },
  {
    label: "Дохід",
    value: "₴245,600",
    change: "+23%",
    trend: "up",
    icon: DollarSign,
    color: "bg-green-500",
  },
  {
    label: "Активні користувачі",
    value: "1,234",
    change: "-2%",
    trend: "down",
    icon: Users,
    color: "bg-purple-500",
  },
];

const recentOrders = [
  {
    id: "ORD-7891",
    customer: "Олександр Петренко",
    date: "21.06.2026",
    total: "₴4,297",
    status: "NEW",
  },
  {
    id: "ORD-7890",
    customer: "Марія Коваленко",
    date: "20.06.2026",
    total: "₴2,498",
    status: "PROCESSING",
  },
  {
    id: "ORD-7889",
    customer: "Дмитро Шевченко",
    date: "20.06.2026",
    total: "₴1,899",
    status: "SHIPPED",
  },
  {
    id: "ORD-7888",
    customer: "Анна Мельник",
    date: "19.06.2026",
    total: "₴3,197",
    status: "DELIVERED",
  },
  {
    id: "ORD-7887",
    customer: "Іван Бондаренко",
    date: "19.06.2026",
    total: "₴999",
    status: "CANCELLED",
  },
];

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
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
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
                <span
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {stat.change}
                </span>
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
        {/* Recent Orders */}
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
                  <th className="px-6 py-3">Дата</th>
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
                      {order.id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {order.customer}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {order.date}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {order.total}
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

        {/* Quick Actions & Chart */}
        <div className="space-y-6">
          {/* Quick Actions */}
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

          {/* Revenue Chart Placeholder */}
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
