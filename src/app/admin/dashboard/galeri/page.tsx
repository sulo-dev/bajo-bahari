"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// ==========================================
// 1. TIPE DATA (INTERFACES)
// ==========================================
interface GaleriItem {
  id?: number;
  judul: string;
  kategori: string;
  gambar_url: string;
  created_at?: string;
}

export default function GaleriAdminPage() {
  const [galeriList, setGaleriList] = useState<GaleriItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pesan, setPesan] = useState({ type: "", text: "" });
  const [showForm, setShowForm] = useState(false);

  // Form State Default
  const [formData, setFormData] = useState<GaleriItem>({
    judul: "",
    kategori: "Pemandangan",
    gambar_url: "",
  });

  // State File Gambar
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Pilihan Kategori sesuai layout Guest
  const pilihanKategori = [
    "Pemandangan",
    "Aktivitas Warga",
    "Wisata Bahari",
    "Seni & Budaya",
    "Infrastruktur",
    "Sosial",
    "Ekonomi",
  ];

  // ==========================================
  // 2. FETCH DATA GALERI
  // ==========================================
  useEffect(() => {
    const fetchGaleri = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("galeri")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) setGaleriList(data);
      } catch (error) {
        console.error(error);
        setPesan({ type: "error", text: "Gagal memuat arsip foto galeri." });
      }
      setIsLoading(false);
    };

    fetchGaleri();
  }, []);

  // ==========================================
  // 3. HANDLERS FORM
  // ==========================================
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setShowForm(false);
    setFormData({ judul: "", kategori: "Pemandangan", gambar_url: "" });
    setImageFile(null);
    setPreviewUrl("");
  };

  const editGaleri = (item: GaleriItem) => {
    setFormData(item);
    setImageFile(null);
    setPreviewUrl(item.gambar_url);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ==========================================
  // 4. PENYIMPANAN DATA (UPLOAD & SAVE)
  // ==========================================
  const saveGaleri = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setPesan({ type: "", text: "" });

    try {
      let finalGambarUrl = formData.gambar_url;

      // Jalankan upload file jika ada berkas gambar baru yang dipilih
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `galeri-${Date.now()}.${fileExt}`;
        const filePath = `galeri/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("media-desa")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("media-desa")
          .getPublicUrl(filePath);

        finalGambarUrl = urlData.publicUrl;
      }

      // Validasi agar tidak menyimpan string kosong ke kolom gambar_url
      if (!finalGambarUrl) {
        throw new Error("Wajib memilih berkas foto untuk diunggah.");
      }

      const payload = {
        judul: formData.judul,
        kategori: formData.kategori,
        gambar_url: finalGambarUrl,
      };

      if (formData.id) {
        // PROSES UPDATE (Perbaikan ada di sini, langsung gunakan payload)
        const { error } = await supabase.from("galeri").update(payload).eq("id", formData.id);
        if (error) throw error;

        setGaleriList(prev => prev.map(g => (g.id === formData.id ? { ...payload, id: formData.id } : g)));
        setPesan({ type: "success", text: "Foto galeri sukses diperbarui!" });
      } else {
        // PROSES INSERT BARU
        const { data, error } = await supabase.from("galeri").insert([payload]).select().single();
        if (error) throw error;

        if (data) setGaleriList(prev => [data, ...prev]);
        setPesan({ type: "success", text: "Foto dokumentasi baru berhasil diterbitkan!" });
      }

      setIsSaving(false);
      resetForm();
      setTimeout(() => setPesan({ type: "", text: "" }), 3000);
    } catch (error) {
      setIsSaving(false);
      const errMessage = error instanceof Error ? error.message : "Terjadi kendala saat menyimpan foto.";
      setPesan({ type: "error", text: errMessage });
    }
  };

  const deleteGaleri = async (id?: number) => {
    if (!id || !window.confirm("Apakah Anda yakin ingin menghapus foto ini dari galeri publik?")) return;

    try {
      const { error } = await supabase.from("galeri").delete().eq("id", id);
      if (error) throw error;

      setGaleriList(prev => prev.filter(g => g.id !== id));
      setPesan({ type: "success", text: "Foto berhasil dihapus dari arsip." });
      setTimeout(() => setPesan({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error(error);
      setPesan({ type: "error", text: "Gagal menghapus data foto." });
    }
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
        <h1 className="text-3xl font-extrabold text-gray-900">Manajemen Galeri Desa</h1>
        <p className="text-gray-500 mt-1">
          Kelola arsip dokumentasi visual keindahan alam, kegiatan masyarakat, dan potensi kemaritiman desa.
        </p>
      </div>

      {pesan.text && (
        <div
          className={`p-4 mb-6 rounded-xl font-medium border ${
            pesan.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {pesan.text}
        </div>
      )}

      {showForm ? (
        <form
          onSubmit={saveGaleri}
          className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 w-full animate-fadeIn"
        >
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {formData.id ? "Edit Detail Foto" : "Unggah Foto Dokumentasi Baru"}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="text-gray-400 hover:text-red-500 font-medium"
            >
              ✖ Tutup Form
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Sisi Kiri: Data Informasi */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Judul / Keterangan Foto</label>
                <input
                  type="text"
                  name="judul"
                  value={formData.judul}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary font-medium text-gray-900"
                  placeholder="Cth: Senja di Dermaga Utama"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Kelompok Kategori</label>
                <select
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary bg-white font-medium text-gray-800"
                >
                  {pilihanKategori.map(kat => (
                    <option key={kat} value={kat}>
                      {kat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sisi Kanan: Unggah Berkas Gambar */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Berkas Gambar</label>
              <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-2xl hover:border-bajo-primary transition-colors bg-gray-50">
                <div className="space-y-1 text-center">
                  {previewUrl ? (
                    <div className="relative mx-auto w-full max-w-[280px] h-40 mb-4 rounded-xl overflow-hidden shadow-sm border bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewUrl} alt="Pratinjau Galeri" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setPreviewUrl("");
                          setFormData(prev => ({ ...prev, gambar_url: "" }));
                        }}
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity font-bold text-xs"
                      >
                        Hapus & Ganti
                      </button>
                    </div>
                  ) : (
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label className="relative cursor-pointer bg-white rounded-md font-bold text-bajo-primary hover:text-bajo-dark outline-none">
                      <span>{previewUrl ? "Ganti Berkas" : "Pilih Berkas Foto"}</span>
                      <input type="file" accept="image/*" className="sr-only" onChange={handleImageSelect} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Format gambar: PNG, JPG, JPEG, WEBP</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSaving}
              className={`px-8 py-3.5 rounded-xl font-bold text-white transition-all shadow-md ${
                isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-bajo-primary hover:bg-bajo-dark shadow-bajo-primary/30"
              }`}
          >
            {isSaving ? "Mengunggah Berkas Visual..." : "💾 Simpan ke Galeri Publik"}
          </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden w-full">
          <div className="p-5 md:p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">Koleksi Album Terbit</h2>
            <button
              onClick={() => setShowForm(true)}
              className="px-5 py-2.5 bg-bajo-primary text-white font-bold rounded-xl hover:bg-bajo-dark shadow-md shadow-bajo-primary/30 transition-all whitespace-nowrap"
            >
              + Unggah Foto Baru
            </button>
          </div>

          <div className="block w-full overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest border-b border-gray-200">
                  <th className="p-4 font-bold w-32 text-center">Pratinjau</th>
                  <th className="p-4 font-bold">Judul Keterangan</th>
                  <th className="p-4 font-bold w-48">Kategori Kelompok</th>
                  <th className="p-4 font-bold text-center w-36">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {galeriList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-gray-400 font-medium">
                      Belum ada koleksi foto yang diunggah ke dalam galeri.
                    </td>
                  </tr>
                ) : (
                  galeriList.map(item => (
                    <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-4">
                        <div className="mx-auto w-20 h-14 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.gambar_url} alt={item.judul} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4 font-extrabold text-gray-900 whitespace-nowrap">
                        {item.judul}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="bg-gray-100 text-gray-700 border border-gray-200 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => editGaleri(item)}
                            className="text-blue-600 hover:text-white border border-blue-200 hover:bg-blue-500 px-3 py-1.5 rounded-lg text-sm font-bold transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteGaleri(item.id)}
                            className="text-red-500 hover:text-white border border-red-200 hover:bg-red-500 px-3 py-1.5 rounded-lg text-sm font-bold transition-all"
                          >
                            Hapus
                          </button>
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