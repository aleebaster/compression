"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useAdminBanners } from "@/lib/admin-store";

function getDeviceKey(width: number): "mobile" | "tablet" | "desktop" {
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

function getVal(v: { desktop?: number | string; tablet?: number | string; mobile?: number | string } | undefined, device: "mobile" | "tablet" | "desktop", fallback: number): number {
  const val = v?.[device];
  if (typeof val === "number") return val;
  if (typeof val === "string") return parseInt(val, 10) || fallback;
  return fallback;
}

function getBoolVal(v: { desktop?: boolean; tablet?: boolean; mobile?: boolean } | undefined, device: "mobile" | "tablet" | "desktop", fallback: boolean): boolean {
  if (!v) return fallback;
  const val = v[device];
  return typeof val === "boolean" ? val : fallback;
}

export default function HeroBanner() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { banners, load: loadBanners } = useAdminBanners();

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  const activeBanner = banners.find((b) => b.isActive) || banners[0];

  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1920);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const device = getDeviceKey(windowWidth);

  const bannerImage = activeBanner
    ? device === "mobile"
      ? activeBanner.mobileImage
      : device === "tablet"
        ? activeBanner.tabletImage
        : activeBanner.desktopImage
    : "";

  const bannerHeight = activeBanner
    ? getVal(activeBanner.height, device, device === "mobile" ? 500 : device === "tablet" ? 650 : 750)
    : 750;

  const bannerMaxW = activeBanner
    ? getVal(activeBanner.maxWidth, device, 1440)
    : 1440;

  const isFullWidth = activeBanner ? getBoolVal(activeBanner.fullWidth, device, true) : true;

  const imageStyle: React.CSSProperties = {};
  if (activeBanner) {
    const transforms: string[] = [];
    if (activeBanner.positionX) transforms.push(`translateX(${activeBanner.positionX}px)`);
    if (activeBanner.positionY) transforms.push(`translateY(${activeBanner.positionY}px)`);
    if (activeBanner.scale && activeBanner.scale !== 1) transforms.push(`scale(${activeBanner.scale})`);
    if (transforms.length > 0) imageStyle.transform = transforms.join(" ");
    imageStyle.objectPosition = activeBanner.objectPosition || "center";
    imageStyle.objectFit = activeBanner.objectFit || "cover";
  }

  const overlayStyle: React.CSSProperties = {};
  if (activeBanner?.overlay?.enabled) {
    const o = activeBanner.overlay;
    if (o.gradientEnabled) {
      const dir = o.gradientDirection || "to bottom";
      overlayStyle.background = `linear-gradient(${dir}, ${o.color}${Math.round((o.opacity || 0.5) * 255).toString(16).padStart(2, "0")}, transparent)`;
    } else {
      overlayStyle.backgroundColor = o.color;
      overlayStyle.opacity = o.opacity ?? 0.5;
    }
  }

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

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
        className="relative mx-auto w-full"
        style={{
          minHeight: `${bannerHeight}px`,
          maxWidth: isFullWidth ? "100%" : `${bannerMaxW}px`,
        }}
      >
        {bannerImage ? (
          <motion.div
            className="relative h-full w-full overflow-hidden"
            style={{ minHeight: `${bannerHeight}px`, y: imgY }}
          >
            <Image
              src={bannerImage}
              alt="Hero Banner"
              fill
              sizes="100vw"
              priority
              className="h-full w-full"
              style={imageStyle}
              unoptimized
            />
            {activeBanner?.overlay?.enabled && (
              <div className="absolute inset-0" style={overlayStyle} />
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-[500px] items-center justify-center sm:h-[650px] lg:h-[750px]"
          >
            <div className="text-sm text-white/20">Завантажте банер через адмін панель</div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
