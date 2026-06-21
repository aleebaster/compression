"use client";

import { useState } from "react";
import Image from "next/image";
import { Package } from "lucide-react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}

function ImageSkeleton() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl shimmer" />
  );
}

function ImageError({ className }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 ${
        className || ""
      }`}
    >
      <Package className="h-10 w-10 text-gray-400 mb-2" />
      <span className="text-xs text-gray-400">Зображення недоступне</span>
    </div>
  );
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  fill,
  sizes,
  priority,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`relative ${className || ""}`} style={fill ? {} : { width, height }}>
        <ImageError />
      </div>
    );
  }

  return (
    <div className={`relative ${className || ""}`} style={fill ? {} : { width, height }}>
      {isLoading && <ImageSkeleton />}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        className={`object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}
