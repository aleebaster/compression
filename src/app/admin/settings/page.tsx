"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  Settings,
  Save,
  Globe,
  Mail,
  Palette,
  Phone,
  Share2,
  Upload,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";

interface SettingsData {
  shopName: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  telegram: string;
  tiktok: string;
  metaTitle: string;
  metaDescription: string;
  smtpHost: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

const defaultSettings: SettingsData = {
  shopName: "COMPEX",
  description: "Компресійний одяг для спорту та активного способу життя",
  phone: "",
  email: "",
  address: "",
  facebook: "",
  instagram: "",
  telegram: "",
  tiktok: "",
  metaTitle: "COMPEX — Компресійний одяг",
  metaDescription: "Інтернет-магазин компресійного одягу для спорту та активного способу життя",
  smtpHost: "",
  smtpPort: "587",
  smtpUsername: "",
  smtpPassword: "",
  primaryColor: "#E31837",
  secondaryColor: "#1A1A1A",
  accentColor: "#3B82F6",
};

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
          <Icon className="h-4 w-4 text-gray-600" />
        </div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function InputField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-[#E31837] focus:bg-white focus:ring-1 focus:ring-[#E31837]"
      />
    </div>
  );
}

function TextareaField({
  label,
  placeholder,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-[#E31837] focus:bg-white focus:ring-1 focus:ring-[#E31837] resize-none"
      />
    </div>
  );
}

function UploadZone({ label }: { label: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center gap-4 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center transition-colors hover:border-[#E31837]/40 hover:bg-[#E31837]/5 cursor-pointer">
        <Upload className="h-8 w-8 text-gray-400" />
        <div>
          <p className="text-sm font-medium text-gray-700">
            Натисніть або перетягніть файл
          </p>
          <p className="mt-1 text-xs text-gray-500">PNG, JPG до 2MB</p>
        </div>
      </div>
    </div>
  );
}

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 w-10 cursor-pointer rounded-lg border border-gray-200 p-0.5"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-mono text-gray-900 outline-none transition-colors focus:border-[#E31837] focus:bg-white focus:ring-1 focus:ring-[#E31837]"
        />
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);

  const update = (key: keyof SettingsData, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    toast.success("Налаштування збережено!");
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    toast("Налаштування скинуті", { icon: "🔄" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Налаштування</h2>
          <p className="text-sm text-gray-500">
            Конфігурація вашого магазину
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* General Settings */}
        <SectionCard icon={Settings} title="Загальні налаштування">
          <div className="space-y-4">
            <InputField
              label="Назва магазину"
              placeholder="COMPEX"
              value={settings.shopName}
              onChange={(v) => update("shopName", v)}
            />
            <TextareaField
              label="Опис"
              placeholder="Компресійний одяг для спорту..."
              value={settings.description}
              onChange={(v) => update("description", v)}
            />
            <UploadZone label="Логотип" />
            <UploadZone label="Фавікон" />
          </div>
        </SectionCard>

        {/* Contact Information */}
        <SectionCard icon={Phone} title="Контактна інформація">
          <div className="space-y-4">
            <InputField
              label="Телефон"
              placeholder="+380 (XX) XXX-XX-XX"
              value={settings.phone}
              onChange={(v) => update("phone", v)}
            />
            <InputField
              label="Email"
              placeholder="info@compex.ua"
              value={settings.email}
              onChange={(v) => update("email", v)}
              type="email"
            />
            <TextareaField
              label="Адреса"
              placeholder="вул. Приклад, 1, м. Київ"
              value={settings.address}
              onChange={(v) => update("address", v)}
              rows={2}
            />
          </div>
        </SectionCard>

        {/* Social Media */}
        <SectionCard icon={Share2} title="Соціальні мережі">
          <div className="space-y-4">
            <InputField
              label="Facebook URL"
              placeholder="https://facebook.com/compex"
              value={settings.facebook}
              onChange={(v) => update("facebook", v)}
            />
            <InputField
              label="Instagram URL"
              placeholder="https://instagram.com/compex"
              value={settings.instagram}
              onChange={(v) => update("instagram", v)}
            />
            <InputField
              label="Telegram URL"
              placeholder="https://t.me/compex"
              value={settings.telegram}
              onChange={(v) => update("telegram", v)}
            />
            <InputField
              label="TikTok URL"
              placeholder="https://tiktok.com/@compex"
              value={settings.tiktok}
              onChange={(v) => update("tiktok", v)}
            />
          </div>
        </SectionCard>

        {/* SEO Settings */}
        <SectionCard icon={Globe} title="Налаштування SEO">
          <div className="space-y-4">
            <InputField
              label="Meta Title"
              placeholder="COMPEX — Компресійний одяг"
              value={settings.metaTitle}
              onChange={(v) => update("metaTitle", v)}
            />
            <TextareaField
              label="Meta Description"
              placeholder="Інтернет-магазин компресійного одягу..."
              value={settings.metaDescription}
              onChange={(v) => update("metaDescription", v)}
            />
            <UploadZone label="OpenGraph зображення" />
          </div>
        </SectionCard>

        {/* Email (SMTP) */}
        <SectionCard icon={Mail} title="Email (SMTP)">
          <div className="space-y-4">
            <InputField
              label="SMTP Host"
              placeholder="smtp.gmail.com"
              value={settings.smtpHost}
              onChange={(v) => update("smtpHost", v)}
            />
            <InputField
              label="SMTP Port"
              placeholder="587"
              value={settings.smtpPort}
              onChange={(v) => update("smtpPort", v)}
            />
            <InputField
              label="SMTP Username"
              placeholder="user@gmail.com"
              value={settings.smtpUsername}
              onChange={(v) => update("smtpUsername", v)}
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                SMTP Password
              </label>
              <div className="relative">
                <input
                  type={showSmtpPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={settings.smtpPassword}
                  onChange={(e) => update("smtpPassword", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 pr-10 text-sm text-gray-900 outline-none transition-colors focus:border-[#E31837] focus:bg-white focus:ring-1 focus:ring-[#E31837]"
                />
                <button
                  type="button"
                  onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showSmtpPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Branding */}
        <SectionCard icon={Palette} title="Брендинг">
          <div className="space-y-4">
            <ColorPicker
              label="Основний колір"
              value={settings.primaryColor}
              onChange={(v) => update("primaryColor", v)}
            />
            <ColorPicker
              label="Другорядний колір"
              value={settings.secondaryColor}
              onChange={(v) => update("secondaryColor", v)}
            />
            <ColorPicker
              label="Акцентний колір"
              value={settings.accentColor}
              onChange={(v) => update("accentColor", v)}
            />
          </div>
        </SectionCard>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          onClick={handleReset}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <RotateCcw className="h-4 w-4" />
          СКИНУТИ
        </button>
        <button
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E31837] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#B5122C]"
        >
          <Save className="h-4 w-4" />
          ЗБЕРЕГТИ НАЛАШТУВАННЯ
        </button>
      </div>
    </div>
  );
}
