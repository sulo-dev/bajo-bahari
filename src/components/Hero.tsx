"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[calc(100vh-5rem)] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#0a192f] via-bajo-dark to-[#0f3460]">
      {/* 1. LAYER ANIMASI BACKDROP (Efek Arus Laut Abstrak) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Blob Biru Terang */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-bajo-primary/20 blur-[100px] animate-[pulse_8s_ease-in-out_infinite]"></div>
        {/* Blob Toska/Cyan */}
        <div className="absolute top-1/2 right-10 w-[600px] h-[600px] rounded-full bg-bajo-light/10 blur-[120px] animate-[pulse_12s_ease-in-out_infinite_alternate]"></div>
        {/* Partikel Cahaya Mengambang */}
        <div className="absolute bottom-20 left-1/3 w-4 h-4 rounded-full bg-white/20 blur-sm animate-[bounce_4s_ease-in-out_infinite]"></div>
        <div className="absolute top-1/4 right-1/4 w-6 h-6 rounded-full bg-white/10 blur-xs animate-[bounce_6s_ease-in-out_infinite_delayed]"></div>
      </div>

      {/* Spacer Atas untuk Menyeimbangkan Konten */}
      <div className="hidden lg:block h-12"></div>

      {/* 2. KONTEN UTAMA (Kiri/Tengah) */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex-grow flex flex-col justify-center items-center">
        {/* Badge Interaktif */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white text-xs font-bold uppercase tracking-widest mb-8 shadow-2xl hover:bg-white/10 transition-colors cursor-pointer group">
          <span className="w-2 h-2 rounded-full bg-bajo-light animate-ping"></span>
          <span className="text-gray-300 group-hover:text-white transition-colors">Portal Pelayanan Digital</span>
          <svg className="w-3 h-3 text-bajo-light transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Judul Utama dengan Gradasi Teks */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-none mb-6">
          Selamat Datang di <br />
          <span className="bg-gradient-to-r from-white via-bajo-light to-cyan-200 bg-clip-text text-transparent drop-shadow-sm">
            Desa Bajo Bahari
          </span>
        </h1>
        
        {/* Deskripsi Pendek */}
        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10 font-medium">
          Mewujudkan tata kelola pemerintahan yang transparan, inovatif, dan berfokus pada kesejahteraan serta potensi maritim masyarakat pesisir.
        </p>
        
        {/* Tombol Aksi Utama */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md sm:max-w-none">
          <Link
            href="/profil/visi-misi"
            className="px-8 py-4 bg-bajo-primary hover:bg-bajo-dark text-white font-extrabold rounded-2xl shadow-lg shadow-bajo-primary/30 hover:shadow-bajo-primary/50 hover:-translate-y-0.5 transition-all duration-300 text-center"
          >
            Mulai Jelajahi
          </Link>
          <Link
            href="/layanan/surat"
            className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-extrabold rounded-2xl hover:bg-white hover:text-bajo-dark hover:-translate-y-0.5 transition-all duration-300 text-center shadow-md"
          >
            Layanan Surat Online
          </Link>
        </div>
      </div>


    </section>
  );
}