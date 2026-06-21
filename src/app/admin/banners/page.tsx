"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, Eye, EyeOff, X } from "lucide-react";
import { useAdminBanners } from "@/lib/admin-store";

interface BannerFormData {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  isActive: boolean;
  order: number;
}

export default function AdminBannersPage() {
  const { banners, addBanner, updateBanner, deleteBanner, toggleBanner } = useAdminBanners();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BannerFormData>({
    title: "",
    subtitle: "",
    image: "",
    link: "",
    isActive: true,
    order: 0,
  });

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: "", subtitle: "", image: "", link: "", isActive: true, order: banners.length });
    setShowModal(true);
  };

  const openEditModal = (banner: typeof banners[0]) => {
    setEditingId(banner.id);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      image: banner.image,
      link: banner.link || "",
      isActive: banner.isActive,
      order: banner.order,
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Назва обов'язкова");
      return;
    }

    if (editingId) {
      updateBanner(editingId, formData);
      toast.success("Банер оновлено");
    } else {
      addBanner(formData);
      toast.success("Банер додано");
    }
    setShowModal(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Видалити банер "${title}"?`)) {
      deleteBanner(id);
      toast.success("Банер видалено");
    }
  };

  const handleToggle = (id: string) => {
    toggleBanner(id);
    toast.success("Статус банера змінено");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Управління банерами
          </h2>
          <p className="text-sm text-gray-500">
            {banners.length} банерів
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-[#E31837] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#B5122C] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Додати банер
        </button>
      </div>

      <div className="space-y-4">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-3 sm:order-first">
              <span className="text-sm font-medium text-gray-400">
                #{index + 1}
              </span>
            </div>

            <div className="relative h-32 w-full overflow-hidden rounded-lg bg-gray-100 sm:h-20 sm:w-40">
              {banner.image ? (
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-400">
                  Немає зображення
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {banner.title}
              </h3>
              {banner.subtitle && (
                <p className="mt-0.5 text-xs text-gray-500 truncate">
                  {banner.subtitle}
                </p>
              )}
              {banner.link && (
                <p className="mt-1 text-xs text-blue-500 truncate">
                  {banner.link}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggle(banner.id)}
                className={`rounded-lg p-2 transition-colors ${
                  banner.isActive
                    ? "bg-green-50 text-green-600 hover:bg-green-100"
                    : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                }`}
                title={banner.isActive ? "Активний" : "Неактивний"}
              >
                {banner.isActive ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => openEditModal(banner)}
                className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(banner.id, banner.title)}
                className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingId ? "Редагувати банер" : "Новий банер"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Заголовок *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                  placeholder="Заголовок банера"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Підзаголовок
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, subtitle: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                  placeholder="Підзаголовок"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  URL зображення
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, image: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Посилання
                </label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, link: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                  placeholder="/catalog"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#E31837] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#B5122C] transition-colors"
                >
                  {editingId ? "Оновити" : "Створити"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Скасувати
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
