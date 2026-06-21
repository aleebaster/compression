"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Upload,
  Monitor,
  Tablet,
  Smartphone,
  ImageIcon,
  SlidersHorizontal,
  Maximize,
  Eye as EyeIcon,
  ArrowLeft,
} from "lucide-react";
import { useAdminBanners } from "@/lib/admin-store";
import type { Banner } from "@/lib/types";

type ModalTab = "images" | "positioning" | "dimensions" | "preview";

interface BannerFormData {
  title: string;
  subtitle: string;
  link: string;
  isActive: boolean;
  order: number;
  desktopImage: string;
  tabletImage: string;
  mobileImage: string;
  positionX: number;
  positionY: number;
  objectPosition: string;
  scale: number;
  heightDesktop: number;
  heightTablet: number;
  heightMobile: number;
}

const defaultFormData: BannerFormData = {
  title: "",
  subtitle: "",
  link: "",
  isActive: true,
  order: 0,
  desktopImage: "",
  tabletImage: "",
  mobileImage: "",
  positionX: 0,
  positionY: 0,
  objectPosition: "center",
  scale: 1.0,
  heightDesktop: 750,
  heightTablet: 650,
  heightMobile: 500,
};

const objectPositionOptions = [
  { value: "center", label: "Центр" },
  { value: "left", label: "Ліворуч" },
  { value: "right", label: "Праворуч" },
  { value: "top", label: "Зверху" },
  { value: "bottom", label: "Знизу" },
  { value: "top-left", label: "Зверху ліворуч" },
  { value: "top-right", label: "Зверху праворуч" },
  { value: "bottom-left", label: "Знизу ліворуч" },
  { value: "bottom-right", label: "Знизу праворуч" },
];

function getObjectPositionCSS(pos: string): React.CSSProperties["objectPosition"] {
  const map: Record<string, string> = {
    center: "50% 50%",
    left: "0% 50%",
    right: "100% 50%",
    top: "50% 0%",
    bottom: "50% 100%",
    "top-left": "0% 0%",
    "top-right": "100% 0%",
    "bottom-left": "0% 100%",
    "bottom-right": "100% 100%",
  };
  return (map[pos] || "50% 50%") as React.CSSProperties["objectPosition"];
}

export default function AdminBannersPage() {
  const { banners, addBanner, updateBanner, deleteBanner, toggleBanner } = useAdminBanners();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ModalTab>("images");
  const [formData, setFormData] = useState<BannerFormData>(defaultFormData);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ ...defaultFormData, order: banners.length });
    setActiveTab("images");
    setShowModal(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingId(banner.id);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      link: banner.link || "",
      isActive: banner.isActive,
      order: banner.order,
      desktopImage: banner.desktopImage,
      tabletImage: banner.tabletImage,
      mobileImage: banner.mobileImage,
      positionX: banner.positionX,
      positionY: banner.positionY,
      objectPosition: banner.objectPosition,
      scale: banner.scale,
      heightDesktop: banner.heightDesktop,
      heightTablet: banner.heightTablet,
      heightMobile: banner.heightMobile,
    });
    setActiveTab("images");
    setShowModal(true);
  };

  const handleSubmit = () => {
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

  const updateField = <K extends keyof BannerFormData>(key: K, value: BannerFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hero Banners</h2>
          <p className="text-sm text-gray-500">{banners.length} банерів</p>
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
        {banners.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-sm text-gray-500">Немає банерів. Створіть перший!</p>
          </div>
        )}
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-3">
              <GripVertical className="h-5 w-5 text-gray-300" />
              <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
            </div>

            <div className="flex gap-2 sm:order-last">
              {banner.desktopImage && (
                <div className="relative h-16 w-28 overflow-hidden rounded-lg bg-gray-100">
                  <Image src={banner.desktopImage} alt="Desktop" fill className="object-cover" />
                  <span className="absolute bottom-0.5 left-0.5 rounded bg-black/60 px-1 py-0.5 text-[9px] text-white">D</span>
                </div>
              )}
              {banner.tabletImage && (
                <div className="relative hidden h-16 w-20 overflow-hidden rounded-lg bg-gray-100 sm:block">
                  <Image src={banner.tabletImage} alt="Tablet" fill className="object-cover" />
                  <span className="absolute bottom-0.5 left-0.5 rounded bg-black/60 px-1 py-0.5 text-[9px] text-white">T</span>
                </div>
              )}
              {banner.mobileImage && (
                <div className="relative hidden h-16 w-12 overflow-hidden rounded-lg bg-gray-100 sm:block">
                  <Image src={banner.mobileImage} alt="Mobile" fill className="object-cover" />
                  <span className="absolute bottom-0.5 left-0.5 rounded bg-black/60 px-1 py-0.5 text-[9px] text-white">M</span>
                </div>
              )}
              {!banner.desktopImage && !banner.tabletImage && !banner.mobileImage && (
                <div className="flex h-16 w-28 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                  Немає зображень
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{banner.title}</h3>
              {banner.subtitle && (
                <p className="mt-0.5 text-xs text-gray-500 truncate">{banner.subtitle}</p>
              )}
              {banner.link && (
                <p className="mt-1 text-xs text-blue-500 truncate">{banner.link}</p>
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
                {banner.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
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
        <EditModal
          formData={formData}
          editingId={editingId}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          updateField={updateField}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

function EditModal({
  formData,
  editingId,
  activeTab,
  setActiveTab,
  updateField,
  onClose,
  onSubmit,
}: {
  formData: BannerFormData;
  editingId: string | null;
  activeTab: ModalTab;
  setActiveTab: (tab: ModalTab) => void;
  updateField: <K extends keyof BannerFormData>(key: K, value: BannerFormData[K]) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const tabs: { id: ModalTab; label: string; icon: React.ReactNode }[] = [
    { id: "images", label: "Зображення", icon: <ImageIcon className="h-4 w-4" /> },
    { id: "positioning", label: "Позиціонування", icon: <SlidersHorizontal className="h-4 w-4" /> },
    { id: "dimensions", label: "Розміри", icon: <Maximize className="h-4 w-4" /> },
    { id: "preview", label: "Preview", icon: <EyeIcon className="h-4 w-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {editingId ? "Редагувати банер" : "Новий банер"}
            </h3>
            <p className="text-xs text-gray-500">Додайте зображення та налаштуйте відображення</p>
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

      <div className="flex border-b border-gray-200 bg-gray-50 px-4 sm:px-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-[#E31837] text-[#E31837]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          {activeTab === "images" && <ImagesTab formData={formData} updateField={updateField} />}
          {activeTab === "positioning" && <PositioningTab formData={formData} updateField={updateField} />}
          {activeTab === "dimensions" && <DimensionsTab formData={formData} updateField={updateField} />}
          {activeTab === "preview" && <PreviewTab formData={formData} />}
        </div>
      </div>
    </div>
  );
}

function ImageUploadZone({
  label,
  sublabel,
  image,
  onUpload,
  onRemove,
}: {
  label: string;
  sublabel: string;
  image: string;
  onUpload: (base64: string) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
        toast.error("Підтримуються JPG, PNG, WEBP");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onUpload(result);
        toast.success("Зображення завантажено");
      };
      reader.readAsDataURL(file);
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="border-b border-gray-100 px-4 py-3">
        <h4 className="text-sm font-semibold text-gray-900">{label}</h4>
        <p className="text-xs text-gray-400">{sublabel}</p>
      </div>

      {image ? (
        <div className="relative">
          <div className="relative h-48 w-full bg-gray-100">
            <Image src={image} alt={label} fill className="object-cover" />
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-green-600 font-medium">Завантажено</span>
            <div className="flex gap-2">
              <button
                onClick={() => inputRef.current?.click()}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Замінити
              </button>
              <button
                onClick={onRemove}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                Видалити
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center px-4 py-10 transition-colors ${
            dragging ? "bg-red-50 border-2 border-dashed border-[#E31837]" : "bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300"
          }`}
        >
          <Upload className={`h-8 w-8 ${dragging ? "text-[#E31837]" : "text-gray-400"}`} />
          <p className="mt-2 text-sm font-medium text-gray-700">Перетягніть зображення сюди</p>
          <p className="mt-1 text-xs text-gray-400">або натисніть для вибору файлу</p>
          <p className="mt-2 text-[10px] text-gray-400">JPG, PNG, WEBP</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function ImagesTab({
  formData,
  updateField,
}: {
  formData: BannerFormData;
  updateField: <K extends keyof BannerFormData>(key: K, value: BannerFormData[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900">Зображення банера</h3>
        <p className="mt-1 text-sm text-gray-500">Завантажте окремі зображення для кожного пристрою</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ImageUploadZone
          label="Десктоп"
          sublabel="Рекомендовано 1920x750"
          image={formData.desktopImage}
          onUpload={(base64) => updateField("desktopImage", base64)}
          onRemove={() => updateField("desktopImage", "")}
        />
        <ImageUploadZone
          label="Планшет"
          sublabel="Рекомендовано 1024x650"
          image={formData.tabletImage}
          onUpload={(base64) => updateField("tabletImage", base64)}
          onRemove={() => updateField("tabletImage", "")}
        />
        <ImageUploadZone
          label="Мобільний"
          sublabel="Рекомендовано 375x500"
          image={formData.mobileImage}
          onUpload={(base64) => updateField("mobileImage", base64)}
          onRemove={() => updateField("mobileImage", "")}
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
        <h4 className="text-sm font-semibold text-gray-900">Загальна інформація</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Заголовок *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
              placeholder="Заголовок банера"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Підзаголовок</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => updateField("subtitle", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
              placeholder="Підзаголовок"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Посилання</label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) => updateField("link", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
              placeholder="/catalog"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Порядок</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => updateField("order", parseInt(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
              min={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderInput({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  unit?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={value}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
            }}
            min={min}
            max={max}
            step={step}
            className="w-20 rounded-lg border border-gray-200 px-2 py-1.5 text-center text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
          />
          {unit && <span className="text-xs text-gray-500">{unit}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#E31837]"
      />
      <div className="flex justify-between text-[10px] text-gray-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function PositioningTab({
  formData,
  updateField,
}: {
  formData: BannerFormData;
  updateField: <K extends keyof BannerFormData>(key: K, value: BannerFormData[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900">Позиціонування зображення</h3>
        <p className="mt-1 text-sm text-gray-500">Налаштуйте позицію та масштаб зображення в банері</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-6">
        <SliderInput
          label="Позиція X"
          value={formData.positionX}
          min={-100}
          max={100}
          step={1}
          onChange={(v) => updateField("positionX", v)}
        />

        <SliderInput
          label="Позиція Y"
          value={formData.positionY}
          min={-100}
          max={100}
          step={1}
          onChange={(v) => updateField("positionY", v)}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Вирівнювання зображення</label>
          <div className="grid grid-cols-3 gap-2">
            {objectPositionOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateField("objectPosition", opt.value)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  formData.objectPosition === opt.value
                    ? "border-[#E31837] bg-red-50 text-[#E31837]"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <SliderInput
          label="Масштаб"
          value={formData.scale}
          min={0.5}
          max={2.0}
          step={0.1}
          onChange={(v) => updateField("scale", v)}
          unit="x"
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Поточні значення:</h4>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div>X: {formData.positionX}</div>
          <div>Y: {formData.positionY}</div>
          <div>Вирівнювання: {formData.objectPosition}</div>
          <div>Масштаб: {formData.scale}x</div>
        </div>
      </div>
    </div>
  );
}

function DimensionsTab({
  formData,
  updateField,
}: {
  formData: BannerFormData;
  updateField: <K extends keyof BannerFormData>(key: K, value: BannerFormData[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900">Розміри банера</h3>
        <p className="mt-1 text-sm text-gray-500">Встановіть висоту банера для кожного пристрою</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-6">
        <div className="flex items-center gap-3">
          <Monitor className="h-5 w-5 text-gray-500" />
          <div className="flex-1">
            <SliderInput
              label="Висота десктопу"
              value={formData.heightDesktop}
              min={400}
              max={1200}
              step={10}
              onChange={(v) => updateField("heightDesktop", v)}
              unit="px"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Tablet className="h-5 w-5 text-gray-500" />
          <div className="flex-1">
            <SliderInput
              label="Висота планшета"
              value={formData.heightTablet}
              min={300}
              max={900}
              step={10}
              onChange={(v) => updateField("heightTablet", v)}
              unit="px"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Smartphone className="h-5 w-5 text-gray-500" />
          <div className="flex-1">
            <SliderInput
              label="Висота мобільного"
              value={formData.heightMobile}
              min={200}
              max={700}
              step={10}
              onChange={(v) => updateField("heightMobile", v)}
              unit="px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewBanner({
  image,
  width: _width,
  height,
  positionX,
  positionY,
  objectPosition,
  scale,
}: {
  image: string;
  width: number;
  height: number;
  positionX: number;
  positionY: number;
  objectPosition: string;
  scale: number;
}) {
  const tx = positionX * 0.5;
  const ty = positionY * 0.5;

  if (!image) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-sm text-gray-400"
        style={{ width: "100%", height }}
      >
        Немає зображення
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-100" style={{ width: "100%", height }}>
      <img
        src={image}
        alt="Preview"
        className="h-full w-full"
        style={{
          objectFit: "cover",
          objectPosition: getObjectPositionCSS(objectPosition),
          transform: `translate(${tx}%, ${ty}%) scale(${scale})`,
        }}
      />
    </div>
  );
}

function PreviewTab({ formData }: { formData: BannerFormData }) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-base font-semibold text-gray-900">Попередній перегляд</h3>
        <p className="mt-1 text-sm text-gray-500">Перевірте як виглядатиме банер на кожному пристрої</p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Monitor className="h-4 w-4 text-gray-500" />
            <h4 className="text-sm font-medium text-gray-700">Десктоп (1920px)</h4>
            <span className="text-xs text-gray-400">Висота: {formData.heightDesktop}px</span>
          </div>
          <PreviewBanner
            image={formData.desktopImage}
            width={1920}
            height={formData.heightDesktop}
            positionX={formData.positionX}
            positionY={formData.positionY}
            objectPosition={formData.objectPosition}
            scale={formData.scale}
          />
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Tablet className="h-4 w-4 text-gray-500" />
            <h4 className="text-sm font-medium text-gray-700">Планшет (768px)</h4>
            <span className="text-xs text-gray-400">Висота: {formData.heightTablet}px</span>
          </div>
          <div className="mx-auto" style={{ maxWidth: 768 }}>
            <PreviewBanner
              image={formData.tabletImage || formData.desktopImage}
              width={768}
              height={formData.heightTablet}
              positionX={formData.positionX}
              positionY={formData.positionY}
              objectPosition={formData.objectPosition}
              scale={formData.scale}
            />
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-gray-500" />
            <h4 className="text-sm font-medium text-gray-700">Мобільний (375px)</h4>
            <span className="text-xs text-gray-400">Висота: {formData.heightMobile}px</span>
          </div>
          <div className="mx-auto" style={{ maxWidth: 375 }}>
            <PreviewBanner
              image={formData.mobileImage || formData.tabletImage || formData.desktopImage}
              width={375}
              height={formData.heightMobile}
              positionX={formData.positionX}
              positionY={formData.positionY}
              objectPosition={formData.objectPosition}
              scale={formData.scale}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
