export const metadata = {
  title: "Geografi - Desa Bajo Bahari",
  description: "Letak geografis, batas wilayah, dan peta Desa Bajo Bahari.",
};

export default function GeografiPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header Halaman */}
      <div className="bg-bajo-dark py-16 text-center text-white relative overflow-hidden">
        {/* Ornamen Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none z-0">
          <div className="absolute top-12 left-12 w-64 h-64 rounded-full bg-bajo-light blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-bajo-primary blur-3xl"></div>
        </div>

        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Geografi Wilayah</h1>
          <p className="mt-4 text-lg text-bajo-light max-w-2xl mx-auto">
            Informasi letak geografis, batas wilayah, dan peta interaktif Desa Bajo Bahari.
          </p>
        </div>
      </div>

      {/* Konten Utama */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Kolom Kiri: Peta Wilayah */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-1 rounded-full bg-bajo-light/30 text-bajo-dark font-bold uppercase tracking-widest text-sm mb-2">
              Peta Desa
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Letak Titik Koordinat</h2>
            <p className="text-gray-600 leading-relaxed">
              Desa Bajo Bahari terletak di pesisir yang strategis. Anda dapat menjelajahi area desa, fasilitas publik, dan akses jalan melalui peta interaktif di bawah ini.
            </p>
            
            {/* Wadah Google Maps */}
            <div className="w-full h-96 rounded-2xl overflow-hidden shadow-lg border-4 border-gray-50 relative group">
              {/* Jika link yang Anda berikan tidak muncul (blank), Anda perlu mengambil link "Embed a map" (Sematkan Peta) dari Google Maps */}
              <iframe 
                src="https://maps.app.goo.gl/dmjBjHsb1oR4Zcpz9?g_st=aw" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 z-10 bg-gray-200"
              ></iframe>
              {/* Fallback visual saat iframe sedang loading */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-0">
                <span className="text-gray-400 font-medium">Memuat Peta...</span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Informasi Demografi & Batas */}
          <div className="space-y-10 lg:pl-8 lg:mt-16">
            
            {/* Batas Wilayah */}
            <div>
              <h3 className="text-2xl font-bold text-bajo-dark mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-bajo-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                Batas Wilayah
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { arah: "Utara", batas: "Laut Lepas / Perairan" },
                  { arah: "Selatan", batas: "Desa Tetangga A" },
                  { arah: "Timur", batas: "Kawasan Hutan Mangrove" },
                  { arah: "Barat", batas: "Desa Tetangga B" },
                ].map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                    <span className="block text-sm font-semibold text-bajo-primary mb-1 uppercase tracking-wider">{item.arah}</span>
                    <span className="text-gray-800 font-medium">{item.batas}</span>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Karakteristik Wilayah */}
            <div>
              <h3 className="text-2xl font-bold text-bajo-dark mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-bajo-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Karakteristik
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-bajo-secondary mr-3"></div>
                  <p className="text-gray-700"><strong className="text-gray-900">Topografi:</strong> Sebagian besar merupakan dataran rendah pesisir laut dengan ketinggian rata-rata 0 - 5 meter di atas permukaan laut.</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-bajo-secondary mr-3"></div>
                  <p className="text-gray-700"><strong className="text-gray-900">Iklim:</strong> Tropis dengan curah hujan sedang, sangat dipengaruhi oleh angin laut dan musim pesisir.</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-bajo-secondary mr-3"></div>
                  <p className="text-gray-700"><strong className="text-gray-900">Luas Wilayah:</strong> Kurang lebih sekitar 150 Hektar yang mencakup area pemukiman, tambak, dan hutan bakau.</p>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}