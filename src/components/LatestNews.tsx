import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface ArtikelDB {
  id: number;
  judul: string;
  slug: string;
  kategori: string;
  ringkasan: string;
  gambar_url: string;
  created_at: string;
}

export default async function LatestNews() {
  // 1. TARIK 3 ARTIKEL TERBARU DARI DATABASE
  const { data: artikelData } = await supabase
    .from("artikel")
    .select("id, judul, slug, kategori, ringkasan, gambar_url, created_at")
    .order("created_at", { ascending: false })
    .limit(3); // Kita batasi hanya 3 berita paling baru untuk Beranda

  const articles: ArtikelDB[] = artikelData || [];

  // Helper Pemformatan Tanggal Indonesia
  const formatTanggal = (isoString: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(isoString));
  };

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Ornamen Latar Belakang */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-bajo-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Seksi */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl">
            <div className="inline-block px-3 py-1 rounded-md bg-bajo-primary/10 text-bajo-primary font-bold text-xs uppercase tracking-wider mb-3">
              Informasi Terkini
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Kabar & Kegiatan Desa
            </h2>
            <p className="mt-4 text-gray-600 font-medium">
              Ikuti terus perkembangan terbaru, pengumuman resmi, dan dokumentasi aktivitas pembangunan di Desa Bajo Bahari.
            </p>
          </div>
          
          <Link 
            href="/potensi/artikel" 
            className="inline-flex items-center text-bajo-primary font-bold hover:text-bajo-dark transition-all group whitespace-nowrap text-sm bg-white border border-gray-200 px-5 py-3 rounded-xl shadow-sm hover:shadow"
          >
            Lihat Semua Berita
            <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Kondisi jika belum ada artikel di database */}
        {articles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-gray-200 text-gray-400 font-medium">
            Belum ada kabar atau artikel kegiatan yang dimuat.
          </div>
        ) : (
          /* Grid Berita */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article 
                key={article.id} 
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-bajo-primary/5 transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1"
              >
                {/* Bagian Gambar Berita */}
                <div className="h-52 w-full bg-gray-100 relative overflow-hidden flex-shrink-0">
                  {article.gambar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={article.gambar_url} 
                      alt={article.judul} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl bg-bajo-light/10">
                      📰
                    </div>
                  )}
                  {/* Badge Kategori Kaca (Glassmorphism) */}
                  <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-extrabold text-gray-800 uppercase tracking-wider border border-white/20 shadow-sm">
                    {article.kategori}
                  </div>
                </div>
                
                {/* Konten Isian Berita */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Tanggal Rilis */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mb-3">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatTanggal(article.created_at)}
                  </div>

                  {/* Judul Berita */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-bajo-primary transition-colors line-clamp-2 leading-snug">
                    {article.judul}
                  </h3>

                  {/* Ringkasan Singkat */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow font-medium">
                    {article.ringkasan}
                  </p>

                  {/* Tombol Tautan Pintas */}
                  <Link 
                    href={`/potensi/artikel/${article.slug}`} // Diubah dari id menjadi slug agar serasi dengan halaman detail
                    className="inline-flex items-center text-sm font-bold text-bajo-primary group-hover:text-bajo-dark group-hover:gap-2 transition-all mt-auto"
                  >
                    Baca Selengkapnya
                    <svg className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}