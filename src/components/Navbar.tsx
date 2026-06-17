"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Data navigasi
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
    <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-extrabold text-bajo-dark flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <div className="w-8 h-8 bg-bajo-primary rounded-lg flex items-center justify-center text-white text-lg shadow-sm">
                B
              </div>
              <span>Bajo<span className="text-bajo-primary">Bahari</span></span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-1 items-center">
            {navMenus.map((menu, index) => (
              <div key={index} className="relative group">
                <button className="text-gray-700 hover:text-bajo-primary hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-1">
                  {menu.title}
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-bajo-primary group-hover:-rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Desktop */}
                <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50 overflow-hidden">
                  <div className="py-2">
                    {menu.submenu.map((sub, idx) => (
                      <Link
                        key={idx}
                        href={sub.href}
                        className="block px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-bajo-primary/5 hover:text-bajo-primary hover:pl-7 transition-all duration-300"
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
              className="ml-4 bg-bajo-dark hover:bg-bajo-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Login Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 bg-gray-50 hover:bg-gray-100 p-2.5 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-bajo-primary"
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
      <div 
        className={`lg:hidden absolute w-full bg-white border-t border-gray-100 shadow-2xl transition-all duration-300 origin-top overflow-hidden ${isOpen ? 'max-h-[85vh] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-4 py-6 space-y-6">
          {navMenus.map((menu, index) => (
            <div key={index} className="space-y-2">
              {/* Header Kategori Mobile */}
              <div className="px-2 text-xs font-extrabold text-bajo-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-bajo-primary"></div>
                {menu.title}
              </div>
              
              {/* List Submenu Mobile */}
              <div className="grid grid-cols-1 gap-1 pl-2 border-l-2 border-gray-100 ml-2">
                {menu.submenu.map((sub, idx) => (
                  <Link
                    key={idx}
                    href={sub.href}
                    onClick={() => setIsOpen(false)} // PERBAIKAN: Menutup menu setelah di-klik
                    className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-bajo-primary hover:bg-bajo-primary/5 rounded-xl transition-colors"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          
          {/* Tombol Admin (Mobile) */}
          <div className="pt-6 pb-4 border-t border-gray-100">
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)} // PERBAIKAN: Menutup menu setelah di-klik
              className="flex justify-center w-full bg-bajo-dark hover:bg-bajo-primary text-white px-5 py-4 rounded-xl text-base font-bold transition-all shadow-md"
            >
              Login Panel Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}