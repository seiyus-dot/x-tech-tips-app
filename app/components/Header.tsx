"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "\u30db\u30fc\u30e0" },
  { href: "/menu", label: "\u30e1\u30cb\u30e5\u30fc\u30fb\u6599\u91d1" },
  { href: "/gallery", label: "\u30ae\u30e3\u30e9\u30ea\u30fc" },
  { href: "/staff", label: "\u30b9\u30bf\u30c3\u30d5\u7d39\u4ecb" },
  { href: "/access", label: "\u30a2\u30af\u30bb\u30b9" },
  { href: "/reservation", label: "\u3054\u4e88\u7d04" },
  { href: "/blog", label: "\u30d6\u30ed\u30b0" },
  { href: "/contact", label: "\u304a\u554f\u3044\u5408\u308f\u305b" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">&#x1f485;</span>
            <div>
              <span className="text-lg font-bold text-primary-dark tracking-wide">
                Lumiere
              </span>
              <span className="text-[10px] text-gray-400 block leading-none">
                NAIL SALON
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 hover:text-primary-dark transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/reservation"
              className="btn-primary text-sm px-5 py-2 rounded-full"
            >
              \u4eca\u3059\u3050\u4e88\u7d04
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="\u30e1\u30cb\u30e5\u30fc\u3092\u958b\u304f"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`block h-0.5 bg-gray-600 transition-transform ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block h-0.5 bg-gray-600 transition-opacity ${isMenuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 bg-gray-600 transition-transform ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden pb-4 border-t border-gray-100">
            <div className="flex flex-col gap-1 pt-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-600 hover:text-primary-dark hover:bg-primary-light/30 px-3 py-2 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/reservation"
                className="btn-primary text-sm px-5 py-2 rounded-full text-center mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                \u4eca\u3059\u3050\u4e88\u7d04
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
