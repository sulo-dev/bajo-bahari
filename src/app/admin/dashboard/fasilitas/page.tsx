"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// ==========================================
// 1. TIPE DATA (INTERFACES)
// ==========================================
interface FasilitasItem {
  id?: number;
  nama: string;
  kategori: string;
  deskripsi: string;
  icon: string;
  warna_bg: string;
  warna_teks: string;
}

export default function FasilitasAdminPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pesan, setPesan] = useState({ type: "", text: "" });

  const [fasilitasList, setFasilitasList] = useState<FasilitasItem[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Form Default
  const [formData, setFormData] = useState<FasilitasItem>({
    nama: "",
    kategori: "",
    deskripsi: "",
    icon: "🏛️",
    warna_bg: "bg-blue-100",
    warna_teks: "text-blue-600",
  });

  // Tema warna yang aman untuk Tailwind CSS
  const pilihanWarna = [
    { label: "Biru", bg: "bg-blue-100", teks: "text-blue-600" },
    { label: "Hijau", bg: "bg-green-100", teks: "text-green-600" },
    { label: "Nila / Indigo", bg: "bg-indigo-100", teks: "text-indigo-600" },
    { label: "Cyan / Tosca", bg: "bg-cyan-100", teks: "text-cyan-600" },
    { label: "Oranye", bg: "bg-orange-100", teks: "text-orange-600" },
    { label: "Teal", bg: "bg-teal-100", teks: "text-teal-600" },
    { label: "Merah", bg: "bg-red-100", teks: "text-red-600" },
    { label: "Ungu", bg: "bg-purple-100", teks: "text-purple-600" },
    { label: "Bajo Primary", bg: "bg-bajo-primary/20", teks: "text-bajo-primary" },
  ];

  // ==========================================
  // 2. FETCH DATA DARI SUPABASE
  // ==========================================
  useEffect(() => {
    const fetchFasilitas = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('fasilitas_publik')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        if (data) setFasilitasList(data);
      } catch (error) {
        console.error(error);
        setPesan({ type: "error", text: "Gagal memuat data dari database." });
      }
      setIsLoading(false);
    };

    fetchFasilitas();
  }, []);

  // ==========================================
  // 3. HANDLERS FORM
  // ==========================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const setWarna = (bg: string, teks: string) => {
    setFormData(prev => ({ ...prev, warna_bg: bg, warna_teks: teks }));
  };

  const resetForm = () => {
    setShowForm(false);
    setFormData({
      nama: "", kategori: "", deskripsi: "", icon: "🏛️", warna_bg: "bg-blue-100", warna_teks: "text-blue-600"
    });
  };

  const editFasilitas = (item: FasilitasItem) => {
    setFormData(item);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ==========================================
  // 4. PENYIMPANAN & PENGHAPUSAN
  // ==========================================
  const saveFasilitas = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setPesan({ type: "", text: "" });

    try {
      const payload = {
        nama: formData.nama,
        kategori: formData.kategori,
        deskripsi: formData.deskripsi,
        icon: formData.icon,
        warna_bg: formData.warna_bg,
        warna_teks: formData.warna_teks,
      };

      if (formData.id) {
        // UPDATE
        const { error } = await supabase.from('fasilitas_publik').update(payload).eq('id', formData.id);
        if (error) throw error;
        
        setFasilitasList(prev => prev.map(f => f.id === formData.id ? { ...payload, id: formData.id } : f));
        setPesan({ type: "success", text: "Fasilitas berhasil diperbarui!" });
      } else {
        // INSERT
        const { data, error } = await supabase.from('fasilitas_publik').insert([payload]).select().single();
        if (error) throw error;
        
        if (data) setFasilitasList(prev => [...prev, data]);
        setPesan({ type: "success", text: "Fasilitas baru berhasil ditambahkan!" });
      }

      setIsSaving(false);
      resetForm();
      setTimeout(() => setPesan({ type: "", text: "" }), 3000);
    } catch (error) {
      setIsSaving(false);
      const errMessage = error instanceof Error ? error.message : "Gagal menyimpan data.";
      setPesan({ type: "error", text: errMessage });
    }
  };

  const deleteFasilitas = async (id?: number) => {
    if (!id || !window.confirm("Yakin ingin menghapus fasilitas ini?")) return;

    try {
      const { error } = await supabase.from('fasilitas_publik').delete().eq('id', id);
      if (error) throw error;
      
      setFasilitasList(prev => prev.filter(f => f.id !== id));
      setPesan({ type: "success", text: "Fasilitas berhasil dihapus!" });
      setTimeout(() => setPesan({ type: "", text: "" }), 3000);
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "Gagal menghapus fasilitas.";
      setPesan({ type: "error", text: errMessage });
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
        <h1 className="text-3xl font-extrabold text-gray-900">Manajemen Fasilitas Desa</h1>
        <p className="text-gray-500 mt-1">Kelola data infrastruktur dan fasilitas publik yang tersedia untuk warga.</p>
      </div>

      {pesan.text && (
        <div className={`p-4 mb-6 rounded-xl font-medium border ${pesan.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
          {pesan.text}
        </div>
      )}

      {showForm ? (
        <form onSubmit={saveFasilitas} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 w-full animate-fadeIn">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-bold text-gray-900">{formData.id ? "Edit Fasilitas Publik" : "Tambah Fasilitas Baru"}</h2>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-red-500 font-medium">✖ Batal</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Fasilitas</label>
                <input type="text" name="nama" value={formData.nama} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary" placeholder="Cth: Balai Pertemuan Desa" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
                <input type="text" name="kategori" value={formData.kategori} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary" placeholder="Cth: Pemerintahan, Kesehatan..." />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Ikon / Emoji</label>
                <div className="flex gap-4 items-center">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 ${formData.warna_bg} ${formData.warna_teks}`}>
                    {formData.icon || "🏛️"}
                  </div>
                  <input type="text" name="icon" value={formData.icon} onChange={handleChange} maxLength={5} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary text-xl" placeholder="Masukkan 1 Emoji (Contoh: 🏛️)" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Singkat</label>
                <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows={4} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary resize-none" placeholder="Tuliskan deskripsi fungsi dan kegunaan fasilitas ini..." />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Pilih Tema Warna (Ikon)</label>
                <div className="flex flex-wrap gap-3">
                  {pilihanWarna.map((warna, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setWarna(warna.bg, warna.teks)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                        formData.warna_bg === warna.bg 
                          ? `border-bajo-dark shadow-md ${warna.bg} ${warna.teks}` 
                          : `border-gray-200 bg-white text-gray-600 hover:border-gray-400`
                      }`}
                    >
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${warna.bg}`}></span>
                      {warna.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button type="submit" disabled={isSaving} className={`px-8 py-3.5 rounded-xl font-bold text-white transition-all shadow-md ${isSaving ? "bg-gray-400" : "bg-bajo-primary hover:bg-bajo-dark shadow-bajo-primary/30 hover:-translate-y-0.5"}`}>
              {isSaving ? "Menyimpan..." : "Simpan Fasilitas"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden w-full">
          <div className="p-5 md:p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">Daftar Fasilitas Publik</h2>
            <button onClick={() => setShowForm(true)} className="px-5 py-2.5 bg-bajo-primary text-white font-bold rounded-xl hover:bg-bajo-dark shadow-md shadow-bajo-primary/30 transition-all whitespace-nowrap">
              + Tambah Fasilitas
            </button>
          </div>
          
          <div className="block w-full overflow-x-auto">
            <table className="w-full min-w-[800px] text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest border-b border-gray-200">
                  <th className="p-4 font-bold text-center w-20">Ikon</th>
                  <th className="p-4 font-bold w-64">Nama & Kategori</th>
                  <th className="p-4 font-bold">Deskripsi Singkat</th>
                  <th className="p-4 font-bold text-center w-40">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {fasilitasList.length === 0 ? (
                  <tr><td colSpan={4} className="p-10 text-center text-gray-400 font-medium">Belum ada data fasilitas yang terdaftar.</td></tr>
                ) : (
                  fasilitasList.map(item => (
                    <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-4">
                        <div className={`mx-auto w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-white ${item.warna_bg} ${item.warna_teks}`}>
                          {item.icon}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-gray-900 whitespace-nowrap">{item.nama}</p>
                        <span className="inline-block mt-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-600 line-clamp-2 max-w-sm">{item.deskripsi}</p>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => editFasilitas(item)} className="text-blue-600 hover:text-white border border-blue-200 hover:bg-blue-500 px-3 py-1.5 rounded-lg text-sm font-bold transition-all">Edit</button>
                          <button onClick={() => deleteFasilitas(item.id)} className="text-red-500 hover:text-white border border-red-200 hover:bg-red-500 px-3 py-1.5 rounded-lg text-sm font-bold transition-all">Hapus</button>
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