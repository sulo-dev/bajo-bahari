"use client";

import { useState } from "react"; // useEffect dihapus
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // State untuk mengontrol buka/tutup sidebar di Mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data Menu Admin
  const menuGroups = [
    {
      kategori: "Main Menu",
      items: [
        { title: "Dashboard", path: "/admin/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" }
      ]
    },
    {
      kategori: "Data & Transparansi",
      items: [
        { title: "Profil & Sejarah", path: "/admin/dashboard/profil", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
        { title: "Pemerintahan", path: "/admin/dashboard/pemerintahan", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
        { title: "APBDes & LPJ", path: "/admin/dashboard/transparansi", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }
      ]
    },
    {
      kategori: "Layanan Publik",
      items: [
        { title: "Pengajuan Surat", path: "/admin/dashboard/surat", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
        { title: "Kotak Aspirasi", path: "/admin/dashboard/aspirasi", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
        { title: "Fasilitas Desa", path: "/admin/dashboard/fasilitas", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" }
      ]
    },
    {
      kategori: "Potensi & Berita",
      items: [
        { title: "Artikel Kegiatan", path: "/admin/dashboard/artikel", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
        { title: "Agenda Desa", path: "/admin/dashboard/agenda", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
        { title: "Galeri Foto", path: "/admin/dashboard/galeri", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
        { title: "Promosi UMKM", path: "/admin/dashboard/umkm", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" }
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] text-gray-800 overflow-hidden font-sans">
      
      {/* Overlay Gelap untuk Mobile saat Sidebar Terbuka */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* ================= SIDEBAR ================= */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-bajo-dark text-white flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:relative lg:translate-x-0`}
      >
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

        {/* Logo & Header */}
        <div className="h-20 flex items-center justify-between px-6 lg:px-8 border-b border-white/10 relative z-10">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-bajo-primary to-bajo-light flex items-center justify-center mr-3 shadow-lg">
              <span className="font-extrabold text-white text-lg">B</span>
            </div>
            <h2 className="text-xl font-bold tracking-wide text-white">
              Desa <span className="text-bajo-light">Bajo</span>
            </h2>
          </div>
          
          {/* Tombol Tutup Sidebar (Hanya terlihat di Mobile) */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Navigasi */}
        <div className="flex-grow py-6 px-4 overflow-y-auto relative z-10 scrollbar-hide">
          <div className="space-y-8">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <p className="px-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-3">
                  {group.kategori}
                </p>
                <div className="space-y-1">
                  {group.items.map((item, itemIndex) => {
                    const isActive = item.path === "/admin/dashboard" 
                      ? pathname === item.path 
                      : pathname.startsWith(item.path);
                    
                    return (
                      <Link 
                        key={itemIndex} 
                        href={item.path}
                        onClick={() => setIsSidebarOpen(false)} // Menutup sidebar di mobile saat menu diklik
                        className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                          isActive 
                            ? "bg-white/10 text-white shadow-inner" 
                            : "text-gray-400 hover:bg-white/5 hover:text-gray-100"
                        }`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-bajo-primary rounded-r-full shadow-[0_0_10px_rgba(var(--bajo-primary),0.8)]"></div>
                        )}
                        <svg className={`w-5 h-5 transition-transform duration-300 ${isActive ? "text-bajo-primary scale-110" : "group-hover:scale-110 group-hover:text-bajo-light"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d={item.icon} />
                        </svg>
                        <span className={`text-sm ${isActive ? "font-semibold" : "font-medium"}`}>{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Sidebar (User Info Mini) */}
        <div className="p-4 border-t border-white/10 relative z-10">
          <button className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 rounded-xl transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-transparent group-hover:border-red-400 flex items-center justify-center overflow-hidden transition-colors">
                <svg className="w-5 h-5 text-gray-300 group-hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-none">Admin Utama</p>
                <p className="text-[10px] text-gray-400 mt-1">Keluar Sistem</p>
              </div>
            </div>
            <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </aside>

      {/* ================= KONTEN UTAMA & TOPBAR ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Topbar / Header Atas */}
        <header className="h-20 bg-white/90 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 z-30 relative">
          
          <div className="flex items-center flex-1">
            {/* Tombol Hamburger (Muncul di Mobile/Tablet saja) */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 mr-2 -ml-2 text-gray-600 hover:text-bajo-primary hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Sisi Kiri Topbar (Search) */}
            <div className="relative w-full max-w-md hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100/80 border-transparent rounded-xl text-sm focus:border-bajo-primary focus:bg-white focus:ring-1 focus:ring-bajo-primary/50 transition-all outline-none" 
                placeholder="Cari menu atau data desa..."
              />
            </div>
          </div>

          {/* Sisi Kanan Topbar (Aksi & Profil) */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button className="relative p-2 text-gray-400 hover:text-bajo-primary hover:bg-gray-100 rounded-full transition-all">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>

            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800 leading-none">Admin Desa</p>
                <p className="text-xs text-gray-500 mt-1">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-bajo-primary text-white flex items-center justify-center font-bold shadow-md shadow-bajo-primary/30 group-hover:scale-105 transition-transform">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Area Render Halaman Dashboard */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 relative">
          <div className="absolute top-0 left-0 w-full h-64 bg-bajo-primary/5 rounded-b-[50px] -z-10 pointer-events-none"></div>
          {children}
        </main>

      </div>
    </div>
  );
}