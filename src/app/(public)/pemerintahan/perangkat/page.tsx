export const metadata = {
  title: "Daftar Perangkat Desa - Bajo Bahari",
  description: "Profil dan daftar nama perangkat Pemerintahan Desa Bajo Bahari.",
};

export default function PerangkatPage() {
  // Data statis perangkat desa (Nanti bisa dihubungkan ke Supabase jika ingin dinamis)
  const perangkatDesa = [
    { id: 1, nama: "Bapak [Nama Kades]", jabatan: "Kepala Desa", warna: "bg-bajo-primary" },
    { id: 2, nama: "Bapak [Nama Sekdes]", jabatan: "Sekretaris Desa", warna: "bg-bajo-dark" },
    { id: 3, nama: "Ibu [Nama Kaur]", jabatan: "Kaur Umum & Perencanaan", warna: "bg-bajo-secondary" },
    { id: 4, nama: "Bapak [Nama Kaur]", jabatan: "Kaur Keuangan", warna: "bg-bajo-secondary" },
    { id: 5, nama: "Bapak [Nama Kasi]", jabatan: "Kasi Pemerintahan", warna: "bg-bajo-light" },
    { id: 6, nama: "Ibu [Nama Kasi]", jabatan: "Kasi Kesejahteraan", warna: "bg-bajo-light" },
    { id: 7, nama: "Bapak [Nama Kadus 1]", jabatan: "Kepala Dusun 1", warna: "bg-gray-400" },
    { id: 8, nama: "Bapak [Nama Kadus 2]", jabatan: "Kepala Dusun 2", warna: "bg-gray-400" },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header Halaman */}
      <div className="bg-bajo-dark py-16 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none z-0">
          <div className="absolute top-1/2 left-12 w-64 h-64 rounded-full bg-bajo-primary blur-3xl"></div>
          <div className="absolute -top-12 right-24 w-80 h-80 rounded-full bg-bajo-light blur-3xl"></div>
        </div>

        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Perangkat Desa</h1>
          <p className="mt-4 text-lg text-bajo-light max-w-2xl mx-auto">
            Mengenal lebih dekat para pelayan masyarakat di lingkungan Pemerintahan Desa Bajo Bahari.
          </p>
        </div>
      </div>

      {/* Konten Utama - Grid Profil */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        {/* Kepala Desa (Highlight Paling Atas) */}
        <div className="flex justify-center mb-16">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden w-full max-w-sm transform hover:-translate-y-2 transition-all duration-300">
            {/* Area Foto Dummy */}
            <div className={`h-64 ${perangkatDesa[0].warna} w-full relative flex items-center justify-center`}>
              <svg className="w-24 h-24 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-bajo-dark mb-1">{perangkatDesa[0].nama}</h2>
              <p className="text-bajo-primary font-medium tracking-wide uppercase text-sm">
                {perangkatDesa[0].jabatan}
              </p>
            </div>
          </div>
        </div>

        {/* Grid Sisa Perangkat Desa */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {perangkatDesa.slice(1).map((person) => (
            <div 
              key={person.id} 
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transform hover:-translate-y-2 transition-all duration-300"
            >
              {/* Area Foto Dummy */}
              <div className={`h-48 ${person.warna} w-full relative flex items-center justify-center`}>
                <svg className="w-16 h-16 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="p-5 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{person.nama}</h3>
                <p className="text-gray-500 text-sm font-medium">
                  {person.jabatan}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}