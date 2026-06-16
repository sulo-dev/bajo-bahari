export const metadata = {
  title: "Sejarah - Desa Bajo Bahari",
  description: "Menelusuri jejak langkah dan sejarah terbentuknya Desa Bajo Bahari.",
};

export default function SejarahPage() {
  // Data statis sejarah (Bisa disesuaikan dengan sejarah asli desa nantinya)
  const sejarahTimeline = [
    {
      year: "Awal Mula",
      title: "Terbentuknya Pemukiman Pesisir",
      description: "Sekelompok nelayan tangguh mulai mendirikan pemukiman di sepanjang pesisir. Kedekatan dengan laut menjadikan wilayah ini sebagai titik strategis persinggahan perahu nelayan dari berbagai daerah.",
    },
    {
      year: "2005",
      title: "Peresmian Menjadi Dusun",
      description: "Seiring bertambahnya populasi dan semakin pesatnya interaksi sosial ekonomi, pemukiman pesisir ini secara resmi diakui sebagai dusun definitif yang menginduk pada desa tetangga.",
    },
    {
      year: "2012",
      title: "Pemekaran Menjadi Desa Bajo Bahari",
      description: "Karena potensi maritim yang besar dan kebutuhan administrasi mandiri, wilayah ini resmi mekar menjadi 'Desa Bajo Bahari'. Pemilihan nama ini merepresentasikan kedekatan masyarakat dengan lautan sebagai sumber kehidupan.",
    },
    {
      year: "Saat Ini",
      title: "Era Digital dan Pariwisata",
      description: "Desa Bajo Bahari kini bertransformasi menjadi desa yang modern dengan tata kelola digital. Fokus pembangunan diarahkan pada transparansi, peningkatan UMKM warga, dan pelestarian ekosistem pariwisata pesisir.",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header Halaman */}
      <div className="bg-bajo-dark py-16 text-center text-white relative overflow-hidden">
        {/* Ornamen Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none z-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-bajo-secondary blur-3xl"></div>
          <div className="absolute bottom-0 left-12 w-64 h-64 rounded-full bg-bajo-primary blur-3xl"></div>
        </div>

        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Sejarah Desa</h1>
          <p className="mt-4 text-lg text-bajo-light max-w-2xl mx-auto">
            Mengenal lebih dekat asal-usul, jejak langkah, dan perkembangan Desa Bajo Bahari dari masa ke masa.
          </p>
        </div>
      </div>

      {/* Konten Utama - Timeline */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="relative">
          
          {/* Garis Vertikal Tengah (Background) */}
          <div className="absolute hidden md:block left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 rounded-full"></div>

          <div className="space-y-12">
            {sejarahTimeline.map((item, index) => {
              // Menentukan posisi Kiri atau Kanan untuk tampilan Desktop
              const isEven = index % 2 === 0;

              return (
                <div key={index} className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Area Konten */}
                  <div className={`w-full md:w-5/12 ${isEven ? 'md:text-left' : 'md:text-right'} mb-6 md:mb-0`}>
                    <div className={`bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-bajo-light transition-all duration-300 relative`}>
                      <span className="block text-bajo-primary font-extrabold text-xl mb-2">
                        {item.year}
                      </span>
                      <h3 className="text-xl font-bold text-bajo-dark mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Titik Tengah Timeline */}
                  <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white border-4 border-bajo-primary z-10 hidden md:flex">
                    <div className="w-2 h-2 rounded-full bg-bajo-dark"></div>
                  </div>

                  {/* Spacer untuk menyeimbangkan Flexbox di Desktop */}
                  <div className="hidden md:block w-5/12"></div>
                </div>
              );
            })}
          </div>

        </div>
        
        {/* Paragraf Penutup */}
        <div className="mt-20 text-center bg-bajo-light/20 p-8 rounded-3xl border border-bajo-light/50">
          <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto italic">
            &quot;Semangat gotong royong dan kecintaan pada alam bahari yang diwariskan para pendahulu, akan selalu menjadi pedoman kami dalam melangkah menuju masa depan yang lebih cerah.&quot;
          </p>
        </div>

      </div>
    </div>
  );
}