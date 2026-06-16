"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // State untuk menahan tampilan (loading) selama satpam mengecek status login
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fungsi untuk mengecek sesi saat ini
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Jika tidak ada sesi (belum login/jalan tikus), lempar ke halaman login
        router.replace("/admin");
      } else {
        // Jika sesi ada (sah), matikan loading dan izinkan masuk
        setIsLoading(false);
      }
    };

    checkAuth();

    // Memasang pendengar (listener) jika sewaktu-waktu status berubah 
    // (misalnya *logout* dari tab *browser* yang lain)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.replace("/admin");
      }
    });

    // Membersihkan listener saat komponen dilepas untuk mencegah memory leak
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  const menuItems = [
    { name: "Beranda Dashboard", href: "/admin/dashboard", icon: "🏠" },
    { name: "Kelola Berita", href: "/admin/dashboard/berita", icon: "📰" },
    { name: "Kelola Layanan", href: "/admin/dashboard/layanan", icon: "📄" },
    { name: "Transparansi Dana", href: "/admin/dashboard/dana", icon: "💰" },
  ];

  // Layar Loading Sederhana saat pengecekan berlangsung
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-bajo-primary"></div>
          <p className="text-bajo-dark font-medium animate-pulse">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  // Jika aman (isLoading false), tampilkan struktur Sidebar dan Konten Utama
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar untuk Desktop */}
      <aside className="w-64 bg-bajo-dark text-white flex flex-col hidden md:flex shadow-2xl z-10">
        <div className="h-20 flex items-center justify-center border-b border-white/10">
          <h1 className="text-xl font-bold">Panel <span className="text-bajo-primary">Admin</span></h1>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? "bg-bajo-primary text-white shadow-md transform scale-[1.02]" 
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors text-sm font-medium"
          >
            <span className="text-lg">🚪</span> Keluar
          </button>
        </div>
      </aside>

      {/* Area Konten Utama */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header Mobile Ringkas */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 md:hidden z-10">
          <h1 className="font-bold text-bajo-dark">Admin Bajo Bahari</h1>
          <button onClick={handleLogout} className="text-red-500 text-sm font-medium hover:text-red-700 transition-colors">
            Keluar
          </button>
        </header>

        {/* Area Scrollable untuk Konten (Children) */}
        <div className="p-6 md:p-10 flex-1 overflow-y-auto bg-gray-50/50">
          {children}
        </div>
      </main>
    </div>
  );
}   