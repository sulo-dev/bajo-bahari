import Link from "next/link";

export const metadata = {
  title: "RPJMDes - Desa Bajo Bahari",
  description: "Rencana Pembangunan Jangka Menengah Desa (RPJMDes) Bajo Bahari.",
};

export default function RpjmdesPage() {
  const bidangPembangunan = [
    {
      id: 1,
      title: "Penyelenggaraan Pemerintahan",
      desc: "Peningkatan kualitas pelayanan publik, tata kelola aset desa, dan digitalisasi sistem administrasi desa.",
      icon: "🏢",
    },
    {
      id: 2,
      title: "Pembangunan Desa",
      desc: "Pembangunan infrastruktur fisik, perbaikan akses jalan pesisir, fasilitas kesehatan, dan pendidikan.",
      icon: "🏗️",
    },
    {
      id: 3,
      title: "Pembinaan Kemasyarakatan",
      desc: "Pelestarian adat budaya pesisir, pembinaan lembaga kemasyarakatan, kerukunan warga, dan keamanan desa.",
      icon: "🤝",
    },
    {
      id: 4,
      title: "Pemberdayaan Masyarakat",
      desc: "Dukungan modal BUMDes, pelatihan UMKM produk laut, dan peningkatan keterampilan nelayan serta petani tambak.",
      icon: "💡",
    },
    {
      id: 5,
      title: "Penanggulangan Bencana & Darurat",
      desc: "Kesiapsiagaan menghadapi abrasi pesisir, cuaca ekstrem, dan pengadaan fasilitas keselamatan warga.",
      icon: "🚨",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header Halaman */}
      <div className="bg-bajo-dark py-16 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none z-0">
          <div className="absolute top-0 right-12 w-80 h-80 rounded-full bg-bajo-primary blur-3xl"></div>
          <div className="absolute -bottom-10 left-10 w-64 h-64 rounded-full bg-bajo-secondary blur-3xl"></div>
        </div>

        <div className="relative z-10 px-4">
          <div className="inline-block px-4 py-1 rounded-full bg-bajo-light/20 text-bajo-light font-bold uppercase tracking-widest text-xs mb-4 border border-bajo-light/30">
            Dokumen Perencanaan
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">R P J M Des</h1>
          <p className="mt-4 text-lg text-bajo-light max-w-2xl mx-auto">
            Rencana Pembangunan Jangka Menengah Desa Bajo Bahari. Cetak biru arah pembangunan desa.
          </p>
        </div>
      </div>

      {/* Konten Utama */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        {/* Penjelasan Singkat */}
        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto mb-16 shadow-sm">
          <h2 className="text-2xl font-bold text-bajo-dark mb-4">Apa itu RPJMDes?</h2>
          <p className="text-gray-600 leading-relaxed md:text-lg">
            RPJMDes adalah dokumen perencanaan strategis yang memuat visi, misi, arah kebijakan, dan rencana program kerja Pemerintah Desa Bajo Bahari selama masa jabatan Kepala Desa. Dokumen ini menjadi pedoman utama dalam penyusunan anggaran (APBDes) setiap tahunnya untuk memastikan pembangunan berjalan terarah dan berkelanjutan.
          </p>
        </div>

        {/* Bidang Pembangunan */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-bajo-dark mb-10 text-center">Fokus Bidang Pembangunan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bidangPembangunan.map((bidang) => (
              <div key={bidang.id} className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-bajo-primary hover:shadow-lg transition-all duration-300 group">
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">
                  {bidang.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{bidang.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {bidang.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section Download Dokumen */}
        <div className="bg-bajo-dark rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden">
          {/* Ornamen Latar Belakang */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-bajo-primary blur-3xl opacity-30 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          
          <div className="text-white mb-8 md:mb-0 md:pr-8 relative z-10 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">Unduh Dokumen Lengkap</h3>
            <p className="text-bajo-light">
              Pelajari rincian matriks program kerja dan sasaran strategis Desa Bajo Bahari secara menyeluruh.
            </p>
          </div>
          
          <div className="relative z-10">
            {/* Tombol Unduh (Link ini nanti bisa diarahkan ke file PDF asli di folder public) */}
            <Link 
              href="#" 
              className="bg-white text-bajo-dark hover:bg-bajo-light px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-colors shadow-lg whitespace-nowrap"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Unduh RPJMDes (PDF)
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}