export const metadata = {
  title: "Kontak Kami - Desa Bajo Bahari",
  description: "Hubungi Pemerintah Desa Bajo Bahari untuk informasi dan layanan.",
};

export default function KontakPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header Halaman */}
      <div className="bg-bajo-dark py-16 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none z-0">
          <div className="absolute -bottom-12 right-12 w-64 h-64 rounded-full bg-bajo-primary blur-3xl"></div>
          <div className="absolute top-12 left-1/4 w-72 h-72 rounded-full bg-bajo-light blur-3xl"></div>
        </div>

        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Hubungi Kami</h1>
          <p className="mt-4 text-lg text-bajo-light max-w-2xl mx-auto">
            Kami siap melayani Anda. Silakan hubungi kami melalui kontak di bawah ini atau kirimkan pesan langsung.
          </p>
        </div>
      </div>

      {/* Konten Utama */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Kolom Kiri: Informasi Kontak & Jam Operasional */}
          <div>
            <div className="inline-block px-4 py-1 rounded-full bg-bajo-light/30 text-bajo-dark font-bold uppercase tracking-widest text-sm mb-6">
              Informasi Kontak
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Pusat Layanan Desa</h2>
            
            <div className="space-y-8">
              {/* Alamat */}
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 mt-1">
                  <svg className="w-6 h-6 text-bajo-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-bold text-bajo-dark">Alamat Kantor</h3>
                  <p className="mt-2 text-gray-600 leading-relaxed">
                    Jl. Poros Desa Bajo Bahari No. 1<br />
                    Kecamatan, Kabupaten<br />
                    Provinsi, Kode Pos
                  </p>
                </div>
              </div>

              {/* Email & Telepon */}
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 mt-1">
                  <svg className="w-6 h-6 text-bajo-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-bold text-bajo-dark">Kontak Digital</h3>
                  <p className="mt-2 text-gray-600">pemdes@bajobahari.desa.id</p>
                  <p className="mt-1 text-gray-600">+62 812-3456-7890 (WA Admin)</p>
                </div>
              </div>

              {/* Jam Operasional */}
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 mt-1">
                  <svg className="w-6 h-6 text-bajo-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-bold text-bajo-dark">Jam Operasional</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-gray-600 flex justify-between w-48">
                      <span>Senin - Kamis:</span> <span className="font-medium">08:00 - 15:00</span>
                    </p>
                    <p className="text-gray-600 flex justify-between w-48">
                      <span>Jumat:</span> <span className="font-medium">08:00 - 11:30</span>
                    </p>
                    <p className="text-gray-400 flex justify-between w-48 italic">
                      <span>Sabtu - Minggu:</span> <span>Libur</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Form Pesan */}
          <div className="bg-gray-50 p-8 md:p-10 rounded-3xl border border-gray-100">
            <h3 className="text-2xl font-bold text-bajo-dark mb-6">Kirim Pesan / Aspirasi</h3>
            <form className="space-y-5">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bajo-primary focus:border-bajo-primary outline-none transition-colors"
                  placeholder="Masukkan nama Anda"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email atau No. WhatsApp</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bajo-primary focus:border-bajo-primary outline-none transition-colors"
                  placeholder="Agar kami bisa membalas pesan Anda"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subjek / Keperluan</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bajo-primary focus:border-bajo-primary outline-none transition-colors bg-white">
                  <option>Informasi Umum</option>
                  <option>Layanan Persuratan</option>
                  <option>Kritik & Saran</option>
                  <option>Pengaduan Warga</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pesan Anda</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bajo-primary focus:border-bajo-primary outline-none transition-colors resize-none"
                  placeholder="Tuliskan pesan, pertanyaan, atau saran Anda di sini..."
                ></textarea>
              </div>

              <button 
                type="button" // Saat ini tipe button agar halaman tidak me-refresh saat diklik
                className="w-full bg-bajo-primary hover:bg-bajo-dark text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 flex justify-center items-center gap-2"
              >
                Kirim Pesan
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}