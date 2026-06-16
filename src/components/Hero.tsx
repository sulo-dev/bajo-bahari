import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden">
      {/* Background: Sementara menggunakan gradient dari palette warna Anda. 
          Nantinya bisa diganti dengan tag <img /> foto asli desa Bajo Bahari */}
      <div className="absolute inset-0 bg-gradient-to-br from-bajo-dark via-bajo-primary to-bajo-light z-0">
        {/* Overlay gelap agar teks putih lebih terbaca */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Konten Utama */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight animate-fade-in-up opacity-0">
          Selamat Datang di <br className="md:hidden" />
          <span className="text-bajo-light">Desa Bajo Bahari</span>
        </h1>
        
        <p className="mt-6 text-lg md:text-xl text-gray-100 max-w-2xl mx-auto animate-fade-in-up delay-100 opacity-0">
          Mewujudkan tata kelola pemerintahan yang transparan, inovatif, dan berfokus pada kesejahteraan masyarakat pesisir.
        </p>
        
        {/* Tombol Interaktif */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-200 opacity-0">
          <Link
            href="/profil/visi-misi"
            className="px-8 py-3 bg-white text-bajo-dark font-semibold rounded-full shadow-lg hover:bg-bajo-light hover:text-bajo-dark hover:scale-105 transition-all duration-300"
          >
            Mulai Jelajahi
          </Link>
          <Link
            href="/layanan/surat"
            className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-bajo-dark hover:scale-105 transition-all duration-300"
          >
            Layanan Publik
          </Link>
        </div>
      </div>

      {/* Dekorasi Gelombang (Opsional: Memberikan kesan laut di bagian bawah) */}
      <div className="absolute bottom-0 w-full overflow-hidden leading-none z-10">
        <svg
          className="relative block w-full h-[50px] md:h-[100px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,123.82,200.5,109.11,245.5,99.5,285.34,74.5,321.39,56.44Z"
            className="fill-gray-50" /* Menyesuaikan dengan bg-gray-50 di RootLayout */
          ></path>
        </svg>
      </div>
    </section>
  );
}