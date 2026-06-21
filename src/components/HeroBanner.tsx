"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Wind,
  Droplets,
  Shield,
  Heart,
  ArrowRight,
  CheckCircle,
  Zap,
} from "lucide-react";
import { useAdminBanners } from "@/lib/admin-store";

const featureBadges = [
  { icon: Wind, label: "Дихаючий матеріал" },
  { icon: Shield, label: "Підтримка м'язів" },
  { icon: Droplets, label: "Відведення вологи" },
  { icon: Heart, label: "Максимальний комфорт" },
];

const bottomStrip = [
  "Преміум якість",
  "Для будь-яких цілей",
  "Ідеальна посадка",
  "Для дорослих та дітей",
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const slideIn = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const silhouetteReveal = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export default function HeroBanner() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { banners } = useAdminBanners();

  const activeBanner = banners.find((b) => b.isActive) || banners[0];

  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1920);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const bannerImage = activeBanner
    ? windowWidth < 768
      ? activeBanner.mobileImage
      : windowWidth < 1024
        ? activeBanner.tabletImage
        : activeBanner.desktopImage
    : "";

  const bannerHeight = activeBanner
    ? windowWidth < 768
      ? activeBanner.heightMobile
      : windowWidth < 1024
        ? activeBanner.heightTablet
        : activeBanner.heightDesktop
    : 750;

  const imageStyle: React.CSSProperties = {};
  if (activeBanner) {
    const transforms: string[] = [];
    if (activeBanner.positionX) transforms.push(`translateX(${activeBanner.positionX}px)`);
    if (activeBanner.positionY) transforms.push(`translateY(${activeBanner.positionY}px)`);
    if (activeBanner.scale && activeBanner.scale !== 1) transforms.push(`scale(${activeBanner.scale})`);
    if (transforms.length > 0) imageStyle.transform = transforms.join(" ");
    imageStyle.objectPosition = activeBanner.objectPosition || "center";
  }

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const silhouetteY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-[#0a0a0a]">
      {!bannerImage && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#1a1a1a]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#E31837]/[0.07] blur-[140px]" />
          <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-[#E31837]/[0.05] blur-[120px]" />
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.02] blur-[100px]" />
        </div>
      )}

      <div
        className="relative mx-auto flex w-full max-w-[1440px] flex-col lg:flex-row"
        style={{ minHeight: `${bannerHeight}px` }}
      >
        <motion.div
          className="relative z-10 flex w-full flex-col justify-center px-6 py-12 sm:px-8 md:px-12 lg:w-[48%] lg:py-0 xl:px-16"
          style={{ y: textY }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} className="mb-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-[0.15em] text-white/80 backdrop-blur-sm sm:text-sm">
              <Zap className="h-3.5 w-3.5 text-[#E31837]" />
              КОМПРЕСІЙНИЙ ОДЯГ
            </span>
          </motion.div>

          <motion.h1
            variants={slideIn}
            className="mb-5 text-[2rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.5rem] xl:text-[4rem]"
          >
            ДЛЯ ТВОГО{" "}
            <span className="text-[#E31837]">ЗРУЧНОГО</span>
            <br />
            ТРЕНУВАННЯ
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mb-8 max-w-md text-sm leading-relaxed text-white/60 sm:text-base md:text-lg"
          >
            Преміальний компресійний одяг для дорослих та дітей.
            Дихаючий матеріал, підтримка м&apos;язів, ідеальна посадка.
          </motion.p>

          <motion.div variants={fadeUp} className="mb-10 flex flex-wrap gap-3">
            <Link
              href="/catalog?gender=men"
              className="group flex items-center gap-2.5 rounded-full bg-[#E31837] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#E31837]/25 transition-all duration-300 hover:bg-[#C41430] hover:shadow-xl hover:shadow-[#E31837]/35 hover:scale-[1.03] sm:px-8 sm:py-3.5 sm:text-base"
            >
              ДЛЯ ДОРОСЛИХ
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/catalog?gender=kids"
              className="group flex items-center gap-2.5 rounded-full border-2 border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:scale-[1.03] sm:px-8 sm:py-3.5 sm:text-base"
            >
              ДЛЯ ДІТЕЙ
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex flex-wrap gap-2.5"
          >
            {featureBadges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:text-white sm:text-sm"
              >
                <Icon className="h-3.5 w-3.5 text-[#E31837]" />
                {label}
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="relative w-full lg:w-[52%]">
          {bannerImage ? (
            <div className="relative h-full w-full overflow-hidden">
              <Image
                src={bannerImage}
                alt={activeBanner?.title || "Hero Banner"}
                fill
                sizes="(max-width: 1024px) 100vw, 52vw"
                priority
                className="object-cover"
                style={imageStyle}
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
            </div>
          ) : (
            <motion.div
              variants={silhouetteReveal}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="relative h-[400px] w-full sm:h-[500px] lg:h-full lg:min-h-[600px]"
                style={{ y: silhouetteY }}
              >
                <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E31837]/[0.12] blur-[100px]" />
                <div className="absolute left-[45%] top-[40%] h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E31837]/[0.08] blur-[80px]" />

                <div className="absolute left-1/2 top-[12%] -translate-x-[65%] sm:left-[42%] sm:top-[10%]">
                  <div className="relative mb-1 ml-[38px] h-[42px] w-[42px] rounded-full bg-gradient-to-b from-white/20 to-white/5 shadow-[0_0_30px_rgba(227,24,55,0.15)]" />
                  <div className="mx-auto h-[10px] w-[16px] bg-gradient-to-b from-white/15 to-white/5" />
                  <div className="relative mx-auto h-[130px] w-[90px] overflow-hidden rounded-t-3xl bg-gradient-to-b from-white/12 to-white/[0.04] shadow-[0_0_40px_rgba(227,24,55,0.1)]">
                    <div className="absolute left-0 right-0 top-[20px] h-[1px] bg-gradient-to-r from-transparent via-[#E31837]/30 to-transparent" />
                    <div className="absolute left-0 right-0 top-[45px] h-[1px] bg-gradient-to-r from-transparent via-[#E31837]/25 to-transparent" />
                    <div className="absolute left-0 right-0 top-[70px] h-[1px] bg-gradient-to-r from-transparent via-[#E31837]/20 to-transparent" />
                    <div className="absolute left-0 right-0 top-[95px] h-[1px] bg-gradient-to-r from-transparent via-[#E31837]/15 to-transparent" />
                    <div className="absolute bottom-0 left-0 top-0 w-[12px] bg-gradient-to-r from-[#E31837]/15 to-transparent" />
                    <div className="absolute bottom-0 right-0 top-0 w-[12px] bg-gradient-to-l from-[#E31837]/15 to-transparent" />
                  </div>
                  <div className="absolute left-[-18px] top-[56px] h-[110px] w-[22px] -rotate-12 rounded-full bg-gradient-to-b from-white/10 to-white/[0.03]" />
                  <div className="absolute right-[-18px] top-[56px] h-[110px] w-[22px] rotate-12 rounded-full bg-gradient-to-b from-white/10 to-white/[0.03]" />
                  <div className="mx-auto flex gap-[6px]">
                    <div className="h-[150px] w-[36px] rounded-b-2xl rounded-t-lg bg-gradient-to-b from-white/10 to-white/[0.03]">
                      <div className="absolute bottom-[40px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E31837]/20 to-transparent" />
                      <div className="absolute bottom-[80px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E31837]/15 to-transparent" />
                    </div>
                    <div className="h-[150px] w-[36px] rounded-b-2xl rounded-t-lg bg-gradient-to-b from-white/10 to-white/[0.03]">
                      <div className="absolute bottom-[40px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E31837]/20 to-transparent" />
                      <div className="absolute bottom-[80px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E31837]/15 to-transparent" />
                    </div>
                  </div>
                </div>

                <div className="absolute left-1/2 top-[28%] -translate-x-[15%] sm:left-[58%] sm:top-[22%]">
                  <div className="relative mb-1 ml-[30px] h-[34px] w-[34px] rounded-full bg-gradient-to-b from-white/15 to-white/[0.04] shadow-[0_0_20px_rgba(227,24,55,0.1)]" />
                  <div className="mx-auto h-[8px] w-[12px] bg-gradient-to-b from-white/10 to-white/[0.03]" />
                  <div className="relative mx-auto h-[100px] w-[70px] overflow-hidden rounded-t-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] shadow-[0_0_30px_rgba(227,24,55,0.08)]">
                    <div className="absolute left-0 right-0 top-[16px] h-[1px] bg-gradient-to-r from-transparent via-[#E31837]/20 to-transparent" />
                    <div className="absolute left-0 right-0 top-[36px] h-[1px] bg-gradient-to-r from-transparent via-[#E31837]/15 to-transparent" />
                    <div className="absolute left-0 right-0 top-[56px] h-[1px] bg-gradient-to-r from-transparent via-[#E31837]/12 to-transparent" />
                    <div className="absolute left-0 right-0 top-[76px] h-[1px] bg-gradient-to-r from-transparent via-[#E31837]/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 top-0 w-[10px] bg-gradient-to-r from-[#E31837]/10 to-transparent" />
                    <div className="absolute bottom-0 right-0 top-0 w-[10px] bg-gradient-to-l from-[#E31837]/10 to-transparent" />
                  </div>
                  <div className="absolute left-[-14px] top-[44px] h-[85px] w-[18px] -rotate-12 rounded-full bg-gradient-to-b from-white/[0.08] to-white/[0.02]" />
                  <div className="absolute right-[-14px] top-[44px] h-[85px] w-[18px] rotate-12 rounded-full bg-gradient-to-b from-white/[0.08] to-white/[0.02]" />
                  <div className="mx-auto flex gap-[5px]">
                    <div className="h-[120px] w-[28px] rounded-b-xl rounded-t-md bg-gradient-to-b from-white/[0.08] to-white/[0.02]">
                      <div className="absolute bottom-[32px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E31837]/15 to-transparent" />
                      <div className="absolute bottom-[64px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E31837]/12 to-transparent" />
                    </div>
                    <div className="h-[120px] w-[28px] rounded-b-xl rounded-t-md bg-gradient-to-b from-white/[0.08] to-white/[0.02]">
                      <div className="absolute bottom-[32px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E31837]/15 to-transparent" />
                      <div className="absolute bottom-[64px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E31837]/12 to-transparent" />
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-[15%] left-[15%] h-[1px] w-[120px] rotate-[25deg] bg-gradient-to-r from-transparent via-[#E31837]/25 to-transparent" />
                <div className="absolute bottom-[22%] left-[20%] h-[1px] w-[80px] rotate-[20deg] bg-gradient-to-r from-transparent via-[#E31837]/15 to-transparent" />
                <div className="absolute top-[18%] right-[12%] h-[1px] w-[100px] rotate-[-15deg] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="absolute bottom-[10%] right-[10%] h-[60px] w-[60px] rotate-45 border border-[#E31837]/20" />
                <div className="absolute bottom-[12%] right-[12%] h-[44px] w-[44px] rotate-45 border border-[#E31837]/10" />
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="relative z-10 w-full border-t border-white/5 bg-black/80 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-x-6 gap-y-2.5 px-6 py-3.5 sm:justify-between sm:px-8 md:px-12 lg:px-16">
          {bottomStrip.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-[#E31837]" />
              <span className="text-xs font-medium text-white/60 sm:text-sm">
                {item}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
