import Link from "next/link";

export const metadata = {
  title: "Layanan Surat - Desa Bajo Bahari",
  description: "Informasi persyaratan dan layanan pengurusan surat administrasi Desa Bajo Bahari.",
};

export default function LayananSuratPage() {
  // Data statis daftar layanan surat dan persyaratannya
  const daftarLayanan = [
    {
      id: 1,
      nama: "Surat Keterangan Domisili",
      deskripsi: "Dokumen yang menerangkan tempat tinggal / domisili sah seseorang di Desa Bajo Bahari.",
      syarat: [
        "Fotokopi KTP Pemohon",
        "Fotokopi Kartu Keluarga (KK)",
        "Surat Pengantar dari RT/RW setempat",
      ],
      icon: "🏠",
    },
    {
      id: 2,
      nama: "Surat Keterangan Usaha (SKU)",
      deskripsi: "Surat pengantar untuk keperluan administrasi usaha, seperti pengajuan kredit bank atau izin.",
      syarat: [
        "Fotokopi KTP dan KK",
        "Foto Tempat Usaha",
        "Surat Pengantar RT/RW",
        "Mengisi Formulir Pernyataan Usaha",
      ],
      icon: "🏪",
    },
    {
      id: 3,
      nama: "Surat Keterangan Tidak Mampu (SKTM)",
      deskripsi: "Surat yang menyatakan kondisi ekonomi untuk keperluan pendidikan, kesehatan, atau bantuan.",
      syarat: [
        "Fotokopi KTP dan KK",
        "Surat Pengantar RT/RW",
        "Foto Kondisi Rumah (Depan & Dalam)",
        "Belum terdaftar sebagai penerima PKH/BPNT (Opsional)",
      ],
      icon: "📄",
    },
    {
      id: 4,
      nama: "Surat Pengantar Nikah (N1-N4)",
      deskripsi: "Kumpulan dokumen pengantar dari desa sebagai syarat wajib pendaftaran pernikahan di KUA.",
      syarat: [
        "Fotokopi KTP & KK Calon Suami & Istri",
        "Pas Foto 3x4 (4 Lembar) berlatar biru/merah",
        "Surat Pengantar RT/RW",
        "Fotokopi Akta Kelahiran",
        "Fotokopi KTP Orang Tua",
      ],
      icon: "💍",
    },
  ];

  // Nomor WhatsApp Admin Desa (Ganti dengan nomor yang sebenarnya)
  const noWhatsApp = "6281234567890";

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header Halaman */}
      <div className="bg-bajo-dark py-16 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none z-0">
          <div className="absolute -top-12 right-1/4 w-80 h-80 rounded-full bg-bajo-primary blur-3xl"></div>
          <div className="absolute bottom-0 left-12 w-64 h-64 rounded-full bg-bajo-secondary blur-3xl"></div>
        </div>

        <div className="relative z-10 px-4">
          <div className="inline-block px-4 py-1 rounded-full bg-bajo-light/20 text-bajo-light font-bold uppercase tracking-widest text-xs mb-4 border border-bajo-light/30">
            Layanan Publik
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Pengurusan Surat</h1>
          <p className="mt-4 text-lg text-bajo-light max-w-2xl mx-auto">
            Ketahui persyaratan administrasi untuk berbagai keperluan surat menyurat Anda di sini.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        {/* Info Alur Pelayanan */}
        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 md:p-12 mb-16 text-center">
          <h2 className="text-2xl font-bold text-bajo-dark mb-8">Alur Pengurusan Administrasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Garis Penghubung (Hanya Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-1 bg-gray-200 transform -translate-y-1/2 z-0"></div>
            
            <div className="relative z-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 mx-auto bg-bajo-primary text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">1</div>
              <h3 className="font-bold text-gray-900 mb-2">Lengkapi Syarat</h3>
              <p className="text-sm text-gray-600">Siapkan seluruh berkas dan dokumen persyaratan sesuai dengan jenis surat yang dibutuhkan.</p>
            </div>
            
            <div className="relative z-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 mx-auto bg-bajo-secondary text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">2</div>
              <h3 className="font-bold text-gray-900 mb-2">Hubungi Admin / Datang</h3>
              <p className="text-sm text-gray-600">Bawa berkas fisik ke kantor desa, atau kirimkan foto dokumen melalui WhatsApp pelayanan desa.</p>
            </div>

            <div className="relative z-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 mx-auto bg-bajo-dark text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">3</div>
              <h3 className="font-bold text-gray-900 mb-2">Surat Diterbitkan</h3>
              <p className="text-sm text-gray-600">Tunggu proses verifikasi. Surat yang telah ditandatangani Kepala Desa siap untuk diambil.</p>
            </div>
          </div>
        </div>

        {/* Daftar Layanan Surat */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-bajo-dark mb-10 text-center">Jenis Layanan & Persyaratan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {daftarLayanan.map((layanan) => {
              // Membuat pesan default WhatsApp berdasarkan jenis surat
              const pesanWA = encodeURIComponent(`Halo Admin Desa Bajo Bahari, saya ingin mengurus ${layanan.nama}. Apakah saya bisa mengirimkan persyaratannya secara online?`);
              
              return (
                <div key={layanan.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full">
                  <div className="p-8 flex-grow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl bg-gray-50 w-16 h-16 rounded-xl flex items-center justify-center border border-gray-100">
                        {layanan.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 leading-tight">{layanan.nama}</h3>
                    </div>
                    <p className="text-gray-600 mb-6 line-clamp-2">
                      {layanan.deskripsi}
                    </p>
                    
                    <div className="bg-bajo-light/10 p-5 rounded-xl border border-bajo-light/30">
                      <h4 className="text-sm font-bold text-bajo-dark uppercase tracking-wider mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-bajo-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Persyaratan:
                      </h4>
                      <ul className="space-y-2">
                        {layanan.syarat.map((syarat, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                            <span className="text-bajo-secondary mt-0.5">•</span>
                            <span>{syarat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Tombol Aksi Bawah */}
                  <div className="p-6 bg-gray-50 border-t border-gray-100 mt-auto">
                    <a 
                      href={`https://wa.me/${noWhatsApp}?text=${pesanWA}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transition-colors flex justify-center items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Konsultasi & Urus via WhatsApp
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}