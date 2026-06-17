"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// ==========================================
// 1. TIPE DATA (INTERFACES)
// ==========================================
interface UmkmItem {
  id?: number;
  nama_produk: string;
  pemilik: string;
  kategori: string;
  harga: string;
  deskripsi: string;
  gambar_url: string;
  no_whatsapp: string;
}

export default function UmkmAdminPage() {
  const [umkmList, setUmkmList] = useState<UmkmItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pesan, setPesan] = useState({ type: "", text: "" });
  const [showForm, setShowForm] = useState(false);

  // Form State Default
  const [formData, setFormData] = useState<UmkmItem>({
    nama_produk: "",
    pemilik: "",
    kategori: "Makanan Laut",
    harga: "",
    deskripsi: "",
    gambar_url: "",
    no_whatsapp: "",
  });

  // State File Gambar
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const pilihanKategori = [
    "Makanan Laut",
    "Kerajinan Tangan",
    "Bahan Pokok",
    "Jasa Wisata",
    "Makanan Ringan",
    "Pakaian & Kain",
    "Pertanian & Perkebunan",
    "Lainnya",
  ];

  // ==========================================
  // 2. FETCH DATA UMKM
  // ==========================================
  useEffect(() => {
    const fetchUmkm = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("umkm")
          .select("*")
          .order("id", { ascending: false });

        if (error) throw error;
        if (data) setUmkmList(data);
      } catch (error) {
        console.error(error);
        setPesan({ type: "error", text: "Gagal memuat katalog UMKM." });
      }
      setIsLoading(false);
    };

    fetchUmkm();
  }, []);

  // ==========================================
  // 3. HANDLERS FORM
  // ==========================================
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
    setFormData({
      nama_produk: "",
      pemilik: "",
      kategori: "Makanan Laut",
      harga: "",
      deskripsi: "",
      gambar_url: "",
      no_whatsapp: "",
    });
    setImageFile(null);
    setPreviewUrl("");
  };

  const editUmkm = (item: UmkmItem) => {
    setFormData(item);
    setImageFile(null);
    setPreviewUrl(item.gambar_url || "");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ==========================================
  // 4. PENYIMPANAN DATA (UPLOAD & SAVE)
  // ==========================================
  const saveUmkm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setPesan({ type: "", text: "" });

    try {
      let finalGambarUrl = formData.gambar_url;

      // Upload gambar jika ada file baru yang dipilih
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `umkm-${Date.now()}.${fileExt}`;
        const filePath = `umkm/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("media-desa")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("media-desa")
          .getPublicUrl(filePath);

        finalGambarUrl = urlData.publicUrl;
      }

      const payload = {
        nama_produk: formData.nama_produk,
        pemilik: formData.pemilik,
        kategori: formData.kategori,
        harga: formData.harga,
        deskripsi: formData.deskripsi,
        gambar_url: finalGambarUrl,
        no_whatsapp: formData.no_whatsapp,
      };

      if (formData.id) {
        // PROSES UPDATE
        const { error } = await supabase.from("umkm").update(payload).eq("id", formData.id);
        if (error) throw error;

        setUmkmList(prev => prev.map(u => (u.id === formData.id ? { ...payload, id: formData.id } : u)));
        setPesan({ type: "success", text: "Produk UMKM berhasil diperbarui!" });
      } else {
        // PROSES INSERT
        const { data, error } = await supabase.from("umkm").insert([payload]).select().single();
        if (error) throw error;

        if (data) setUmkmList(prev => [data, ...prev]);
        setPesan({ type: "success", text: "Produk UMKM baru berhasil ditambahkan!" });
      }

      setIsSaving(false);
      resetForm();
      setTimeout(() => setPesan({ type: "", text: "" }), 3000);
    } catch (error) {
      setIsSaving(false);
      const errMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan data.";
      setPesan({ type: "error", text: errMessage });
    }
  };

  const deleteUmkm = async (id?: number) => {
    if (!id || !window.confirm("Yakin ingin menghapus produk ini dari katalog?")) return;

    try {
      const { error } = await supabase.from("umkm").delete().eq("id", id);
      if (error) throw error;

      setUmkmList(prev => prev.filter(u => u.id !== id));
      setPesan({ type: "success", text: "Produk berhasil dihapus." });
      setTimeout(() => setPesan({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error(error);
      setPesan({ type: "error", text: "Gagal menghapus produk." });
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
        <h1 className="text-3xl font-extrabold text-gray-900">Katalog Produk UMKM</h1>
        <p className="text-gray-500 mt-1">
          Kelola etalase produk unggulan, kerajinan lokal, dan jasa dari warga desa.
        </p>
      </div>

      {pesan.text && (
        <div
          className={`p-4 mb-6 rounded-xl font-medium border ${
            pesan.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {pesan.text}
        </div>
      )}

      {showForm ? (
        <form onSubmit={saveUmkm} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 w-full animate-fadeIn">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {formData.id ? "Edit Detail Produk" : "Tambah Produk UMKM Baru"}
            </h2>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-red-500 font-medium">✖ Batal</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Produk / Jasa</label>
                <input type="text" name="nama_produk" value={formData.nama_produk} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary font-bold text-gray-900" placeholder="Cth: Ikan Asin Tenggiri" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Pemilik / Toko</label>
                  <input type="text" name="pemilik" value={formData.pemilik} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary" placeholder="Cth: Ibu Fatimah" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
                  <select name="kategori" value={formData.kategori} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary bg-white">
                    {pilihanKategori.map(kat => <option key={kat} value={kat}>{kat}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Harga</label>
                  <input type="text" name="harga" value={formData.harga} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary text-bajo-primary font-bold" placeholder="Cth: Rp 65.000 / kg" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">No. WhatsApp Penjual</label>
                  <input type="text" name="no_whatsapp" value={formData.no_whatsapp} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary font-mono text-sm" placeholder="628123..." />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Produk</label>
                <textarea name="deskripsi" value={formData.deskripsi} onChange={handleInputChange} rows={3} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary resize-none" placeholder="Jelaskan keunggulan produk ini..." />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Foto Produk Asli (Opsional namun disarankan)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-2xl hover:border-bajo-primary transition-colors bg-gray-50 h-full max-h-[320px]">
                <div className="space-y-1 text-center my-auto">
                  {previewUrl ? (
                    <div className="relative mx-auto w-full max-w-[200px] h-40 mb-4 rounded-xl overflow-hidden shadow-sm border bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewUrl} alt="Produk" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => { setImageFile(null); setPreviewUrl(""); setFormData(prev => ({ ...prev, gambar_url: "" })); }} className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity font-bold text-xs">Hapus</button>
                    </div>
                  ) : (
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label className="relative cursor-pointer bg-white rounded-md font-bold text-bajo-primary hover:text-bajo-dark outline-none">
                      <span>{previewUrl ? "Ganti Foto" : "Pilih Foto Produk"}</span>
                      <input type="file" accept="image/*" className="sr-only" onChange={handleImageSelect} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 max-w-[200px] mx-auto">Upload foto asli agar produk terlihat lebih profesional.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button type="submit" disabled={isSaving} className={`px-8 py-3.5 rounded-xl font-bold text-white transition-all shadow-md ${isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-bajo-primary hover:bg-bajo-dark shadow-bajo-primary/30"}`}>
              {isSaving ? "Menyimpan Katalog..." : "💾 Simpan Produk UMKM"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden w-full">
          <div className="p-5 md:p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">Daftar Produk Terdaftar</h2>
            <button onClick={() => setShowForm(true)} className="px-5 py-2.5 bg-bajo-primary text-white font-bold rounded-xl hover:bg-bajo-dark shadow-md shadow-bajo-primary/30 transition-all whitespace-nowrap">
              + Tambah Produk UMKM
            </button>
          </div>

          <div className="block w-full overflow-x-auto">
            <table className="w-full min-w-[900px] text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest border-b border-gray-200">
                  <th className="p-4 font-bold w-20 text-center">Foto</th>
                  <th className="p-4 font-bold w-64">Nama Produk & Kategori</th>
                  <th className="p-4 font-bold">Pemilik & Kontak</th>
                  <th className="p-4 font-bold w-32">Harga</th>
                  <th className="p-4 font-bold text-center w-36">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {umkmList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-gray-400 font-medium">Belum ada data produk UMKM yang ditambahkan.</td>
                  </tr>
                ) : (
                  umkmList.map(item => (
                    <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-4">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                          {item.gambar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.gambar_url} alt={item.nama_produk} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">🛍️</div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-extrabold text-gray-900 line-clamp-1">{item.nama_produk}</p>
                        <span className="inline-block mt-1 bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-gray-800">{item.pemilik}</p>
                        <a href={`https://wa.me/${item.no_whatsapp}`} target="_blank" rel="noreferrer" className="text-xs text-green-600 font-bold hover:underline">
                          WA: {item.no_whatsapp}
                        </a>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-bajo-primary whitespace-nowrap">{item.harga}</p>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => editUmkm(item)} className="text-blue-600 hover:text-white border border-blue-200 hover:bg-blue-500 px-3 py-1.5 rounded-lg text-sm font-bold transition-all">Edit</button>
                          <button onClick={() => deleteUmkm(item.id)} className="text-red-500 hover:text-white border border-red-200 hover:bg-red-500 px-3 py-1.5 rounded-lg text-sm font-bold transition-all">Hapus</button>
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