import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Visi & Misi - Desa Bajo Bahari",
  description: "Visi dan Misi arah pembangunan Pemerintahan Desa Bajo Bahari.",
};

// Memaksa Next.js untuk selalu mengambil data terbaru dari database
export const dynamic = 'force-dynamic';

export default async function VisiMisiPage() {
  // 1. TARIK DATA LANGSUNG DARI SERVER (Tanpa useEffect!)
  const { data } = await supabase
    .from("profil_desa")
    .select("visi, misi")
    .limit(1)
    .single();

  // 2. OLAH DATA
  const visi = data?.visi || "Visi desa sedang dalam tahap penyusunan.";
  let misiList: string[] = [];
  
  if (data?.misi) {
    try {
      // Karena misi disimpan sebagai array JSON string di admin
      misiList = JSON.parse(data.misi);
    } catch (e) {
      misiList = [];
    }
  }

  // Jika admin belum mengisi misi sama sekali
  if (misiList.length === 0) {
    misiList = ["Misi desa sedang dalam tahap penyusunan."];
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header Halaman */}
      <div className="bg-bajo-dark py-16 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none z-0">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-bajo-primary blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-bajo-secondary blur-3xl"></div>
        </div>

        <div className="relative z-10 px-4">
          <div className="inline-block px-4 py-1 rounded-full bg-bajo-light/20 text-bajo-light font-bold uppercase tracking-widest text-xs mb-4 border border-bajo-light/30">
            Profil Desa
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Visi & Misi</h1>
          <p className="mt-4 text-lg text-bajo-light max-w-2xl mx-auto">
            Arah dan tujuan pembangunan Pemerintahan Desa Bajo Bahari.
          </p>
        </div>
      </div>

      {/* Konten Utama */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        {/* Section Visi */}
        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 md:p-14 text-center mb-16 shadow-sm relative overflow-hidden group hover:border-bajo-primary/30 transition-colors">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-bajo-primary rounded-b-full"></div>
          <h2 className="text-sm font-extrabold text-bajo-primary uppercase tracking-widest mb-6">
            Visi Utama
          </h2>
          <p className="text-2xl md:text-4xl font-bold text-gray-900 leading-snug md:leading-relaxed">
            {visi}
          </p>
        </div>

        {/* Section Misi */}
        <div className="bg-white">
          <div className="text-center mb-12">
            <h2 className="text-sm font-extrabold text-bajo-secondary uppercase tracking-widest mb-3">
              Langkah Nyata
            </h2>
            <h3 className="text-3xl font-bold text-gray-900">Misi Desa</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {misiList.map((misi, index) => (
              <div 
                key={index} 
                className="flex items-start gap-5 p-6 md:p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 w-14 h-14 bg-bajo-primary/10 text-bajo-primary font-extrabold text-2xl rounded-2xl flex items-center justify-center border border-bajo-primary/20">
                  {index + 1}
                </div>
                <div>
                  <p className="text-gray-700 text-lg leading-relaxed pt-1 font-medium">
                    {misi}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}