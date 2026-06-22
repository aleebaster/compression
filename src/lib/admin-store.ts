import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, Category, Order, Banner, Review, HeroContent } from "./types";
import { products as initialProducts, categories as initialCategories, banners as initialBanners } from "./data";

// ─── Auth Store ───────────────────────────────────────────
interface AdminAuthState {
  user: { email: string; name: string; role: string } | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const useAdminAuth = create<AdminAuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email: string, password: string) => {
        if (email === "boleksandr096@gmail.com" && password === "cJ7siL9vpK") {
          set({
            user: { email, name: "Олександр", role: "SUPER_ADMIN" },
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "admin-auth" }
  )
);

// ─── Products Store ───────────────────────────────────────
interface AdminProductsState {
  products: Product[];
  loaded: boolean;
  load: () => Promise<void>;
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt" | "reviews" | "images" | "sizes" | "colors" | "category" | "brand"> & { images?: string[]; sizes?: string[]; colors?: { name: string; hex: string }[] }) => string;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => string | null;
  getProduct: (id: string) => Product | undefined;
}

export const useAdminProducts = create<AdminProductsState>()(
  (set, get) => ({
    products: initialProducts,
    loaded: false,
    load: async () => {
      try {
        const res = await fetch("/api/admin/products");
        if (res.ok) {
          const data = await res.json();
          set({ products: data, loaded: true });
        } else {
          set({ loaded: true });
        }
      } catch {
        set({ loaded: true });
      }
    },
    addProduct: (product) => {
      const id = `p${Date.now()}`;
      const now = new Date();
      const newProduct: Product = {
        ...product,
        id,
        slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9а-яіїєґ]+/g, "-"),
        images: (product.images || []).map((url, i) => ({
          id: `img-${id}-${i}`,
          url,
          alt: product.name,
          isPrimary: i === 0,
          order: i,
        })),
        sizes: (product.sizes || []).map((name, i) => ({
          id: `s-${id}-${i}`,
          name,
          inStock: true,
        })),
        colors: (product.colors || []).map((c, i) => ({
          id: `c-${id}-${i}`,
          name: c.name,
          hex: c.hex,
        })),
        category: initialCategories.find((c) => c.id === product.categoryId) || initialCategories[0],
        brand: undefined,
        reviews: [],
        createdAt: now,
        updatedAt: now,
      };
      const prev = get().products;
      set((state) => ({ products: [...state.products, newProduct] }));
      fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      }).catch(() => set({ products: prev }));
      return id;
    },
    updateProduct: (id, data) => {
      const prev = get().products;
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, ...data, updatedAt: new Date() } : p
        ),
      }));
      fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch(() => set({ products: prev }));
    },
    deleteProduct: (id) => {
      const prev = get().products;
      set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
      fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      }).catch(() => set({ products: prev }));
    },
    duplicateProduct: (id) => {
      const product = get().products.find((p) => p.id === id);
      if (!product) return null;
      const newId = `p${Date.now()}`;
      const now = new Date();
      const duplicate: Product = {
        ...JSON.parse(JSON.stringify(product)),
        id: newId,
        name: `${product.name} (копія)`,
        slug: `${product.slug}-copy-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      const prev = get().products;
      set((state) => ({ products: [...state.products, duplicate] }));
      fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duplicate),
      }).catch(() => set({ products: prev }));
      return newId;
    },
    getProduct: (id) => get().products.find((p) => p.id === id),
  })
);

// ─── Orders Store ─────────────────────────────────────────
interface AdminOrdersState {
  orders: Order[];
  loaded: boolean;
  load: () => Promise<void>;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  addOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => string;
  getOrder: (id: string) => Order | undefined;
}

const defaultOrders: Order[] = [
  {
    id: "o1",
    orderNumber: "ORD-7891",
    status: "NEW",
    total: 4297,
    shippingCost: 0,
    firstName: "Олександр",
    lastName: "Петренко",
    phone: "+380501234567",
    email: "oleksandr@test.com",
    city: "Київ",
    address: "вул. Хрещатик, 22",
    deliveryMethod: "Нова Пошта",
    paymentMethod: "Онлайн оплата",
    comment: "Будь ласка, загорніть у подарункову упаковку",
    discount: 0,
    items: [
      { id: "oi1", quantity: 2, price: 1299, size: "L", productId: "p1", product: initialProducts[0] },
      { id: "oi2", quantity: 1, price: 999, size: "M", productId: "p2", product: initialProducts[1] },
      { id: "oi3", quantity: 1, price: 1499, size: "XL", productId: "p3", product: initialProducts[2] },
    ],
    createdAt: new Date("2026-06-21"),
    updatedAt: new Date("2026-06-21"),
  },
  {
    id: "o2",
    orderNumber: "ORD-7890",
    status: "PROCESSING",
    total: 2498,
    shippingCost: 0,
    firstName: "Марія",
    lastName: "Коваленко",
    phone: "+380671234567",
    email: "maria@test.com",
    city: "Одеса",
    address: "вул. Дерибасівська, 10",
    deliveryMethod: "Нова Пошта",
    paymentMethod: "Післяплата",
    discount: 0,
    items: [
      { id: "oi4", quantity: 2, price: 1199, size: "S", productId: "p4", product: initialProducts[3] },
    ],
    createdAt: new Date("2026-06-20"),
    updatedAt: new Date("2026-06-20"),
  },
  {
    id: "o3",
    orderNumber: "ORD-7889",
    status: "SHIPPED",
    total: 1899,
    shippingCost: 0,
    firstName: "Дмитро",
    lastName: "Шевченко",
    phone: "+380931234567",
    email: "dmytro@test.com",
    city: "Львів",
    address: "вул. Свободи, 45",
    deliveryMethod: "Кур'єр",
    paymentMethod: "Онлайн оплата",
    discount: 0,
    items: [
      { id: "oi5", quantity: 1, price: 1499, size: "M", productId: "p3", product: initialProducts[2] },
      { id: "oi6", quantity: 1, price: 999, size: "L", productId: "p2", product: initialProducts[1] },
    ],
    createdAt: new Date("2026-06-20"),
    updatedAt: new Date("2026-06-20"),
  },
  {
    id: "o4",
    orderNumber: "ORD-7888",
    status: "DELIVERED",
    total: 3197,
    shippingCost: 0,
    firstName: "Анна",
    lastName: "Мельник",
    phone: "+380631234567",
    email: "anna@test.com",
    city: "Харків",
    address: "вул. Сумська, 78",
    deliveryMethod: "Нова Пошта",
    paymentMethod: "Онлайн оплата",
    discount: 0,
    items: [
      { id: "oi7", quantity: 1, price: 1299, size: "M", productId: "p1", product: initialProducts[0] },
      { id: "oi8", quantity: 2, price: 899, size: "S", productId: "p5", product: initialProducts[4] },
    ],
    createdAt: new Date("2026-06-19"),
    updatedAt: new Date("2026-06-19"),
  },
  {
    id: "o5",
    orderNumber: "ORD-7887",
    status: "CANCELLED",
    total: 999,
    shippingCost: 0,
    firstName: "Іван",
    lastName: "Бондаренко",
    phone: "+380501234568",
    email: "ivan@test.com",
    city: "Дніпро",
    address: "пр. Дмитра Яворницького, 55",
    deliveryMethod: "Нова Пошта",
    paymentMethod: "Післяплата",
    comment: "Замовлення скасовано за запитом клієнта",
    discount: 0,
    items: [
      { id: "oi9", quantity: 1, price: 999, size: "XL", productId: "p2", product: initialProducts[1] },
    ],
    createdAt: new Date("2026-06-19"),
    updatedAt: new Date("2026-06-19"),
  },
];

export const useAdminOrders = create<AdminOrdersState>()(
  (set, get) => ({
    orders: defaultOrders,
    loaded: false,
    load: async () => {
      try {
        const res = await fetch("/api/admin/orders");
        if (res.ok) {
          const data = await res.json();
          set({ orders: data, loaded: true });
        } else {
          set({ loaded: true });
        }
      } catch {
        set({ loaded: true });
      }
    },
    updateOrderStatus: (id, status) => {
      const prev = get().orders;
      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === id ? { ...o, status, updatedAt: new Date() } : o
        ),
      }));
      fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }).catch(() => set({ orders: prev }));
    },
    addOrder: (order) => {
      const id = `o${Date.now()}`;
      const now = new Date();
      const prev = get().orders;
      set((state) => ({
        orders: [...state.orders, { ...order, id, createdAt: now, updatedAt: now }],
      }));
      fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...order, id, createdAt: now, updatedAt: now }),
      }).catch(() => set({ orders: prev }));
      return id;
    },
    getOrder: (id) => get().orders.find((o) => o.id === id),
  })
);

// ─── Categories Store ─────────────────────────────────────
interface AdminCategoriesState {
  categories: Category[];
  loaded: boolean;
  load: () => Promise<void>;
  addCategory: (category: Omit<Category, "id">) => string;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

export const useAdminCategories = create<AdminCategoriesState>()(
  (set, get) => ({
    categories: initialCategories,
    loaded: false,
    load: async () => {
      try {
        const res = await fetch("/api/admin/categories");
        if (res.ok) {
          const data = await res.json();
          set({ categories: data, loaded: true });
        } else {
          set({ loaded: true });
        }
      } catch {
        set({ loaded: true });
      }
    },
    addCategory: (category) => {
      const id = `cat${Date.now()}`;
      const prev = get().categories;
      set((state) => ({
        categories: [...state.categories, { ...category, id }],
      }));
      fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...category, id }),
      }).catch(() => set({ categories: prev }));
      return id;
    },
    updateCategory: (id, data) => {
      const prev = get().categories;
      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === id ? { ...c, ...data } : c
        ),
      }));
      fetch(`/api/admin/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch(() => set({ categories: prev }));
    },
    deleteCategory: (id) => {
      const prev = get().categories;
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }));
      fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      }).catch(() => set({ categories: prev }));
    },
  })
);

// ─── Banners Store ────────────────────────────────────────
interface AdminBannersState {
  banners: Banner[];
  loaded: boolean;
  load: () => Promise<void>;
  addBanner: (banner: Omit<Banner, "id">) => string;
  updateBanner: (id: string, data: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  toggleBanner: (id: string) => void;
}

export const useAdminBanners = create<AdminBannersState>()(
  (set, get) => ({
    banners: initialBanners,
    loaded: false,
    load: async () => {
      try {
        const res = await fetch("/api/admin/banners");
        if (res.ok) {
          const data = await res.json();
          const parsed = data.map((b: Record<string, unknown>) => ({
            ...b,
            width: typeof b.width === "string" ? JSON.parse(b.width) : b.width ?? { desktop: "100%", tablet: "100%", mobile: "100%" },
            height: typeof b.height === "string" ? JSON.parse(b.height) : b.height ?? { desktop: 750, tablet: 600, mobile: 700 },
            maxWidth: typeof b.maxWidth === "string" ? JSON.parse(b.maxWidth) : b.maxWidth ?? { desktop: 1920, tablet: 1024, mobile: 375 },
            maxHeight: typeof b.maxHeight === "string" ? JSON.parse(b.maxHeight) : b.maxHeight ?? { desktop: 750, tablet: 600, mobile: 700 },
            aspectRatio: typeof b.aspectRatio === "string" ? JSON.parse(b.aspectRatio) : b.aspectRatio ?? { desktop: "auto", tablet: "auto", mobile: "auto" },
            fullWidth: typeof b.fullWidth === "string" ? JSON.parse(b.fullWidth) : b.fullWidth ?? { desktop: true, tablet: true, mobile: true },
            fullHeight: typeof b.fullHeight === "string" ? JSON.parse(b.fullHeight) : b.fullHeight ?? { desktop: false, tablet: false, mobile: false },
            margin: typeof b.margin === "string" ? JSON.parse(b.margin) : b.margin ?? {
              desktop: { desktop: 0, tablet: 0, mobile: 0 },
              tablet: { desktop: 0, tablet: 0, mobile: 0 },
              mobile: { desktop: 0, tablet: 0, mobile: 0 },
            },
            padding: typeof b.padding === "string" ? JSON.parse(b.padding) : b.padding ?? {
              desktop: { desktop: 0, tablet: 0, mobile: 0 },
              tablet: { desktop: 0, tablet: 0, mobile: 0 },
              mobile: { desktop: 0, tablet: 0, mobile: 0 },
            },
            overlay: typeof b.overlay === "string" ? JSON.parse(b.overlay) : b.overlay ?? {
              enabled: false,
              color: "#000000",
              opacity: 0.5,
              gradientEnabled: false,
              gradientDirection: "to bottom",
            },
          }));
          set({ banners: parsed, loaded: true });
        } else {
          set({ loaded: true });
        }
      } catch {
        set({ loaded: true });
      }
    },
    addBanner: (banner) => {
      const id = `ban${Date.now()}`;
      const prev = get().banners;
      set((state) => ({
        banners: [...state.banners, { ...banner, id }],
      }));
      fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...banner, id }),
      }).catch(() => set({ banners: prev }));
      return id;
    },
    updateBanner: (id, data) => {
      const prev = get().banners;
      set((state) => ({
        banners: state.banners.map((b) =>
          b.id === id ? { ...b, ...data } : b
        ),
      }));
      fetch(`/api/admin/banners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch(() => set({ banners: prev }));
    },
    deleteBanner: (id) => {
      const prev = get().banners;
      set((state) => ({
        banners: state.banners.filter((b) => b.id !== id),
      }));
      fetch(`/api/admin/banners/${id}`, {
        method: "DELETE",
      }).catch(() => set({ banners: prev }));
    },
    toggleBanner: (id) => {
      const banner = get().banners.find((b) => b.id === id);
      if (!banner) return;
      const prev = get().banners;
      set((state) => ({
        banners: state.banners.map((b) =>
          b.id === id ? { ...b, isActive: !b.isActive } : b
        ),
      }));
      fetch(`/api/admin/banners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !banner.isActive }),
      }).catch(() => set({ banners: prev }));
    },
  })
);

// ─── Reviews Store ────────────────────────────────────────
interface AdminReviewsState {
  reviews: Review[];
  loaded: boolean;
  load: () => Promise<void>;
  approveReview: (id: string) => void;
  rejectReview: (id: string) => void;
  deleteReview: (id: string) => void;
}

function getAllReviews(): Review[] {
  const reviews: Review[] = [];
  for (const product of initialProducts) {
    for (const review of product.reviews) {
      reviews.push(review);
    }
  }
  return reviews;
}

export const useAdminReviews = create<AdminReviewsState>()(
  (set, get) => ({
    reviews: getAllReviews(),
    loaded: false,
    load: async () => {
      try {
        const res = await fetch("/api/admin/reviews");
        if (res.ok) {
          const data = await res.json();
          set({ reviews: data, loaded: true });
        } else {
          set({ loaded: true });
        }
      } catch {
        set({ loaded: true });
      }
    },
    approveReview: (id) => {
      const prev = get().reviews;
      set((state) => ({
        reviews: state.reviews.map((r) =>
          r.id === id ? { ...r, isApproved: true } : r
        ),
      }));
      fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true }),
      }).catch(() => set({ reviews: prev }));
    },
    rejectReview: (id) => {
      const prev = get().reviews;
      set((state) => ({
        reviews: state.reviews.map((r) =>
          r.id === id ? { ...r, isApproved: false } : r
        ),
      }));
      fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: false }),
      }).catch(() => set({ reviews: prev }));
    },
    deleteReview: (id) => {
      const prev = get().reviews;
      set((state) => ({
        reviews: state.reviews.filter((r) => r.id !== id),
      }));
      fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      }).catch(() => set({ reviews: prev }));
    },
  })
);

// ─── Settings Store ───────────────────────────────────────
interface AdminSettingsState {
  settings: Record<string, string>;
  loaded: boolean;
  load: () => Promise<void>;
  updateSetting: (key: string, value: string) => void;
  saveSettings: () => Promise<void>;
  getSetting: (key: string) => string;
  resetSettings: () => void;
}

const defaultSettings: Record<string, string> = {
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
  logoUrl: "",
  faviconUrl: "",
};

export const useAdminSettings = create<AdminSettingsState>()(
  (set, get) => ({
    settings: { ...defaultSettings },
    loaded: false,
    load: async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          set({ settings: { ...defaultSettings, ...data }, loaded: true });
        } else {
          set({ loaded: true });
        }
      } catch {
        set({ loaded: true });
      }
    },
    updateSetting: (key, value) => {
      set((state) => ({
        settings: { ...state.settings, [key]: value },
      }));
    },
    saveSettings: async () => {
      try {
        const res = await fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ settings: get().settings }),
        });
        if (!res.ok) throw new Error("Failed to save");
      } catch (error) {
        throw error;
      }
    },
    getSetting: (key) => get().settings[key] || "",
    resetSettings: () => set({ settings: { ...defaultSettings } }),
  })
);

// ─── Hero Content Store ──────────────────────────────────
interface AdminHeroContentState {
  items: HeroContent[];
  loaded: boolean;
  load: () => Promise<void>;
  addItem: (item: Omit<HeroContent, "id">) => string;
  updateItem: (id: string, data: Partial<HeroContent>) => void;
  deleteItem: (id: string) => void;
}

const defaultHeroContent: HeroContent[] = [
  {
    id: "hc1",
    title: "Компресійний одяг для тренувань",
    subtitle: "Преміальна якість для дорослих та дітей",
    description: "Відчуйте різницю з компресійним одягом COMPEX",
    buttonText: "Переглянути каталог",
    buttonLink: "/catalog",
    position: "center",
    textColor: "#FFFFFF",
    textShadow: true,
    isActive: true,
    order: 0,
  },
];

export const useAdminHeroContent = create<AdminHeroContentState>()(
  (set, get) => ({
    items: defaultHeroContent,
    loaded: false,
    load: async () => {
      try {
        const res = await fetch("/api/admin/hero-content");
        if (res.ok) {
          const data = await res.json();
          set({ items: data, loaded: true });
        } else {
          set({ loaded: true });
        }
      } catch {
        set({ loaded: true });
      }
    },
    addItem: (item) => {
      const id = `hc${Date.now()}`;
      const prev = get().items;
      set((state) => ({
        items: [...state.items, { ...item, id }],
      }));
      fetch("/api/admin/hero-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, id }),
      }).catch(() => set({ items: prev }));
      return id;
    },
    updateItem: (id, data) => {
      const prev = get().items;
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, ...data } : item
        ),
      }));
      fetch(`/api/admin/hero-content/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch(() => set({ items: prev }));
    },
    deleteItem: (id) => {
      const prev = get().items;
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      }));
      fetch(`/api/admin/hero-content/${id}`, {
        method: "DELETE",
      }).catch(() => set({ items: prev }));
    },
  })
);
