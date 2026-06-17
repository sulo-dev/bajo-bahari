export const metadata = {
  title: "Fasilitas Publik - Desa Bajo Bahari",
  description: "Daftar fasilitas publik dan infrastruktur yang tersedia di Desa Bajo Bahari.",
};

export default function FasilitasPage() {
  // Data statis fasilitas desa dengan penyesuaian warna yang aman (Tailwind standar + Custom)
  const fasilitasPublik = [
    {
      id: 1,
      nama: "Balai Pertemuan Desa",
      kategori: "Pemerintahan",
      deskripsi: "Pusat kegiatan warga, musyawarah desa, dan acara seremonial. Dilengkapi dengan sound system dan ruang rapat.",
      icon: "🏛️",
      warnaBg: "bg-blue-100",
      warnaTeks: "text-blue-600",
    },
    {
      id: 2,
      nama: "Poskesdes & Polindes",
      kategori: "Kesehatan",
      deskripsi: "Fasilitas kesehatan tingkat pertama untuk pelayanan ibu, anak, dan pertolongan pertama bagi warga desa.",
      icon: "🏥",
      warnaBg: "bg-green-100",
      warnaTeks: "text-green-600",
    },
    {
      id: 3,
      nama: "Masjid Raya Desa",
      kategori: "Tempat Ibadah",
      deskripsi: "Pusat ibadah dan kegiatan keagamaan masyarakat. Mampu menampung hingga 300 jamaah dengan tempat wudhu bersih.",
      icon: "🕌",
      warnaBg: "bg-indigo-100",
      warnaTeks: "text-indigo-600",
    },
    {
      id: 4,
      nama: "Dermaga Pesisir",
      kategori: "Transportasi Laut",
      deskripsi: "Tempat bersandar perahu nelayan dan bongkar muat hasil tangkapan laut warga Desa Bajo Bahari.",
      icon: "⚓",
      warnaBg: "bg-cyan-100",
      warnaTeks: "text-cyan-600",
    },
    {
      id: 5,
      nama: "Lapangan Olahraga",
      kategori: "Sosial & Olahraga",
      deskripsi: "Area terbuka untuk kegiatan olahraga seperti voli dan takraw, serta digunakan untuk perayaan lomba.",
      icon: "⚽",
      warnaBg: "bg-orange-100",
      warnaTeks: "text-orange-600",
    },
    {
      id: 6,
      nama: "Pasar Desa / TPI Mini",
      kategori: "Ekonomi",
      deskripsi: "Tempat transaksi jual beli kebutuhan pokok dan pusat pelelangan ikan skala kecil hasil tangkapan lokal.",
      icon: "🏪",
      warnaBg: "bg-teal-100",
      warnaTeks: "text-teal-600",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header Halaman - Dibuat lebih ringkas dan aman */}
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
        
        {/* Grid Card yang Stabil */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fasilitasPublik.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full"
            >
              {/* Header Card: Ikon dan Kategori */}
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${item.warnaBg} ${item.warnaTeks}`}>
                  {item.icon}
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

        {/* Banner Peminjaman - Dibuat jadi bentuk Box rapi */}
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
          <button className="w-full md:w-auto px-6 py-3 bg-bajo-primary hover:bg-bajo-dark text-white text-sm font-bold rounded-xl transition-colors whitespace-nowrap">
            Hubungi Admin
          </button>
        </div>

      </div>
    </div>
  );
}