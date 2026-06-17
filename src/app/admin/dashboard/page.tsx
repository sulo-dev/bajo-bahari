export const metadata = {
  title: "Dashboard Admin - Desa Bajo Bahari",
};

export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      {/* Header Dashboard */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Selamat Datang, Admin!</h1>
        <p className="text-gray-600 mt-2">
          Ini adalah pusat kendali sistem informasi Desa Bajo Bahari.
        </p>
      </div>

      {/* Grid Statistik Singkat */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl">
              📰
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase">Total Artikel</p>
              <h3 className="text-2xl font-extrabold text-gray-900">24</h3>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-2xl">
              📅
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase">Agenda Aktif</p>
              <h3 className="text-2xl font-extrabold text-gray-900">5</h3>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-2xl">
              🏪
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase">Produk UMKM</p>
              <h3 className="text-2xl font-extrabold text-gray-900">18</h3>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-2xl">
              📬
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase">Aspirasi Baru</p>
              <h3 className="text-2xl font-extrabold text-gray-900">3</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Area Kosong untuk konten selanjutnya */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Sistem Database Siap Disambungkan</h3>
        <p className="text-gray-500">
          Gunakan menu di sebelah kiri untuk mulai mengelola konten website Desa Bajo Bahari.
        </p>
      </div>
    </div>
  );
}