export default function Demographics() {
  // Data statis sementara (nantinya bisa dihubungkan ke Supabase)
  const stats = [
    { id: 1, name: 'Total Penduduk', value: '1.250', unit: 'Jiwa' },
    { id: 2, name: 'Kepala Keluarga', value: '340', unit: 'KK' },
    { id: 3, name: 'Rukun Tetangga', value: '8', unit: 'RT' },
    { id: 4, name: 'Luas Wilayah', value: '150', unit: 'Hektar' },
  ];

  return (
    <section className="py-16 bg-bajo-dark text-white relative overflow-hidden">
      {/* Elemen Dekorasi Latar Belakang */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-bajo-light blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-bajo-primary blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-bajo-light">Statistik Desa</h2>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
            Gambaran ringkas demografi dan wilayah administrasi Desa Bajo Bahari.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 text-center">
          {stats.map((stat) => (
            <div 
              key={stat.id} 
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300"
            >
              <dt className="text-sm md:text-base font-medium text-gray-300 mb-2">
                {stat.name}
              </dt>
              <dd className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                {stat.value}
                <span className="block mt-1 text-sm md:text-lg font-medium text-bajo-light">
                  {stat.unit}
                </span>
              </dd>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}