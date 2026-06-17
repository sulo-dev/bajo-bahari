"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// ==========================================
// 1. TIPE DATA (INTERFACES)
// ==========================================
interface ArtikelItem {
  id?: number;
  judul: string;
  slug: string;
  kategori: string;
  ringkasan: string;
  konten: string;
  gambar_url: string;
  is_headline: boolean;
  created_at?: string;
}

export default function ArtikelAdminPage() {
  const [artikelList, setArtikelList] = useState<ArtikelItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pesan, setPesan] = useState({ type: "", text: "" });
  const [showForm, setShowForm] = useState(false);

  // Form State Default
  const [formData, setFormData] = useState<ArtikelItem>({
    judul: "",
    slug: "",
    kategori: "Kegiatan Warga",
    ringkasan: "",
    konten: "",
    gambar_url: "",
    is_headline: false,
  });

  // State File Gambar
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // ==========================================
  // 2. FETCH DATA ARTIKEL
  // ==========================================
  useEffect(() => {
    const fetchArtikel = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("artikel")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) setArtikelList(data);
      } catch (error) {
        console.error(error);
        setPesan({ type: "error", text: "Gagal memuat daftar artikel." });
      }
      setIsLoading(false);
    };

    fetchArtikel();
  }, []);

  // ==========================================
  // 3. HANDLERS FORM & OTOMATISASI SLUG
  // ==========================================
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const updatedData = { ...prev, [name]: value };
      
      // Otomatis buat slug jika admin sedang mengetik judul
      if (name === "judul") {
        updatedData.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "") // Hapus karakter aneh
          .replace(/\s+/g, "-")         // Ganti spasi dengan strip
          .replace(/-+/g, "-")          // Bersihkan strip ganda
          .trim();
      }
      return updatedData;
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, is_headline: e.target.checked }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setShowForm(false);
    setFormData({ judul: "", slug: "", kategori: "Kegiatan Warga", ringkasan: "", konten: "", gambar_url: "", is_headline: false });
    setImageFile(null);
    setPreviewUrl("");
  };

  const editArtikel = (item: ArtikelItem) => {
    setFormData(item);
    setImageFile(null);
    setPreviewUrl(item.gambar_url || "");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ==========================================
  // 4. PROSES SIMPAN (INSERT / UPDATE)
  // ==========================================
  const saveArtikel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setPesan({ type: "", text: "" });

    try {
      let finalGambarUrl = formData.gambar_url;

      // Proses upload gambar jika admin memilih file baru
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `artikel-${Date.now()}.${fileExt}`;
        const filePath = `artikel/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("media-desa")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("media-desa")
          .getPublicUrl(filePath);

        finalGambarUrl = urlData.publicUrl;
      }

      const payload = { ...formData, gambar_url: finalGambarUrl };

      if (formData.id) {
        // UPDATE DATA
        const { id, ...dataToUpdate } = payload;
        const { error } = await supabase.from("artikel").update(dataToUpdate).eq("id", id);
        if (error) throw error;

        setArtikelList(prev => prev.map(a => (a.id === id ? { ...dataToUpdate, id } : a)));
        setPesan({ type: "success", text: "Artikel sukses diperbarui!" });
      } else {
        // INSERT DATA BARU
        const { id, ...dataToInsert } = payload; // eslint-disable-line @typescript-eslint/no-unused-vars
        const { data, error } = await supabase.from("artikel").insert([dataToInsert]).select().single();
        if (error) throw error;

        if (data) setArtikelList(prev => [data, ...prev]);
        setPesan({ type: "success", text: "Artikel baru berhasil diterbitkan!" });
      }

      setIsSaving(false);
      resetForm();
      setTimeout(() => setPesan({ type: "", text: "" }), 3000);
    } catch (error) {
      setIsSaving(false);
      const errMessage = error instanceof Error ? error.message : "Terjadi kendala saat menyimpan artikel.";
      setPesan({ type: "error", text: errMessage });
    }
  };

  const deleteArtikel = async (id?: number) => {
    if (!id || !window.confirm("Apakah Anda yakin ingin menghapus artikel ini?")) return;

    try {
      const { error } = await supabase.from("artikel").delete().eq("id", id);
      if (error) throw error;

      setArtikelList(prev => prev.filter(a => a.id !== id));
      setPesan({ type: "success", text: "Artikel berhasil dihapus." });
      setTimeout(() => setPesan({ type: "", text: "" }), 3000);
    } catch (error) {
      setPesan({ type: "error", text: "Gagal menghapus data artikel." });
    }
  };

  // Helper format tanggal di tabel
  const formatTanggal = (isoString?: string) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(d);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-bajo-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 w-full">
      <div className="mb-8 border-b pb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Pusat Artikel & Berita Desa</h1>
        <p className="text-gray-500 mt-1">Publikasikan informasi kegiatan desa, edukasi, maupun kebijakan pemdes.</p>
      </div>

      {pesan.text && (
        <div className={`p-4 mb-6 rounded-xl font-medium border ${pesan.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
          {pesan.text}
        </div>
      )}

      {showForm ? (
        <form onSubmit={saveArtikel} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 w-full animate-fadeIn">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-bold text-gray-900">{formData.id ? "Modifikasi Artikel" : "Tulis Artikel Baru"}</h2>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-red-500 font-medium">✖ Kembali</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Kolom Kiri & Tengah: Input Teks Artikel */}
            <div className="lg:col-span-2 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Judul Artikel / Berita</label>
                <input type="text" name="judul" value={formData.judul} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary text-gray-900 font-semibold" placeholder="Cth: Kerja Bakti Rutin Membersihkan Pesisir Pantai" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 font-mono">Tautan URL Otomatis (Slug)</label>
                <input type="text" name="slug" value={formData.slug} readOnly className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-mono text-xs outline-none cursor-not-allowed" placeholder="otomatis-terisi-berdasarkan-judul" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Ringkasan Berita (Muncul di Halaman Depan)</label>
                <textarea name="ringkasan" value={formData.ringkasan} onChange={handleInputChange} rows={3} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary text-sm" placeholder="Tulis maksimal 2 kalimat ringkasan pendek menarik..." />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Isi Lengkap Artikel Konten</label>
                <textarea name="konten" value={formData.konten} onChange={handleInputChange} rows={12} required className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary text-sm leading-relaxed" placeholder="Tuliskan berita lengkap di sini secara mendalam..." />
              </div>
            </div>

            {/* Kolom Kanan: Pengaturan Kategori & Cover Gambar */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Kategori Berita</label>
                <select name="kategori" value={formData.kategori} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary font-medium bg-white">
                  <option value="Kegiatan Warga">Kegiatan Warga</option>
                  <option value="Pemerintahan">Pemerintahan</option>
                  <option value="Pemberdayaan">Pemberdayaan</option>
                  <option value="Pendidikan">Pendidikan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              {/* Checkbox Headline */}
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <input type="checkbox" id="is_headline" checked={formData.is_headline} onChange={handleCheckboxChange} className="w-5 h-5 text-bajo-primary border-gray-300 rounded focus:ring-bajo-primary" />
                <label htmlFor="is_headline" className="text-sm text-gray-700 font-bold cursor-pointer select-none">
                  Jadikan Berita Utama (Headline) ⭐
                </label>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Gambar Sampul (Cover)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-2xl hover:border-bajo-primary transition-colors bg-gray-50">
                  <div className="space-y-1 text-center">
                    {previewUrl ? (
                      <div className="relative mx-auto w-full max-w-[240px] h-36 mb-4 rounded-xl overflow-hidden shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={previewUrl} alt="Preview Sampul" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => { setImageFile(null); setPreviewUrl(""); setFormData(prev => ({ ...prev, gambar_url: "" })); }} className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity font-bold text-xs">Hapus Gambar</button>
                      </div>
                    ) : (
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    )}
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label className="relative cursor-pointer bg-white rounded-md font-bold text-bajo-primary hover:text-bajo-dark outline-none">
                        <span>{previewUrl ? "Ganti Gambar" : "Pilih File Gambar"}</span>
                        <input type="file" accept="image/*" className="sr-only" onChange={handleImageSelect} />
                      </label>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Mendukung format JPG, PNG, WEBP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button type="submit" disabled={isSaving} className={`px-10 py-3.5 rounded-xl font-bold text-white transition-all shadow-md ${isSaving ? "bg-gray-400" : "bg-bajo-primary hover:bg-bajo-dark shadow-bajo-primary/30"}`}>
              {isSaving ? "Menerbitkan Artikel..." : "🚀 Terbitkan Artikel Sekarang"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden w-full">
          <div className="p-5 md:p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">Arsip Berita Terbit</h2>
            <button onClick={() => setShowForm(true)} className="px-5 py-2.5 bg-bajo-primary text-white font-bold rounded-xl hover:bg-bajo-dark shadow-md shadow-bajo-primary/30 transition-all whitespace-nowrap">
              + Tulis Artikel Baru
            </button>
          </div>

          <div className="block w-full overflow-x-auto">
            <table className="w-full min-w-[850px] text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest border-b border-gray-200">
                  <th className="p-4 font-bold w-36">Tanggal Terbit</th>
                  <th className="p-4 font-bold w-24 text-center">Sampul</th>
                  <th className="p-4 font-bold">Judul Berita / Artikel</th>
                  <th className="p-4 font-bold w-40">Kategori</th>
                  <th className="p-4 font-bold text-center w-36">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {artikelList.length === 0 ? (
                  <tr><td colSpan={5} className="p-10 text-center text-gray-400 font-medium">Belum ada dokumen berita yang diterbitkan.</td></tr>
                ) : (
                  artikelList.map(item => (
                    <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-4 text-sm text-gray-500 whitespace-nowrap">{formatTanggal(item.created_at)}</td>
                      <td className="p-4">
                        <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                          {item.gambar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.gambar_url} alt="Cover" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">🖼️</div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <p className="font-extrabold text-gray-900 line-clamp-1 max-w-sm">{item.judul}</p>
                          {item.is_headline && (
                            <span className="bg-yellow-100 text-yellow-800 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase border border-yellow-200 whitespace-nowrap">Berita Utama ⭐</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 font-mono mt-0.5 max-w-sm truncate">Slug: {item.slug}</p>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="bg-blue-50 text-bajo-primary border border-blue-100 px-2.5 py-1 rounded-md text-xs font-bold uppercase">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => editArtikel(item)} className="text-blue-600 hover:text-white border border-blue-200 hover:bg-blue-500 px-3 py-1.5 rounded-lg text-sm font-bold transition-all">Edit</button>
                          <button onClick={() => deleteArtikel(item.id)} className="text-red-500 hover:text-white border border-red-200 hover:bg-red-500 px-3 py-1.5 rounded-lg text-sm font-bold transition-all">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}