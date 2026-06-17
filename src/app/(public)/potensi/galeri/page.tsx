import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Galeri Desa - Desa Bajo Bahari",
  description: "Dokumentasi foto keindahan alam, kegiatan warga, dan potensi Desa Bajo Bahari.",
};

// Memaksa Next.js untuk selalu mengambil data terbaru dari database saat halaman diakses
export const dynamic = "force-dynamic";

interface GaleriItem {
  id: number;
  judul: string;
  kategori: string;
  gambar_url: string;
  created_at: string;
}

// Next.js Server Component menerima searchParams untuk mendeteksi filter di URL
export default async function GaleriPage({
  searchParams,
}: {
  searchParams: { kategori?: string };
}) {
  const kategoriTerpilih = searchParams.kategori || "Semua Foto";

  // 1. MEMBUAT QUERY DINAMIS KE SUPABASE
  let query = supabase
    .from("galeri")
    .select("id, judul, kategori, gambar_url, created_at")
    .order("created_at", { ascending: false });

  // Jika memilih kategori tertentu (selain "Semua Foto"), lakukan pemfilteran di database
  if (kategoriTerpilih !== "Semua Foto") {
    query = query.eq("kategori", kategoriTerpilih);
  }

  const { data: galeriData } = await query;
  const daftarFoto: GaleriItem[] = galeriData || [];

  // Daftar kategori tetap yang diselaraskan dengan pilihan di Dashboard Admin
  const listKategori = [
    "Semua Foto",
    "Pemandangan",
    "Aktivitas Warga",
    "Wisata Bahari",
    "Seni & Budaya",
    "Infrastruktur",
    "Sosial",
    "Ekonomi"
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
        
        {/* Kategori Filter Dinamis menggunakan Tautan Link */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-wrap justify-center gap-2 mb-10">
          {listKategori.map((kategori, index) => {
            const isActive = kategoriTerpilih === kategori;
            // Jika memilih "Semua Foto", arahkan ke URL bersih tanpa query string
            const hrefLocation = kategori === "Semua Foto" ? "/potensi/galeri" : `/potensi/galeri?kategori=${encodeURIComponent(kategori)}`;

            return (
              <Link 
                key={index}
                href={hrefLocation}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors ${
                  isActive 
                    ? "bg-bajo-primary text-white shadow-md" 
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100"
                }`}
              >
                {kategori}
              </Link>
            );
          })}
        </div>

        {/* Grid Galeri Foto Dinamis */}
        {daftarFoto.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm text-gray-500 font-medium">
            Belum ada dokumentasi foto untuk kategori &quot;{kategoriTerpilih}&quot;.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fadeIn">
            {daftarFoto.map((foto) => (
              <div 
                key={foto.id} 
                className="group relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300 bg-gray-100 border border-gray-200"
              >
                {/* Gambar Asli dari Storage Supabase */}
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={foto.gambar_url} 
                    alt={foto.judul} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* Overlay Hitam Gradasi & Teks (Muncul anggun saat Hover) */}
                <div className="absolute inset-0 bg-gradient-to-t from-bajo-dark/95 via-bajo-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-10">
                  <span className="text-bajo-primary font-bold text-xs uppercase tracking-wider mb-1">
                    {foto.kategori}
                  </span>
                  <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
                    {foto.judul}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tombol Riwayat (Visual Pelengkap) */}
        {daftarFoto.length > 0 && (
          <div className="mt-12 text-center">
            <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:border-bajo-primary hover:text-bajo-primary shadow-sm transition-all flex items-center gap-2 mx-auto">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Muat Foto Lainnya
            </button>
          </div>
        )}

      </div>
    </div>
  );
}