export const metadata = {
  title: "Galeri Desa - Desa Bajo Bahari",
  description: "Dokumentasi foto keindahan alam, kegiatan warga, dan potensi Desa Bajo Bahari.",
};

export default function GaleriPage() {
  // Data statis (dummy) untuk galeri foto
  const daftarFoto = [
    {
      id: 1,
      judul: "Pesona Bawah Laut Bajo",
      kategori: "Wisata Bahari",
      warnaBg: "bg-cyan-500", // Pengganti gambar sementara
      icon: "🤿",
    },
    {
      id: 2,
      judul: "Panen Ikan Tangkapan Nelayan",
      kategori: "Aktivitas Warga",
      warnaBg: "bg-blue-500",
      icon: "🐟",
    },
    {
      id: 3,
      judul: "Senja di Dermaga Utama",
      kategori: "Pemandangan",
      warnaBg: "bg-orange-400",
      icon: "🌅",
    },
    {
      id: 4,
      judul: "Festival Budaya Pesisir",
      kategori: "Seni & Budaya",
      warnaBg: "bg-red-400",
      icon: "🎭",
    },
    {
      id: 5,
      judul: "Pembangunan Jalan Desa",
      kategori: "Infrastruktur",
      warnaBg: "bg-gray-500",
      icon: "🏗️",
    },
    {
      id: 6,
      judul: "Anak-anak Pesisir Bermain",
      kategori: "Sosial",
      warnaBg: "bg-yellow-400",
      icon: "🪁",
    },
    {
      id: 7,
      judul: "Perahu Tradisional Bersandar",
      kategori: "Pemandangan",
      warnaBg: "bg-teal-500",
      icon: "⛵",
    },
    {
      id: 8,
      judul: "Produksi UMKM Ikan Asin",
      kategori: "Ekonomi",
      warnaBg: "bg-amber-600",
      icon: "🧂",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header Halaman */}
      <div className="bg-bajo-dark py-16 text-center text-white px-4 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-bajo-primary/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 left-10 w-64 h-64 bg-bajo-secondary/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white font-semibold uppercase tracking-widest text-xs mb-4">
            Potensi & Berita
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Galeri Desa</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Kumpulan momen, pesona alam, dan ragam aktivitas masyarakat di Desa Bajo Bahari.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-10">
        
        {/* Kategori Filter (Visual Statis) */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-wrap justify-center gap-2 mb-10">
          {["Semua Foto", "Pemandangan", "Aktivitas Warga", "Wisata Bahari", "Infrastruktur"].map((kategori, index) => (
            <button 
              key={index}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors ${
                index === 0 
                  ? "bg-bajo-primary text-white shadow-md" 
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100"
              }`}
            >
              {kategori}
            </button>
          ))}
        </div>

        {/* Grid Galeri */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {daftarFoto.map((foto) => (
            <div 
              key={foto.id} 
              className="group relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300 bg-gray-100"
            >
              {/* Gambar / Placeholder */}
              <div className={`absolute inset-0 ${foto.warnaBg} flex items-center justify-center transition-transform duration-700 group-hover:scale-110`}>
                <span className="text-6xl drop-shadow-md opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                  {foto.icon}
                </span>
              </div>

              {/* Overlay Hitam Gradasi & Teks (Muncul saat Hover) */}
              <div className="absolute inset-0 bg-gradient-to-t from-bajo-dark/90 via-bajo-dark/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-bajo-primary font-bold text-xs uppercase tracking-wider mb-1">
                  {foto.kategori}
                </span>
                <h3 className="text-white font-bold text-lg leading-tight">
                  {foto.judul}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Tombol Muat Lebih Banyak */}
        <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:border-bajo-primary hover:text-bajo-primary shadow-sm transition-all flex items-center gap-2 mx-auto">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Muat Foto Lainnya
          </button>
        </div>

      </div>
    </div>
  );
}