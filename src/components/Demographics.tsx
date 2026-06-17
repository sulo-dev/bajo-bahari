import { supabase } from "@/lib/supabase";

// Komponen Server (Tidak perlu "use client")
export default async function Demographics() {
  // 1. TARIK DATA STATISTIK DARI DATABASE
  const { data } = await supabase
    .from("profil_desa")
    .select("total_penduduk, total_laki_laki, total_perempuan")
    .limit(1)
    .single();

  // 2. PEMETAAN DATA DENGAN FALLBACK AMAN
  const penduduk = data?.total_penduduk || 1250;
  const lakiLaki = data?.total_laki_laki || 640;
  const perempuan = data?.total_perempuan || 610;
  const luasWilayah = 150; // Angka statis (Bisa disesuaikan jika ada di DB)

  // 3. STRUKTUR KONTEN BESERTA IKON SVG PREMIUM
  const stats = [
    { 
      id: 1, 
      name: 'Total Penduduk', 
      value: penduduk.toLocaleString('id-ID'), 
      unit: 'Jiwa',
      icon: (
        <svg className="w-8 h-8 text-bajo-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      id: 2, 
      name: 'Laki-Laki', 
      value: lakiLaki.toLocaleString('id-ID'), 
      unit: 'Jiwa',
      icon: (
        <svg className="w-8 h-8 text-bajo-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      id: 3, 
      name: 'Perempuan', 
      value: perempuan.toLocaleString('id-ID'), 
      unit: 'Jiwa',
      icon: (
        <svg className="w-8 h-8 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    { 
      id: 4, 
      name: 'Luas Wilayah', 
      value: luasWilayah.toLocaleString('id-ID'), 
      unit: 'Hektar',
      icon: (
        <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      )
    },
  ];

  return (
    <section className="py-20 bg-bajo-dark text-white relative overflow-hidden">
      
      {/* 1. Latar Belakang Abstrak & Ornamen */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Pola Grid Tipis */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Ornamen Cahaya Blur */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-bajo-primary/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-bajo-secondary/20 blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Seksi */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-bajo-light font-bold uppercase tracking-widest text-xs mb-4">
            Data Terpadu
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Statistik Desa</h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto font-medium">
            Gambaran demografi dan wilayah administrasi Desa Bajo Bahari berdasarkan data kependudukan terbaru.
          </p>
        </div>

        {/* Grid Kartu Statistik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat) => (
            <div 
              key={stat.id} 
              className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 shadow-2xl"
            >
              {/* Efek Glow di dalam kartu saat Hover */}
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-colors"></div>

              {/* Ikon */}
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                {stat.icon}
              </div>

              {/* Konten Teks */}
              <dt className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                {stat.name}
              </dt>
              <dd className="flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter drop-shadow-md">
                  {stat.value}
                </span>
                <span className="text-sm md:text-base font-bold text-bajo-light uppercase tracking-wide">
                  {stat.unit}
                </span>
              </dd>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}