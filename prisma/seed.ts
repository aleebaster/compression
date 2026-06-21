import { PrismaClient, Role } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("cJ7siL9vpK", 12);

  await prisma.user.upsert({
    where: { email: "boleksandr096@gmail.com" },
    update: {},
    create: {
      email: "boleksandr096@gmail.com",
      password: hashedPassword,
      name: "Admin",
      role: Role.SUPER_ADMIN,
    },
  });

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

  for (const [key, value] of Object.entries(defaultSettings)) {
    await prisma.settings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  await prisma.banner.upsert({
    where: { id: "default-banner" },
    update: {},
    create: {
      id: "default-banner",
      title: "Компресійний одяг для тренувань",
      subtitle: "Преміальна якість для дорослих та дітей",
      isActive: true,
      order: 0,
      mode: "image_only",
      useTextContent: false,
      objectFit: "cover",
      positionX: 0,
      positionY: 0,
      objectPosition: "center",
      scale: 1,
      width: JSON.stringify({ desktop: "100%", tablet: "100%", mobile: "100%" }),
      height: JSON.stringify({ desktop: 750, tablet: 650, mobile: 500 }),
      maxWidth: JSON.stringify({ desktop: 1440, tablet: 768, mobile: 375 }),
      maxHeight: JSON.stringify({ desktop: 900, tablet: 800, mobile: 700 }),
      aspectRatio: JSON.stringify({ desktop: "auto", tablet: "auto", mobile: "auto" }),
      fullWidth: JSON.stringify({ desktop: true, tablet: true, mobile: true }),
      fullHeight: JSON.stringify({ desktop: false, tablet: false, mobile: false }),
      margin: JSON.stringify({ desktop: { desktop: 0, tablet: 0, mobile: 0 }, tablet: { desktop: 0, tablet: 0, mobile: 0 }, mobile: { desktop: 0, tablet: 0, mobile: 0 } }),
      padding: JSON.stringify({ desktop: { desktop: 0, tablet: 0, mobile: 0 }, tablet: { desktop: 0, tablet: 0, mobile: 0 }, mobile: { desktop: 0, tablet: 0, mobile: 0 } }),
      overlay: JSON.stringify({ enabled: false, color: "#000000", opacity: 0.5, gradientEnabled: false, gradientDirection: "to bottom" }),
    },
  });

  const menCategory = await prisma.category.upsert({
    where: { slug: "men" },
    update: {},
    create: { name: "Чоловічий", slug: "men", description: "Компресійний одяг для чоловіків" },
  });
  const womenCategory = await prisma.category.upsert({
    where: { slug: "women" },
    update: {},
    create: { name: "Жіночий", slug: "women", description: "Компресійний одяг для жінок" },
  });
  const kidsCategory = await prisma.category.upsert({
    where: { slug: "kids" },
    update: {},
    create: { name: "Дитячий", slug: "kids", description: "Компресійний одяг для дітей" },
  });

  const brand1 = await prisma.brand.upsert({
    where: { slug: "compex-pro" },
    update: {},
    create: { name: "Compex Pro", slug: "compex-pro" },
  });

  await prisma.product.upsert({
    where: { slug: "compression-tshirt-pro" },
    update: {},
    create: {
      name: "Компресійна футболка Pro",
      slug: "compression-tshirt-pro",
      description: "Високоякісна компресійна футболка для професійних спортсменів",
      price: 1299,
      oldPrice: 1599,
      gender: "MEN",
      isFeatured: true,
      isSale: true,
      stockQty: 45,
      categoryId: menCategory.id,
      brandId: brand1.id,
      images: { create: [{ url: "https://picsum.photos/seed/pro1/600/800", alt: "Футболка Pro", isPrimary: true }] },
      sizes: { create: [{ name: "S" }, { name: "M" }, { name: "L" }, { name: "XL" }] },
      colors: { create: [{ name: "Чорний", hex: "#1A1A1A" }, { name: "Червоний", hex: "#E31837" }] },
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
