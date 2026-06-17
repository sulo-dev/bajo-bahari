import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Daftar Perangkat Desa - Bajo Bahari",
  description: "Profil dan daftar nama perangkat Pemerintahan Desa Bajo Bahari.",
};

// Memaksa Next.js mengambil data terbaru setiap kali halaman dimuat oleh pengunjung
export const dynamic = "force-dynamic";

interface PerangkatItem {
  id: number;
  nama_lengkap: string;
  jabatan: string;
  foto_url: string | null;
  urutan_tampil: number;
}

export default async function PerangkatPage() {
  // 1. AMBIL DATA SELURUH PERANGKAT DESA DARI DATABASE
  const { data: perangkatList } = await supabase
    .from("perangkat_desa")
    .select("id, nama_lengkap, jabatan, foto_url, urutan_tampil")
    .order("urutan_tampil", { ascending: true });

  // 2. IDENTIFIKASI KEPALA DESA SEBAGAI HIGHLIGHT UTAMA
  const kepalaDesa = perangkatList?.find((p: PerangkatItem) => p.jabatan === "Kepala Desa") || perangkatList?.[0];

  // 3. SARING SISA PERANGKAT LAINNYA UNTUK GRID BAWAH
  const sisaPerangkat = perangkatList?.filter((p: PerangkatItem) => p.id !== kepalaDesa?.id) || [];

  // Helper untuk menentukan warna latar belakang cadangan jika foto tidak tersedia
  const dapatkanWarnaSesuaiJabatan = (jabatan: string): string => {
    const jab = jabatan.toLowerCase();
    if (jab.includes("kepala desa")) return "bg-bajo-primary";
    if (jab.includes("sekretaris")) return "bg-bajo-dark";
    if (jab.includes("kaur")) return "bg-bajo-secondary";
    if (jab.includes("kasi")) return "bg-bajo-light";
    return "bg-gray-400";
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Halaman */}
      <div className="bg-bajo-dark py-16 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none z-0">
          <div className="absolute top-1/2 left-12 w-64 h-64 rounded-full bg-bajo-primary blur-3xl"></div>
          <div className="absolute -top-12 right-24 w-80 h-80 rounded-full bg-bajo-light blur-3xl"></div>
        </div>

        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Perangkat Desa</h1>
          <p className="mt-4 text-lg text-bajo-light max-w-2xl mx-auto">
            Mengenal lebih dekat para pelayan masyarakat di lingkungan Pemerintahan Desa Bajo Bahari.
          </p>
        </div>
      </div>

      {/* Konten Utama - Grid Profil */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        {/* Kondisi Jika Belum Ada Data Perangkat Sama Sekali */}
        {!kepalaDesa && (
          <p className="text-center text-gray-400 font-medium py-10">Data aparatur pemerintahan desa belum tersedia.</p>
        )}

        {/* Kepala Desa (Highlight Paling Atas) */}
        {kepalaDesa && (
          <div className="flex justify-center mb-16 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden w-full max-w-sm transform hover:-translate-y-2 transition-all duration-300">
              
              {/* Area Foto Utama */}
              <div className={`h-72 w-full relative flex items-center justify-center ${kepalaDesa.foto_url ? 'bg-gray-50' : dapatkanWarnaSesuaiJabatan(kepalaDesa.jabatan)}`}>
                {kepalaDesa.foto_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={kepalaDesa.foto_url} 
                    alt={kepalaDesa.nama_lengkap} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-24 h-24 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>

              <div className="p-6 text-center">
                <h2 className="text-2xl font-bold text-bajo-dark mb-1">{kepalaDesa.nama_lengkap}</h2>
                <p className="text-bajo-primary font-extrabold tracking-wide uppercase text-sm">
                  {kepalaDesa.jabatan}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Grid Sisa Perangkat Desa */}
        {sisaPerangkat.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-fadeIn">
            {sisaPerangkat.map((person: PerangkatItem) => (
              <div 
                key={person.id} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transform hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
              >
                {/* Area Foto Sisa Perangkat */}
                <div className={`h-56 w-full relative flex items-center justify-center ${person.foto_url ? 'bg-gray-50' : dapatkanWarnaSesuaiJabatan(person.jabatan)}`}>
                  {person.foto_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={person.foto_url} 
                      alt={person.nama_lengkap} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-16 h-16 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>

                <div className="p-5 text-center flex-grow flex flex-col justify-center bg-white border-t border-gray-50">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{person.nama_lengkap}</h3>
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider text-xs mt-1">
                    {person.jabatan}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}