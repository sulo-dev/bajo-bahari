"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Data navigasi agar kode lebih rapi dan mudah di-maintenance
  const navMenus = [
    {
      title: "Profil Desa",
      submenu: [
        { name: "Visi Misi", href: "/profil/visi-misi" },
        { name: "Sejarah", href: "/profil/sejarah" },
        { name: "Geografi", href: "/profil/geografi" },
        { name: "Demografi", href: "/profil/demografi" },
      ],
    },
    {
      title: "Informasi Pemerintahan",
      submenu: [
        { name: "Struktur Organisasi", href: "/pemerintahan/struktur" },
        { name: "Daftar Perangkat Desa", href: "/pemerintahan/perangkat" },
        { name: "Kontak", href: "/pemerintahan/kontak" },
      ],
    },
    {
      title: "Transparansi Anggaran",
      submenu: [
        { name: "RPJMDes", href: "/transparansi/rpjmdes" },
        { name: "APBDes", href: "/transparansi/apbdes" },
        { name: "LPJ", href: "/transparansi/lpj" },
      ],
    },
    {
      title: "Layanan Desa",
      submenu: [
        { name: "Pengurusan Surat", href: "/layanan/surat" },
        { name: "Aspirasi", href: "/layanan/aspirasi" },
        { name: "Fasilitas Publik", href: "/layanan/fasilitas" },
      ],
    },
    {
      title: "Potensi & Berita",
      submenu: [
        { name: "Artikel Kegiatan", href: "/potensi/artikel" },
        { name: "Agenda Desa", href: "/potensi/agenda" },
        { name: "Galeri", href: "/potensi/galeri" },
        { name: "Promosi UMKM", href: "/potensi/umkm" },
      ],
    },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-bajo-dark">
              Bajo<span className="text-bajo-primary">-Bahari</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4 items-center">
            {navMenus.map((menu, index) => (
              <div key={index} className="relative group">
                <button className="text-gray-700 hover:text-bajo-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  {menu.title}
                </button>
                {/* Dropdown Desktop */}
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="py-1">
                    {menu.submenu.map((sub, idx) => (
                      <Link
                        key={idx}
                        href={sub.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-bajo-light hover:text-bajo-dark"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Tombol Admin (Desktop) */}
            <Link
              href="/admin"
              className="ml-4 bg-bajo-secondary hover:bg-bajo-dark text-white px-5 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
            >
              Login Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-bajo-primary focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Dropdown Vertical) */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 pb-4 shadow-inner">
          <div className="px-2 pt-2 space-y-1">
            {navMenus.map((menu, index) => (
              <div key={index} className="space-y-1">
                <div className="px-3 py-2 text-base font-semibold text-bajo-dark bg-gray-50 rounded-md">
                  {menu.title}
                </div>
                {menu.submenu.map((sub, idx) => (
                  <Link
                    key={idx}
                    href={sub.href}
                    className="block px-6 py-2 text-sm text-gray-600 hover:text-bajo-primary hover:bg-bajo-light rounded-md"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            ))}
            
            {/* Tombol Admin (Mobile) */}
            <div className="pt-4 px-3">
              <Link
                href="/admin"
                className="block w-full text-center bg-bajo-secondary hover:bg-bajo-dark text-white px-5 py-3 rounded-md text-base font-medium transition-colors shadow-sm"
              >
                Login Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}