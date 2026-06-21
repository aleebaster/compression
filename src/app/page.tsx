"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Truck, ShieldCheck, RotateCcw, Headphones, ArrowRight } from "lucide-react";
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
    gradient: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
    description: "Компресійний одяг для чоловіків",
  },
  {
    title: "Дитячий",
    slug: "kids",
    gradient: "linear-gradient(135deg, #1f2937 0%, #1e3a5f 100%)",
    description: "Компресійний одяг для дітей",
  },
];

const benefits = [
  {
    icon: Truck,
    title: "Безкоштовна доставка від 2000₴",
    description: "Доставляємо по всій Україні",
  },
  {
    icon: ShieldCheck,
    title: "Гарантія якості",
    description: "Тільки оригінальна продукція",
  },
  {
    icon: RotateCcw,
    title: "Повернення 30 днів",
    description: "Просте повернення та обмін",
  },
  {
    icon: Headphones,
    title: "Підтримка 24/7",
    description: "Завжди на зв'язку для вас",
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
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {categories.map((cat) => (
                <motion.div key={cat.slug} variants={fadeUp}>
                  <Link
                    href={`/catalog?gender=${cat.slug}`}
                    className="group relative block h-80 overflow-hidden rounded-2xl"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ background: cat.gradient }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center">
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {cat.title}
                      </h3>
                      <p className="text-sm text-white/80">{cat.description}</p>
                      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#E31837] group-hover:gap-3 transition-all">
                        Переглянути
                        <ArrowRight className="h-4 w-4" />
                      </div>
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
