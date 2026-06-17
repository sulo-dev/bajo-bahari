import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Geografi - Desa Bajo Bahari",
  description: "Letak geografis, batas wilayah, dan peta Desa Bajo Bahari.",
};

// Memaksa Next.js mengambil data terbaru setiap kali halaman dimuat oleh pengunjung
export const dynamic = "force-dynamic";

interface KarakteristikItem {
  label: string;
  deskripsi: string;
}

export default async function GeografiPage() {
  // 1. TARIK DATA GEOGRAFI DARI DATABASE SUPER FAST
  const { data } = await supabase
    .from("profil_desa")
    .select("geografi_peta_url, batas_utara, batas_selatan, batas_timur, batas_barat, karakteristik_wilayah")
    .limit(1)
    .single();

  // 2. PARSING KONTEN KARAKTERISTIK (JSON ARRAY)
  let karakteristikList: KarakteristikItem[] = [];
  if (data?.karakteristik_wilayah) {
    try {
      karakteristikList = JSON.parse(data.karakteristik_wilayah);
    } catch (e) {
      karakteristikList = [];
    }
  }

  // Fallback standar jika admin belum mengisi karakteristik wilayah
  if (karakteristikList.length === 0) {
    karakteristikList = [
      { label: "Topografi", deskripsi: "Sebagian besar merupakan dataran rendah pesisir laut dengan ketinggian rata-rata 0 - 5 meter di atas permukaan laut." },
      { label: "Iklim", deskripsi: "Tropis dengan curah hujan sedang, sangat dipengaruhi oleh angin laut dan musim pesisir." },
      { label: "Luas Wilayah", deskripsi: "Kurang lebih sekitar 150 Hektar yang mencakup area pemukiman, tambak, dan hutan bakau." }
    ];
  }

  // Pengkondisian link iframe Google Maps (mengamankan jika admin memasukkan full tag iframe atau hanya URL)
  let mapSrc = data?.geografi_peta_url || "";
  if (mapSrc.includes('src="')) {
    const match = mapSrc.match(/src="([^"]+)"/);
    if (match && match[1]) {
      mapSrc = match[1];
    }
  }
  // Jika masih kosong, berikan koordinat peta pesisir bawaan sebagai cadangan aman
  if (!mapSrc) {
    mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.650952955519!2d122.5855!3d-5.5411!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMzInMjguMCJTIDEyMsKwMzUnMDcuOCJF!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid";
  }

  // Struktur susunan batas wilayah
  const batasWilayah = [
    { arah: "Utara", batas: data?.batas_utara || "Perairan / Laut Lepas" },
    { arah: "Selatan", batas: data?.batas_selatan || "Wilayah Daratan / Desa Tetangga" },
    { arah: "Timur", batas: data?.batas_timur || "Kawasan Pesisir Pantai" },
    { arah: "Barat", batas: data?.batas_barat || "Semenanjung Teluk" },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header Halaman */}
      <div className="bg-bajo-dark py-16 text-center text-white relative overflow-hidden">
        {/* Ornamen Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none z-0">
          <div className="absolute top-12 left-12 w-64 h-64 rounded-full bg-bajo-light blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-bajo-primary blur-3xl"></div>
        </div>

        <div className="relative z-10 px-4">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white font-semibold uppercase tracking-widest text-xs mb-4">
            Profil Desa
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Geografi Wilayah</h1>
          <p className="mt-4 text-lg text-bajo-light max-w-2xl mx-auto">
            Informasi letak geografis, batas wilayah, dan peta interaktif Desa Bajo Bahari.
          </p>
        </div>
      </div>

      {/* Konten Utama */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Kolom Kiri: Peta Wilayah */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-1 rounded-full bg-bajo-light/30 text-bajo-dark font-bold uppercase tracking-widest text-sm mb-2">
              Peta Desa
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Letak Titik Koordinat</h2>
            <p className="text-gray-600 leading-relaxed">
              Desa Bajo Bahari terletak di wilayah pesisir yang strategis. Anda dapat menjelajahi area desa, fasilitas publik, dan akses jalan melalui peta interaktif di bawah ini.
            </p>
            
            {/* Wadah Peta */}
            <div className="w-full h-96 rounded-2xl overflow-hidden shadow-lg border-4 border-gray-50 relative group">
              <iframe 
                src={mapSrc}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 z-10 bg-gray-200"
                title="Peta Lokasi Desa Bajo Bahari"
              ></iframe>
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-0">
                <span className="text-gray-400 font-medium">Memuat Peta...</span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Informasi Batas & Karakteristik */}
          <div className="space-y-10 lg:pl-8 lg:mt-16 w-full">
            
            {/* Batas Wilayah */}
            <div>
              <h3 className="text-2xl font-bold text-bajo-dark mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-bajo-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                Batas Wilayah
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {batasWilayah.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                    <span className="block text-sm font-semibold text-bajo-primary mb-1 uppercase tracking-wider">{item.arah}</span>
                    <span className="text-gray-800 font-bold text-sm leading-snug">{item.batas}</span>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Karakteristik Wilayah */}
            <div>
              <h3 className="text-2xl font-bold text-bajo-dark mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-bajo-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Karakteristik Wilayah
              </h3>
              <ul className="space-y-4">
                {karakteristikList.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-bajo-secondary mr-3"></div>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      <strong className="text-gray-900 font-extrabold uppercase tracking-wide text-xs block mb-0.5">{item.label}:</strong> 
                      {item.deskripsi}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}