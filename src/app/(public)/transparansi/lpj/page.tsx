import Link from "next/link";

export const metadata = {
  title: "LPJ Realisasi - Desa Bajo Bahari",
  description: "Laporan Pertanggung Jawaban (LPJ) dan Realisasi Pelaksanaan APBDes Bajo Bahari.",
};

export default function LpjPage() {
  // Simulasi Data Realisasi (Misal untuk tahun sebelumnya, 2025)
  const tahunRealisasi = "2025";
  const targetAnggaran = 1350000000; // Rp 1.350.000.000
  const realisasiAnggaran = 1315000000; // Rp 1.315.000.000
  const persentaseSerapan = Math.round((realisasiAnggaran / targetAnggaran) * 100);

  // Fungsi untuk memformat angka menjadi format Rupiah
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  // Data bukti pembangunan/kegiatan
  const buktiKegiatan = [
    {
      id: 1,
      kegiatan: "Pembangunan Rabat Beton Jalan Pesisir",
      bidang: "Pembangunan Desa",
      biaya: 150000000,
      status: "Selesai 100%",
    },
    {
      id: 2,
      kegiatan: "Penyaluran BLT Dana Desa",
      bidang: "Penanggulangan Bencana & Mendesak",
      biaya: 85000000,
      status: "Tersalurkan 100%",
    },
    {
      id: 3,
      kegiatan: "Pelatihan & Bantuan Alat Tangkap Nelayan",
      bidang: "Pemberdayaan Masyarakat",
      biaya: 65000000,
      status: "Selesai 100%",
    },
    {
      id: 4,
      kegiatan: "Renovasi Posyandu Mawar",
      bidang: "Pembangunan Desa",
      biaya: 45000000,
      status: "Selesai 100%",
    },
  ];

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
        
        {/* Section 1: Ringkasan Realisasi Anggaran */}
        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 md:p-12 mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-bajo-dark mb-2">Serapan Anggaran {tahunRealisasi}</h2>
            <p className="text-gray-600">Perbandingan antara anggaran yang direncanakan dengan dana yang direalisasikan.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            {/* Visualisasi Donut / Lingkaran Persentase */}
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
                {/* Progress Circle */}
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
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Target Anggaran (APBDes)</p>
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
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-bajo-dark">Bukti Pelaksanaan Kegiatan</h2>
              <p className="text-gray-600 mt-2">Daftar program kerja utama yang telah selesai direalisasikan.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {buktiKegiatan.map((kegiatan) => (
              <div key={kegiatan.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all">
                {/* Kotak Gambar (Placeholder) */}
                <div className="h-40 bg-bajo-light/30 flex items-center justify-center relative">
                  <svg className="w-12 h-12 text-bajo-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                    {kegiatan.status}
                  </div>
                </div>
                
                {/* Detail Kegiatan */}
                <div className="p-5">
                  <p className="text-xs font-bold text-bajo-primary uppercase tracking-wider mb-2 line-clamp-1">
                    {kegiatan.bidang}
                  </p>
                  <h3 className="font-bold text-gray-900 mb-4 line-clamp-2 min-h-[3rem]">
                    {kegiatan.kegiatan}
                  </h3>
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-500 mb-1">Nilai Realisasi:</p>
                    <p className="font-bold text-bajo-dark">{formatRupiah(kegiatan.biaya)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Download LPJ Lengkap */}
        <div className="bg-bajo-dark rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between shadow-xl relative overflow-hidden">
          <div className="text-white mb-6 sm:mb-0 relative z-10 text-center sm:text-left">
            <h3 className="text-xl font-bold mb-2">Dokumen LPJ Lengkap {tahunRealisasi}</h3>
            <p className="text-bajo-light text-sm">
              Unduh laporan tertulis yang berisi rincian aset, Sisa Lebih Pembiayaan Anggaran (SiLPA), dan detail lainnya.
            </p>
          </div>
          
          <Link 
            href="#" 
            className="bg-bajo-primary hover:bg-white hover:text-bajo-dark text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors whitespace-nowrap z-10 border border-transparent hover:border-gray-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Unduh Dokumen
          </Link>
        </div>

      </div>
    </div>
  );
}