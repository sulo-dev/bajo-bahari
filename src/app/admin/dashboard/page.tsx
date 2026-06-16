export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Selamat Datang, Admin!</h1>
        <p className="mt-2 text-gray-600">
          Ini adalah pusat kendali untuk mengelola konten website Desa Bajo Bahari.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Statistik Cepat */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-bajo-primary">
          <h3 className="text-sm font-medium text-gray-500">Total Berita</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-bajo-secondary">
          <h3 className="text-sm font-medium text-gray-500">Layanan Aktif</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">5</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-bajo-light">
          <h3 className="text-sm font-medium text-gray-500">Pesan Aspirasi</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
        </div>
      </div>
    </div>
  );
}