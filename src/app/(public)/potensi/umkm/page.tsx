import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Promosi UMKM - Desa Bajo Bahari",
  description: "Etalase produk unggulan dan kerajinan lokal dari UMKM Desa Bajo Bahari.",
};

export const dynamic = "force-dynamic";

interface UmkmDB {
  id: number;
  nama_produk: string;
  pemilik: string;
  kategori: string;
  harga: string;
  deskripsi: string;
  gambar_url: string;
  no_whatsapp: string;
}

export default async function UmkmPage({
  searchParams,
}: {
  searchParams: { kategori?: string };
}) {
  const kategoriTerpilih = searchParams.kategori || "Semua Produk";

  // 1. TARIK DATA PRODUK UMKM
  let query = supabase
    .from("umkm")
    .select("id, nama_produk, pemilik, kategori, harga, deskripsi, gambar_url, no_whatsapp")
    .order("id", { ascending: false });

  if (kategoriTerpilih !== "Semua Produk") {
    query = query.eq("kategori", kategoriTerpilih);
  }

  const { data: umkmList } = await query;
  const daftarUmkm: UmkmDB[] = umkmList || [];

  const listKategori = [
    "Semua Produk",
    "Makanan Laut",
    "Kerajinan Tangan",
    "Bahan Pokok",
    "Jasa Wisata",
    "Makanan Ringan",
    "Pakaian & Kain",
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header Halaman */}
      <div className="bg-bajo-dark py-16 text-center text-white px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none z-0">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-bajo-primary blur-3xl"></div>
          <div className="absolute -bottom-10 right-1/4 w-80 h-80 rounded-full bg-bajo-secondary blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white font-semibold uppercase tracking-widest text-xs mb-4">
            Potensi Ekonomi
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Produk UMKM Desa</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Dukung perekonomian lokal dengan membeli produk olahan hasil laut dan kerajinan tangan warga Bajo Bahari.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-10">
        
        {/* Kategori Filter Dinamis */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-wrap justify-center gap-3 mb-10">
          {listKategori.map((kategori, index) => {
            const isActive = kategoriTerpilih === kategori;
            const href = kategori === "Semua Produk" ? "/potensi/umkm" : `/potensi/umkm?kategori=${encodeURIComponent(kategori)}`;
            
            return (
              <a 
                key={index}
                href={href}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors ${
                  isActive 
                    ? "bg-bajo-primary text-white shadow-md" 
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100"
                }`}
              >
                {kategori}
              </a>
            );
          })}
        </div>

        {/* Grid Produk UMKM */}
        {daftarUmkm.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-medium bg-white rounded-3xl border border-gray-200">
            Belum ada produk dalam kategori &quot;{kategoriTerpilih}&quot;.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
            {daftarUmkm.map((produk) => {
              const pesanWA = encodeURIComponent(
                `Halo ${produk.pemilik}, saya melihat produk ${produk.nama_produk} di website Desa Bajo Bahari. Apakah produk ini masih tersedia?`
              );

              return (
                <div 
                  key={produk.id} 
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full group"
                >
                  {/* Area Gambar Produk */}
                  <div className="h-56 w-full bg-gray-100 relative overflow-hidden">
                    {produk.gambar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={produk.gambar_url} 
                        alt={produk.nama_produk} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">🛍️</div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-bajo-dark px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm z-10">
                      {produk.kategori}
                    </div>
                  </div>

                  {/* Detail Produk */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2">
                      {produk.nama_produk}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-500">{produk.pemilik}</span>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                      {produk.deskripsi}
                    </p>

                    <div className="border-t border-gray-100 pt-4 mb-4">
                      <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Harga</span>
                      <span className="text-2xl font-extrabold text-bajo-primary">
                        {produk.harga}
                      </span>
                    </div>

                    {/* Tombol Pesan via WA Langsung ke Penjual */}
                    <a 
                      href={`https://wa.me/${produk.no_whatsapp.replace(/\D/g, '')}?text=${pesanWA}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-4 rounded-xl transition-colors flex justify-center items-center gap-2 mt-auto shadow-sm"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Pesan via WhatsApp
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}