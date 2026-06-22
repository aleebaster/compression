"use client";
import Image from "next/image";
import { useAdminSettings } from "@/lib/admin-store";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ className = "", size = "md" }: LogoProps) {
  const { getSetting } = useAdminSettings();
  const logoUrl = getSetting("logoUrl");

  const heights = { sm: "h-6", md: "h-8", lg: "h-10" };

  if (logoUrl) {
    return (
      <div className={`relative ${heights[size]} w-auto ${className}`}>
        <Image src={logoUrl} alt="Logo" fill className="object-contain" unoptimized />
      </div>
    );
  }

  return (
    <span className={`text-xl font-bold tracking-tight ${size === "lg" ? "text-2xl" : ""} ${className}`}>
      compression_mega_shop
    </span>
  );
}
