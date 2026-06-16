import Link from "next/link";

export default function LatestNews() {
  // Data statis sementara. Tanggal disesuaikan dengan waktu saat ini (Juni 2026).
  const articles = [
    {
      id: 1,
      title: "Pelatihan Pengembangan Produk UMKM Pesisir",
      date: "15 Juni 2026",
      category: "UMKM",
      excerpt: "Pemerintah desa mengadakan pelatihan inovasi pengemasan produk hasil laut untuk meningkatkan daya saing pasar.",
      imageColor: "bg-bajo-primary", 
    },
    {
      id: 2,
      title: "Kerja Bakti Pembersihan Area Wisata Mangrove",
      date: "10 Juni 2026",
      category: "Lingkungan",
      excerpt: "Warga desa bergotong royong membersihkan area hutan mangrove sebagai persiapan menyambut musim liburan.",
      imageColor: "bg-bajo-secondary",
    },
    {
      id: 3,
      title: "Penyaluran Bantuan Langsung Tunai (BLT) Tahap II",
      date: "05 Juni 2026",
      category: "Pemerintahan",
      excerpt: "Pemerintah Desa Bajo Bahari telah sukses menyalurkan BLT kepada 120 Kepala Keluarga yang berhak menerima.",
      imageColor: "bg-bajo-light",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-bajo-dark">Kabar & Potensi Desa</h2>
            <p className="mt-4 text-gray-600">
              Ikuti terus perkembangan terbaru, kegiatan warga, dan potensi pariwisata dari Desa Bajo Bahari.
            </p>
          </div>
          <Link 
            href="/potensi/artikel" 
            className="hidden md:inline-flex items-center text-bajo-primary font-semibold hover:text-bajo-dark transition-colors"
          >
            Lihat Semua Berita
            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article 
              key={article.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col h-full"
            >
              {/* Area Gambar (Sementara menggunakan warna block) */}
              <div className={`h-48 w-full ${article.imageColor} relative`}>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-bajo-dark uppercase tracking-wider">
                  {article.category}
                </div>
              </div>
              
              {/* Konten Artikel */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-sm text-gray-500 mb-2">{article.date}</div>
                <h3 className="text-xl font-bold text-bajo-dark mb-3 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
                  {article.excerpt}
                </p>
                <Link 
                  href={`/potensi/artikel/${article.id}`} 
                  className="inline-flex items-center text-bajo-primary font-medium hover:text-bajo-dark transition-colors mt-auto"
                >
                  Baca Selengkapnya
                  <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
        
        {/* Tombol Lihat Semua untuk Mobile */}
        <div className="mt-8 text-center md:hidden">
          <Link 
            href="/potensi/artikel" 
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Lihat Semua Berita
          </Link>
        </div>
      </div>
    </section>
  );
}