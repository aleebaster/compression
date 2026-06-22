import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "compression_mega_shop — Преміальний компресійний одяг",
    template: "%s | compression_mega_shop",
  },
  description:
    "Преміальний компресійний одяг для чоловіків та дітей. Рашгарди, шорти, футболки, комплекти 2-5в1. Доставка по Україні.",
  keywords: ["компресійний одяг", "рашгард", "компресійні шорти", "спорт", "MMA", "фітнес", "UFC"],
  openGraph: {
    type: "website",
    locale: "uk_UA",
    siteName: "compression_mega_shop",
    title: "compression_mega_shop — Преміальний компресійний одяг",
    description: "Преміальний компресійний одяг для чоловіків та дітей. Рашгарди, шорти, футболки, комплекти.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
