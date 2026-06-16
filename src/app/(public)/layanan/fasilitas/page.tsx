export const metadata = {
  title: "Fasilitas Publik - Desa Bajo Bahari",
  description: "Daftar fasilitas publik dan infrastruktur yang tersedia di Desa Bajo Bahari.",
};

export default function FasilitasPage() {
  // Data statis fasilitas desa
  const fasilitasPublik = [
    {
      id: 1,
      nama: "Balai Pertemuan Desa",
      kategori: "Pemerintahan",
      deskripsi: "Pusat kegiatan warga, musyawarah desa, dan acara seremonial. Dilengkapi dengan sound system dan ruang rapat.",
      icon: "🏛️",
      warna: "bg-bajo-primary",
    },
    {
      id: 2,
      nama: "Poskesdes & Polindes",
      kategori: "Kesehatan",
      deskripsi: "Fasilitas kesehatan tingkat pertama untuk pelayanan ibu, anak, dan pertolongan pertama bagi warga desa.",
      icon: "🏥",
      warna: "bg-green-500",
    },
    {
      id: 3,
      nama: "Masjid Raya Desa",
      kategori: "Tempat Ibadah",
      deskripsi: "Pusat ibadah dan kegiatan keagamaan masyarakat. Mampu menampung hingga 300 jamaah dengan fasilitas tempat wudhu bersih.",
      icon: "🕌",
      warna: "bg-bajo-dark",
    },
    {
      id: 4,
      nama: "Dermaga Pesisir",
      kategori: "Transportasi & Ekonomi",
      deskripsi: "Tempat bersandar perahu nelayan dan bongkar muat hasil tangkapan laut warga Desa Bajo Bahari.",
      icon: "⚓",
      warna: "bg-bajo-secondary",
    },
    {
      id: 5,
      nama: "Lapangan Olahraga Terpadu",
      kategori: "Sosial & Olahraga",
      deskripsi: "Area terbuka untuk kegiatan olahraga seperti voli dan takraw, serta digunakan untuk perayaan lomba 17 Agustus.",
      icon: "⚽",
      warna: "bg-orange-500",
    },
    {
      id: 6,
      nama: "Pasar Desa / TPI Mini",
      kategori: "Ekonomi",
      deskripsi: "Tempat transaksi jual beli kebutuhan pokok dan pusat pelelangan ikan skala kecil hasil tangkapan nelayan lokal.",
      icon: "🏪",
      warna: "bg-bajo-light",
    },
  ];

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header Halaman */}
      <div className="bg-bajo-dark py-16 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none z-0">
          <div className="absolute top-0 left-12 w-80 h-80 rounded-full bg-bajo-primary blur-3xl"></div>
          <div className="absolute -bottom-10 right-1/4 w-72 h-72 rounded-full bg-bajo-secondary blur-3xl"></div>
        </div>

        <div className="relative z-10 px-4">
          <div className="inline-block px-4 py-1 rounded-full bg-bajo-light/20 text-bajo-light font-bold uppercase tracking-widest text-xs mb-4 border border-bajo-light/30">
            Layanan Publik
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Fasilitas Publik</h1>
          <p className="mt-4 text-lg text-bajo-light max-w-2xl mx-auto">
            Berbagai infrastruktur dan fasilitas yang dikelola desa untuk menunjang kesejahteraan warga.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        {/* Grid Galeri Fasilitas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fasilitasPublik.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden group">
              
              {/* Area Visual (Placeholder Gambar) */}
              <div className="h-48 bg-gray-50 relative flex items-center justify-center overflow-hidden">
                {/* Latar Belakang Warna Dekoratif */}
                <div className={`absolute inset-0 opacity-10 ${item.warna} group-hover:opacity-20 transition-opacity`}></div>
                
                {/* Ikon Besar */}
                <span className="text-7xl transform group-hover:scale-110 transition-transform duration-300 relative z-10 drop-shadow-md">
                  {item.icon}
                </span>
                
                {/* Badge Kategori */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm z-20">
                  {item.kategori}
                </div>
              </div>

              {/* Deskripsi Teks */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.nama}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.deskripsi}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Banner Informasi Peminjaman Fasilitas */}
        <div className="mt-16 bg-bajo-light/10 border border-bajo-light/30 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-shrink-0 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
            <svg className="w-10 h-10 text-bajo-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-grow text-center md:text-left">
            <h3 className="text-2xl font-bold text-bajo-dark mb-2">Ingin Meminjam Fasilitas Desa?</h3>
            <p className="text-gray-600">
              Warga dapat mengajukan peminjaman Balai Desa atau fasilitas lainnya untuk kegiatan sosial, pernikahan, maupun olahraga. Syarat dan ketentuan berlaku sesuai peraturan desa.
            </p>
          </div>
          <div className="flex-shrink-0 w-full md:w-auto">
            <button className="w-full bg-bajo-primary hover:bg-bajo-dark text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md">
              Hubungi Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}