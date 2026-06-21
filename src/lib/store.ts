"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "./types";

interface CartStore {
  items: CartItem[];
  promoCode: string;
  discount: number;
  addItem: (product: Product, size?: string, color?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => void;
  removePromoCode: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getShippingCost: () => number;
  getFinalTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: "",
      discount: 0,

      addItem: (product, size, color) => {
        const items = get().items;
        const existingItem = items.find(
          (item) =>
            item.product.id === product.id &&
            item.size === size &&
            item.color === color
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === existingItem.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          const newItem: CartItem = {
            id: `${product.id}-${size || ""}-${color || ""}-${Date.now()}`,
            quantity: 1,
            size,
            color,
            product,
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [], promoCode: "", discount: 0 }),

      applyPromoCode: (code) => {
        const promoCodes: Record<string, number> = {
          SPORT10: 10,
          COMPRESSION20: 20,
          PREMIUM15: 15,
          FIRSTORDER: 25,
        };
        const discount = promoCodes[code.toUpperCase()];
        if (discount) {
          set({ promoCode: code.toUpperCase(), discount });
        }
      },

      removePromoCode: () => set({ promoCode: "", discount: 0 }),

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      getShippingCost: () => {
        const total = get().getTotal();
        return total >= 2000 ? 0 : 70;
      },

      getFinalTotal: () => {
        const total = get().getTotal();
        const discount = get().discount;
        const shipping = get().getShippingCost();
        return total - (total * discount) / 100 + shipping;
      },
    }),
    {
      name: "compression-cart",
    }
  )
);
