import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Artikel Kegiatan - Desa Bajo Bahari",
  description: "Berita, artikel, dan dokumentasi kegiatan warga serta Pemerintahan Desa Bajo Bahari.",
};

// Pastikan data selalu ditarik fresh dari database (SSR)
export const dynamic = "force-dynamic";

interface ArtikelItem {
  id: number;
  judul: string;
  slug: string;
  kategori: string;
  ringkasan: string;
  gambar_url: string;
  is_headline: boolean;
  created_at: string;
}

export default async function ArtikelPage() {
  // 1. TARIK SELURUH ARTIKEL DARI DATABASE
  const { data: artikelData } = await supabase
    .from("artikel")
    .select("id, judul, slug, kategori, ringkasan, gambar_url, is_headline, created_at")
    .order("created_at", { ascending: false });

  const daftarArtikel: ArtikelItem[] = artikelData || [];

  // 2. LOGIKA PEMISAHAN HEADLINE & LIST REGULER
  // Cari artikel pertama yang dicentang sebagai "Headline" oleh admin.
  // Jika tidak ada yang dicentang, jadikan artikel paling baru (index 0) sebagai Headline.
  let headline = daftarArtikel.find((artikel) => artikel.is_headline);
  if (!headline && daftarArtikel.length > 0) {
    headline = daftarArtikel[0];
  }

  // Filter sisa artikel: keluarkan artikel yang sudah menjadi headline dari daftar bawah
  const listArtikel = daftarArtikel.filter((artikel) => artikel.id !== headline?.id);

  // Helper Pemformatan Tanggal ke Bahasa Indonesia
  const formatTanggal = (isoString: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date(isoString));
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header Halaman */}
      <div className="bg-bajo-dark py-16 text-center text-white px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-bajo-primary/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white font-semibold uppercase tracking-widest text-xs mb-4">
            Potensi & Berita
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Artikel Kegiatan</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Kabar terbaru seputar aktivitas warga, program desa, dan peristiwa penting di Bajo Bahari.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {daftarArtikel.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm text-gray-500 font-medium">
            Belum ada artikel kegiatan yang dipublikasikan oleh Pemerintah Desa.
          </div>
        ) : (
          <>
            {/* Headline (Artikel Utama) */}
            {headline && (
              <div className="mb-12 animate-fadeIn">
                <Link href={`/potensi/artikel/${headline.slug}`} className="group block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200">
                  <div className="flex flex-col md:flex-row">
                    {/* Area Gambar Cover */}
                    <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-100 relative flex items-center justify-center overflow-hidden">
                      {headline.gambar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={headline.gambar_url} 
                          alt={headline.judul} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                      ) : (
                        <svg className="w-16 h-16 text-gray-300 group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      )}
                      <div className="absolute top-4 left-4 bg-bajo-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide shadow-sm z-10">
                        Berita Utama
                      </div>
                    </div>
                    
                    {/* Konten Headline */}
                    <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-gray-500 text-sm font-medium flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatTanggal(headline.created_at)}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        <span className="text-bajo-primary font-bold text-sm uppercase">{headline.kategori}</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 group-hover:text-bajo-primary transition-colors line-clamp-3">
                        {headline.judul}
                      </h2>
                      <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                        {headline.ringkasan}
                      </p>
                      <div className="inline-flex items-center gap-2 text-bajo-primary font-bold group-hover:gap-3 transition-all">
                        Baca Selengkapnya 
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Grid Artikel Lainnya */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
              {listArtikel.map((artikel) => (
                <Link key={artikel.id} href={`/potensi/artikel/${artikel.slug}`} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200">
                  {/* Image Placeholder */}
                  <div className="h-48 w-full bg-gray-100 relative flex items-center justify-center overflow-hidden">
                    {artikel.gambar_url ? (
                       // eslint-disable-next-line @next/next/no-img-element
                       <img 
                         src={artikel.gambar_url} 
                         alt={artikel.judul} 
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                       />
                    ) : (
                      <svg className="w-12 h-12 text-gray-300 group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Konten Artikel */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-center mb-3">
                      <span className="bg-gray-100 text-bajo-dark px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        {artikel.kategori}
                      </span>
                      <span className="text-gray-400 text-xs font-medium">{formatTanggal(artikel.created_at)}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-bajo-primary transition-colors line-clamp-2">
                      {artikel.judul}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                      {artikel.ringkasan}
                    </p>
                    <div className="text-bajo-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                      Baca Artikel
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}