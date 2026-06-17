import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Fasilitas Publik - Desa Bajo Bahari",
  description: "Daftar fasilitas publik dan infrastruktur yang tersedia di Desa Bajo Bahari.",
};

// Memaksa Next.js untuk selalu mengambil data paling segar dari database
export const dynamic = "force-dynamic";

interface FasilitasDB {
  id: number;
  nama: string;
  kategori: string;
  deskripsi: string;
  icon: string;
  warna_bg: string;
  warna_teks: string;
}

export default async function FasilitasPage() {
  // 1. AMBIL DATA FASILITAS PUBLIK DARI DATABASE
  const { data: fasilitasData } = await supabase
    .from("fasilitas_publik")
    .select("id, nama, kategori, deskripsi, icon, warna_bg, warna_teks")
    .order("id", { ascending: true });

  // 2. AMBIL DATA NOMOR WHATSAPP DARI KONTAK DESA
  const { data: kontakData } = await supabase
    .from("kontak_desa")
    .select("no_whatsapp")
    .limit(1)
    .single();

  const noWhatsApp = kontakData?.no_whatsapp || "6281234567890"; // Fallback nomor aman
  const pesanPeminjaman = encodeURIComponent(
    "Halo Admin Desa Bajo Bahari, saya ingin berkonsultasi mengenai prosedur dan persyaratan peminjaman fasilitas publik desa untuk kegiatan masyarakat."
  );

  const daftarFasilitas: FasilitasDB[] = fasilitasData || [];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header Halaman */}
      <div className="bg-bajo-dark py-16 text-center text-white px-4">
        <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white font-semibold uppercase tracking-widest text-xs mb-4">
          Layanan Publik
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Fasilitas Publik</h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Infrastruktur dan fasilitas yang dikelola desa untuk menunjang kesejahteraan serta kegiatan warga.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-10">
        
        {/* Grid Card Dinamis */}
        {daftarFasilitas.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm text-gray-500 font-medium">
            Data infrastruktur dan fasilitas publik belum ditambahkan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {daftarFasilitas.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full"
              >
                {/* Header Card: Ikon dan Kategori */}
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${item.warna_bg || 'bg-blue-100'} ${item.warna_teks || 'text-blue-600'}`}>
                    {item.icon || "🏛️"}
                  </div>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                    {item.kategori}
                  </span>
                </div>

                {/* Isi Card */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.nama}</h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                  {item.deskripsi}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Banner Peminjaman Terintegrasi WhatsApp */}
        <div className="mt-12 bg-white border border-bajo-primary/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="hidden md:flex w-16 h-16 bg-bajo-primary/10 rounded-full items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-bajo-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Peminjaman Fasilitas</h3>
              <p className="text-sm text-gray-600 max-w-xl">
                Warga dapat mengajukan peminjaman fasilitas (seperti Balai Desa) untuk kegiatan sosial. Hubungi admin untuk informasi persyaratan lebih lanjut.
              </p>
            </div>
          </div>
          <a 
            href={`https://wa.me/${noWhatsApp}?text=${pesanPeminjaman}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto px-6 py-3 bg-bajo-primary hover:bg-bajo-dark text-white text-sm font-bold rounded-xl transition-colors text-center shadow-md shadow-bajo-primary/10 whitespace-nowrap"
          >
            Hubungi Admin via WA
          </a>
        </div>

      </div>
    </div>
  );
}