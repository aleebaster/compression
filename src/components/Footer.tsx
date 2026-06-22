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
    <footer className="relative border-t border-white/10 bg-[#111111]">
      <div
        className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <Logo size="lg" className="text-white" />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-neutral-400">
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
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-neutral-400 transition-colors hover:border-[#E31837] hover:text-[#E31837]"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation columns */}
          {navLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-400 transition-colors hover:text-[#E31837]"
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
        <div className="grid grid-cols-1 gap-8 border-t border-white/10 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Contact info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Зв&apos;язатися з нами
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="tel:+380504967515"
                  className="flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-[#E31837]"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  +38 (050) 496-75-15
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@crossover.com.ua"
                  className="flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-[#E31837]"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  crossover.info@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Payment methods */}
          <div className="sm:col-span-2 lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Способи оплати
            </h3>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              {(["Visa", "Mastercard", "LiqPay", "Monobank"] as const).map(
                (method) => (
                  <span
                    key={method}
                    className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-neutral-300"
                  >
                    {method}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 sm:flex-row">
          <p className="text-xs text-neutral-500">
            &copy; 2026 Усі права захищені.
          </p>
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <Link
              href="/privacy"
              className="transition-colors hover:text-[#E31837]"
            >
              Політика конфіденційності
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-[#E31837]"
            >
              Умови використання
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
