"use client";

import { useState, Fragment } from "react";
import toast from "react-hot-toast";
import { Edit2, Trash2, Plus, ChevronRight, X } from "lucide-react";
import { useAdminCategories } from "@/lib/admin-store";
import { products } from "@/lib/data";

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  image: string;
}

export default function AdminCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdminCategories();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    slug: "",
    description: "",
    image: "",
  });

  const toggleExpand = (id: string) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getProductCount = (categoryId: string) => {
    return products.filter((p) => p.categoryId === categoryId).length;
  };

  const getChildProductCount = (categorySlug: string) => {
    return products.filter((p) => {
      const cat = categories.find((c) => c.id === p.categoryId);
      return cat?.children?.some((child) => child.slug === categorySlug);
    }).length;
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9а-яіїєґ]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: "", slug: "", description: "", image: "" });
    setShowModal(true);
  };

  const openEditModal = (id: string, name: string, slug: string, description: string, image: string) => {
    setEditingId(id);
    setFormData({ name, slug, description, image: image || "" });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Назва обов'язкова");
      return;
    }

    if (editingId) {
      updateCategory(editingId, {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description,
        image: formData.image,
      });
      toast.success("Категорію оновлено");
    } else {
      addCategory({
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description,
        image: formData.image,
      });
      toast.success("Категорію додано");
    }
    setShowModal(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Видалити категорію "${name}"?`)) {
      deleteCategory(id);
      toast.success("Категорію видалено");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Управління категоріями
          </h2>
          <p className="text-sm text-gray-500">
            {categories.length} категорій
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-[#E31837] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#B5122C] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Додати категорію
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
                <th className="px-6 py-3">Назва</th>
                <th className="px-6 py-3 hidden md:table-cell">Slug</th>
                <th className="px-6 py-3 text-center">Товарів</th>
                <th className="px-6 py-3 text-right">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((category) => {
                const isExpanded = expandedCategories.includes(category.id);
                const hasChildren =
                  category.children && category.children.length > 0;
                const productCount = getProductCount(category.id);

                return (
                  <Fragment key={category.id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {hasChildren && (
                            <button
                              onClick={() => toggleExpand(category.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <ChevronRight
                                className={`h-4 w-4 transition-transform ${
                                  isExpanded ? "rotate-90" : ""
                                }`}
                              />
                            </button>
                          )}
                          {!hasChildren && <div className="w-4" />}
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {category.name}
                            </p>
                            {category.description && (
                              <p className="text-xs text-gray-500">
                                {category.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 hidden md:table-cell">
                        <span className="text-sm text-gray-500">
                          /{category.slug}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                          {productCount}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(category.id, category.name, category.slug, category.description || "", category.image || "")}
                            className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id, category.name)}
                            className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {hasChildren &&
                      isExpanded &&
                      category.children!.map((child) => (
                        <tr
                          key={child.id}
                          className="bg-gray-50/50 hover:bg-gray-100 transition-colors"
                        >
                          <td className="px-6 py-3 pl-14">
                            <p className="text-sm text-gray-700">{child.name}</p>
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 hidden md:table-cell">
                            <span className="text-sm text-gray-400">
                              /{child.slug}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 text-center">
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                              {getChildProductCount(child.slug)}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditModal(child.id, child.name, child.slug, "", "")}
                                className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(child.id, child.name)}
                                className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingId ? "Редагувати категорію" : "Нова категорія"}
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
                  Назва *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                      slug: generateSlug(e.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                  placeholder="Назва категорії"
                />
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
                  placeholder="category-slug"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Опис
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837] resize-none"
                  placeholder="Опис категорії"
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
