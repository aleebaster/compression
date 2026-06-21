"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { useAdminProducts } from "@/lib/admin-store";
import { categories, brands } from "@/lib/data";

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const genderOptions = [
  { value: "MEN", label: "Чоловічий" },
  { value: "WOMEN", label: "Жіночий" },
  { value: "KIDS", label: "Дитячий" },
  { value: "UNISEX", label: "Унісекс" },
];

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  shortDesc: string;
  price: string;
  oldPrice: string;
  sku: string;
  categoryId: string;
  brandId: string;
  gender: string;
  stockQty: string;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isSale: boolean;
  sizes: string[];
  customSizes: string[];
  colors: { name: string; hex: string }[];
  images: string[];
}

const emptyForm: ProductFormData = {
  name: "",
  slug: "",
  description: "",
  shortDesc: "",
  price: "",
  oldPrice: "",
  sku: "",
  categoryId: "",
  brandId: "",
  gender: "MEN",
  stockQty: "",
  isActive: true,
  isFeatured: false,
  isNew: false,
  isSale: false,
  sizes: [],
  customSizes: [],
  colors: [],
  images: [],
};

export default function NewProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { getProduct, addProduct, updateProduct } = useAdminProducts();

  const [formData, setFormData] = useState<ProductFormData>(() => {
    if (editId) {
      const product = getProduct(editId);
      if (product) {
        return {
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDesc: product.shortDesc || "",
          price: product.price.toString(),
          oldPrice: product.oldPrice?.toString() || "",
          sku: product.sku || "",
          categoryId: product.categoryId,
          brandId: product.brandId || "",
          gender: product.gender,
          stockQty: product.stockQty.toString(),
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          isNew: product.isNew,
          isSale: product.isSale,
          sizes: product.sizes.map((s) => s.name),
          customSizes: [],
          colors: product.colors.map((c) => ({ name: c.name, hex: c.hex })),
          images: product.images.map((img) => img.url),
        };
      }
    }
    return emptyForm;
  });
  const [newColor, setNewColor] = useState({ name: "", hex: "#000000" });
  const [newCustomSize, setNewCustomSize] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageInput, setImageInput] = useState("");

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9а-яіїєґ]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleSizeToggle = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const addCustomSize = () => {
    if (newCustomSize.trim() && !formData.customSizes.includes(newCustomSize.trim())) {
      setFormData((prev) => ({
        ...prev,
        customSizes: [...prev.customSizes, newCustomSize.trim()],
      }));
      setNewCustomSize("");
    }
  };

  const removeCustomSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      customSizes: prev.customSizes.filter((s) => s !== size),
    }));
  };

  const addColor = () => {
    if (newColor.name.trim() && newColor.hex) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, { ...newColor }],
      }));
      setNewColor({ name: "", hex: "#000000" });
    }
  };

  const removeColor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  const addImage = () => {
    if (imageInput.trim() && !formData.images.includes(imageInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageInput.trim()],
      }));
      setImageInput("");
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Назва обов'язкова";
    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = "Введіть коректну ціну";
    if (!formData.categoryId) newErrors.categoryId = "Оберіть категорію";
    if (!formData.stockQty) newErrors.stockQty = "Введіть кількість";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Будь ласка, заповніть всі обов'язкові поля");
      return;
    }

    const productData: Parameters<typeof addProduct>[0] = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      shortDesc: formData.shortDesc,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
      sku: formData.sku || undefined,
      categoryId: formData.categoryId,
      brandId: formData.brandId || undefined,
      gender: formData.gender as "MEN" | "WOMEN" | "KIDS" | "UNISEX",
      isActive: formData.isActive,
      isFeatured: formData.isFeatured,
      isNew: formData.isNew,
      isSale: formData.isSale,
      inStock: Number(formData.stockQty) > 0,
      stockQty: Number(formData.stockQty),
      images: formData.images,
      sizes: [...formData.sizes, ...formData.customSizes],
      colors: formData.colors,
    };

    if (editId) {
      updateProduct(editId, productData as unknown as Record<string, unknown>);
      toast.success("Товар оновлено!");
    } else {
      addProduct(productData);
      toast.success("Товар створено!");
    }
    router.push("/admin/products");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {editId ? "Редагувати товар" : "Новий товар"}
          </h2>
          <p className="text-sm text-gray-500">
            {editId ? "Оновіть інформацію про товар" : "Додайте новий товар до каталогу"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Основна інформація
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Назва *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-1 ${
                      errors.name
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-200 focus:border-[#E31837] focus:ring-[#E31837]"
                    }`}
                    placeholder="Компресійна футболка Pro"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                    placeholder="compression-tshirt-pro"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Короткий опис
                  </label>
                  <input
                    type="text"
                    value={formData.shortDesc}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        shortDesc: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                    placeholder="Короткий опис товару"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Опис
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837] resize-none"
                    placeholder="Повний опис товару"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Ціна та склад
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Ціна (₴) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, price: e.target.value }))
                    }
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-1 ${
                      errors.price
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-200 focus:border-[#E31837] focus:ring-[#E31837]"
                    }`}
                    placeholder="1299"
                    min="0"
                  />
                  {errors.price && (
                    <p className="mt-1 text-xs text-red-500">{errors.price}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Стара ціна (₴)
                  </label>
                  <input
                    type="number"
                    value={formData.oldPrice}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        oldPrice: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                    placeholder="1599"
                    min="0"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, sku: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                    placeholder="CMP-TSH-001"
                  />
                </div>
              </div>
              <div className="mt-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Кількість на складі *
                  </label>
                  <input
                    type="number"
                    value={formData.stockQty}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        stockQty: e.target.value,
                      }))
                    }
                    className={`w-full max-w-xs rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-1 ${
                      errors.stockQty
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-200 focus:border-[#E31837] focus:ring-[#E31837]"
                    }`}
                    placeholder="45"
                    min="0"
                  />
                  {errors.stockQty && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.stockQty}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Зображення
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  placeholder="URL зображення"
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image src={img} alt="" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Статус
              </h3>
              <div className="space-y-3">
                {[
                  { key: "isActive", label: "Активний" },
                  { key: "isFeatured", label: "Рекомендований" },
                  { key: "isNew", label: "Новинка" },
                  { key: "isSale", label: "Розпродаж" },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-700">{label}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          [key]: !prev[key as keyof ProductFormData],
                        }))
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData[key as keyof ProductFormData]
                          ? "bg-[#E31837]"
                          : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                          formData[key as keyof ProductFormData]
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Класифікація
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Категорія *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        categoryId: e.target.value,
                      }))
                    }
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-1 ${
                      errors.categoryId
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-200 focus:border-[#E31837] focus:ring-[#E31837]"
                    }`}
                  >
                    <option value="">Оберіть категорію</option>
                    {categories.map((cat) => (
                      <optgroup key={cat.id} label={cat.name}>
                        <option value={cat.id}>{cat.name}</option>
                        {cat.children?.map((child) => (
                          <option key={child.id} value={child.id}>
                            {child.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.categoryId}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Бренд
                  </label>
                  <select
                    value={formData.brandId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        brandId: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                  >
                    <option value="">Оберіть бренд</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Стать
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                  >
                    {genderOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Розміри
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                      formData.sizes.includes(size)
                        ? "border-[#E31837] bg-[#E31837] text-white"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={newCustomSize}
                  onChange={(e) => setNewCustomSize(e.target.value)}
                  placeholder="Свій розмір"
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSize())}
                />
                <button
                  type="button"
                  onClick={addCustomSize}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {formData.customSizes.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.customSizes.map((size) => (
                    <span
                      key={size}
                      className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                    >
                      {size}
                      <button
                        type="button"
                        onClick={() => removeCustomSize(size)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Кольори
              </h3>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={newColor.hex}
                  onChange={(e) =>
                    setNewColor((prev) => ({ ...prev, hex: e.target.value }))
                  }
                  className="h-10 w-10 cursor-pointer rounded-lg border border-gray-200"
                />
                <input
                  type="text"
                  value={newColor.name}
                  onChange={(e) =>
                    setNewColor((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Назва кольору"
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                />
                <button
                  type="button"
                  onClick={addColor}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {formData.colors.length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData.colors.map((color, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2"
                    >
                      <div
                        className="h-6 w-6 rounded-full border border-gray-200"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="flex-1 text-sm text-gray-700">
                        {color.name}
                      </span>
                      <span className="text-xs text-gray-400">{color.hex}</span>
                      <button
                        type="button"
                        onClick={() => removeColor(i)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#E31837] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#B5122C] transition-colors"
              >
                <Save className="h-4 w-4" />
                {editId ? "Оновити" : "Зберегти"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Скасувати
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
