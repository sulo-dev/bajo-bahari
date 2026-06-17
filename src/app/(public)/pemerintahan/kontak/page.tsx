"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// ==========================================
// 1. TIPE DATA (INTERFACES)
// ==========================================
interface JamOperasional {
  senin_kamis: string;
  jumat: string;
  sabtu_minggu: string;
}

interface KontakData {
  alamat: string;
  email: string;
  no_whatsapp: string;
  jam_operasional: JamOperasional;
}

export default function KontakPage() {
  const [kontak, setKontak] = useState<KontakData>({
    alamat: "Memuat alamat...",
    email: "Memuat email...",
    no_whatsapp: "Memuat nomor...",
    jam_operasional: { senin_kamis: "-", jumat: "-", sabtu_minggu: "-" }
  });

  // State untuk Formulir Aspirasi / Pesan
  const [formData, setFormData] = useState({
    nama: "",
    kontakInfo: "", // Akan disimpan di kolom 'nik' pada tabel aspirasi sebagai info kontak
    kategori: "Informasi Umum",
    pesan: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notif, setNotif] = useState({ type: "", message: "" });

  // ==========================================
  // 2. FETCH DATA KONTAK DARI DATABASE
  // ==========================================
  useEffect(() => {
    const fetchKontak = async () => {
      try {
        const { data, error } = await supabase
          .from("kontak_desa")
          .select("*")
          .limit(1)
          .single();

        if (error && error.code !== "PGRST116") throw error;

        if (data) {
          let parsedJam = { senin_kamis: "-", jumat: "-", sabtu_minggu: "-" };
          if (data.jam_operasional) {
            parsedJam = typeof data.jam_operasional === "string" 
              ? JSON.parse(data.jam_operasional) 
              : data.jam_operasional;
          }

          setKontak({
            alamat: data.alamat || "Alamat belum diatur",
            email: data.email || "Email belum diatur",
            no_whatsapp: data.no_whatsapp || "Nomor belum diatur",
            jam_operasional: parsedJam
          });
        }
      } catch (error) {
        console.error("Gagal memuat kontak:", error);
      }
    };

    fetchKontak();
  }, []);

  // ==========================================
  // 3. HANDLER FORMULIR PESAN
  // ==========================================
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotif({ type: "", message: "" });

    try {
      // Kita simpan ke tabel 'aspirasi' yang sudah dibuat sebelumnya
      const payload = {
        nama_pengirim: formData.nama,
        nik: formData.kontakInfo, // Menyimpan Email/WA di kolom NIK agar admin bisa membalas
        kategori: formData.kategori,
        pesan: formData.pesan,
        is_anonim: false,
        status: "Menunggu"
      };

      const { error } = await supabase.from("aspirasi").insert([payload]);
      if (error) throw error;

      setNotif({ type: "success", message: "Pesan Anda berhasil dikirim! Admin kami akan segera meninjaunya." });
      setFormData({ nama: "", kontakInfo: "", kategori: "Informasi Umum", pesan: "" });
      
      setTimeout(() => setNotif({ type: "", message: "" }), 5000);
    } catch (error) {
      setNotif({ type: "error", message: "Terjadi kesalahan. Gagal mengirim pesan." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Halaman */}
      <div className="bg-bajo-dark py-16 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none z-0">
          <div className="absolute -bottom-12 right-12 w-64 h-64 rounded-full bg-bajo-primary blur-3xl"></div>
          <div className="absolute top-12 left-1/4 w-72 h-72 rounded-full bg-bajo-light blur-3xl"></div>
        </div>

        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Hubungi Kami</h1>
          <p className="mt-4 text-lg text-bajo-light max-w-2xl mx-auto">
            Kami siap melayani Anda. Silakan hubungi kami melalui kontak di bawah ini atau kirimkan pesan langsung.
          </p>
        </div>
      </div>

      {/* Konten Utama */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Kolom Kiri: Informasi Kontak & Jam Operasional (Dinamis dari Database) */}
          <div>
            <div className="inline-block px-4 py-1 rounded-full bg-bajo-light/30 text-bajo-dark font-bold uppercase tracking-widest text-sm mb-6">
              Informasi Kontak
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Pusat Layanan Desa</h2>
            
            <div className="space-y-8 animate-fadeIn">
              {/* Alamat */}
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 mt-1">
                  <svg className="w-6 h-6 text-bajo-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-bold text-bajo-dark">Alamat Kantor</h3>
                  <p className="mt-2 text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {kontak.alamat}
                  </p>
                </div>
              </div>

              {/* Email & Telepon */}
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 mt-1">
                  <svg className="w-6 h-6 text-bajo-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-bold text-bajo-dark">Kontak Digital</h3>
                  <p className="mt-2 text-gray-600 font-medium">{kontak.email}</p>
                  <p className="mt-1 text-bajo-primary font-bold">{kontak.no_whatsapp}</p>
                </div>
              </div>

              {/* Jam Operasional */}
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 mt-1">
                  <svg className="w-6 h-6 text-bajo-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-full">
                  <h3 className="text-lg font-bold text-bajo-dark">Jam Operasional</h3>
                  <div className="mt-2 space-y-2">
                    <div className="text-gray-600 flex justify-between max-w-xs border-b border-gray-100 pb-1">
                      <span>Senin - Kamis:</span> <span className="font-bold text-gray-900">{kontak.jam_operasional.senin_kamis}</span>
                    </div>
                    <div className="text-gray-600 flex justify-between max-w-xs border-b border-gray-100 pb-1">
                      <span>Jumat:</span> <span className="font-bold text-bajo-primary">{kontak.jam_operasional.jumat}</span>
                    </div>
                    <div className="text-gray-400 flex justify-between max-w-xs pb-1 italic">
                      <span>Sabtu - Minggu:</span> <span className="font-medium text-red-400">{kontak.jam_operasional.sabtu_minggu}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Form Pesan (Bisa dikirim langsung ke database) */}
          <div className="bg-gray-50 p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm relative">
            <h3 className="text-2xl font-bold text-bajo-dark mb-6">Kirim Pesan / Aspirasi</h3>
            
            {notif.message && (
              <div className={`mb-6 p-4 rounded-xl font-bold text-sm ${notif.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {notif.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                <input 
                  type="text" 
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bajo-primary focus:border-bajo-primary outline-none transition-colors bg-white"
                  placeholder="Masukkan nama Anda"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email atau No. WhatsApp</label>
                <input 
                  type="text" 
                  name="kontakInfo"
                  value={formData.kontakInfo}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bajo-primary focus:border-bajo-primary outline-none transition-colors bg-white"
                  placeholder="Agar kami bisa membalas pesan Anda"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subjek / Keperluan</label>
                <select 
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bajo-primary focus:border-bajo-primary outline-none transition-colors bg-white font-medium"
                >
                  <option value="Informasi Umum">Informasi Umum</option>
                  <option value="Layanan Persuratan">Layanan Persuratan</option>
                  <option value="Kritik & Saran">Kritik & Saran</option>
                  <option value="Pengaduan Warga">Pengaduan Warga</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Pesan Anda</label>
                <textarea 
                  name="pesan"
                  value={formData.pesan}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bajo-primary focus:border-bajo-primary outline-none transition-colors resize-none bg-white"
                  placeholder="Tuliskan pesan, pertanyaan, atau saran Anda di sini..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 shadow-md ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-bajo-primary hover:bg-bajo-dark hover:-translate-y-1'}`}
              >
                {isSubmitting ? "Mengirim Pesan..." : "Kirim Pesan Sekarang"}
                {!isSubmitting && (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}