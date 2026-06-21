import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, Category, Order, Banner, Review } from "./types";
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
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt" | "reviews" | "images" | "sizes" | "colors" | "category" | "brand"> & { images?: string[]; sizes?: string[]; colors?: { name: string; hex: string }[] }) => string;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => string | null;
  getProduct: (id: string) => Product | undefined;
}

export const useAdminProducts = create<AdminProductsState>()(
  persist(
    (set, get) => ({
      products: initialProducts,
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
        set((state) => ({ products: [...state.products, newProduct] }));
        return id;
      },
      updateProduct: (id, data) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...data, updatedAt: new Date() } : p
          ),
        }));
      },
      deleteProduct: (id) => {
        set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
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
        set((state) => ({ products: [...state.products, duplicate] }));
        return newId;
      },
      getProduct: (id) => get().products.find((p) => p.id === id),
    }),
    { name: "admin-products" }
  )
);

// ─── Orders Store ─────────────────────────────────────────
interface AdminOrdersState {
  orders: Order[];
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
  persist(
    (set, get) => ({
      orders: defaultOrders,
      updateOrderStatus: (id, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status, updatedAt: new Date() } : o
          ),
        }));
      },
      addOrder: (order) => {
        const id = `o${Date.now()}`;
        const now = new Date();
        set((state) => ({
          orders: [...state.orders, { ...order, id, createdAt: now, updatedAt: now }],
        }));
        return id;
      },
      getOrder: (id) => get().orders.find((o) => o.id === id),
    }),
    { name: "admin-orders" }
  )
);

// ─── Categories Store ─────────────────────────────────────
interface AdminCategoriesState {
  categories: Category[];
  addCategory: (category: Omit<Category, "id">) => string;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

export const useAdminCategories = create<AdminCategoriesState>()(
  persist(
    (set) => ({
      categories: initialCategories,
      addCategory: (category) => {
        const id = `cat${Date.now()}`;
        set((state) => ({
          categories: [...state.categories, { ...category, id }],
        }));
        return id;
      },
      updateCategory: (id, data) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        }));
      },
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },
    }),
    { name: "admin-categories" }
  )
);

// ─── Banners Store ────────────────────────────────────────
interface AdminBannersState {
  banners: Banner[];
  addBanner: (banner: Omit<Banner, "id">) => string;
  updateBanner: (id: string, data: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  toggleBanner: (id: string) => void;
}

export const useAdminBanners = create<AdminBannersState>()(
  persist(
    (set) => ({
      banners: initialBanners,
      addBanner: (banner) => {
        const id = `ban${Date.now()}`;
        set((state) => ({
          banners: [...state.banners, { ...banner, id }],
        }));
        return id;
      },
      updateBanner: (id, data) => {
        set((state) => ({
          banners: state.banners.map((b) =>
            b.id === id ? { ...b, ...data } : b
          ),
        }));
      },
      deleteBanner: (id) => {
        set((state) => ({
          banners: state.banners.filter((b) => b.id !== id),
        }));
      },
      toggleBanner: (id) => {
        set((state) => ({
          banners: state.banners.map((b) =>
            b.id === id ? { ...b, isActive: !b.isActive } : b
          ),
        }));
      },
    }),
    { name: "admin-banners" }
  )
);

// ─── Reviews Store ────────────────────────────────────────
interface AdminReviewsState {
  reviews: Review[];
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
  persist(
    (set) => ({
      reviews: getAllReviews(),
      approveReview: (id) => {
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id ? { ...r, isApproved: true } : r
          ),
        }));
      },
      rejectReview: (id) => {
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id ? { ...r, isApproved: false } : r
          ),
        }));
      },
      deleteReview: (id) => {
        set((state) => ({
          reviews: state.reviews.filter((r) => r.id !== id),
        }));
      },
    }),
    { name: "admin-reviews" }
  )
);

// ─── Settings Store ───────────────────────────────────────
interface AdminSettingsState {
  settings: Record<string, string>;
  updateSetting: (key: string, value: string) => void;
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
};

export const useAdminSettings = create<AdminSettingsState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      updateSetting: (key, value) => {
        set((state) => ({
          settings: { ...state.settings, [key]: value },
        }));
      },
      getSetting: (key) => get().settings[key] || "",
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    { name: "admin-settings" }
  )
);
