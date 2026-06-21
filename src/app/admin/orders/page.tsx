"use client";

import { useState, useMemo, Fragment } from "react";
import { Eye, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import { useAdminOrders } from "@/lib/admin-store";
import { formatPrice } from "@/lib/data";

type OrderStatus = "NEW" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

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
  const { orders, updateOrderStatus } = useAdminOrders();
  const [activeTab, setActiveTab] = useState<OrderStatus | "ALL">("ALL");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    return activeTab === "ALL"
      ? orders
      : orders.filter((o) => o.status === activeTab);
  }, [orders, activeTab]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    toast.success(`Статус змінено на "${statusLabels[newStatus]}"`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Управління замовленнями
        </h2>
        <p className="text-sm text-gray-500">
          {orders.length} замовлень всього
        </p>
      </div>

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
                ({orders.filter((o) => o.status === tab.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

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
                <Fragment key={order.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.firstName} {order.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{order.email}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                      {new Date(order.createdAt).toLocaleDateString("uk-UA")}
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
                    <tr>
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
                                    {item.product?.name || "Товар"}{" "}
                                    {item.size && (
                                      <span className="text-gray-400">
                                        ({item.size})
                                      </span>
                                    )}{" "}
                                    × {item.quantity}
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {formatPrice(item.price * item.quantity)}
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
                              <p>{order.city}, {order.address}</p>
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
                            <div className="mt-3 flex flex-wrap gap-2">
                              {order.status === "NEW" && (
                                <>
                                  <button
                                    onClick={() => handleStatusChange(order.id, "PROCESSING")}
                                    className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600 transition-colors"
                                  >
                                    Прийняти
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(order.id, "CANCELLED")}
                                    className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600 transition-colors"
                                  >
                                    Скасувати
                                  </button>
                                </>
                              )}
                              {order.status === "PROCESSING" && (
                                <button
                                  onClick={() => handleStatusChange(order.id, "SHIPPED")}
                                  className="rounded-lg bg-purple-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-600 transition-colors"
                                >
                                  Відправити
                                </button>
                              )}
                              {order.status === "SHIPPED" && (
                                <button
                                  onClick={() => handleStatusChange(order.id, "DELIVERED")}
                                  className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-600 transition-colors"
                                >
                                  Доставлено
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
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
