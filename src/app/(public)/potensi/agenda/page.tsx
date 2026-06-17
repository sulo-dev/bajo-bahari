import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Agenda Desa - Desa Bajo Bahari",
  description: "Jadwal kegiatan, rapat, dan agenda Pemerintahan Desa Bajo Bahari.",
};

// Memaksa Next.js mengambil data terbaru setiap kali halaman dimuat oleh pengunjung
export const dynamic = "force-dynamic";

interface AgendaDB {
  id: number;
  judul: string;
  tanggal: string; // Format asli YYYY-MM-DD dari database
  waktu: string;
  lokasi: string;
  deskripsi: string;
  status: string;
  warna_status: string;
}

export default async function AgendaPage() {
  // 1. AMBIL DATA JADWAL AGENDA DARI DATABASE SUPABASE
  const { data: agendaData } = await supabase
    .from("agenda_desa")
    .select("id, judul, tanggal, waktu, lokasi, deskripsi, status, warna_status")
    .order("tanggal", { ascending: true }); // Diurutkan kronologis dari tanggal terdekat

  const rawAgenda: AgendaDB[] = agendaData || [];

  // 2. PROSES EKSTRAKSI FORMAT TANGGAL DAN BULAN KALENDER Visual
  const daftarAgenda = rawAgenda.map((item: AgendaDB) => {
    const dateObj = new Date(item.tanggal);
    
    // Ambil angka hari (Contoh: "20" atau "05")
    const hariAngka = dateObj.getDate().toString().padStart(2, "0");
    
    // Ambil singkatan nama bulan dalam format lokal Indonesia (Contoh: "JUN")
    const bulanTeks = dateObj.toLocaleDateString("id-ID", { month: "short" }).toUpperCase();

    return {
      id: item.id,
      judul: item.judul,
      tanggal: hariAngka,
      bulan: bulanTeks,
      waktu: item.waktu,
      lokasi: item.lokasi,
      deskripsi: item.deskripsi,
      status: item.status,
      warnaStatus: item.warna_status,
    };
  });

  const tahunAnggaran = new Date().getFullYear();

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header Halaman */}
      <div className="bg-bajo-dark py-16 text-center text-white px-4 relative overflow-hidden">
        <div className="absolute -top-12 left-1/4 w-96 h-96 bg-bajo-primary/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-bajo-secondary/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white font-semibold uppercase tracking-widest text-xs mb-4">
            Potensi & Berita
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Agenda Desa</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Jadwal kegiatan warga, rapat pemerintahan, dan acara penting lainnya di Desa Bajo Bahari.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-10">
        
        {/* Kotak Informasi / Filter Cepat */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <h2 className="text-lg font-bold text-gray-900">Daftar Kegiatan Tahun {tahunAnggaran}</h2>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">Hari Ini</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-md">Akan Datang</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-md">Selesai</span>
          </div>
        </div>

        {/* Daftar Agenda (Event List) Dinamis */}
        <div className="space-y-6">
          {daftarAgenda.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 border border-gray-200 text-center text-gray-500 font-medium shadow-sm">
              Belum ada agenda kegiatan yang dijadwalkan dalam waktu dekat.
            </div>
          ) : (
            daftarAgenda.map((agenda) => (
              <div 
                key={agenda.id} 
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col sm:flex-row animate-fadeIn"
              >
                {/* Sisi Kiri: Tanggal (Kotak Kalender Otomatis) */}
                <div className="bg-bajo-primary/5 sm:w-40 flex-shrink-0 flex flex-row sm:flex-col items-center justify-center p-6 border-b sm:border-b-0 sm:border-r border-gray-100">
                  <span className="text-sm font-bold text-bajo-primary uppercase tracking-widest sm:mb-1 mr-3 sm:mr-0">
                    {agenda.bulan}
                  </span>
                  <span className="text-4xl sm:text-5xl font-extrabold text-bajo-dark">
                    {agenda.tanggal}
                  </span>
                </div>

                {/* Sisi Rangan: Detail Agenda */}
                <div className="p-6 sm:p-8 flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight pr-4">
                      {agenda.judul}
                    </h3>
                    {/* Badge Status Dinamis dari Database */}
                    <span className={`px-3 py-1 border rounded-full text-xs font-bold whitespace-nowrap ${agenda.warnaStatus || 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                      {agenda.status}
                    </span>
                  </div>

                  {/* Info Waktu & Lokasi */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-4 text-sm font-medium text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {agenda.waktu}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {agenda.lokasi}
                    </div>
                  </div>

                  {/* Deskripsi */}
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                    {agenda.deskripsi}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Tombol Riwayat */}
        <div className="mt-10 text-center">
          <button className="px-6 py-2.5 bg-white border border-gray-300 text-gray-600 font-bold text-sm rounded-xl hover:border-bajo-primary hover:text-bajo-primary shadow-sm transition-colors">
            Lihat Agenda Bulan Sebelumnya
          </button>
        </div>

      </div>
    </div>
  );
}