import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Demografi - Desa Bajo Bahari",
  description: "Data kependudukan, statistik, dan demografi warga Desa Bajo Bahari.",
};

// Memaksa Next.js mengambil data terbaru setiap kali halaman dimuat
export const dynamic = "force-dynamic";

// Interface untuk menampung JSON hasil parsing
interface UmurItem {
  label: string;
  count: number;
  percent: number;
}

interface PekerjaanItem {
  job: string;
  percent_text: string;
}

export default async function DemografiPage() {
  // 1. TARIK DATA DARI DATABASE (Server-Side)
  const { data } = await supabase
    .from("profil_desa")
    .select("total_penduduk, total_laki_laki, total_perempuan, demografi_umur, demografi_pekerjaan")
    .limit(1)
    .single();

  // 2. PARSING & PENGKONDISIAN DATA STATISTIK
  const totalPenduduk = data?.total_penduduk || 0;
  const totalLakiLaki = data?.total_laki_laki || 0;
  const totalPerempuan = data?.total_perempuan || 0;

  let demografiUmur: UmurItem[] = [];
  if (data?.demografi_umur) {
    try {
      demografiUmur = JSON.parse(data.demografi_umur);
    } catch (e) {
      demografiUmur = [];
    }
  }

  let demografiPekerjaan: PekerjaanItem[] = [];
  if (data?.demografi_pekerjaan) {
    try {
      demografiPekerjaan = JSON.parse(data.demografi_pekerjaan);
    } catch (e) {
      demografiPekerjaan = [];
    }
  }

  // Memberikan warna dinamis berulang untuk progress bar kelompok umur
  const warnaProgress = ["bg-bajo-light", "bg-bajo-primary", "bg-bajo-secondary", "bg-gray-400", "bg-teal-400"];

  return (
    <div className="bg-white min-h-screen">
      {/* Header Halaman */}
      <div className="bg-bajo-dark py-16 text-center text-white relative overflow-hidden">
        {/* Ornamen Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none z-0">
          <div className="absolute -top-12 right-12 w-72 h-72 rounded-full bg-bajo-primary blur-3xl"></div>
          <div className="absolute bottom-0 -left-12 w-64 h-64 rounded-full bg-bajo-secondary blur-3xl"></div>
        </div>

        <div className="relative z-10 px-4">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white font-semibold uppercase tracking-widest text-xs mb-4">
            Profil Desa
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Demografi Penduduk</h1>
          <p className="mt-4 text-lg text-bajo-light max-w-2xl mx-auto">
            Gambaran statistik kependudukan, mata pencaharian, dan kelompok umur di Desa Bajo Bahari.
          </p>
        </div>
      </div>

      {/* Konten Utama */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Highlight Statistik Utama */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Card Total */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center transform hover:-translate-y-1 transition-transform">
            <div className="w-16 h-16 mx-auto bg-bajo-light/30 rounded-full flex items-center justify-center mb-4 text-bajo-dark">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-gray-500 font-medium mb-1">Total Penduduk</h3>
            <p className="text-4xl font-extrabold text-bajo-dark">
              {totalPenduduk.toLocaleString("id-ID")} <span className="text-lg font-normal text-gray-400">Jiwa</span>
            </p>
          </div>

          {/* Card Laki-laki */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center transform hover:-translate-y-1 transition-transform">
            <div className="w-16 h-16 mx-auto bg-bajo-light/30 rounded-full flex items-center justify-center mb-4 text-bajo-primary">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-gray-500 font-medium mb-1">Laki-laki</h3>
            <p className="text-4xl font-extrabold text-bajo-dark">
              {totalLakiLaki.toLocaleString("id-ID")} <span className="text-lg font-normal text-gray-400">Jiwa</span>
            </p>
          </div>

          {/* Card Perempuan */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center transform hover:-translate-y-1 transition-transform">
            <div className="w-16 h-16 mx-auto bg-bajo-light/30 rounded-full flex items-center justify-center mb-4 text-bajo-secondary">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-gray-500 font-medium mb-1">Perempuan</h3>
            <p className="text-4xl font-extrabold text-bajo-dark">
              {totalPerempuan.toLocaleString("id-ID")} <span className="text-lg font-normal text-gray-400">Jiwa</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Kelompok Umur (Visualisasi Progress Bar Dinamis) */}
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <h3 className="text-2xl font-bold text-bajo-dark mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-bajo-primary text-white flex items-center justify-center text-sm">1</span>
              Distribusi Kelompok Umur
            </h3>
            
            <div className="space-y-6">
              {demografiUmur.length === 0 ? (
                <p className="text-gray-500 italic">Data distribusi umur belum tersedia.</p>
              ) : (
                demografiUmur.map((item, index) => {
                  const barColor = warnaProgress[index % warnaProgress.length]; // Rotasi warna
                  return (
                    <div key={index}>
                      <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                        <span>{item.label}</span>
                        <span>{item.count.toLocaleString("id-ID")} Jiwa ({item.percent}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className={`${barColor} h-3 rounded-full`} style={{ width: `${item.percent}%` }}></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Mata Pencaharian Dinamis */}
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <h3 className="text-2xl font-bold text-bajo-dark mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-bajo-secondary text-white flex items-center justify-center text-sm">2</span>
              Mata Pencaharian Utama
            </h3>
            
            <div className="space-y-4">
              {demografiPekerjaan.length === 0 ? (
                <p className="text-gray-500 italic">Data mata pencaharian belum tersedia.</p>
              ) : (
                demografiPekerjaan.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-bajo-primary"></div>
                      <span className="font-medium text-gray-700">{item.job}</span>
                    </div>
                    <span className="font-bold text-bajo-dark">{item.percent_text}</span>
                  </div>
                ))
              )}
            </div>
            <p className="mt-6 text-sm text-gray-500 italic">
              *Data ini merupakan agregasi umum berdasarkan pendataan kependudukan Desa Bajo Bahari.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}