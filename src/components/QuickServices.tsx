import Link from "next/link";

export default function QuickServices() {
  const services = [
    {
      title: "Pengurusan Surat",
      description: "Layanan mandiri cepat untuk administrasi dan persuratan warga desa.",
      href: "/layanan/surat",
      icon: (
        <svg className="w-7 h-7 text-bajo-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "bg-blue-50",
    },
    {
      title: "Transparansi Dana",
      description: "Akses terbuka informasi APBDes dan laporan pertanggungjawaban (LPJ).",
      href: "/transparansi/apbdes",
      icon: (
        <svg className="w-7 h-7 text-bajo-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "bg-teal-50",
    },
    {
      title: "Suara Warga",
      description: "Sampaikan aspirasi, pengaduan, dan saran untuk kemajuan desa.",
      href: "/layanan/aspirasi",
      icon: (
        <svg className="w-7 h-7 text-bajo-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      color: "bg-indigo-50",
    },
    {
      title: "Potensi & UMKM",
      description: "Jelajahi produk komoditas unggulan dan potensi pariwisata Bajo Bahari.",
      href: "/potensi/umkm",
      icon: (
        <svg className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: "bg-orange-50",
    },
  ];

  return (
    // Menggunakan bg-gray-50 agar menyatu dengan dekorasi gelombang dari Hero Component
    <section className="pt-8 pb-20 bg-gray-50 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Seksi */}
        <div className="text-center mb-14">
          <h2 className="text-3xl font-extrabold text-bajo-dark tracking-tight">Layanan & Informasi Utama</h2>
          <div className="w-16 h-1 bg-bajo-primary mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto font-medium">
            Akses cepat ke berbagai fasilitas administrasi digital dan transparansi informasi Desa Bajo Bahari.
          </p>
        </div>

        {/* Grid Layanan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
          {services.map((service, index) => (
            <Link href={service.href} key={index} className="group flex flex-col h-full">
              <div className="flex flex-col h-full bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-bajo-primary/10 transition-all duration-300 transform group-hover:-translate-y-2 relative overflow-hidden">
                
                {/* Dekorasi Latar Kotak */}
                <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gray-50 group-hover:scale-150 transition-transform duration-500 ease-in-out z-0"></div>

                {/* Ikon */}
                <div className={`relative z-10 w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                
                {/* Teks */}
                <div className="relative z-10 flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-bajo-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                {/* Panah Interaktif di Bawah */}
                <div className="relative z-10 flex items-center text-sm font-bold text-bajo-primary mt-auto">
                  <span>Akses Layanan</span>
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4-4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}