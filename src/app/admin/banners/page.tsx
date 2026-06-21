"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Eye, EyeOff, Upload, GripVertical } from "lucide-react";
import { banners } from "@/lib/data";

interface BannerData {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  isActive: boolean;
  order: number;
}

const mockBanners: BannerData[] = [
  {
    id: "b1",
    title: "Компресійний одяг для твого тренування",
    subtitle: "Преміальна якість для дорослих та дітей",
    image: "/hero-banner.png",
    link: "/catalog",
    isActive: true,
    order: 0,
  },
  {
    id: "b2",
    title: "Весняна колекція 2026",
    subtitle: "Нові надходження вже в наявності",
    image: "/hero-banner.png",
    link: "/catalog",
    isActive: true,
    order: 1,
  },
  {
    id: "b3",
    title: "Знижки до -30%",
    subtitle: "На обрані компресійні футболки",
    image: "/hero-banner.png",
    link: "/catalog",
    isActive: false,
    order: 2,
  },
];

export default function AdminBannersPage() {
  const [bannersList, setBannersList] = useState(mockBanners);

  const toggleActive = (id: string) => {
    setBannersList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Управління банерами
          </h2>
          <p className="text-sm text-gray-500">
            {bannersList.length} банерів
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-[#E31837] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#B5122C] transition-colors">
          <Plus className="h-4 w-4" />
          Додати банер
        </button>
      </div>

      {/* Upload Area */}
      <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white p-8 text-center hover:border-gray-300 transition-colors">
        <Upload className="mx-auto mb-3 h-10 w-10 text-gray-400" />
        <p className="text-sm font-medium text-gray-700">
          Перетягніть зображення банера сюди
        </p>
        <p className="mt-1 text-xs text-gray-500">
          PNG, JPG або WebP. Рекомендований розмір: 1920x600px
        </p>
      </div>

      {/* Banners List */}
      <div className="space-y-4">
        {bannersList.map((banner, index) => (
          <div
            key={banner.id}
            className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
          >
            {/* Drag Handle */}
            <div className="flex items-center gap-3 sm:order-first">
              <button className="cursor-grab text-gray-300 hover:text-gray-500">
                <GripVertical className="h-5 w-5" />
              </button>
              <span className="text-sm font-medium text-gray-400">
                #{index + 1}
              </span>
            </div>

            {/* Preview */}
            <div className="relative h-32 w-full overflow-hidden rounded-lg bg-gray-100 sm:h-20 sm:w-40">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Info */}
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

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleActive(banner.id)}
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
              <button className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <Edit2 className="h-4 w-4" />
              </button>
              <button className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
