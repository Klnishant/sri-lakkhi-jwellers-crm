"use client";

import Link from "next/link";

const footerLinks = [
  { label: "TERMS", href: "/terms" },
  { label: "PRIVACY", href: "/privacy" },
  { label: "SUPPORT", href: "/support" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#FFF8F7] border-t border-[#E8DDD4]">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-20 h-[72px] flex items-center justify-between">

        {/* Copyright */}
        <p
          className="text-[#9E8A7E] tracking-[0.08em]"
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: "11px",
            fontWeight: 400,
            textTransform: "uppercase",
          }}
        >
          © 2024 Lakhhi Jewellers. All Rights Reserved.
        </p>

        {/* Nav Links */}
        <nav className="flex items-center gap-8">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[#9E8A7E] hover:text-[#5C3D2E] transition-colors duration-200 tracking-[0.10em]"
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: "11px",
                fontWeight: 400,
                textTransform: "uppercase",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

      </div>
    </footer>
  );
}