export const metadata = {
  title: "Layanan Aspirasi - Desa Bajo Bahari",
  description: "Sampaikan saran, kritik, dan aspirasi Anda untuk kemajuan Desa Bajo Bahari.",
};

export default function AspirasiPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header Halaman */}
      <div className="bg-bajo-dark py-16 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none z-0">
          <div className="absolute -top-12 left-1/4 w-80 h-80 rounded-full bg-bajo-primary blur-3xl"></div>
          <div className="absolute bottom-0 right-12 w-64 h-64 rounded-full bg-bajo-secondary blur-3xl"></div>
        </div>

        <div className="relative z-10 px-4">
          <div className="inline-block px-4 py-1 rounded-full bg-bajo-light/20 text-bajo-light font-bold uppercase tracking-widest text-xs mb-4 border border-bajo-light/30">
            Layanan Publik
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Kotak Aspirasi Warga</h1>
          <p className="mt-4 text-lg text-bajo-light max-w-2xl mx-auto">
            Suara Anda adalah kunci kemajuan desa. Sampaikan saran, kritik, maupun laporan masalah di lingkungan Anda.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Kolom Kiri: Aturan & Info (Porsi 5 kolom di layar besar) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Mari Bersama Membangun Desa</h2>
              <p className="text-gray-600 leading-relaxed">
                Pemerintah Desa Bajo Bahari sangat terbuka terhadap segala bentuk masukan dari masyarakat. Kami berkomitmen untuk menindaklanjuti setiap aspirasi yang masuk secara profesional.
              </p>
            </div>

            <div className="bg-bajo-light/20 p-6 rounded-2xl border border-bajo-light/50">
              <h3 className="font-bold text-bajo-dark flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-bajo-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Panduan Menyampaikan Aspirasi
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-bajo-primary font-bold text-xs shadow-sm">1</div>
                  <p className="text-sm text-gray-700">Gunakan bahasa yang sopan, jelas, dan mudah dipahami.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-bajo-primary font-bold text-xs shadow-sm">2</div>
                  <p className="text-sm text-gray-700">Sertakan detail lokasi atau nama program jika menyampaikan keluhan infrastruktur.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-bajo-primary font-bold text-xs shadow-sm">3</div>
                  <p className="text-sm text-gray-700">Hindari unsur SARA (Suku, Agama, Ras, dan Antargolongan) serta penyebaran hoaks.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-bajo-primary font-bold text-xs shadow-sm">4</div>
                  <p className="text-sm text-gray-700">Anda dapat menyembunyikan nama Anda dari publikasi jika merasa khawatir (Pilih opsi Anonim).</p>
                </li>
              </ul>
            </div>

            {/* Statistik Mini (Opsional) */}
            <div className="flex items-center gap-6 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-xl">100%</h4>
                <p className="text-sm text-gray-500">Aspirasi dibaca oleh Kepala Desa</p>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Form Aspirasi (Porsi 7 kolom di layar besar) */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-xl relative">
              {/* Dekorasi Form */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-bajo-primary opacity-5 rounded-bl-full pointer-events-none"></div>

              <h3 className="text-2xl font-bold text-bajo-dark mb-8">Formulir Aspirasi Online</h3>
              
              <form className="space-y-6 relative z-10">
                {/* Opsi Identitas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bajo-primary focus:border-bajo-primary outline-none transition-colors"
                      placeholder="Masukkan nama Anda"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Induk Kependudukan (NIK)</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bajo-primary focus:border-bajo-primary outline-none transition-colors"
                      placeholder="Opsional, untuk verifikasi"
                    />
                  </div>
                </div>

                {/* Checkbox Anonim */}
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <input 
                    type="checkbox" 
                    id="anonim"
                    className="w-5 h-5 text-bajo-primary border-gray-300 rounded focus:ring-bajo-primary"
                  />
                  <label htmlFor="anonim" className="text-sm text-gray-700 font-medium cursor-pointer select-none">
                    Sembunyikan identitas saya (Kirim sebagai <span className="font-bold">Anonim</span>)
                  </label>
                </div>

                {/* Kategori Aspirasi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Aspirasi / Laporan</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bajo-primary focus:border-bajo-primary outline-none transition-colors bg-white">
                    <option value="" disabled selected>-- Pilih Kategori --</option>
                    <option value="infrastruktur">Infrastruktur & Pembangunan</option>
                    <option value="pelayanan">Pelayanan Publik (Surat/Adminduk)</option>
                    <option value="kebersihan">Kebersihan & Lingkungan</option>
                    <option value="sosial">Bantuan Sosial & Kesehatan</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>

                {/* Isi Aspirasi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Isi Pesan / Aspirasi</label>
                  <textarea 
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bajo-primary focus:border-bajo-primary outline-none transition-colors resize-none"
                    placeholder="Ceritakan dengan jelas keluhan, saran, atau aspirasi Anda di sini..."
                  ></textarea>
                </div>

                {/* Lampiran Foto (Opsional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lampiran Foto Bukti (Opsional)</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Klik untuk unggah</span> atau seret foto ke sini</p>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG (Maks. 2MB)</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" />
                    </label>
                  </div>
                </div>

                <button 
                  type="button" // Tetap type button untuk tampilan statis saat ini
                  className="w-full bg-bajo-dark hover:bg-bajo-primary text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Kirim Aspirasi Sekarang
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}