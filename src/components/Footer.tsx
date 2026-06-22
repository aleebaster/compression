"use client";

import Link from "next/link";
import {
  Camera,
  Globe,
  Send,
  Phone,
  Mail,
} from "lucide-react";
import Logo from "@/components/Logo";

const navLinks = [
  {
    title: "Каталог",
    links: [
      { label: "Новинки", href: "/new" },
      { label: "Чоловічий", href: "/category/men" },
      { label: "Дитячий", href: "/category/kids" },
    ],
  },
  {
    title: "Допомога",
    links: [
      { label: "Доставка та оплата", href: "/delivery" },
      { label: "Повернення", href: "/returns" },
      { label: "Розмірна сітка", href: "/size-guide" },
      { label: "Контакти", href: "/contacts" },
    ],
  },
  {
    title: "Про нас",
    links: [
      { label: "Про нас", href: "/about" },
      { label: "Контакти", href: "/contacts" },
      { label: "Повернення", href: "/returns" },
      { label: "Розмірна сітка", href: "/size-guide" },
    ],
  },
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", icon: Camera },
  { label: "Facebook", href: "https://facebook.com", icon: Globe },
  { label: "Telegram", href: "https://t.me", icon: Send },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <Logo size="lg" />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-500">
              Преміальний компресійний одяг для активного життя та здоров&apos;я
            </p>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-colors hover:border-[#E31837] hover:text-[#E31837]"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation columns */}
          {navLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 transition-colors hover:text-[#E31837]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact + Payment */}
        <div className="grid grid-cols-1 gap-8 border-t border-gray-200 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Contact info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Зв&apos;язатися з нами
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="tel:+380977585422"
                  className="flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-[#E31837]"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  +38 (097) 758-54-22
                </a>
              </li>
              <li className="text-sm text-gray-500">
                Олександр
              </li>
            </ul>
          </div>

          {/* Payment methods */}
          <div className="sm:col-span-2 lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Способи оплати
            </h3>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              {(["LiqPay", "Monobank", "Накладний платіж"] as const).map(
                (method) => (
                  <span
                    key={method}
                    className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600"
                  >
                    {method}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 py-6 sm:flex-row">
          <p className="text-xs text-gray-400">
            &copy; 2026 compression_mega_shop. Усі права захищені.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link
              href="/privacy"
              className="transition-colors hover:text-[#E31837]"
            >
              Політика конфіденційності
            </Link>
            <Link
              href="/delivery"
              className="transition-colors hover:text-[#E31837]"
            >
              Доставка та оплата
            </Link>
            <Link
              href="/returns"
              className="transition-colors hover:text-[#E31837]"
            >
              Повернення
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
