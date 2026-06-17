import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Transparansi APBDes - Desa Bajo Bahari",
  description: "Informasi Anggaran Pendapatan dan Belanja Desa (APBDes) Bajo Bahari terkini.",
};

export const dynamic = "force-dynamic";

interface CabangItem {
  nama: string;
  anggaran: number;
  realisasi: number;
}

interface AspekItem {
  aspek: string;
  cabang: CabangItem[];
}

export default async function ApbdesPage() {
  // 1. TARIK DATA ANGGARAN TAHUN TERBARU
  const { data: dbData } = await supabase
    .from("transparansi_tahunan")
    .select("tahun, apbdes_data")
    .order("tahun", { ascending: false })
    .limit(1)
    .single();

  const tahunAnggaran = dbData?.tahun || new Date().getFullYear();
  let apbdesList: AspekItem[] = [];

  if (dbData?.apbdes_data) {
    try {
      apbdesList = JSON.parse(dbData.apbdes_data);
    } catch (e) {
      apbdesList = [];
    }
  }

  // 2. TARIK DATA FILE PDF APBDES BERDASARKAN TAHUN TERKAIT
  const { data: dokumenPdf } = await supabase
    .from("transparansi_dokumen")
    .select("judul, file_url")
    .eq("jenis", "APBDes")
    .eq("tahun", tahunAnggaran)
    .limit(1)
    .single();

  // 3. FUNGSI PEMFORMATAN RUPIAH
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const hitungTotalAspek = (cabangList: CabangItem[]) => {
    return cabangList.reduce((acc, curr) => acc + (curr.anggaran || 0), 0);
  };

  const colorPalette = ["bg-bajo-primary", "bg-bajo-secondary", "bg-bajo-dark", "bg-bajo-light", "bg-teal-500", "bg-orange-400"];

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header Halaman */}
      <div className="bg-bajo-dark py-16 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none z-0">
          <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-bajo-primary blur-3xl"></div>
          <div className="absolute bottom-12 right-1/4 w-80 h-80 rounded-full bg-bajo-secondary blur-3xl"></div>
        </div>

        <div className="relative z-10 px-4">
          <div className="inline-block px-4 py-1 rounded-full bg-bajo-primary/30 text-white font-bold uppercase tracking-widest text-xs mb-4 border border-bajo-primary/50">
            Tahun Anggaran {tahunAnggaran}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Transparansi APBDes</h1>
          <p className="mt-4 text-lg text-bajo-light max-w-2xl mx-auto">
            Rincian Anggaran Pendapatan dan Belanja Desa Bajo Bahari sebagai bentuk keterbukaan informasi publik.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        
        {apbdesList.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-lg border-t-4 border-gray-300 text-center">
            <h2 className="text-2xl font-bold text-gray-500">Data Belum Tersedia</h2>
            <p className="text-gray-400 mt-2">Pemerintah Desa sedang merumuskan matriks anggaran untuk tahun ini.</p>
          </div>
        ) : (
          <>
            {/* Ringkasan Utama */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {apbdesList.slice(0, 2).map((aspekItem, idx) => (
                <div key={idx} className={`bg-white rounded-2xl p-8 shadow-lg border-b-4 ${idx === 0 ? 'border-bajo-primary' : 'border-bajo-secondary'}`}>
                  <h2 className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-2">
                    Total {aspekItem.aspek}
                  </h2>
                  <p className="text-3xl md:text-4xl font-extrabold text-gray-900">
                    {formatRupiah(hitungTotalAspek(aspekItem.cabang))}
                  </p>
                </div>
              ))}
            </div>

            {/* Detail Visualisasi Anggaran */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              {apbdesList.map((aspekItem, aspekIdx) => {
                const totalAspek = hitungTotalAspek(aspekItem.cabang);
                const headerColor = aspekIdx % 2 === 0 ? 'text-bajo-primary bg-bajo-primary/20' : 'text-bajo-secondary bg-bajo-secondary/20';

                return (
                  <div key={aspekIdx} className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-8">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${headerColor}`}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-bajo-dark">{aspekItem.aspek}</h3>
                    </div>

                    <div className="space-y-6">
                      {aspekItem.cabang.map((cabang, cabangIdx) => {
                        const persen = totalAspek > 0 ? Math.round((cabang.anggaran / totalAspek) * 100) : 0;
                        const barColor = colorPalette[cabangIdx % colorPalette.length];

                        return (
                          <div key={cabangIdx}>
                            <div className="flex justify-between text-sm font-semibold text-gray-800 mb-2">
                              <span>{cabang.nama}</span>
                              <span>{formatRupiah(cabang.anggaran)}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex-grow bg-gray-200 rounded-full h-3">
                                <div className={`${barColor} h-3 rounded-full`} style={{ width: `${persen}%` }}></div>
                              </div>
                              <span className="text-xs font-bold text-gray-500 w-8 text-right">{persen}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SEKSI BARU: BANNER UNDUH FILE PDF APBDES ASLI */}
            <div className="bg-bajo-dark rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden mb-12">
              <div className="absolute right-0 top-0 w-64 h-64 bg-bajo-primary blur-3xl opacity-30 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
              
              <div className="text-white mb-6 md:mb-0 md:pr-8 relative z-10 text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">Dokumen Lampiran APBDes {tahunAnggaran}</h3>
                <p className="text-bajo-light text-sm">
                  Unduh salinan berkas PDF resmi lembaran regulasi Anggaran Pendapatan dan Belanja Desa Bajo Bahari.
                </p>
              </div>
              
              <div className="relative z-10 whitespace-nowrap">
                {dokumenPdf && dokumenPdf.file_url ? (
                  <a 
                    href={dokumenPdf.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-bajo-dark hover:bg-bajo-light px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Unduh Lampiran (PDF)
                  </a>
                ) : (
                  <span className="bg-gray-700 text-gray-400 px-6 py-3.5 rounded-xl font-bold text-sm cursor-not-allowed inline-block">
                    Lampiran PDF Belum Tersedia
                  </span>
                )}
              </div>
            </div>
          </>
        )}

        {/* Info Grafis / Banner Bawah */}
        <div className="bg-bajo-light/20 border border-bajo-light/50 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
            <svg className="w-8 h-8 text-bajo-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-lg font-bold text-bajo-dark mb-1">Catatan Penting</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Data di atas merupakan ringkasan eksekutif dari APBDes Tahun Anggaran {tahunAnggaran}. Angka tersebut mencerminkan komitmen Pemerintah Desa Bajo Bahari dalam menjalankan roda pemerintahan yang transparan dan akuntabel sesuai dengan regulasi yang berlaku.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}