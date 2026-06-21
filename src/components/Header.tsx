"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ShoppingBag, User, ChevronDown } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { categories } from "@/lib/data";

const navLinks = [
  { label: "Чоловічий", href: "/category/men" },
  { label: "Жіночий", href: "/category/women" },
  { label: "Дитячий", href: "/category/kids" },
  { label: "Термобілизна", href: "/category/thermal" },
  { label: "Всі товари", href: "/catalog" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const { getItemCount } = useCartStore();
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const getCategorySlug = (label: string): string | null => {
    const map: Record<string, string> = {
      Чоловічий: "men",
      Жіночий: "women",
      Дитячий: "kids",
      Термобілизна: "thermal",
    };
    return map[label] ?? null;
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden -ml-2 p-2 text-gray-700 hover:text-[#E31837] transition-colors"
              aria-label="Відкрити меню"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl font-bold tracking-tight lg:text-2xl">
                COMP
                <span className="text-[#E31837]">EX</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:gap-1">
              {navLinks.map((link) => {
                const categorySlug = getCategorySlug(link.label);
                const category = categorySlug
                  ? categories.find((c) => c.slug === categorySlug)
                  : null;
                const hasChildren =
                  category?.children && category.children.length > 0;

                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() =>
                      hasChildren && setActiveDropdown(link.label)
                    }
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#E31837] transition-colors"
                    >
                      {link.label}
                      {hasChildren && (
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            activeDropdown === link.label ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </Link>

                    {/* Dropdown */}
                    <AnimatePresence>
                      {hasChildren &&
                        activeDropdown === link.label &&
                        category?.children && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 top-full z-50 mt-1 w-56 rounded-lg border border-gray-100 bg-white py-2 shadow-xl"
                          >
                            <Link
                              href={link.href}
                              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#E31837]"
                            >
                              Всі {link.label.toLowerCase()}
                            </Link>
                            {category.children.map((child) => (
                              <Link
                                key={child.id}
                                href={`/category/${child.slug}`}
                                className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#E31837]"
                              >
                                {child.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search - Desktop */}
              <div className="hidden sm:block">
                <AnimatePresence mode="wait">
                  {isSearchExpanded ? (
                    <motion.form
                      key="expanded-search"
                      initial={{ width: 40, opacity: 0 }}
                      animate={{ width: 240, opacity: 1 }}
                      exit={{ width: 40, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleSearchSubmit}
                      className="flex items-center"
                    >
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        placeholder="Пошук товарів..."
                        className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2 pr-10 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsSearchExpanded(false);
                          setSearchQuery("");
                        }}
                        className="absolute right-2 p-1 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.form>
                  ) : (
                    <motion.button
                      key="search-button"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsSearchExpanded(true)}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 hover:text-[#E31837] transition-colors"
                      aria-label="Пошук"
                    >
                      <Search className="h-5 w-5" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Search - Mobile */}
              <Link
                href="/search"
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 hover:text-[#E31837] transition-colors sm:hidden"
                aria-label="Пошук"
              >
                <Search className="h-5 w-5" />
              </Link>

              {/* Account */}
              <Link
                href="/account"
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 hover:text-[#E31837] transition-colors"
                aria-label="Обліковий запис"
              >
                <User className="h-5 w-5" />
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 hover:text-[#E31837] transition-colors"
                aria-label="Кошик"
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E31837] px-1 text-[10px] font-bold text-white"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </motion.span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[70] flex w-full max-w-sm flex-col bg-white"
            >
              {/* Drawer Header */}
              <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xl font-bold tracking-tight"
                >
                  COMP<span className="text-[#E31837]">EX</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
                  aria-label="Закрити меню"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Search */}
              <div className="border-b border-gray-100 px-4 py-4">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Пошук товарів..."
                    className="w-full rounded-full border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#E31837] focus:ring-1 focus:ring-[#E31837]"
                  />
                </form>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-1">
                  {navLinks.map((link) => {
                    const categorySlug = getCategorySlug(link.label);
                    const category = categorySlug
                      ? categories.find((c) => c.slug === categorySlug)
                      : null;
                    const hasChildren =
                      category?.children && category.children.length > 0;

                    return (
                      <div key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium text-gray-800 hover:bg-gray-50 hover:text-[#E31837] transition-colors"
                        >
                          {link.label}
                        </Link>
                        {hasChildren && category?.children && (
                          <div className="ml-4 border-l-2 border-gray-100 pl-4">
                            {category.children.map((child) => (
                              <Link
                                key={child.id}
                                href={`/category/${child.slug}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#E31837]"
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </nav>

              {/* Drawer Footer */}
              <div className="border-t border-gray-100 px-4 py-4">
                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#E31837]"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">Обліковий запис</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-16 lg:h-20" />
    </>
  );
}
