"use client";

import Link from "next/link";
import { useState } from "react";

interface SiteNavProps {
  id: string;
  name: string;
  palette: { primary: string; text: string; bg: string };
}

export default function SiteNav({ id, name, palette }: SiteNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);

  const links = [
    { href: `/site/${id}`, label: "Home" },
    { href: `/site/${id}/features`, label: "Features" },
    { href: `/site/${id}/how-it-works`, label: "How It Works" },
    { href: `/site/${id}/pricing`, label: "Pricing" },
    { href: `/site/${id}/about`, label: "About" },
    { href: `/site/${id}/contact`, label: "Contact" },
    { href: `/site/${id}/faq`, label: "FAQ" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-colors ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}
      style={!dark ? { borderBottomColor: palette.primary + "20" } : undefined}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={`/site/${id}`} className="font-bold text-lg" style={{ color: dark ? "#fff" : palette.primary }}>
            {name}
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={`text-sm font-medium hover:opacity-80 ${dark ? "text-gray-300" : "text-gray-600"}`}>
                {l.label}
              </Link>
            ))}
            <button
              onClick={() => setDark(!dark)}
              className={`p-2 rounded-lg text-sm ${dark ? "bg-gray-800 text-yellow-400" : "bg-gray-100 text-gray-600"}`}
            >
              {dark ? "Light" : "Dark"}
            </button>
            <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">&larr; Factory</Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2"
            style={{ color: dark ? "#fff" : palette.text }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={`block py-2 text-sm ${dark ? "text-gray-300" : "text-gray-600"}`} onClick={() => setMenuOpen(false)}>
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
