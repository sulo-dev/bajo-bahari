"use client";

import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[calc(100vh-5rem)] flex flex-col justify-between overflow-hidden bg-bajo-dark">
      
      {/* 1. LAYER GAMBAR LATAR BELAKANG & OVERLAY BIRU TRANSPARAN */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Komponen Image Next.js untuk optimasi performa dan LCP */}
        <Image
          src="/images/landing-page.jpeg" // Silakan taruh foto desa Anda di folder public/images/ dengan nama ini
          alt="Pemandangan Pesisir Desa Bajo Bahari"
          fill
          priority
          className="object-cover object-center scale-105 animate-[pulse_10s_ease-in-out_infinite_alternate]"
        />
        
        {/* OVERLAY BIRU: Menjaga palet warna dan kontras teks putih */}
        {/* Anda bisa mengatur tingkat transparansi dengan mengubah angka setelah slash (misal: /80, /60, /40) */}
        <div className="absolute inset-0 bg-gradient-to-br from-bajo-dark/85 via-bajo-primary/70 to-bajo-light/30 backdrop-blur-[1px]"></div>
      </div>

      {/* Spacer Atas untuk Keseimbangan Tata Letak */}
      <div className="hidden lg:block h-12 relative z-10"></div>

      {/* 2. KONTEN UTAMA */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex-grow flex flex-col justify-center items-center">
        {/* Badge Info */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-8 shadow-2xl hover:bg-white/10 transition-colors cursor-pointer group">
          <span className="w-2 h-2 rounded-full bg-bajo-light animate-ping"></span>
          <span className="text-gray-200 group-hover:text-white transition-colors">Portal Pelayanan Digital</span>
          <svg className="w-3 h-3 text-bajo-light transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Judul Utama dengan Efek Bayangan Lembut */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-none mb-6 drop-shadow-md">
          Selamat Datang di <br />
          <span className="bg-gradient-to-r from-white via-bajo-light to-cyan-100 bg-clip-text text-transparent">
            Desa Bajo Bahari
          </span>
        </h1>
        
        {/* Deskripsi Pendek */}
        <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-10 font-medium drop-shadow">
          Mewujudkan tata kelola pemerintahan yang transparan, inovatif, dan berfokus pada kesejahteraan serta potensi maritim masyarakat pesisir.
        </p>
        
        {/* Tombol Navigasi */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md sm:max-w-none">
          <Link
            href="/profil/visi-misi"
            className="px-8 py-4 bg-bajo-primary hover:bg-bajo-dark text-white font-extrabold rounded-2xl shadow-lg shadow-bajo-primary/30 hover:shadow-bajo-primary/50 hover:-translate-y-0.5 transition-all duration-300 text-center"
          >
            Mulai Jelajahi
          </Link>
          <Link
            href="/layanan/surat"
            className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-extrabold rounded-2xl hover:bg-white hover:text-bajo-dark hover:-translate-y-0.5 transition-all duration-300 text-center shadow-md"
          >
            Layanan Surat Online
          </Link>
        </div>
      </div>


    </section>
  );
}