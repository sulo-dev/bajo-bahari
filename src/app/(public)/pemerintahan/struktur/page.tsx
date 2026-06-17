import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Struktur Organisasi - Desa Bajo Bahari",
  description: "Bagan hierarki struktur organisasi pemerintahan Desa Bajo Bahari.",
};

// Memaksa Next.js mengambil data terbaru setiap kali halaman dimuat
export const dynamic = "force-dynamic";

interface Perangkat {
  id: number;
  nama_lengkap: string;
  jabatan: string;
}

export default async function StrukturPage() {
  // 1. TARIK DATA PERANGKAT DESA DARI DATABASE
  const { data: perangkatList } = await supabase
    .from("perangkat_desa")
    .select("id, nama_lengkap, jabatan")
    .order("urutan_tampil", { ascending: true });

  // 2. FUNGSI PENCARI NAMA BERDASARKAN JABATAN
  const cariNama = (namaJabatan: string) => {
    const pejabat = perangkatList?.find((p: Perangkat) => p.jabatan === namaJabatan);
    return pejabat ? pejabat.nama_lengkap : "Belum Diisi";
  };

  // 3. FILTER KHUSUS KEPALA DUSUN (Karena jumlahnya bisa banyak)
  const daftarKadus = perangkatList?.filter((p: Perangkat) => 
    p.jabatan.toLowerCase().includes("kepala dusun")
  ) || [];

  return (
    <div className="bg-white min-h-screen">
      {/* Header Halaman */}
      <div className="bg-bajo-dark py-16 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none z-0">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-bajo-primary blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-bajo-secondary blur-3xl"></div>
        </div>

        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Struktur Organisasi</h1>
          <p className="mt-4 text-lg text-bajo-light max-w-2xl mx-auto">
            Bagan tata kerja dan susunan Pemerintahan Desa Bajo Bahari.
          </p>
        </div>
      </div>

      {/* Konten Utama - Bagan Hierarki CSS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 overflow-x-auto">
        <div className="min-w-[900px] flex flex-col items-center pb-12">
          
          {/* Level 1: Kepala Desa */}
          <div className="flex flex-col items-center">
            <div className="bg-bajo-primary text-white px-8 py-4 rounded-xl shadow-md border-b-4 border-bajo-dark text-center w-72 z-10 relative">
              <h3 className="font-extrabold text-lg uppercase tracking-wider">Kepala Desa</h3>
              <div className="mt-3 pt-3 border-t border-white/20">
                <p className="font-bold text-lg">{cariNama("Kepala Desa")}</p>
              </div>
            </div>
            {/* Garis Vertikal */}
            <div className="w-1 h-12 bg-gray-300"></div>
          </div>

          {/* Level 2: Sekretaris Desa & BPD */}
          <div className="flex justify-center items-start relative w-full max-w-5xl">
            {/* Garis Horizontal Penghubung */}
            <div className="absolute top-0 left-[20%] right-[20%] h-1 bg-gray-300"></div>
            
            {/* BPD (Garis Komando Kemitraan) */}
            <div className="w-1/2 flex flex-col items-center">
              <div className="w-1 h-8 bg-gray-300"></div>
              <div className="bg-bajo-secondary text-white px-6 py-3 rounded-xl shadow-md border-b-4 border-bajo-dark text-center w-64">
                <h3 className="font-bold uppercase tracking-wider">Ketua B P D</h3>
                <div className="mt-2 pt-2 border-t border-white/20">
                  <p className="font-bold">{cariNama("Ketua BPD")}</p>
                </div>
              </div>
            </div>

            {/* Sekretaris Desa */}
            <div className="w-1/2 flex flex-col items-center">
              <div className="w-1 h-8 bg-gray-300"></div>
              <div className="bg-white border-2 border-bajo-primary px-6 py-3 rounded-xl shadow-sm text-center w-64 z-10 relative">
                <h3 className="font-bold text-bajo-dark uppercase tracking-wider">Sekretaris Desa</h3>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="font-bold text-gray-800">{cariNama("Sekretaris Desa")}</p>
                </div>
              </div>
              {/* Garis Vertikal Lanjutan dari Sekdes */}
              <div className="w-1 h-12 bg-gray-300"></div>
            </div>
          </div>

          {/* Level 3: Kaur & Kasi */}
          <div className="flex justify-center w-full max-w-6xl relative mt-[-1px]">
            {/* Garis Horizontal Panjang */}
            <div className="absolute top-0 left-[10%] right-[10%] h-1 bg-gray-300"></div>
            
            {/* Grid Para Kaur & Kasi */}
            <div className="flex justify-between w-full px-4">
              
              {/* Kaur Umum */}
              <div className="flex flex-col items-center">
                <div className="w-1 h-8 bg-gray-300"></div>
                <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg shadow-sm text-center w-48">
                  <h4 className="font-semibold text-gray-600 text-xs uppercase mb-2">Kaur Umum & Perencanaan</h4>
                  <p className="font-bold text-gray-900 text-sm">{cariNama("Kaur Umum & Perencanaan")}</p>
                </div>
              </div>

              {/* Kaur Keuangan */}
              <div className="flex flex-col items-center">
                <div className="w-1 h-8 bg-gray-300"></div>
                <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg shadow-sm text-center w-48">
                  <h4 className="font-semibold text-gray-600 text-xs uppercase mb-2">Kaur Keuangan</h4>
                  <p className="font-bold text-gray-900 text-sm">{cariNama("Kaur Keuangan")}</p>
                </div>
              </div>

              {/* Kasi Pemerintahan */}
              <div className="flex flex-col items-center">
                <div className="w-1 h-8 bg-gray-300"></div>
                <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg shadow-sm text-center w-48">
                  <h4 className="font-semibold text-gray-600 text-xs uppercase mb-2">Kasi Pemerintahan</h4>
                  <p className="font-bold text-gray-900 text-sm">{cariNama("Kasi Pemerintahan")}</p>
                </div>
              </div>

              {/* Kasi Kesejahteraan */}
              <div className="flex flex-col items-center">
                <div className="w-1 h-8 bg-gray-300"></div>
                <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg shadow-sm text-center w-48">
                  <h4 className="font-semibold text-gray-600 text-xs uppercase mb-2">Kasi Kesejahteraan</h4>
                  <p className="font-bold text-gray-900 text-sm">{cariNama("Kasi Kesejahteraan")}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Level 4: Kepala Dusun */}
          <div className="mt-16 w-full max-w-5xl border-t border-dashed border-gray-300 pt-10 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-4 text-sm font-bold text-gray-400 uppercase tracking-widest">
              Unsur Kewilayahan (Kepala Dusun)
            </div>
            <div className="flex justify-center gap-6 flex-wrap">
              {daftarKadus.length > 0 ? (
                daftarKadus.map((dusun: Perangkat) => (
                  <div key={dusun.id} className="bg-white border-l-4 border-bajo-secondary px-6 py-3 rounded-r-lg shadow-sm w-56">
                    <h4 className="font-semibold text-gray-500 text-xs mb-1">{dusun.jabatan}</h4>
                    <p className="font-bold text-bajo-dark text-sm">{dusun.nama_lengkap}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic text-sm">Data Kepala Dusun belum ditambahkan.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}