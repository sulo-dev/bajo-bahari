import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "LPJ Realisasi - Desa Bajo Bahari",
  description: "Laporan Pertanggung Jawaban (LPJ) dan Realisasi Pelaksanaan APBDes Bajo Bahari.",
};

export const dynamic = "force-dynamic";

interface KegiatanItem {
  kegiatan: string;
  bidang: string;
  biaya: number;
  status: string;
  foto_url?: string;
}

export default async function LpjPage() {
  // 1. TARIK DATA LPJ TAHUN TERBARU
  const { data: dbData } = await supabase
    .from("transparansi_tahunan")
    .select("tahun, lpj_target, lpj_realisasi, lpj_kegiatan")
    .order("tahun", { ascending: false })
    .limit(1)
    .single();

  const tahunRealisasi = dbData?.tahun || new Date().getFullYear();
  const targetAnggaran = dbData?.lpj_target || 0;
  const realisasiAnggaran = dbData?.lpj_realisasi || 0;
  
  // Hitung persentase serapan (Cegah pembagian dengan nol)
  const persentaseSerapan = targetAnggaran > 0 
    ? Math.min(Math.round((realisasiAnggaran / targetAnggaran) * 100), 100) 
    : 0;

  // 2. PARSING JSON DAFTAR KEGIATAN
  let buktiKegiatan: KegiatanItem[] = [];
  if (dbData?.lpj_kegiatan) {
    try {
      buktiKegiatan = JSON.parse(dbData.lpj_kegiatan);
    } catch (e) {
      buktiKegiatan = [];
    }
  }

  // 3. TARIK DOKUMEN PDF LPJ JIKA ADA
  const { data: dokumenPdf } = await supabase
    .from("transparansi_dokumen")
    .select("file_url")
    .eq("jenis", "LPJ")
    .eq("tahun", tahunRealisasi)
    .limit(1)
    .single();

  // 4. FUNGSI PEMFORMATAN RUPIAH
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header Halaman */}
      <div className="bg-bajo-dark py-16 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none z-0">
          <div className="absolute top-1/2 right-12 w-80 h-80 rounded-full bg-bajo-primary blur-3xl"></div>
          <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-bajo-light blur-3xl"></div>
        </div>

        <div className="relative z-10 px-4">
          <div className="inline-block px-4 py-1 rounded-full bg-green-500/30 text-white font-bold uppercase tracking-widest text-xs mb-4 border border-green-500/50">
            Laporan Realisasi {tahunRealisasi}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">LPJ Desa</h1>
          <p className="mt-4 text-lg text-bajo-light max-w-2xl mx-auto">
            Laporan Pertanggung Jawaban dan Bukti Nyata Pelaksanaan Pembangunan Desa Bajo Bahari.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        {/* Kondisi jika data belum diisi sama sekali */}
        {!dbData ? (
           <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-200 text-center">
             <h2 className="text-2xl font-bold text-gray-500">Laporan Belum Tersedia</h2>
             <p className="text-gray-400 mt-2">Data Laporan Pertanggung Jawaban (LPJ) untuk tahun ini masih dalam tahap penyusunan.</p>
           </div>
        ) : (
          <>
            {/* Section 1: Ringkasan Realisasi Anggaran */}
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 md:p-12 mb-16">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-bajo-dark mb-2">Serapan Anggaran {tahunRealisasi}</h2>
                <p className="text-gray-600">Perbandingan antara target anggaran dengan dana yang direalisasikan.</p>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                {/* Visualisasi Donut / Lingkaran Persentase SVG Dinamis */}
                <div className="relative w-48 h-48 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    {/* Background Circle */}
                    <path
                      className="text-gray-200"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Progress Circle (Nilai akan bertambah sesuai persentase) */}
                    <path
                      className="text-bajo-primary"
                      strokeDasharray={`${persentaseSerapan}, 100`}
                      strokeWidth="3"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold text-bajo-dark">{persentaseSerapan}%</span>
                    <span className="text-xs text-gray-500 font-bold uppercase mt-1">Terserap</span>
                  </div>
                </div>

                {/* Rincian Angka */}
                <div className="space-y-6 w-full md:w-auto">
                  <div className="bg-white px-6 py-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Target Anggaran</p>
                    <p className="text-2xl font-bold text-gray-900">{formatRupiah(targetAnggaran)}</p>
                  </div>
                  <div className="bg-white px-6 py-4 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-bajo-primary">
                    <p className="text-sm font-bold text-bajo-primary uppercase tracking-wider mb-1">Total Terealisasi</p>
                    <p className="text-2xl font-bold text-gray-900">{formatRupiah(realisasiAnggaran)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Galeri / Bukti Fisik Pembangunan */}
            {buktiKegiatan.length > 0 && (
              <div className="mb-16">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-bajo-dark">Bukti Pelaksanaan Kegiatan</h2>
                  <p className="text-gray-600 mt-2">Daftar program kerja yang telah didanai dan direalisasikan.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {buktiKegiatan.map((kegiatan, index) => (
                    <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all flex flex-col h-full">
                      {/* Area Gambar atau Placeholder */}
                      <div className="h-40 bg-gray-100 flex items-center justify-center relative flex-shrink-0">
                        {kegiatan.foto_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={kegiatan.foto_url} alt={kegiatan.kegiatan} className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                        <div className={`absolute top-3 right-3 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase ${kegiatan.status.includes('100%') ? 'bg-green-500' : 'bg-orange-500'}`}>
                          {kegiatan.status}
                        </div>
                      </div>
                      
                      {/* Detail Kegiatan */}
                      <div className="p-5 flex flex-col flex-grow">
                        <p className="text-[10px] font-extrabold text-bajo-primary uppercase tracking-wider mb-2 line-clamp-1">
                          {kegiatan.bidang}
                        </p>
                        <h3 className="font-bold text-gray-900 mb-4 line-clamp-2">
                          {kegiatan.kegiatan}
                        </h3>
                        <div className="border-t border-gray-100 pt-3 mt-auto">
                          <p className="text-xs text-gray-500 mb-0.5">Nilai Realisasi:</p>
                          <p className="font-bold text-bajo-dark">{formatRupiah(kegiatan.biaya)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 3: Download LPJ Lengkap PDF */}
            <div className="bg-bajo-dark rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-bajo-primary blur-3xl opacity-20 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
              
              <div className="text-white mb-6 sm:mb-0 relative z-10 text-center sm:text-left">
                <h3 className="text-xl font-bold mb-2">Dokumen LPJ Lengkap {tahunRealisasi}</h3>
                <p className="text-bajo-light text-sm">
                  Unduh salinan resmi laporan pertanggungjawaban yang memuat detail aset dan SiLPA.
                </p>
              </div>
              
              <div className="relative z-10">
                {dokumenPdf && dokumenPdf.file_url ? (
                  <a 
                    href={dokumenPdf.file_url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-bajo-primary hover:bg-white hover:text-bajo-dark text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors whitespace-nowrap shadow-md border border-transparent hover:border-gray-200"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Unduh Dokumen (PDF)
                  </a>
                ) : (
                  <span className="bg-gray-600 text-gray-400 px-6 py-3 rounded-xl font-bold text-sm cursor-not-allowed">
                    PDF Belum Tersedia
                  </span>
                )}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}