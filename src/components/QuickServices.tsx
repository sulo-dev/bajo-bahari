import Link from "next/link";

export default function QuickServices() {
  const services = [
    {
      title: "Pengurusan Surat",
      description: "Layanan mandiri untuk administrasi persuratan warga desa.",
      href: "/layanan/surat",
      icon: (
        <svg className="w-8 h-8 text-bajo-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: "Transparansi Dana",
      description: "Akses terbuka informasi APBDes dan laporan pertanggungjawaban.",
      href: "/transparansi/apbdes",
      icon: (
        <svg className="w-8 h-8 text-bajo-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: "Suara Warga",
      description: "Sampaikan aspirasi, kritik, dan saran untuk kemajuan desa.",
      href: "/layanan/aspirasi",
      icon: (
        <svg className="w-8 h-8 text-bajo-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
    {
      title: "Potensi & UMKM",
      description: "Jelajahi produk unggulan dan potensi pariwisata Bajo Bahari.",
      href: "/potensi/umkm",
      icon: (
        <svg className="w-8 h-8 text-bajo-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-bajo-dark">Layanan & Informasi Utama</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Akses cepat ke berbagai layanan administrasi dan informasi penting Desa Bajo Bahari.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Link href={service.href} key={index} className="group">
              <div className="h-full bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                <div className="w-16 h-16 bg-bajo-light/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-bajo-primary/10 transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-bajo-dark mb-3 group-hover:text-bajo-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}