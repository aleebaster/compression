"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit2, Trash2, Plus, ChevronRight } from "lucide-react";
import { categories, products } from "@/lib/data";

export default function AdminCategoriesPage() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Управління категоріями
          </h2>
          <p className="text-sm text-gray-500">
            {categories.length} категорій
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-[#E31837] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#B5122C] transition-colors">
          <Plus className="h-4 w-4" />
          Додати категорію
        </button>
      </div>

      {/* Categories Table */}
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
                  <>
                    <tr
                      key={category.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
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
                          <button className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors">
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
                              <button className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
