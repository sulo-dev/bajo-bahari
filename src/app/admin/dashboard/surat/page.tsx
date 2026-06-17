"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// ==========================================
// 1. TIPE DATA (INTERFACES)
// ==========================================
interface SuratItem {
  id?: number;
  nama_surat: string;
  deskripsi: string;
  syarat: string[];
  icon: string;
}

export default function LayananSuratPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pesan, setPesan] = useState({ type: "", text: "" });

  const [suratList, setSuratList] = useState<SuratItem[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Form Default
  const [formData, setFormData] = useState<SuratItem>({
    nama_surat: "",
    deskripsi: "",
    icon: "📄",
    syarat: [""],
  });

  // ==========================================
  // 2. FETCH DATA DARI SUPABASE
  // ==========================================
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('layanan_surat')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;

        if (data) {
          // Parsing JSONB syarat kembali menjadi Array string
          const parsedList = data.map(item => {
            let parsedSyarat: string[] = [];
            if (item.syarat) {
              parsedSyarat = typeof item.syarat === 'string' ? JSON.parse(item.syarat) : item.syarat;
            }
            return {
              id: item.id,
              nama_surat: item.nama_surat,
              deskripsi: item.deskripsi || "",
              icon: item.icon || "📄",
              syarat: Array.isArray(parsedSyarat) && parsedSyarat.length > 0 ? parsedSyarat : [""],
            };
          });
          setSuratList(parsedList);
        }
      } catch (error) {
        console.error(error);
        setPesan({ type: "error", text: "Gagal memuat data dari database." });
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // ==========================================
  // 3. HANDLERS FORM & SYARAT DINAMIS
  // ==========================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateSyarat = (index: number, value: string) => {
    setFormData(prev => {
      const newSyarat = [...prev.syarat];
      newSyarat[index] = value;
      return { ...prev, syarat: newSyarat };
    });
  };

  const addSyarat = () => {
    setFormData(prev => ({ ...prev, syarat: [...prev.syarat, ""] }));
  };

  const removeSyarat = (index: number) => {
    setFormData(prev => ({ ...prev, syarat: prev.syarat.filter((_, i) => i !== index) }));
  };

  const resetForm = () => {
    setShowForm(false);
    setFormData({ nama_surat: "", deskripsi: "", icon: "📄", syarat: [""] });
  };

  const editSurat = (item: SuratItem) => {
    setFormData(item);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ==========================================
  // 4. PENYIMPANAN & PENGHAPUSAN
  // ==========================================
  const saveSurat = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setPesan({ type: "", text: "" });

    try {
      // Bersihkan syarat yang kosong, lalu jadikan JSON string
      const cleanedSyarat = formData.syarat.filter(s => s.trim() !== "");
      
      const payload = {
        nama_surat: formData.nama_surat,
        deskripsi: formData.deskripsi,
        icon: formData.icon,
        syarat: JSON.stringify(cleanedSyarat.length > 0 ? cleanedSyarat : ["Fotokopi KTP"]),
      };

      if (formData.id) {
        // UPDATE
        const { error } = await supabase.from('layanan_surat').update(payload).eq('id', formData.id);
        if (error) throw error;
        
        setSuratList(prev => prev.map(s => s.id === formData.id ? { ...payload, id: formData.id, syarat: cleanedSyarat } : s));
        setPesan({ type: "success", text: "Layanan surat berhasil diperbarui!" });
      } else {
        // INSERT
        const { data, error } = await supabase.from('layanan_surat').insert([payload]).select().single();
        if (error) throw error;
        
        if (data) {
          setSuratList(prev => [...prev, { ...payload, id: data.id, syarat: cleanedSyarat }]);
        }
        setPesan({ type: "success", text: "Layanan surat baru berhasil ditambahkan!" });
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

  const deleteSurat = async (id?: number) => {
    if (!id || !window.confirm("Yakin ingin menghapus jenis layanan surat ini?")) return;

    try {
      const { error } = await supabase.from('layanan_surat').delete().eq('id', id);
      if (error) throw error;
      
      setSuratList(prev => prev.filter(s => s.id !== id));
      setPesan({ type: "success", text: "Layanan surat berhasil dihapus!" });
      setTimeout(() => setPesan({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error(error);
      setPesan({ type: "error", text: "Gagal menghapus layanan surat." });
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
        <h1 className="text-3xl font-extrabold text-gray-900">Manajemen Layanan Surat</h1>
        <p className="text-gray-500 mt-1">Atur jenis dokumen dan persyaratan yang harus disiapkan oleh warga.</p>
      </div>

      {pesan.text && (
        <div className={`p-4 mb-6 rounded-xl font-medium border ${pesan.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
          {pesan.text}
        </div>
      )}

      {showForm ? (
        <form onSubmit={saveSurat} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 w-full animate-fadeIn">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-bold text-gray-900">{formData.id ? "Edit Layanan Surat" : "Tambah Layanan Surat"}</h2>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-red-500 font-medium">✖ Batal</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Surat / Layanan</label>
                <input type="text" name="nama_surat" value={formData.nama_surat} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary" placeholder="Cth: Surat Keterangan Usaha (SKU)" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Kegunaan</label>
                <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows={3} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary" placeholder="Kegunaan surat ini untuk..." />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Ikon / Emoji (Sebagai visual)</label>
                <input type="text" name="icon" value={formData.icon} onChange={handleChange} maxLength={5} className="w-24 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary text-2xl text-center" placeholder="📄" />
                <p className="text-xs text-gray-500 mt-2">Gunakan Emoji (Tekan Win + . di Windows atau Cmd + Ctrl + Space di Mac)</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Persyaratan Dokumen (Bisa ditambahkan)</label>
              <div className="space-y-3">
                {formData.syarat.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center group">
                    <span className="text-bajo-secondary font-bold">•</span>
                    <input type="text" value={item} onChange={(e) => updateSyarat(index, e.target.value)} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary text-sm" placeholder="Cth: Fotokopi KTP dan KK" />
                    {formData.syarat.length > 1 && (
                      <button type="button" onClick={() => removeSyarat(index)} className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">✖</button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={addSyarat} className="mt-4 px-4 py-2 text-sm font-bold text-bajo-primary bg-bajo-primary/10 hover:bg-bajo-primary hover:text-white rounded-lg transition-colors">+ Tambah Persyaratan</button>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button type="submit" disabled={isSaving} className={`px-8 py-3.5 rounded-xl font-bold text-white transition-all shadow-md ${isSaving ? "bg-gray-400" : "bg-bajo-primary hover:bg-bajo-dark shadow-bajo-primary/30 hover:-translate-y-0.5"}`}>
              {isSaving ? "Menyimpan..." : "Simpan Layanan Surat"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden w-full">
          <div className="p-5 md:p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">Daftar Layanan Tersedia</h2>
            <button onClick={() => setShowForm(true)} className="px-5 py-2.5 bg-bajo-primary text-white font-bold rounded-xl hover:bg-bajo-dark shadow-md shadow-bajo-primary/30 transition-all whitespace-nowrap">
              + Tambah Layanan Baru
            </button>
          </div>
          
          <div className="block w-full overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest border-b border-gray-200">
                  <th className="p-4 font-bold text-center w-16">Ikon</th>
                  <th className="p-4 font-bold">Nama Surat & Deskripsi</th>
                  <th className="p-4 font-bold">Syarat Wajib</th>
                  <th className="p-4 font-bold text-center w-40">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {suratList.length === 0 ? (
                  <tr><td colSpan={4} className="p-10 text-center text-gray-400 font-medium">Belum ada layanan surat yang terdaftar.</td></tr>
                ) : (
                  suratList.map(item => (
                    <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-4 text-center text-3xl">{item.icon}</td>
                      <td className="p-4">
                        <p className="font-bold text-gray-900 whitespace-nowrap">{item.nama_surat}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{item.deskripsi}</p>
                      </td>
                      <td className="p-4">
                        <ul className="text-sm text-gray-600 list-disc list-inside">
                          {item.syarat.slice(0, 2).map((syarat, idx) => (
                            <li key={idx} className="whitespace-nowrap truncate max-w-[200px]">{syarat}</li>
                          ))}
                          {item.syarat.length > 2 && <li className="text-bajo-primary font-medium italic">+{item.syarat.length - 2} syarat lainnya</li>}
                        </ul>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => editSurat(item)} className="text-blue-600 hover:text-white border border-blue-200 hover:bg-blue-500 px-3 py-1.5 rounded-lg text-sm font-bold transition-all">Edit</button>
                          <button onClick={() => deleteSurat(item.id)} className="text-red-500 hover:text-white border border-red-200 hover:bg-red-500 px-3 py-1.5 rounded-lg text-sm font-bold transition-all">Hapus</button>
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