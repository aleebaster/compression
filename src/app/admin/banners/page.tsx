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
  ArrowLeft,
  LayoutGrid,
  Layers,
  Palette,
  ChevronDown,
} from "lucide-react";
import { useAdminBanners } from "@/lib/admin-store";
import type { Banner, DeviceValue, OverlaySettings } from "@/lib/types";
/* eslint-disable @next/next/no-img-element */

type ModalTab = "images" | "dimensions" | "positioning" | "spacing" | "overlay" | "preview";

interface BannerFormData {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  link: string;
  isActive: boolean;
  order: number;
  mode: "image_only" | "image_content" | "custom_layout";
  useTextContent: boolean;
  desktopImage: string;
  tabletImage: string;
  mobileImage: string;
  objectFit: "cover" | "contain" | "fill" | "none";
  positionX: number;
  positionY: number;
  objectPosition: string;
  scale: number;
  width: DeviceValue;
  height: DeviceValue;
  maxWidth: DeviceValue;
  maxHeight: DeviceValue;
  aspectRatio: DeviceValue;
  fullWidth: { desktop: boolean; tablet: boolean; mobile: boolean };
  fullHeight: { desktop: boolean; tablet: boolean; mobile: boolean };
  margin: { desktop: DeviceValue; tablet: DeviceValue; mobile: DeviceValue };
  padding: { desktop: DeviceValue; tablet: DeviceValue; mobile: DeviceValue };
  overlay: OverlaySettings;
}

const defaultFormData: BannerFormData = {
  title: "",
  subtitle: "",
  description: "",
  buttonText: "",
  link: "",
  isActive: true,
  order: 0,
  mode: "image_only",
  useTextContent: false,
  desktopImage: "",
  tabletImage: "",
  mobileImage: "",
  objectFit: "cover",
  positionX: 0,
  positionY: 0,
  objectPosition: "center",
  scale: 1,
  width: { desktop: "100%", tablet: "100%", mobile: "100%" },
  height: { desktop: 750, tablet: 650, mobile: 500 },
  maxWidth: { desktop: 1440, tablet: 768, mobile: 375 },
  maxHeight: { desktop: 900, tablet: 800, mobile: 700 },
  aspectRatio: { desktop: "auto", tablet: "auto", mobile: "auto" },
  fullWidth: { desktop: true, tablet: true, mobile: true },
  fullHeight: { desktop: false, tablet: false, mobile: false },
  margin: {
    desktop: { desktop: 0, tablet: 0, mobile: 0 },
    tablet: { desktop: 0, tablet: 0, mobile: 0 },
    mobile: { desktop: 0, tablet: 0, mobile: 0 },
  },
  padding: {
    desktop: { desktop: 0, tablet: 0, mobile: 0 },
    tablet: { desktop: 0, tablet: 0, mobile: 0 },
    mobile: { desktop: 0, tablet: 0, mobile: 0 },
  },
  overlay: {
    enabled: false,
    color: "#000000",
    opacity: 0.5,
    gradientEnabled: false,
    gradientDirection: "to bottom",
  },
};

const objectPositionOptions = [
  { value: "center", label: "Center" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
  { value: "top-left", label: "Top Left" },
  { value: "top-right", label: "Top Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "bottom-right", label: "Bottom Right" },
];

const templates = [
  { id: "center", label: "Center", icon: "⊙", description: "Centered image with full visibility" },
  { id: "left_focus", label: "Left Focus", icon: "◐", description: "Focus on left side of image" },
  { id: "right_focus", label: "Right Focus", icon: "◑", description: "Focus on right side of image" },
  { id: "product_focus", label: "Product Focus", icon: "◉", description: "Tight crop on product area" },
  { id: "text_focus", label: "Text Focus", icon: "▦", description: "Leave space for text overlay" },
  { id: "mobile_focus", label: "Mobile Focus", icon: "▥", description: "Optimized for mobile viewing" },
];

const templatePresets: Record<string, Partial<BannerFormData>> = {
  center: {
    objectPosition: "center", objectFit: "cover", positionX: 0, positionY: 0, scale: 1,
    fullWidth: { desktop: true, tablet: true, mobile: true },
    fullHeight: { desktop: false, tablet: false, mobile: false },
  },
  left_focus: {
    objectPosition: "left", objectFit: "cover", positionX: -50, positionY: 0, scale: 1.1,
    fullWidth: { desktop: true, tablet: true, mobile: true },
    fullHeight: { desktop: false, tablet: false, mobile: false },
  },
  right_focus: {
    objectPosition: "right", objectFit: "cover", positionX: 50, positionY: 0, scale: 1.1,
    fullWidth: { desktop: true, tablet: true, mobile: true },
    fullHeight: { desktop: false, tablet: false, mobile: false },
  },
  product_focus: {
    objectPosition: "center", objectFit: "contain", positionX: 0, positionY: 0, scale: 1.3,
    fullWidth: { desktop: true, tablet: true, mobile: true },
    fullHeight: { desktop: false, tablet: false, mobile: false },
  },
  text_focus: {
    objectPosition: "right", objectFit: "cover", positionX: 30, positionY: 0, scale: 1,
    fullWidth: { desktop: true, tablet: true, mobile: true },
    fullHeight: { desktop: false, tablet: false, mobile: false },
  },
  mobile_focus: {
    objectPosition: "center", objectFit: "cover", positionX: 0, positionY: 0, scale: 1.2,
    fullWidth: { desktop: true, tablet: true, mobile: true },
    fullHeight: { desktop: true, tablet: true, mobile: true },
  },
};

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

function parseWidthValue(v: number | string): number {
  if (typeof v === "number") return v;
  const n = parseInt(v, 10);
  return isNaN(n) ? 0 : n;
}

function getWidthUnit(v: number | string): "px" | "%" {
  return typeof v === "string" && v.includes("%") ? "%" : "px";
}

export default function AdminBannersPage() {
  const { banners, addBanner, updateBanner, deleteBanner, toggleBanner } = useAdminBanners();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ModalTab>("images");
  const [formData, setFormData] = useState<BannerFormData>(defaultFormData);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ ...defaultFormData, order: banners.length });
    setActiveTab("images");
    setSelectedTemplate("");
    setShowModal(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingId(banner.id);
    setFormData({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      description: banner.description || "",
      buttonText: banner.buttonText || "",
      link: banner.link || "",
      isActive: banner.isActive,
      order: banner.order,
      mode: banner.mode,
      useTextContent: banner.useTextContent,
      desktopImage: banner.desktopImage || "",
      tabletImage: banner.tabletImage || "",
      mobileImage: banner.mobileImage || "",
      objectFit: banner.objectFit,
      positionX: banner.positionX,
      positionY: banner.positionY,
      objectPosition: banner.objectPosition,
      scale: banner.scale,
      width: banner.width || defaultFormData.width,
      height: banner.height || defaultFormData.height,
      maxWidth: banner.maxWidth || defaultFormData.maxWidth,
      maxHeight: banner.maxHeight || defaultFormData.maxHeight,
      aspectRatio: banner.aspectRatio || defaultFormData.aspectRatio,
      fullWidth: banner.fullWidth || defaultFormData.fullWidth,
      fullHeight: banner.fullHeight || defaultFormData.fullHeight,
      margin: banner.margin || defaultFormData.margin,
      padding: banner.padding || defaultFormData.padding,
      overlay: banner.overlay || defaultFormData.overlay,
    });
    setActiveTab("images");
    setSelectedTemplate("");
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!formData.desktopImage && !formData.tabletImage && !formData.mobileImage) {
      toast.error("At least one image is required");
      return;
    }

    const payload = {
      ...formData,
      order: typeof formData.order === "string" ? parseInt(formData.order as string, 10) || 0 : formData.order,
    };

    if (editingId) {
      updateBanner(editingId, payload);
      toast.success("Banner updated");
    } else {
      addBanner(payload);
      toast.success("Banner created");
    }
    setShowModal(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete banner "${title || "Untitled"}"?`)) {
      deleteBanner(id);
      toast.success("Banner deleted");
    }
  };

  const handleToggle = (id: string) => {
    toggleBanner(id);
    toast.success("Status changed");
  };

  const updateField = <K extends keyof BannerFormData>(key: K, value: BannerFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const updateDeviceValue = (
    field: "width" | "height" | "maxWidth" | "maxHeight" | "aspectRatio",
    device: "desktop" | "tablet" | "mobile",
    value: number | string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [device]: value },
    }));
  };

  const updateFullBool = (
    field: "fullWidth" | "fullHeight",
    device: "desktop" | "tablet" | "mobile",
    value: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [device]: value },
    }));
  };

  const updateSpacing = (
    field: "margin" | "padding",
    device: "desktop" | "tablet" | "mobile",
    side: "desktop" | "tablet" | "mobile",
    value: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [device]: { ...prev[field][device], [side]: value },
      },
    }));
  };

  const applyTemplate = (templateId: string) => {
    const preset = templatePresets[templateId];
    if (preset) {
      setFormData((prev) => ({ ...prev, ...preset }));
      setSelectedTemplate(templateId);
      toast.success(`Template "${templateId}" applied`);
    }
  };

  const showTextFields = formData.mode !== "image_only" || formData.useTextContent;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hero Banners</h2>
          <p className="text-sm text-gray-500">{banners.length} banners</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-[#E31837] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#B5122C] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Banner
        </button>
      </div>

      <div className="space-y-4">
        {banners.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-sm text-gray-500">No banners yet. Create the first one!</p>
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
                  No images
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{banner.title || "Image Only"}</h3>
              <div className="mt-1 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                  {banner.mode}
                </span>
                {banner.subtitle && (
                  <span className="text-xs text-gray-500 truncate">{banner.subtitle}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggle(banner.id)}
                className={`rounded-lg p-2 transition-colors ${
                  banner.isActive
                    ? "bg-green-50 text-green-600 hover:bg-green-100"
                    : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                }`}
                title={banner.isActive ? "Active" : "Inactive"}
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
                onClick={() => handleDelete(banner.id, banner.title || "")}
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
          updateDeviceValue={updateDeviceValue}
          updateFullBool={updateFullBool}
          updateSpacing={updateSpacing}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          selectedTemplate={selectedTemplate}
          applyTemplate={applyTemplate}
          showTextFields={showTextFields}
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
  updateDeviceValue,
  updateFullBool,
  updateSpacing,
  onClose,
  onSubmit,
  selectedTemplate,
  applyTemplate,
  showTextFields,
}: {
  formData: BannerFormData;
  editingId: string | null;
  activeTab: ModalTab;
  setActiveTab: (tab: ModalTab) => void;
  updateField: <K extends keyof BannerFormData>(key: K, value: BannerFormData[K]) => void;
  updateDeviceValue: (field: "width" | "height" | "maxWidth" | "maxHeight" | "aspectRatio", device: "desktop" | "tablet" | "mobile", value: number | string) => void;
  updateFullBool: (field: "fullWidth" | "fullHeight", device: "desktop" | "tablet" | "mobile", value: boolean) => void;
  updateSpacing: (field: "margin" | "padding", device: "desktop" | "tablet" | "mobile", side: "desktop" | "tablet" | "mobile", value: number) => void;
  onClose: () => void;
  onSubmit: () => void;
  selectedTemplate: string;
  applyTemplate: (id: string) => void;
  showTextFields: boolean;
}) {
  const [templateOpen, setTemplateOpen] = useState(false);

  const tabs: { id: ModalTab; label: string; icon: React.ReactNode }[] = [
    { id: "images", label: "Images", icon: <ImageIcon className="h-4 w-4" /> },
    { id: "dimensions", label: "Dimensions", icon: <Maximize className="h-4 w-4" /> },
    { id: "positioning", label: "Positioning", icon: <SlidersHorizontal className="h-4 w-4" /> },
    { id: "spacing", label: "Spacing", icon: <LayoutGrid className="h-4 w-4" /> },
    { id: "overlay", label: "Overlay", icon: <Layers className="h-4 w-4" /> },
    { id: "preview", label: "Preview", icon: <Eye className="h-4 w-4" /> },
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
              {editingId ? "Edit Banner" : "New Banner"}
            </h3>
            <p className="text-xs text-gray-500">Add images and configure display</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setTemplateOpen(!templateOpen)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Palette className="h-4 w-4" />
              {selectedTemplate || "Templates"}
              <ChevronDown className="h-3 w-3" />
            </button>
            {templateOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 w-64 rounded-lg border border-gray-200 bg-white shadow-lg">
                <div className="p-2">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { applyTemplate(t.id); setTemplateOpen(false); }}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                        selectedTemplate === t.id ? "bg-red-50 text-[#E31837]" : "hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-lg">{t.icon}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{t.label}</div>
                        <div className="text-xs text-gray-500">{t.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="rounded-lg bg-[#E31837] px-4 py-2 text-sm font-medium text-white hover:bg-[#B5122C] transition-colors"
          >
            {editingId ? "Save" : "Create"}
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-200 bg-gray-50 px-4 sm:px-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
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
          {activeTab === "images" && (
            <ImagesTab
              formData={formData}
              updateField={updateField}
              showTextFields={showTextFields}
            />
          )}
          {activeTab === "dimensions" && (
            <DimensionsTab
              formData={formData}
              updateDeviceValue={updateDeviceValue}
              updateFullBool={updateFullBool}
            />
          )}
          {activeTab === "positioning" && (
            <PositioningTab formData={formData} updateField={updateField} />
          )}
          {activeTab === "spacing" && (
            <SpacingTab formData={formData} updateSpacing={updateSpacing} />
          )}
          {activeTab === "overlay" && (
            <OverlayTab formData={formData} updateField={updateField} />
          )}
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
        toast.error("Supported: JPG, PNG, WEBP");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onUpload(result);
        toast.success("Image uploaded");
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
            <span className="text-xs text-green-600 font-medium">Uploaded</span>
            <div className="flex gap-2">
              <button
                onClick={() => inputRef.current?.click()}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Replace
              </button>
              <button
                onClick={onRemove}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                Remove
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
          <p className="mt-2 text-sm font-medium text-gray-700">Drop image here</p>
          <p className="mt-1 text-xs text-gray-400">or click to select</p>
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
  showTextFields,
}: {
  formData: BannerFormData;
  updateField: <K extends keyof BannerFormData>(key: K, value: BannerFormData[K]) => void;
  showTextFields: boolean;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900">Banner Images</h3>
        <p className="mt-1 text-sm text-gray-500">Upload separate images for each device</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ImageUploadZone
          label="Desktop"
          sublabel="Recommended 1920x750"
          image={formData.desktopImage}
          onUpload={(base64) => updateField("desktopImage", base64)}
          onRemove={() => updateField("desktopImage", "")}
        />
        <ImageUploadZone
          label="Tablet"
          sublabel="Recommended 1024x650"
          image={formData.tabletImage}
          onUpload={(base64) => updateField("tabletImage", base64)}
          onRemove={() => updateField("tabletImage", "")}
        />
        <ImageUploadZone
          label="Mobile"
          sublabel="Recommended 375x500"
          image={formData.mobileImage}
          onUpload={(base64) => updateField("mobileImage", base64)}
          onRemove={() => updateField("mobileImage", "")}
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-5">
        <h4 className="text-sm font-semibold text-gray-900">Content Mode</h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {([
            { value: "image_only", label: "Image Only", desc: "Display image without text" },
            { value: "image_content", label: "Image + Content", desc: "Image with text overlay" },
            { value: "custom_layout", label: "Custom Layout", desc: "Full control over layout" },
          ] as const).map((mode) => (
            <button
              key={mode.value}
              onClick={() => updateField("mode", mode.value)}
              className={`rounded-lg border p-3 text-left transition-colors ${
                formData.mode === mode.value
                  ? "border-[#E31837] bg-red-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className={`text-sm font-medium ${formData.mode === mode.value ? "text-[#E31837]" : "text-gray-900"}`}>
                {mode.label}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{mode.desc}</div>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
          <div>
            <div className="text-sm font-medium text-gray-900">Use Text Content</div>
            <div className="text-xs text-gray-500">Override mode to show text fields</div>
          </div>
          <button
            onClick={() => updateField("useTextContent", !formData.useTextContent)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              formData.useTextContent ? "bg-[#E31837]" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.useTextContent ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {showTextFields && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">Text Content</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                placeholder="Banner title (optional)"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Subtitle</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => updateField("subtitle", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                placeholder="Subtitle (optional)"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837] resize-none"
                placeholder="Description (optional)"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Button Text</label>
              <input
                type="text"
                value={formData.buttonText}
                onChange={(e) => updateField("buttonText", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                placeholder="Button text (optional)"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Button Link</label>
              <input
                type="text"
                value={formData.link}
                onChange={(e) => updateField("link", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                placeholder="/catalog"
              />
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Order</label>
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

function DeviceDimensionRow({
  device,
  label,
  icon,
  formData,
  updateDeviceValue,
  updateFullBool,
}: {
  device: "desktop" | "tablet" | "mobile";
  label: string;
  icon: React.ReactNode;
  formData: BannerFormData;
  updateDeviceValue: (field: "width" | "height" | "maxWidth" | "maxHeight" | "aspectRatio", device: "desktop" | "tablet" | "mobile", value: number | string) => void;
  updateFullBool: (field: "fullWidth" | "fullHeight", device: "desktop" | "tablet" | "mobile", value: boolean) => void;
}) {
  const widthVal = formData.width[device];
  const heightVal = formData.height[device];
  const maxW = formData.maxWidth[device];
  const maxH = formData.maxHeight[device];
  const ar = formData.aspectRatio[device];

  return (
    <div className="rounded-lg border border-gray-200 p-4 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-semibold text-gray-900">{label}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Width</label>
          <div className="flex">
            <input
              type="number"
              value={parseWidthValue(widthVal)}
              onChange={(e) => {
                const unit = getWidthUnit(widthVal);
                const v = e.target.value;
                updateDeviceValue("width", device, unit === "%" ? `${v}%` : parseInt(v) || 0);
              }}
              className="w-full rounded-l-lg border border-r-0 border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
            />
            <select
              value={getWidthUnit(widthVal)}
              onChange={(e) => {
                const num = parseWidthValue(widthVal);
                updateDeviceValue("width", device, e.target.value === "%" ? `${num}%` : num);
              }}
              className="rounded-r-lg border border-gray-200 bg-gray-50 px-2 text-sm text-gray-700 outline-none"
            >
              <option value="px">px</option>
              <option value="%">%</option>
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Height</label>
          <div className="flex">
            <input
              type="number"
              value={parseWidthValue(heightVal)}
              onChange={(e) => updateDeviceValue("height", device, parseInt(e.target.value) || 0)}
              className="w-full rounded-l-lg border border-r-0 border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
            />
            <span className="flex items-center rounded-r-lg border border-gray-200 bg-gray-50 px-2 text-sm text-gray-500">px</span>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Max Width</label>
          <div className="flex">
            <input
              type="number"
              value={parseWidthValue(maxW)}
              onChange={(e) => updateDeviceValue("maxWidth", device, parseInt(e.target.value) || 0)}
              className="w-full rounded-l-lg border border-r-0 border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
            />
            <span className="flex items-center rounded-r-lg border border-gray-200 bg-gray-50 px-2 text-sm text-gray-500">px</span>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Max Height</label>
          <div className="flex">
            <input
              type="number"
              value={parseWidthValue(maxH)}
              onChange={(e) => updateDeviceValue("maxHeight", device, parseInt(e.target.value) || 0)}
              className="w-full rounded-l-lg border border-r-0 border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
            />
            <span className="flex items-center rounded-r-lg border border-gray-200 bg-gray-50 px-2 text-sm text-gray-500">px</span>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Aspect Ratio</label>
          <input
            type="text"
            value={typeof ar === "string" ? ar : String(ar)}
            onChange={(e) => updateDeviceValue("aspectRatio", device, e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
            placeholder="auto"
          />
        </div>
        <div className="flex items-end gap-3">
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
            <input
              type="checkbox"
              checked={formData.fullWidth[device]}
              onChange={(e) => updateFullBool("fullWidth", device, e.target.checked)}
              className="rounded border-gray-300 accent-[#E31837]"
            />
            Full Width
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
            <input
              type="checkbox"
              checked={formData.fullHeight[device]}
              onChange={(e) => updateFullBool("fullHeight", device, e.target.checked)}
              className="rounded border-gray-300 accent-[#E31837]"
            />
            Full Height
          </label>
        </div>
      </div>
    </div>
  );
}

function DimensionsTab({
  formData,
  updateDeviceValue,
  updateFullBool,
}: {
  formData: BannerFormData;
  updateDeviceValue: (field: "width" | "height" | "maxWidth" | "maxHeight" | "aspectRatio", device: "desktop" | "tablet" | "mobile", value: number | string) => void;
  updateFullBool: (field: "fullWidth" | "fullHeight", device: "desktop" | "tablet" | "mobile", value: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900">Dimensions</h3>
        <p className="mt-1 text-sm text-gray-500">Set width, height and sizing for each device</p>
      </div>
      <div className="space-y-4">
        <DeviceDimensionRow device="desktop" label="Desktop" icon={<Monitor className="h-4 w-4 text-gray-500" />} formData={formData} updateDeviceValue={updateDeviceValue} updateFullBool={updateFullBool} />
        <DeviceDimensionRow device="tablet" label="Tablet" icon={<Tablet className="h-4 w-4 text-gray-500" />} formData={formData} updateDeviceValue={updateDeviceValue} updateFullBool={updateFullBool} />
        <DeviceDimensionRow device="mobile" label="Mobile" icon={<Smartphone className="h-4 w-4 text-gray-500" />} formData={formData} updateDeviceValue={updateDeviceValue} updateFullBool={updateFullBool} />
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
        <h3 className="text-base font-semibold text-gray-900">Positioning</h3>
        <p className="mt-1 text-sm text-gray-500">Adjust image position and scale</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-6">
        <SliderInput
          label="X Position"
          value={formData.positionX}
          min={-200}
          max={200}
          step={1}
          onChange={(v) => updateField("positionX", v)}
        />

        <SliderInput
          label="Y Position"
          value={formData.positionY}
          min={-200}
          max={200}
          step={1}
          onChange={(v) => updateField("positionY", v)}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Object Position</label>
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

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Object Fit</label>
          <select
            value={formData.objectFit}
            onChange={(e) => updateField("objectFit", e.target.value as BannerFormData["objectFit"])}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
          >
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
            <option value="fill">Fill</option>
            <option value="none">None</option>
          </select>
        </div>

        <SliderInput
          label="Scale"
          value={formData.scale}
          min={0.5}
          max={3.0}
          step={0.1}
          onChange={(v) => updateField("scale", v)}
          unit="x"
        />
      </div>
    </div>
  );
}

function SpacingTab({
  formData,
  updateSpacing,
}: {
  formData: BannerFormData;
  updateSpacing: (field: "margin" | "padding", device: "desktop" | "tablet" | "mobile", side: "desktop" | "tablet" | "mobile", value: number) => void;
}) {
  const devices: { key: "desktop" | "tablet" | "mobile"; label: string; icon: React.ReactNode }[] = [
    { key: "desktop", label: "Desktop", icon: <Monitor className="h-4 w-4 text-gray-500" /> },
    { key: "tablet", label: "Tablet", icon: <Tablet className="h-4 w-4 text-gray-500" /> },
    { key: "mobile", label: "Mobile", icon: <Smartphone className="h-4 w-4 text-gray-500" /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900">Spacing</h3>
        <p className="mt-1 text-sm text-gray-500">Set margin and padding for each device</p>
      </div>

      {(["margin", "padding"] as const).map((field) => (
        <div key={field} className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <h4 className="text-sm font-semibold text-gray-900 capitalize">{field}</h4>
          {devices.map((d) => (
            <div key={d.key} className="flex items-center gap-3">
              <div className="flex items-center gap-2 w-24">
                {d.icon}
                <span className="text-xs font-medium text-gray-700">{d.label}</span>
              </div>
              <div className="grid grid-cols-4 gap-2 flex-1">
                {(["desktop", "tablet", "mobile", "desktop"] as const).map((side, i) => (
                  <div key={`${d.key}-${field}-${i}`}>
                    <label className="mb-1 block text-[10px] font-medium text-gray-500">
                      {["T", "R", "B", "L"][i]}
                    </label>
                    <input
                      type="number"
                      value={formData[field][d.key][side]}
                      onChange={(e) => updateSpacing(field, d.key, side, parseInt(e.target.value) || 0)}
                      className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-center text-xs outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function OverlayTab({
  formData,
  updateField,
}: {
  formData: BannerFormData;
  updateField: <K extends keyof BannerFormData>(key: K, value: BannerFormData[K]) => void;
}) {
  const overlay = formData.overlay;

  const updateOverlay = <K extends keyof OverlaySettings>(key: K, value: OverlaySettings[K]) => {
    updateField("overlay", { ...overlay, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900">Overlay</h3>
        <p className="mt-1 text-sm text-gray-500">Add color overlay or gradient effect</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-900">Enable Overlay</div>
            <div className="text-xs text-gray-500">Add a color layer over the image</div>
          </div>
          <button
            onClick={() => updateOverlay("enabled", !overlay.enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              overlay.enabled ? "bg-[#E31837]" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                overlay.enabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {overlay.enabled && (
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={overlay.color}
                  onChange={(e) => updateOverlay("color", e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded-lg border border-gray-200"
                />
                <input
                  type="text"
                  value={overlay.color}
                  onChange={(e) => updateOverlay("color", e.target.value)}
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-mono outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                />
              </div>
            </div>

            <SliderInput
              label="Opacity"
              value={overlay.opacity}
              min={0}
              max={1}
              step={0.05}
              onChange={(v) => updateOverlay("opacity", v)}
            />

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Gradient</div>
                <div className="text-xs text-gray-500">Use gradient instead of solid color</div>
              </div>
              <button
                onClick={() => updateOverlay("gradientEnabled", !overlay.gradientEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  overlay.gradientEnabled ? "bg-[#E31837]" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    overlay.gradientEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {overlay.gradientEnabled && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Direction</label>
                <select
                  value={overlay.gradientDirection}
                  onChange={(e) => updateOverlay("gradientDirection", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                >
                  <option value="to bottom">To Bottom</option>
                  <option value="to top">To Top</option>
                  <option value="to right">To Right</option>
                  <option value="to left">To Left</option>
                  <option value="to bottom right">To Bottom Right</option>
                  <option value="to bottom left">To Bottom Left</option>
                  <option value="to top right">To Top Right</option>
                  <option value="to top left">To Top Left</option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PreviewBanner({
  image,
  height,
  positionX,
  positionY,
  objectPosition,
  objectFit,
  scale,
  overlay,
  formData,
  device,
}: {
  image: string;
  height: number;
  positionX: number;
  positionY: number;
  objectPosition: string;
  objectFit: string;
  scale: number;
  overlay: OverlaySettings;
  formData: BannerFormData;
  device: "desktop" | "tablet" | "mobile";
}) {
  const tx = positionX * 0.5;
  const ty = positionY * 0.5;

  const showText = formData.mode !== "image_only" || formData.useTextContent;

  const getOverlayStyle = (): React.CSSProperties => {
    if (!overlay.enabled) return {};
    if (overlay.gradientEnabled) {
      return {
        background: `linear-gradient(${overlay.gradientDirection}, ${overlay.color} 0%, transparent 100%)`,
        opacity: overlay.opacity,
      };
    }
    return {
      backgroundColor: overlay.color,
      opacity: overlay.opacity,
    };
  };

  if (!image) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-sm text-gray-400"
        style={{ width: "100%", height: Math.min(height, 300) }}
      >
        No image
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100" style={{ width: "100%", height: Math.min(height, 300) }}>
      <img
        src={image}
        alt="Preview"
        className="h-full w-full"
        style={{
          objectFit: objectFit as React.CSSProperties["objectFit"],
          objectPosition: getObjectPositionCSS(objectPosition),
          transform: `translate(${tx}%, ${ty}%) scale(${scale})`,
        }}
      />
      {overlay.enabled && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={getOverlayStyle()}
        />
      )}
      {showText && (formData.title || formData.subtitle || formData.buttonText) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          {formData.title && <h3 className="text-lg font-bold text-white drop-shadow-lg">{formData.title}</h3>}
          {formData.subtitle && <p className="mt-1 text-sm text-white/90 drop-shadow">{formData.subtitle}</p>}
          {formData.buttonText && (
            <span className="mt-3 inline-block rounded-lg bg-[#E31837] px-4 py-1.5 text-xs font-medium text-white shadow-lg">
              {formData.buttonText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function PreviewTab({ formData }: { formData: BannerFormData }) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-base font-semibold text-gray-900">Preview</h3>
        <p className="mt-1 text-sm text-gray-500">Check how the banner looks on each device</p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Monitor className="h-4 w-4 text-gray-500" />
            <h4 className="text-sm font-medium text-gray-700">Desktop (1920px)</h4>
            <span className="text-xs text-gray-400">Height: {parseWidthValue(formData.height.desktop)}px</span>
          </div>
          <PreviewBanner
            image={formData.desktopImage}
            height={parseWidthValue(formData.height.desktop)}
            positionX={formData.positionX}
            positionY={formData.positionY}
            objectPosition={formData.objectPosition}
            objectFit={formData.objectFit}
            scale={formData.scale}
            overlay={formData.overlay}
            formData={formData}
            device="desktop"
          />
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Tablet className="h-4 w-4 text-gray-500" />
            <h4 className="text-sm font-medium text-gray-700">Tablet (768px)</h4>
            <span className="text-xs text-gray-400">Height: {parseWidthValue(formData.height.tablet)}px</span>
          </div>
          <div className="mx-auto" style={{ maxWidth: 768 }}>
            <PreviewBanner
              image={formData.tabletImage || formData.desktopImage}
              height={parseWidthValue(formData.height.tablet)}
              positionX={formData.positionX}
              positionY={formData.positionY}
              objectPosition={formData.objectPosition}
              objectFit={formData.objectFit}
              scale={formData.scale}
              overlay={formData.overlay}
              formData={formData}
              device="tablet"
            />
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-gray-500" />
            <h4 className="text-sm font-medium text-gray-700">Mobile (375px)</h4>
            <span className="text-xs text-gray-400">Height: {parseWidthValue(formData.height.mobile)}px</span>
          </div>
          <div className="mx-auto" style={{ maxWidth: 375 }}>
            <PreviewBanner
              image={formData.mobileImage || formData.tabletImage || formData.desktopImage}
              height={parseWidthValue(formData.height.mobile)}
              positionX={formData.positionX}
              positionY={formData.positionY}
              objectPosition={formData.objectPosition}
              objectFit={formData.objectFit}
              scale={formData.scale}
              overlay={formData.overlay}
              formData={formData}
              device="mobile"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
