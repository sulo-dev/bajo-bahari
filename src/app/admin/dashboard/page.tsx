import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Dashboard Admin - Desa Bajo Bahari",
};

// Pastikan dashboard selalu menampilkan data terbaru
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // 1. MENGAMBIL JUMLAH DATA (COUNT) DARI DATABASE SECARA PARALEL
  // Menggunakan Promise.all agar pengambilan data lebih cepat
  const [
    { count: countArtikel },
    { count: countAgenda },
    { count: countUmkm },
    { count: countAspirasi }
  ] = await Promise.all([
    supabase.from("artikel").select("*", { count: "exact", head: true }),
    supabase.from("agenda_desa").select("*", { count: "exact", head: true }),
    supabase.from("umkm").select("*", { count: "exact", head: true }),
    supabase.from("aspirasi").select("*", { count: "exact", head: true }).eq("status", "Menunggu") // Hanya hitung aspirasi yang belum diproses
  ]);

  // Format Tanggal Hari Ini
  const tanggalHariIni = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  // Data Array untuk Kartu Statistik
  const stats = [
    {
      title: "Total Artikel",
      value: countArtikel || 0,
      desc: "Berita & Kegiatan",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-100"
    },
    {
      title: "Agenda Aktif",
      value: countAgenda || 0,
      desc: "Jadwal Desa",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: "text-green-600",
      bg: "bg-green-100",
      border: "border-green-100"
    },
    {
      title: "Produk UMKM",
      value: countUmkm || 0,
      desc: "Katalog Lokal",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: "text-orange-600",
      bg: "bg-orange-100",
      border: "border-orange-100"
    },
    {
      title: "Aspirasi Baru",
      value: countAspirasi || 0,
      desc: "Menunggu Tinjauan",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: "text-red-600",
      bg: "bg-red-100",
      border: "border-red-100"
    }
  ];

  return (
    <div className="p-4 sm:p-8 animate-fade-in-up">
      {/* Header Dashboard */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Selamat Datang, Admin!</h1>
          <p className="text-gray-600 mt-2 text-lg">
            Pusat kendali sistem informasi terpadu Desa Bajo Bahari.
          </p>
        </div>
        <div className="bg-white px-5 py-2.5 rounded-xl border border-gray-200 shadow-sm text-sm font-bold text-bajo-primary flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {tanggalHariIni}
        </div>
      </div>

      {/* Grid Statistik Dinamis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden"
          >
            {/* Dekorasi Latar */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} opacity-50 group-hover:scale-150 transition-transform duration-500 ease-out`}></div>
            
            <div className="flex items-center gap-5 relative z-10">
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-1">{stat.title}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black text-gray-900 leading-none">{stat.value}</h3>
                </div>
                <p className="text-xs text-gray-500 font-medium mt-1">{stat.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Area Akses Cepat (Quick Actions) */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-bajo-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Akses Cepat Pengelolaan
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/dashboard/artikel" className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-bajo-dark to-[#0f3460] text-white rounded-3xl hover:shadow-lg hover:shadow-bajo-dark/30 transition-all hover:-translate-y-1 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none"></div>
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg">Tulis Artikel Baru</h3>
            <p className="text-bajo-light text-sm mt-2 font-medium">Publikasikan kabar terbaru desa</p>
          </Link>

          <Link href="/admin/dashboard/aspirasi" className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl hover:border-bajo-primary hover:shadow-lg transition-all hover:-translate-y-1 group">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Tinjau Aspirasi</h3>
            <p className="text-gray-500 text-sm mt-2 font-medium">Cek {countAspirasi || 0} laporan warga baru</p>
          </Link>

          <Link href="/admin/dashboard/transparansi" className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl hover:border-bajo-primary hover:shadow-lg transition-all hover:-translate-y-1 group">
            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Kelola Transparansi</h3>
            <p className="text-gray-500 text-sm mt-2 font-medium">Update data APBDes & LPJ</p>
          </Link>
        </div>
      </div>

    </div>
  );
}