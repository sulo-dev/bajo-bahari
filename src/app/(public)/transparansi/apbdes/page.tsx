export const metadata = {
  title: "Transparansi APBDes - Desa Bajo Bahari",
  description: "Informasi Anggaran Pendapatan dan Belanja Desa (APBDes) Bajo Bahari Tahun 2026.",
};

export default function ApbdesPage() {
  // Simulasi Data APBDes Tahun 2026
  const tahunAnggaran = "2026";
  
  const totalPendapatan = 1450000000; // Rp 1.450.000.000
  const totalBelanja = 1435000000;    // Rp 1.435.000.000
  
  const detailPendapatan = [
    { sumber: "Dana Desa (Transfer Pusat)", jumlah: 950000000, persen: 65, color: "bg-bajo-primary" },
    { sumber: "Alokasi Dana Desa (ADD)", jumlah: 350000000, persen: 24, color: "bg-bajo-secondary" },
    { sumber: "Pendapatan Asli Desa (PADes)", jumlah: 100000000, persen: 7, color: "bg-bajo-light" },
    { sumber: "Pendapatan Lain-lain", jumlah: 50000000, persen: 4, color: "bg-gray-400" },
  ];

  const detailBelanja = [
    { bidang: "Pembangunan Desa", jumlah: 750000000, persen: 52, color: "bg-bajo-primary" },
    { bidang: "Penyelenggaraan Pemerintahan", jumlah: 350000000, persen: 24, color: "bg-bajo-dark" },
    { bidang: "Pemberdayaan Masyarakat", jumlah: 185000000, persen: 13, color: "bg-bajo-secondary" },
    { bidang: "Pembinaan Kemasyarakatan", jumlah: 100000000, persen: 7, color: "bg-bajo-light" },
    { bidang: "Penanggulangan Bencana", jumlah: 50000000, persen: 4, color: "bg-red-400" },
  ];

  // Fungsi untuk memformat angka menjadi format Rupiah
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
        
        {/* Ringkasan Utama (Highlight Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Card Pendapatan */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-b-4 border-bajo-primary">
            <h2 className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-2">Total Pendapatan</h2>
            <p className="text-3xl md:text-4xl font-extrabold text-gray-900">
              {formatRupiah(totalPendapatan)}
            </p>
          </div>

          {/* Card Belanja */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-b-4 border-bajo-secondary">
            <h2 className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-2">Total Belanja</h2>
            <p className="text-3xl md:text-4xl font-extrabold text-gray-900">
              {formatRupiah(totalBelanja)}
            </p>
          </div>
        </div>

        {/* Detail Visualisasi Anggaran */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Kolom Kiri: Rincian Pendapatan */}
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-bajo-primary/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-bajo-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-bajo-dark">Sumber Pendapatan</h3>
            </div>

            <div className="space-y-6">
              {detailPendapatan.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm font-semibold text-gray-800 mb-2">
                    <span>{item.sumber}</span>
                    <span>{formatRupiah(item.jumlah)}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-grow bg-gray-200 rounded-full h-3">
                      <div className={`${item.color} h-3 rounded-full`} style={{ width: `${item.persen}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-gray-500 w-8 text-right">{item.persen}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kolom Kanan: Rincian Belanja */}
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-bajo-secondary/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-bajo-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-bajo-dark">Bidang Belanja</h3>
            </div>

            <div className="space-y-6">
              {detailBelanja.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm font-semibold text-gray-800 mb-2">
                    <span>{item.bidang}</span>
                    <span>{formatRupiah(item.jumlah)}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-grow bg-gray-200 rounded-full h-3">
                      <div className={`${item.color} h-3 rounded-full`} style={{ width: `${item.persen}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-gray-500 w-8 text-right">{item.persen}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Info Grafis / Banner Bawah */}
        <div className="mt-12 bg-bajo-light/20 border border-bajo-light/50 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
            <svg className="w-8 h-8 text-bajo-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-lg font-bold text-bajo-dark mb-1">Catatan Penting</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Data di atas merupakan ringkasan eksekutif dari APBDes Tahun Anggaran 2026. Angka tersebut mencerminkan komitmen Pemerintah Desa Bajo Bahari dalam menjalankan roda pemerintahan yang transparan dan akuntabel sesuai dengan regulasi yang berlaku.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}