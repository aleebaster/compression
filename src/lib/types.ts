export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc?: string;
  price: number;
  oldPrice?: number;
  sku?: string;
  gender: "MEN" | "WOMEN" | "KIDS" | "UNISEX";
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isSale: boolean;
  inStock: boolean;
  stockQty: number;
  categoryId: string;
  category: Category;
  brandId?: string;
  brand?: Brand;
  images: ProductImage[];
  sizes: ProductSize[];
  colors: ProductColor[];
  reviews: Review[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductSize {
  id: string;
  name: string;
  inStock: boolean;
}

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
  products?: Product[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

export interface Review {
  id: string;
  rating: number;
  title?: string;
  comment: string;
  isApproved: boolean;
  userId: string;
  user: { name?: string; email: string };
  productId: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: "NEW" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  total: number;
  shippingCost: number;
  firstName: string;
  lastName?: string;
  phone: string;
  email?: string;
  city: string;
  address?: string;
  deliveryMethod: string;
  paymentMethod: string;
  comment?: string;
  trackingNumber?: string;
  promoCode?: string;
  discount: number;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  productId: string;
  product: Product;
}

export interface CartItem {
  id: string;
  quantity: number;
  size?: string;
  color?: string;
  product: Product;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  link?: string;
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

export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
  expiresAt?: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
}

export type SortOption =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "popular"
  | "rating";

export interface FilterState {
  category?: string;
  brand?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  search?: string;
  sort?: SortOption;
}
