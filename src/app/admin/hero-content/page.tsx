"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Type,
  ArrowLeft,
  Palette,
  AlignCenter,
} from "lucide-react";
import { useAdminHeroContent } from "@/lib/admin-store";
import type { HeroContent } from "@/lib/types";

interface HeroContentFormData {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  position: string;
  textColor: string;
  textShadow: boolean;
  isActive: boolean;
  order: number;
}

const defaultFormData: HeroContentFormData = {
  title: "",
  subtitle: "",
  description: "",
  buttonText: "",
  buttonLink: "",
  position: "center",
  textColor: "#FFFFFF",
  textShadow: true,
  isActive: true,
  order: 0,
};

const positionOptions = [
  { value: "center", label: "Центр" },
  { value: "left", label: "Ліворуч" },
  { value: "right", label: "Праворуч" },
  { value: "top-left", label: "Зверху ліворуч" },
  { value: "top-right", label: "Зверху праворуч" },
  { value: "bottom-left", label: "Знизу ліворуч" },
  { value: "bottom-right", label: "Знизу праворуч" },
];

const positionGrid: { value: string; row: number; col: number }[] = [
  { value: "top-left", row: 0, col: 0 },
  { value: "top-right", row: 0, col: 2 },
  { value: "left", row: 1, col: 0 },
  { value: "center", row: 1, col: 1 },
  { value: "right", row: 1, col: 2 },
  { value: "bottom-left", row: 2, col: 0 },
  { value: "bottom-right", row: 2, col: 2 },
];

function getPositionLabel(pos: string): string {
  return positionOptions.find((o) => o.value === pos)?.label || pos;
}

export default function AdminHeroContentPage() {
  const { items, addItem, updateItem, deleteItem } = useAdminHeroContent();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<HeroContentFormData>(defaultFormData);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ ...defaultFormData, order: items.length });
    setShowModal(true);
  };

  const openEditModal = (item: HeroContent) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || "",
      subtitle: item.subtitle || "",
      description: item.description || "",
      buttonText: item.buttonText || "",
      buttonLink: item.buttonLink || "",
      position: item.position,
      textColor: item.textColor,
      textShadow: item.textShadow,
      isActive: item.isActive,
      order: item.order,
    });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateItem(editingId, formData);
      toast.success("Hero контент оновлено");
    } else {
      addItem(formData);
      toast.success("Hero контент додано");
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (confirm(`Видалити "${item?.title || "Hero контент"}"?`)) {
      deleteItem(id);
      toast.success("Hero контент видалено");
    }
  };

  const handleToggle = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    updateItem(id, { isActive: !item.isActive });
    toast.success(item.isActive ? "Деактивовано" : "Активовано");
  };

  const updateField = <K extends keyof HeroContentFormData>(
    key: K,
    value: HeroContentFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const getPositionPreviewClasses = (pos: string): string => {
    const map: Record<string, string> = {
      center: "items-center justify-center text-center",
      left: "items-start justify-center text-left pl-6",
      right: "items-end justify-center text-right pr-6",
      "top-left": "items-start justify-start text-left p-4",
      "top-right": "items-end justify-start text-right p-4",
      "bottom-left": "items-start justify-end text-left p-4",
      "bottom-right": "items-end justify-end text-right p-4",
    };
    return map[pos] || map.center;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hero Контент</h2>
          <p className="text-sm text-gray-500">
            Текстовий оверлей поверх банерів · {items.length} записів
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-[#E31837] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#B5122C] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Додати Hero
        </button>
      </div>

      <div className="space-y-4">
        {items.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <Type className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-sm text-gray-500">
              Немає hero контенту. Створіть перший!
            </p>
          </div>
        )}

        {items.map((item, index) => (
          <div
            key={item.id}
            className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <GripVertical className="h-5 w-5 text-gray-300" />
                <span className="text-sm font-medium text-gray-400">
                  #{index + 1}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {item.title || "(Без заголовка)"}
                  </h3>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                    {getPositionLabel(item.position)}
                  </span>
                  {item.subtitle && (
                    <span className="text-xs text-gray-400 truncate hidden sm:inline">
                      — {item.subtitle}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="mt-0.5 text-xs text-gray-500 truncate">
                    {item.description}
                  </p>
                )}
                <div className="mt-1.5 flex items-center gap-3 flex-wrap">
                  {item.buttonText && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                      Кнопка: {item.buttonText}
                    </span>
                  )}
                  {item.buttonLink && (
                    <span className="text-[10px] text-blue-500 truncate">
                      {item.buttonLink}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                    <span
                      className="inline-block h-3 w-3 rounded-full border border-gray-200"
                      style={{ backgroundColor: item.textColor }}
                    />
                    {item.textColor}
                  </span>
                  {item.textShadow && (
                    <span className="text-[10px] text-gray-400">Тінь</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggle(item.id)}
                  className={`rounded-lg p-2 transition-colors ${
                    item.isActive
                      ? "bg-green-50 text-green-600 hover:bg-green-100"
                      : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                  }`}
                  title={item.isActive ? "Активний" : "Неактивний"}
                >
                  {item.isActive ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => openEditModal(item)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Live preview */}
            <div className="border-t border-gray-100 bg-gradient-to-br from-gray-800 to-gray-900 px-4 py-6">
              <div
                className={`relative flex min-h-[120px] flex-col ${getPositionPreviewClasses(
                  item.position
                )}`}
              >
                {item.title && (
                  <h4
                    className="text-lg font-bold leading-tight"
                    style={{
                      color: item.textColor,
                      textShadow: item.textShadow
                        ? "0 2px 8px rgba(0,0,0,0.6)"
                        : "none",
                    }}
                  >
                    {item.title}
                  </h4>
                )}
                {item.subtitle && (
                  <p
                    className="mt-1 text-sm"
                    style={{
                      color: item.textColor,
                      opacity: 0.85,
                      textShadow: item.textShadow
                        ? "0 1px 4px rgba(0,0,0,0.5)"
                        : "none",
                    }}
                  >
                    {item.subtitle}
                  </p>
                )}
                {item.description && (
                  <p
                    className="mt-1 text-xs"
                    style={{
                      color: item.textColor,
                      opacity: 0.7,
                      textShadow: item.textShadow
                        ? "0 1px 4px rgba(0,0,0,0.5)"
                        : "none",
                    }}
                  >
                    {item.description}
                  </p>
                )}
                {item.buttonText && (
                  <button
                    className="mt-3 inline-flex items-center rounded-lg bg-[#E31837] px-4 py-2 text-xs font-medium text-white shadow-md hover:bg-[#B5122C] transition-colors w-fit"
                    style={{
                      textShadow: item.textShadow
                        ? "0 1px 2px rgba(0,0,0,0.3)"
                        : "none",
                    }}
                  >
                    {item.buttonText}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <EditModal
          formData={formData}
          editingId={editingId}
          updateField={updateField}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          getPositionPreviewClasses={getPositionPreviewClasses}
        />
      )}
    </div>
  );
}

function EditModal({
  formData,
  editingId,
  updateField,
  onClose,
  onSubmit,
  getPositionPreviewClasses,
}: {
  formData: HeroContentFormData;
  editingId: string | null;
  updateField: <K extends keyof HeroContentFormData>(
    key: K,
    value: HeroContentFormData[K]
  ) => void;
  onClose: () => void;
  onSubmit: () => void;
  getPositionPreviewClasses: (pos: string) => string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {editingId ? "Редагувати Hero" : "Новий Hero контент"}
            </h3>
            <p className="text-xs text-gray-500">
              Налаштуйте текстовий оверлей для банерів
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Скасувати
          </button>
          <button
            onClick={onSubmit}
            className="rounded-lg bg-[#E31837] px-4 py-2 text-sm font-medium text-white hover:bg-[#B5122C] transition-colors"
          >
            {editingId ? "Зберегти" : "Створити"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left: Form */}
            <div className="space-y-6">
              {/* Text Content */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4 text-gray-500" />
                  <h4 className="text-sm font-semibold text-gray-900">
                    Текстовий вміст
                  </h4>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Заголовок
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                    placeholder="Компресійний одяг для тренувань"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Підзаголовок
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => updateField("subtitle", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                    placeholder="Преміальна якість для дорослих та дітей"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Опис
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837] resize-none"
                    placeholder="Відчуйте різницю з компресійним одягом COMPEX"
                  />
                </div>
              </div>

              {/* Button */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <AlignCenter className="h-4 w-4 text-gray-500" />
                  <h4 className="text-sm font-semibold text-gray-900">Кнопка</h4>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Текст кнопки
                    </label>
                    <input
                      type="text"
                      value={formData.buttonText}
                      onChange={(e) => updateField("buttonText", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                      placeholder="Переглянути каталог"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Посилання
                    </label>
                    <input
                      type="text"
                      value={formData.buttonLink}
                      onChange={(e) => updateField("buttonLink", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                      placeholder="/catalog"
                    />
                  </div>
                </div>
              </div>

              {/* Position */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <AlignCenter className="h-4 w-4 text-gray-500" />
                  <h4 className="text-sm font-semibold text-gray-900">
                    Позиція на банері
                  </h4>
                </div>

                {/* Position Grid */}
                <div className="flex justify-center">
                  <div
                    className="grid grid-cols-3 gap-1.5 rounded-xl border border-gray-200 bg-gray-50 p-3"
                    style={{ width: "fit-content" }}
                  >
                    {positionGrid.map((pos) => (
                      <button
                        key={pos.value}
                        onClick={() => updateField("position", pos.value)}
                        className={`flex h-14 w-20 items-center justify-center rounded-lg border text-[10px] font-medium transition-all ${
                          formData.position === pos.value
                            ? "border-[#E31837] bg-red-50 text-[#E31837] shadow-sm"
                            : "border-gray-200 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        }`}
                        style={{ gridRow: pos.row + 1, gridColumn: pos.col + 1 }}
                      >
                        {positionOptions.find((o) => o.value === pos.value)
                          ?.label || pos.value}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile-friendly dropdown */}
                <div className="sm:hidden">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Позиція (список)
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => updateField("position", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                  >
                    {positionOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Style */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-gray-500" />
                  <h4 className="text-sm font-semibold text-gray-900">Стиль</h4>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Колір тексту
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <input
                          type="color"
                          value={formData.textColor}
                          onChange={(e) => updateField("textColor", e.target.value)}
                          className="h-10 w-10 cursor-pointer rounded-lg border border-gray-200 p-0.5"
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.textColor}
                        onChange={(e) => updateField("textColor", e.target.value)}
                        className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Тінь тексту
                      </label>
                      <button
                        onClick={() => updateField("textShadow", !formData.textShadow)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          formData.textShadow ? "bg-[#E31837]" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                            formData.textShadow ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Активний
                      </label>
                      <button
                        onClick={() => updateField("isActive", !formData.isActive)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          formData.isActive ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                            formData.isActive ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Порядок
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      updateField("order", parseInt(e.target.value) || 0)
                    }
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                    min={0}
                  />
                </div>
              </div>
            </div>

            {/* Right: Live Preview */}
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4 lg:sticky lg:top-6">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-gray-500" />
                  <h4 className="text-sm font-semibold text-gray-900">
                    Попередній перегляд
                  </h4>
                </div>

                {/* Preview card simulating a banner */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-800 to-gray-900">
                  <div className="relative min-h-[300px]">
                    {/* Dark overlay simulation */}
                    <div className="absolute inset-0 bg-black/20" />

                    {/* Hero text overlay */}
                    <div
                      className={`relative flex min-h-[300px] flex-col ${getPositionPreviewClasses(
                        formData.position
                      )}`}
                    >
                      {formData.title ? (
                        <h2
                          className="text-2xl font-bold leading-tight sm:text-3xl"
                          style={{
                            color: formData.textColor,
                            textShadow: formData.textShadow
                              ? "0 2px 12px rgba(0,0,0,0.6)"
                              : "none",
                          }}
                        >
                          {formData.title}
                        </h2>
                      ) : (
                        <h2 className="text-2xl font-bold text-white/30 sm:text-3xl">
                          Заголовок...
                        </h2>
                      )}

                      {formData.subtitle && (
                        <p
                          className="mt-2 text-sm sm:text-base"
                          style={{
                            color: formData.textColor,
                            opacity: 0.85,
                            textShadow: formData.textShadow
                              ? "0 1px 6px rgba(0,0,0,0.5)"
                              : "none",
                          }}
                        >
                          {formData.subtitle}
                        </p>
                      )}

                      {formData.description && (
                        <p
                          className="mt-2 text-xs sm:text-sm"
                          style={{
                            color: formData.textColor,
                            opacity: 0.7,
                            textShadow: formData.textShadow
                              ? "0 1px 4px rgba(0,0,0,0.5)"
                              : "none",
                          }}
                        >
                          {formData.description}
                        </p>
                      )}

                      {formData.buttonText && (
                        <button
                          className="mt-4 inline-flex w-fit items-center rounded-lg bg-[#E31837] px-6 py-2.5 text-sm font-medium text-white shadow-lg hover:bg-[#B5122C] transition-colors"
                          style={{
                            textShadow: formData.textShadow
                              ? "0 1px 2px rgba(0,0,0,0.3)"
                              : "none",
                          }}
                        >
                          {formData.buttonText}
                          {formData.buttonLink && (
                            <span className="ml-2 text-white/60 text-xs">
                              → {formData.buttonLink}
                            </span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="rounded-lg bg-gray-50 p-3 space-y-1.5 text-xs text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Позиція:</span>
                    <span className="font-medium">
                      {getPositionLabel(formData.position)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Колір:</span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <span
                        className="inline-block h-3 w-3 rounded-full border border-gray-200"
                        style={{ backgroundColor: formData.textColor }}
                      />
                      {formData.textColor}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Тінь:</span>
                    <span className="font-medium">
                      {formData.textShadow ? "Увімкнено" : "Вимкнено"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Статус:</span>
                    <span
                      className={`font-medium ${
                        formData.isActive ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      {formData.isActive ? "Активний" : "Неактивний"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Порядок:</span>
                    <span className="font-medium">#{formData.order}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
