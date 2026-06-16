export const metadata = {
  title: "Visi & Misi - Desa Bajo Bahari",
  description: "Arah dan tujuan pembangunan Desa Bajo Bahari.",
};

export default function VisiMisiPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header Halaman (Hero Mini) */}
      <div className="bg-bajo-dark py-16 text-center text-white relative overflow-hidden">
        {/* Ornamen Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none z-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-bajo-primary blur-3xl"></div>
          <div className="absolute top-1/2 right-12 w-64 h-64 rounded-full bg-bajo-light blur-3xl"></div>
        </div>

        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Visi & Misi</h1>
          <p className="mt-4 text-lg text-bajo-light max-w-2xl mx-auto">
            Arah langkah, tujuan, dan komitmen kami dalam membangun Desa Bajo Bahari yang lebih baik.
          </p>
        </div>
      </div>

      {/* Konten Utama */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        {/* Section Visi */}
        <div className="mb-20 text-center transform transition-all hover:scale-[1.02] duration-300">
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-bajo-light/30 text-bajo-dark font-bold uppercase tracking-widest text-sm">
            Visi Kami
          </div>
          <h2 className="text-2xl md:text-4xl text-gray-800 font-bold leading-relaxed mb-6">
            &quot;Mewujudkan Desa Bajo Bahari yang <span className="text-bajo-primary">Mandiri</span>, <span className="text-bajo-primary">Inovatif</span>, Transparan, dan Sejahtera Berlandaskan Gotong Royong.&quot;
          </h2>
        </div>

        <hr className="border-gray-200 mb-16 w-32 mx-auto border-t-4 rounded-full" />

        {/* Section Misi */}
        <div>
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-1 rounded-full bg-bajo-light/30 text-bajo-dark font-bold uppercase tracking-widest text-sm">
              Misi Kami
            </div>
          </div>
          
          <div className="space-y-6">
            {[
              "Meningkatkan kualitas tata kelola pemerintahan desa yang transparan, bersih, dan akuntabel berbasis digital.",
              "Mendorong pertumbuhan ekonomi warga melalui optimalisasi UMKM dan potensi pariwisata bahari/pesisir.",
              "Meningkatkan kualitas infrastruktur desa dan fasilitas pelayanan publik yang mudah diakses seluruh warga.",
              "Memelihara kelestarian lingkungan pesisir dan laut sebagai ekosistem pendukung sumber kehidupan masyarakat.",
              "Membangun sumber daya manusia yang unggul melalui pelestarian budaya lokal, pendidikan, dan kesehatan."
            ].map((misi, index) => (
              <div 
                key={index} 
                className="flex items-start bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-bajo-light hover:shadow-md transition-all duration-300"
              >
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-bajo-primary text-white font-bold text-xl mr-5 shadow-sm">
                  {index + 1}
                </div>
                <p className="text-lg text-gray-700 leading-relaxed pt-1">
                  {misi}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}   