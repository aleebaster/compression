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
  Zap,
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

const imageReveal = {
  hidden: { opacity: 0, scale: 1.05 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export default function HeroBanner() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-[#0a0a0a]">
      {/* Main hero */}
      <div className="relative mx-auto flex min-h-[600px] w-full max-w-[1440px] flex-col lg:min-h-[85vh] lg:flex-row">
        {/* LEFT COLUMN — Text content */}
        <motion.div
          className="relative z-10 flex w-full flex-col justify-center px-6 py-12 sm:px-8 md:px-12 lg:w-[48%] lg:py-0 xl:px-16"
          style={{ y: textY }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="mb-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-[0.15em] text-white/80 backdrop-blur-sm sm:text-sm">
              <Zap className="h-3.5 w-3.5 text-[#E31837]" />
              КОМПРЕСІЙНИЙ ОДЯГ
            </span>
          </motion.div>

          {/* Heading — NO text that duplicates the image */}
          <motion.h1
            variants={slideIn}
            className="mb-5 text-[2rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.5rem] xl:text-[4rem]"
          >
            ДЛЯ ТВОГО{" "}
            <span className="text-[#E31837]">ЗРУЧНОГО</span>
            <br />
            ТРЕНУВАННЯ
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="mb-8 max-w-md text-sm leading-relaxed text-white/60 sm:text-base md:text-lg"
          >
            Преміальний компресійний одяг для дорослих та дітей.
            Дихаючий матеріал, підтримка м&apos;язів, ідеальна посадка.
          </motion.p>

          {/* CTA Buttons */}
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

          {/* Feature badges */}
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

        {/* RIGHT COLUMN — Image */}
        <motion.div
          className="relative w-full lg:w-[52%]"
          variants={imageReveal}
          initial="hidden"
          animate="visible"
        >
          {/* Clean gradient background — replaces the image background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a0e] via-[#0f0f0f] to-[#0a0a0a]" />

          {/* Subtle red accent glow */}
          <div className="absolute -left-20 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-[#E31837]/8 blur-[100px]" />

          {/* The banner image — positioned to show only the people, text area covered */}
          <motion.div
            className="relative h-[400px] w-full sm:h-[500px] lg:h-full lg:min-h-[600px]"
            style={{ y: imageY }}
          >
            <Image
              src="/hero-banner.png"
              alt="Компресійний одяг для дорослих та дітей"
              fill
              sizes="(max-width: 1024px) 100vw, 52vw"
              priority
              className="object-cover object-left-top sm:object-left"
              style={{ objectPosition: "70% 10%" }}
            />
            {/* Gradient to blend image edges into background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent lg:from-[#0a0a0a] lg:via-[#0a0a0a]/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/40" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom strip */}
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
