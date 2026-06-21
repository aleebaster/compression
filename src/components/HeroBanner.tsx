"use client";

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
} from "lucide-react";
import { useRef } from "react";

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
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

const slideIn = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export default function HeroBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.6]);

  return (
    <section ref={bannerRef} className="relative w-full overflow-hidden">
      {/* Hero container */}
      <div className="relative h-[80vh] min-h-[600px] w-full md:h-[90vh]">
        {/* Background image with parallax */}
        <motion.div
          className="absolute inset-0"
          style={{ y: imageY }}
        >
          <Image
            src="/hero-banner.png"
            alt="Компресійний одяг для тренувань"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
          />
        </motion.div>

        {/* Gradient overlay */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: overlayOpacity }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        </motion.div>

        {/* Content */}
        <motion.div
          className="relative z-10 flex h-full flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-3xl">
            {/* Label */}
            <motion.div variants={fadeUp} className="mb-4">
              <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-white/90 backdrop-blur-md sm:text-sm">
                КОМПРЕСІЙНИЙ ОДЯГ
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={slideIn}
              className="mb-6 text-3xl font-bold leading-[1.1] text-white sm:text-5xl md:text-6xl lg:text-7xl"
            >
              ДЛЯ ТВОГО{" "}
              <span className="text-[#E31837]">ЗРУЧНОГО</span>{" "}
              ТРЕНУВАННЯ
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="mb-10 max-w-xl text-base text-white/80 sm:text-lg md:text-xl"
            >
              Преміальна якість для дорослих та дітей
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              className="mb-14 flex flex-wrap gap-4"
            >
              <Link
                href="/adults"
                className="group flex items-center gap-2 rounded-full bg-[#E31837] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#E31837]/30 transition-all duration-300 hover:bg-[#C41430] hover:shadow-xl hover:shadow-[#E31837]/40 hover:scale-105 sm:px-9 sm:py-4 sm:text-base"
              >
                ДЛЯ ДОРОСЛИХ
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/kids"
                className="group flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/10 hover:scale-105 sm:px-9 sm:py-4 sm:text-base"
              >
                ДЛЯ ДІТЕЙ
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* Feature badges */}
            <motion.div
              variants={fadeIn}
              custom={0.9}
              className="flex flex-wrap gap-3"
            >
              {featureBadges.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-medium text-white backdrop-blur-md transition-all duration-300 hover:bg-white/15 hover:border-white/25 sm:text-sm"
                >
                  <Icon className="h-4 w-4 text-[#E31837]" />
                  {label}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="relative z-10 w-full border-t border-white/10 bg-black/60 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-4 sm:justify-between sm:gap-x-6">
          {bottomStrip.map((item, i) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#E31837]" />
              <span className="text-xs font-medium text-white/80 sm:text-sm">
                {item}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
