"use client";

import { useState } from "react";
import { Eye, ChevronUp } from "lucide-react";
import { formatPrice } from "@/lib/data";

type OrderStatus = "NEW" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  customer: string;
  email: string;
  phone: string;
  date: string;
  total: number;
  items: { name: string; qty: number; price: number; size?: string }[];
  address: string;
  paymentMethod: string;
  deliveryMethod: string;
  comment?: string;
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-7891",
    status: "NEW",
    customer: "Олександр Петренко",
    email: "oleksandr@test.com",
    phone: "+380501234567",
    date: "21.06.2026",
    total: 4297,
    items: [
      { name: "Компресійна футболка Pro Max", qty: 2, price: 1299, size: "L" },
      { name: "Компресійні шорти Elite", qty: 1, price: 999, size: "M" },
      { name: "Рашгард Pro Compression", qty: 1, price: 1499, size: "XL" },
    ],
    address: "м. Київ, вул. Хрещатик, 22",
    paymentMethod: "Онлайн оплата",
    deliveryMethod: "Нова Пошта",
    comment: "Будь ласка, загорніть у подарункову упаковку",
  },
  {
    id: "2",
    orderNumber: "ORD-7890",
    status: "PROCESSING",
    customer: "Марія Коваленко",
    email: "maria@test.com",
    phone: "+380671234567",
    date: "20.06.2026",
    total: 2498,
    items: [
      { name: "Жіночі компресійні легінси Flex", qty: 2, price: 1199, size: "S" },
    ],
    address: "м. Одessa, вул. Дерибасівська, 10",
    paymentMethod: "Післяплата",
    deliveryMethod: "Нова Пошта",
  },
  {
    id: "3",
    orderNumber: "ORD-7889",
    status: "SHIPPED",
    customer: "Дмитро Шевченко",
    email: "dmytro@test.com",
    phone: "+380931234567",
    date: "20.06.2026",
    total: 1899,
    items: [
      { name: "Рашгард Pro Compression", qty: 1, price: 1499, size: "M" },
      { name: "Компресійні шорти Elite", qty: 1, price: 999, size: "L" },
    ],
    address: "м. Львів, вул. Свободи, 45",
    paymentMethod: "Онлайн оплата",
    deliveryMethod: "Кур'єр",
  },
  {
    id: "4",
    orderNumber: "ORD-7888",
    status: "DELIVERED",
    customer: "Анна Мельник",
    email: "anna@test.com",
    phone: "+380631234567",
    date: "19.06.2026",
    total: 3197,
    items: [
      { name: "Компресійна футболка Pro Max", qty: 1, price: 1299, size: "M" },
      { name: "Жіночий компресійний топ Power", qty: 2, price: 899, size: "S" },
    ],
    address: "м. Харків, вул. Сумська, 78",
    paymentMethod: "Онлайн оплата",
    deliveryMethod: "Нова Пошта",
  },
  {
    id: "5",
    orderNumber: "ORD-7887",
    status: "CANCELLED",
    customer: "Іван Бондаренко",
    email: "ivan@test.com",
    phone: "+380501234568",
    date: "19.06.2026",
    total: 999,
    items: [
      { name: "Компресійні шорти Elite", qty: 1, price: 999, size: "XL" },
    ],
    address: "м. Дніпро, пр. Дмитра Яворницького, 55",
    paymentMethod: "Післяплата",
    deliveryMethod: "Нова Пошта",
    comment: "Замовлення скасовано за запитом клієнта",
  },
  {
    id: "6",
    orderNumber: "ORD-7886",
    status: "NEW",
    customer: "Тетяна Шевчук",
    email: "tetiana@test.com",
    phone: "+380671234568",
    date: "18.06.2026",
    total: 1999,
    items: [
      { name: "Чоловічий компресійний комплект Apex", qty: 1, price: 1999, size: "L" },
    ],
    address: "м. Запоріжжя, вул. Перемоги, 33",
    paymentMethod: "Онлайн оплата",
    deliveryMethod: "Кур'єр",
  },
  {
    id: "7",
    orderNumber: "ORD-7885",
    status: "PROCESSING",
    customer: "Павло Максименко",
    email: "pavlo@test.com",
    phone: "+380931234568",
    date: "18.06.2026",
    total: 699,
    items: [
      { name: "Дитяча компресійна футболка Junior", qty: 1, price: 699, size: "152" },
    ],
    address: "м. Вінниця, вул. Соборна, 12",
    paymentMethod: "Післяплата",
    deliveryMethod: "Нова Пошта",
  },
];

const statusTabs: { label: string; value: OrderStatus | "ALL" }[] = [
  { label: "Всі", value: "ALL" },
  { label: "Нові", value: "NEW" },
  { label: "Обробка", value: "PROCESSING" },
  { label: "Відправлено", value: "SHIPPED" },
  { label: "Доставлено", value: "DELIVERED" },
  { label: "Скасовано", value: "CANCELLED" },
];

const statusColors: Record<OrderStatus, string> = {
  NEW: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-yellow-100 text-yellow-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const statusLabels: Record<OrderStatus, string> = {
  NEW: "Нове",
  PROCESSING: "Обробка",
  SHIPPED: "Відправлено",
  DELIVERED: "Доставлено",
  CANCELLED: "Скасовано",
};

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus | "ALL">("ALL");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filteredOrders =
    activeTab === "ALL"
      ? mockOrders
      : mockOrders.filter((o) => o.status === activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Управління замовленнями
        </h2>
        <p className="text-sm text-gray-500">
          {mockOrders.length} замовлень всього
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-[#E31837] text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab.label}
            {tab.value !== "ALL" && (
              <span className="ml-1.5 text-xs opacity-75">
                ({mockOrders.filter((o) => o.status === tab.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
                <th className="px-6 py-3">Замовлення</th>
                <th className="px-6 py-3">Клієнт</th>
                <th className="px-6 py-3 hidden md:table-cell">Дата</th>
                <th className="px-6 py-3">Сума</th>
                <th className="px-6 py-3">Статус</th>
                <th className="px-6 py-3 text-right">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((order) => (
                <>
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.customer}
                        </p>
                        <p className="text-xs text-gray-500">{order.email}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                      {order.date}
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
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <button
                        onClick={() =>
                          setExpandedOrder(
                            expandedOrder === order.id ? null : order.id
                          )
                        }
                        className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {expandedOrder === order.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedOrder === order.id && (
                    <tr key={`${order.id}-details`}>
                      <td colSpan={6} className="bg-gray-50 px-6 py-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <div>
                            <h4 className="mb-2 text-sm font-semibold text-gray-900">
                              Товари
                            </h4>
                            <div className="space-y-2">
                              {order.items.map((item, i) => (
                                <div
                                  key={i}
                                  className="flex items-center justify-between text-sm"
                                >
                                  <span className="text-gray-600">
                                    {item.name}{" "}
                                    {item.size && (
                                      <span className="text-gray-400">
                                        ({item.size})
                                      </span>
                                    )}{" "}
                                    × {item.qty}
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {formatPrice(item.price * item.qty)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="mb-2 text-sm font-semibold text-gray-900">
                              Доставка
                            </h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p>{order.deliveryMethod}</p>
                              <p>{order.address}</p>
                              <p>{order.phone}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="mb-2 text-sm font-semibold text-gray-900">
                              Оплата
                            </h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p>{order.paymentMethod}</p>
                              {order.comment && (
                                <p className="mt-2 rounded-lg bg-white p-2 text-xs text-gray-500 border border-gray-200">
                                  {order.comment}
                                </p>
                              )}
                            </div>
                            <div className="mt-3 flex gap-2">
                              {order.status === "NEW" && (
                                <>
                                  <button className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600">
                                    Прийняти
                                  </button>
                                  <button className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600">
                                    Скасувати
                                  </button>
                                </>
                              )}
                              {order.status === "PROCESSING" && (
                                <button className="rounded-lg bg-purple-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-600">
                                  Відправити
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500">
              Замовлень не знайдено
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
