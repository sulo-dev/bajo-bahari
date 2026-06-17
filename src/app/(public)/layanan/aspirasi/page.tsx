"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AspirasiPage() {
  // State untuk form aspirasi
  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    is_anonim: false,
    kategori: "infrastruktur",
    pesan: ""
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notif, setNotif] = useState({ type: "", message: "" });

  // Handler Input Text & Checkbox
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handler Pemilihan File Gambar
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    // Validasi ukuran (Maksimal 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setNotif({ type: "error", message: "Ukuran file terlalu besar. Maksimal 2MB." });
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setNotif({ type: "", message: "" });
  };

  // Eksekusi Pengiriman ke Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotif({ type: "", message: "" });

    try {
      let finalFotoUrl = null;

      // 1. Upload Foto Bukti jika ada
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `aspirasi-${Date.now()}.${fileExt}`;
        const filePath = `aspirasi/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("media-desa")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("media-desa")
          .getPublicUrl(filePath);

        finalFotoUrl = urlData.publicUrl;
      }

      // 2. Simpan Data Teks ke tabel `aspirasi`
      const payload = {
        nama_pengirim: formData.is_anonim ? "Anonim" : formData.nama,
        nik: formData.is_anonim ? "Dirahasiakan" : formData.nik,
        kategori: formData.kategori,
        pesan: formData.pesan,
        foto_bukti_url: finalFotoUrl,
        is_anonim: formData.is_anonim,
        status: "Menunggu" // Status default
      };

      const { error } = await supabase.from("aspirasi").insert([payload]);
      if (error) throw error;

      // Jika Berhasil
      setNotif({ type: "success", message: "Aspirasi Anda berhasil dikirim dan akan segera ditinjau oleh Pemerintah Desa." });
      
      // Reset Form
      setFormData({ nama: "", nik: "", is_anonim: false, kategori: "infrastruktur", pesan: "" });
      setImageFile(null);
      setPreviewUrl("");
      
      // Hilangkan notifikasi sukses setelah 5 detik
      setTimeout(() => setNotif({ type: "", message: "" }), 5000);

    } catch (error) {
      setNotif({ type: "error", message: "Gagal mengirim aspirasi. Silakan periksa koneksi Anda dan coba lagi." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header Halaman */}
      <div className="bg-bajo-dark py-16 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none z-0">
          <div className="absolute -top-12 left-1/4 w-80 h-80 rounded-full bg-bajo-primary blur-3xl"></div>
          <div className="absolute bottom-0 right-12 w-64 h-64 rounded-full bg-bajo-secondary blur-3xl"></div>
        </div>

        <div className="relative z-10 px-4">
          <div className="inline-block px-4 py-1 rounded-full bg-bajo-light/20 text-bajo-light font-bold uppercase tracking-widest text-xs mb-4 border border-bajo-light/30">
            Layanan Publik
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Kotak Aspirasi Warga</h1>
          <p className="mt-4 text-lg text-bajo-light max-w-2xl mx-auto">
            Suara Anda adalah kunci kemajuan desa. Sampaikan saran, kritik, maupun laporan masalah di lingkungan Anda.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Kolom Kiri: Aturan & Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Mari Bersama Membangun Desa</h2>
              <p className="text-gray-600 leading-relaxed">
                Pemerintah Desa Bajo Bahari sangat terbuka terhadap segala bentuk masukan dari masyarakat. Kami berkomitmen untuk menindaklanjuti setiap aspirasi yang masuk secara profesional.
              </p>
            </div>

            <div className="bg-bajo-light/20 p-6 rounded-2xl border border-bajo-light/50">
              <h3 className="font-bold text-bajo-dark flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-bajo-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Panduan Menyampaikan Aspirasi
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-bajo-primary font-bold text-xs shadow-sm">1</div>
                  <p className="text-sm text-gray-700">Gunakan bahasa yang sopan, jelas, dan mudah dipahami.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-bajo-primary font-bold text-xs shadow-sm">2</div>
                  <p className="text-sm text-gray-700">Sertakan foto bukti lokasi atau kejadian jika menyampaikan keluhan infrastruktur.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-bajo-primary font-bold text-xs shadow-sm">3</div>
                  <p className="text-sm text-gray-700">Hindari unsur SARA (Suku, Agama, Ras, dan Antargolongan) serta penyebaran hoaks.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-bajo-primary font-bold text-xs shadow-sm">4</div>
                  <p className="text-sm text-gray-700">Centang kotak &quot;Sembunyikan identitas saya&quot; jika ingin mengirim secara Anonim.</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Kolom Kanan: Form Aspirasi */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-xl relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-bajo-primary opacity-5 rounded-bl-full pointer-events-none"></div>

              <h3 className="text-2xl font-bold text-bajo-dark mb-6">Formulir Aspirasi Online</h3>
              
              {/* Notifikasi Pop-up */}
              {notif.message && (
                <div className={`mb-6 p-4 rounded-xl font-bold text-sm ${notif.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {notif.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                
                {/* Checkbox Anonim (Dipindah ke atas agar logika input nama terlihat jelas) */}
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <input 
                    type="checkbox" 
                    id="is_anonim"
                    name="is_anonim"
                    checked={formData.is_anonim}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-bajo-primary border-gray-300 rounded focus:ring-bajo-primary"
                  />
                  <label htmlFor="is_anonim" className="text-sm text-gray-700 font-bold cursor-pointer select-none">
                    Kirim pesan ini sebagai Anonim (Identitas Dirahasiakan)
                  </label>
                </div>

                {/* Input Identitas (Hanya muncul jika TIDAK anonim) */}
                {!formData.is_anonim && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                      <input 
                        type="text" 
                        name="nama"
                        value={formData.nama}
                        onChange={handleInputChange}
                        required={!formData.is_anonim}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bajo-primary focus:border-bajo-primary outline-none transition-colors"
                        placeholder="Masukkan nama Anda"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Nomor Induk Kependudukan (NIK)</label>
                      <input 
                        type="text" 
                        name="nik"
                        value={formData.nik}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bajo-primary focus:border-bajo-primary outline-none transition-colors"
                        placeholder="Opsional, untuk verifikasi"
                      />
                    </div>
                  </div>
                )}

                {/* Kategori Aspirasi */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Kategori Aspirasi / Laporan</label>
                  <select 
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bajo-primary focus:border-bajo-primary outline-none transition-colors bg-white font-medium"
                  >
                    <option value="Infrastruktur & Pembangunan">Infrastruktur & Pembangunan</option>
                    <option value="Pelayanan Publik">Pelayanan Publik (Surat/Adminduk)</option>
                    <option value="Kebersihan & Lingkungan">Kebersihan & Lingkungan</option>
                    <option value="Bantuan Sosial & Kesehatan">Bantuan Sosial & Kesehatan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                {/* Isi Aspirasi */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Isi Pesan / Aspirasi</label>
                  <textarea 
                    name="pesan"
                    value={formData.pesan}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bajo-primary focus:border-bajo-primary outline-none transition-colors resize-none"
                    placeholder="Ceritakan dengan jelas keluhan, saran, atau aspirasi Anda di sini..."
                  ></textarea>
                </div>

                {/* Lampiran Foto dengan Pratinjau */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Lampiran Foto Bukti (Opsional)</label>
                  <div className="flex items-center justify-center w-full">
                    {previewUrl ? (
                      <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-sm border-2 border-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={previewUrl} alt="Preview Bukti" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => { setImageFile(null); setPreviewUrl(""); }}
                          className="absolute inset-0 bg-black/50 text-white font-bold flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                        >
                          Hapus & Ganti Foto
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                          </svg>
                          <p className="mb-1 text-sm text-gray-500"><span className="font-semibold">Klik untuk memilih foto</span> dari perangkat</p>
                          <p className="text-xs text-gray-400">Format: PNG, JPG (Maks. 2MB)</p>
                        </div>
                        <input type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handleImageSelect} />
                      </label>
                    )}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 shadow-md ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-bajo-dark hover:bg-bajo-primary hover:-translate-y-1'}`}
                >
                  {isSubmitting ? "Mengirim Laporan..." : "Kirim Aspirasi Sekarang"}
                  {!isSubmitting && (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}