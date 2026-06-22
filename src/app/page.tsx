"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Truck, ShieldCheck, RotateCcw, Headphones, ArrowRight, Star, Zap } from "lucide-react";
import Link from "next/link";

import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { products } from "@/lib/data";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const categories = [
  {
    title: "Чоловічий",
    slug: "men",
    description: "Компресійний одяг для чоловіків",
    items: ["Рашгарди", "Шорти", "Футболки", "Комплекти"],
  },
  {
    title: "Дитячий",
    slug: "kids",
    description: "Компресійний одяг для дітей",
    items: ["Футболки", "Шорти", "Комплекти"],
  },
];

const benefits = [
  {
    icon: Truck,
    title: "Безкоштовна доставка",
    description: "Від 2000₴ по Україні",
  },
  {
    icon: ShieldCheck,
    title: "Гарантія якості",
    description: "Оригінальна продукція",
  },
  {
    icon: RotateCcw,
    title: "Повернення 30 днів",
    description: "Просте повернення",
  },
  {
    icon: Headphones,
    title: "Підтримка 24/7",
    description: "Завжди на зв'язку",
  },
];

const features = [
  {
    icon: Zap,
    title: "Компресія м'язів",
    description: "Підтримка під час тренувань та швидше відновлення",
  },
  {
    icon: Star,
    title: "Преміальні матеріали",
    description: "Технологічна тканина з відведенням вологи",
  },
  {
    icon: ShieldCheck,
    title: "Для дорослих та дітей",
    description: "Широкий вибір розмірів для всієї родини",
  },
];

function AnimatedSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const featuredProducts = products.filter((p) => p.isFeatured);
  const newProducts = products.filter((p) => p.isNew);

  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <HeroBanner />

        {/* About Section */}
        <AnimatedSection className="py-16 sm:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <span className="inline-block rounded-full bg-[#E31837]/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-[#E31837]">
                  ПРО НАС
                </span>
                <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                  Преміальний компресійний одяг
                </h2>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  compression_mega_shop — це компресійний одяг для чоловіків та дітей.
                  Ми пропонуємо рашгарди, шорти, футболки та комплекти 2-5в1 для
                  занять спортом, бойовими мистецтвами та активного відпочинку.
                </p>
                <div className="mt-6 space-y-3">
                  {features.map((feature) => (
                    <div key={feature.title} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E31837]/10 text-[#E31837]">
                        <feature.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{feature.title}</h3>
                        <p className="text-sm text-gray-500">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative rounded-3xl bg-gray-50 p-8 sm:p-12">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#E31837]/10" />
                <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-[#E31837]/5" />
                <div className="relative text-center">
                  <div className="text-6xl font-bold text-[#E31837]">5+</div>
                  <div className="mt-2 text-lg font-semibold text-gray-900">Років досвіду</div>
                  <div className="mt-1 text-sm text-gray-500">Надійний якісний одяг</div>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white p-4 text-center shadow-sm">
                    <div className="text-2xl font-bold text-gray-900">1000+</div>
                    <div className="text-xs text-gray-500">Задоволених клієнтів</div>
                  </div>
                  <div className="rounded-xl bg-white p-4 text-center shadow-sm">
                    <div className="text-2xl font-bold text-gray-900">50+</div>
                    <div className="text-xs text-gray-500">Моделей одягу</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Categories */}
        <AnimatedSection className="py-16 sm:py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                КАТЕГОРІЇ
              </h2>
              <p className="mt-3 text-gray-600">Знайдіть ідеальний одяг для себе</p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2"
            >
              {categories.map((cat) => (
                <motion.div key={cat.slug} variants={fadeUp}>
                  <Link
                    href={`/catalog?gender=${cat.slug}`}
                    className="group block rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:border-[#E31837] hover:shadow-lg"
                  >
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#E31837] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="mt-2 text-gray-500">{cat.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {cat.items.map((item) => (
                        <span key={item} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                          {item}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#E31837] group-hover:gap-3 transition-all">
                      Переглянути
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Featured Products */}
        <AnimatedSection className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  ХІТ ПРОДАЖУ
                </h2>
                <p className="mt-2 text-gray-600">Найпопулярніші товари</p>
              </div>
              <Link
                href="/catalog"
                className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#E31837] hover:gap-3 transition-all"
              >
                Дивитись всі
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            <div className="mt-8 flex justify-center sm:hidden">
              <Link
                href="/catalog"
                className="flex items-center gap-2 rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-900 hover:border-[#E31837] hover:text-[#E31837] transition-colors"
              >
                Дивитись всі товари
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </AnimatedSection>

        {/* Promo Banner */}
        <AnimatedSection className="py-16 sm:py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#E31837] to-[#b0102a] p-8 sm:p-12 lg:p-16">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white" />
                <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-white" />
              </div>
              <div className="relative z-10 max-w-2xl">
                <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold tracking-wider text-white backdrop-blur-sm">
                  СПЕЦІАЛЬНА ПРОПОЗИЦІЯ
                </span>
                <h2 className="mt-6 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
                  Знижки до -25%
                </h2>
                <p className="mt-4 max-w-md text-lg text-white/90">
                  Скористайтесь акційними пропозиціями на компресійний одяг преміум класу. Кількість товарів обмежена.
                </p>
                <Link
                  href="/catalog"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-[#E31837] shadow-lg transition-all hover:shadow-xl hover:scale-105"
                >
                  Перейти до каталогу
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* New Arrivals */}
        <AnimatedSection className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  НОВИНКИ
                </h2>
                <p className="mt-2 text-gray-600">Щойно з&apos;явились у нас</p>
              </div>
              <Link
                href="/catalog?sort=newest"
                className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#E31837] hover:gap-3 transition-all"
              >
                Дивитись всі
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {newProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            <div className="mt-8 flex justify-center sm:hidden">
              <Link
                href="/catalog?sort=newest"
                className="flex items-center gap-2 rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-900 hover:border-[#E31837] hover:text-[#E31837] transition-colors"
              >
                Дивитись всі новинки
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </AnimatedSection>

        {/* Benefits */}
        <AnimatedSection className="py-16 sm:py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {benefits.map((benefit) => (
                <motion.div
                  key={benefit.title}
                  variants={fadeUp}
                  className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E31837]/10 text-[#E31837]">
                    <benefit.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">
                    {benefit.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </AnimatedSection>
      </main>

      <Footer />
    </>
  );
}
