"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// ==========================================
// 1. TIPE DATA (INTERFACES)
// ==========================================
interface DokumenItem {
  id?: number;
  judul: string;
  jenis: string;
  tahun: number;
  file_url: string;
}

interface CabangItem {
  nama: string;
  anggaran: number;
  realisasi: number;
}

interface AspekItem {
  aspek: string;
  cabang: CabangItem[];
}

interface KegiatanItem {
  id?: number;
  tahun: number;
  kegiatan: string;
  bidang: string;
  biaya: number;
  status: string;
  foto_url: string;
}

export default function TransparansiPage() {
  const [activeTab, setActiveTab] = useState("dokumen");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pesan, setPesan] = useState({ type: "", text: "" });

  // --- State Tab 1: Dokumen PDF ---
  const [dokumenList, setDokumenList] = useState<DokumenItem[]>([]);
  const [showFormDokumen, setShowFormDokumen] = useState(false);
  const [dokumenForm, setDokumenForm] = useState<DokumenItem>({ judul: "", jenis: "APBDes", tahun: new Date().getFullYear(), file_url: "" });
  const [fileDokumen, setFileDokumen] = useState<File | null>(null);

  // --- State Tab 2: APBDes & Realisasi (Hierarki Dinamis) ---
  const [selectedTahunApbdes, setSelectedTahunApbdes] = useState<number>(new Date().getFullYear());
  const [apbdesData, setApbdesData] = useState<AspekItem[]>([]);

  // --- State Tab 3: Bukti Kegiatan LPJ ---
  const [kegiatanList, setKegiatanList] = useState<KegiatanItem[]>([]);
  const [showFormKegiatan, setShowFormKegiatan] = useState(false);
  const [kegiatanForm, setKegiatanForm] = useState<KegiatanItem>({ tahun: new Date().getFullYear(), kegiatan: "", bidang: "Pembangunan Desa", biaya: 0, status: "Selesai 100%", foto_url: "" });
  const [fileFotoKegiatan, setFileFotoKegiatan] = useState<File | null>(null);
  const [previewKegiatan, setPreviewKegiatan] = useState<string>("");

  // ==========================================
  // 2. FETCH DATA INITIAL
  // ==========================================
  
  // 1. DEKLARASIKAN FUNGSI INI TERLEBIH DAHULU (Di atas useEffect)
  const loadApbdesData = async (tahun: number) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('transparansi_tahunan').select('apbdes_data').eq('tahun', tahun).single();
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data && data.apbdes_data) {
        setApbdesData(JSON.parse(data.apbdes_data));
      } else {
        setApbdesData([]); // Reset jika tahun tersebut belum ada datanya
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  // 2. BARU PANGGIL FUNGSINYA DI DALAM useEffect
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const { data: dokData } = await supabase.from('transparansi_dokumen').select('*').order('tahun', { ascending: false });
        if (dokData) setDokumenList(dokData);

        const { data: kegData } = await supabase.from('pelaksanaan_kegiatan').select('*').order('tahun', { ascending: false });
        if (kegData) setKegiatanList(kegData);
        
        await loadApbdesData(new Date().getFullYear());
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };
    fetchInitialData();
  }, []); // Karena loadApbdesData dipanggil di sini, ia harus ada di atas

  // ==========================================
  // 3. HANDLERS DOKUMEN PDF (TAB 1)
  // ==========================================
  const resetFormDokumen = () => {
    setShowFormDokumen(false);
    setDokumenForm({ judul: "", jenis: "APBDes", tahun: new Date().getFullYear(), file_url: "" });
    setFileDokumen(null);
  };

  const saveDokumen = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setPesan({ type: "", text: "" });

    try {
      let finalFileUrl = dokumenForm.file_url;

      if (fileDokumen) {
        const fileExt = fileDokumen.name.split('.').pop();
        const fileName = `dokumen-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('media-desa').upload(`dokumen/${fileName}`, fileDokumen);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('media-desa').getPublicUrl(`dokumen/${fileName}`);
        finalFileUrl = publicUrlData.publicUrl;
      }

      const payload = { ...dokumenForm, file_url: finalFileUrl };

      if (dokumenForm.id) {
        const { id, ...dataToUpdate } = payload;
        const { error } = await supabase.from('transparansi_dokumen').update(dataToUpdate).eq('id', id);
        if (error) throw error;
        setDokumenList(prev => prev.map(d => d.id === id ? { ...dataToUpdate, id } : d));
      } else {
        const { id, ...dataToInsert } = payload; // eslint-disable-line @typescript-eslint/no-unused-vars
        const { data, error } = await supabase.from('transparansi_dokumen').insert([dataToInsert]).select().single();
        if (error) throw error;
        if (data) setDokumenList(prev => [data, ...prev]);
      }
      
      setIsSaving(false);
      resetFormDokumen();
      setPesan({ type: "success", text: "Dokumen PDF berhasil disimpan!" });
      setTimeout(() => setPesan({ type: "", text: "" }), 3000);
    } catch (error) {
      setIsSaving(false);
      const errMessage = error instanceof Error ? error.message : "Gagal menyimpan dokumen.";
      setPesan({ type: "error", text: errMessage });
    }
  };

  const deleteDokumen = async (id?: number) => {
    if (!id || !window.confirm("Hapus dokumen ini?")) return;
    try {
      await supabase.from('transparansi_dokumen').delete().eq('id', id);
      setDokumenList(prev => prev.filter(d => d.id !== id));
    } catch (error) { console.error(error); }
  };


  // ==========================================
  // 4. HANDLERS APBDES (TAB 2)
  // ==========================================
  // Tambah & Hapus Aspek (Cth: Pendapatan, Belanja)
  const addAspek = () => setApbdesData([...apbdesData, { aspek: "", cabang: [] }]);
  const removeAspek = (index: number) => setApbdesData(prev => prev.filter((_, i) => i !== index));
  const updateAspekName = (index: number, value: string) => {
    const newArr = [...apbdesData];
    newArr[index].aspek = value;
    setApbdesData(newArr);
  };

  // Tambah & Edit Cabang di dalam Aspek (Cth: Dana Desa)
  const addCabang = (aspekIndex: number) => {
    const newArr = [...apbdesData];
    newArr[aspekIndex].cabang.push({ nama: "", anggaran: 0, realisasi: 0 });
    setApbdesData(newArr);
  };
  const removeCabang = (aspekIndex: number, cabangIndex: number) => {
    const newArr = [...apbdesData];
    newArr[aspekIndex].cabang = newArr[aspekIndex].cabang.filter((_, i) => i !== cabangIndex);
    setApbdesData(newArr);
  };
  const updateCabang = <K extends keyof CabangItem>(aspekIndex: number, cabangIndex: number, field: K, value: CabangItem[K]) => {
    const newArr = [...apbdesData];
    newArr[aspekIndex].cabang[cabangIndex][field] = value;
    setApbdesData(newArr);
  };

  const saveApbdesData = async () => {
    setIsSaving(true);
    setPesan({ type: "", text: "" });
    try {
      const { data: existing } = await supabase.from('transparansi_tahunan').select('id').eq('tahun', selectedTahunApbdes).single();
      
      if (existing) {
        await supabase.from('transparansi_tahunan').update({ apbdes_data: JSON.stringify(apbdesData), updated_at: new Date() }).eq('id', existing.id);
      } else {
        await supabase.from('transparansi_tahunan').insert([{ tahun: selectedTahunApbdes, apbdes_data: JSON.stringify(apbdesData) }]);
      }
      setIsSaving(false);
      setPesan({ type: "success", text: `Data APBDes Tahun ${selectedTahunApbdes} berhasil disimpan!` });
      setTimeout(() => setPesan({ type: "", text: "" }), 3000);
    } catch (error) {
      setIsSaving(false);
      setPesan({ type: "error", text: "Gagal menyimpan APBDes." });
    }
  };


  // ==========================================
  // 5. HANDLERS BUKTI KEGIATAN LPJ (TAB 3)
  // ==========================================
  const resetFormKegiatan = () => {
    setShowFormKegiatan(false);
    setKegiatanForm({ tahun: new Date().getFullYear(), kegiatan: "", bidang: "Pembangunan Desa", biaya: 0, status: "Selesai 100%", foto_url: "" });
    setFileFotoKegiatan(null);
    setPreviewKegiatan("");
  };

  const saveKegiatan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setPesan({ type: "", text: "" });

    try {
      let finalFotoUrl = kegiatanForm.foto_url;

      if (fileFotoKegiatan) {
        const fileExt = fileFotoKegiatan.name.split('.').pop();
        const fileName = `kegiatan-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('media-desa').upload(`kegiatan/${fileName}`, fileFotoKegiatan);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('media-desa').getPublicUrl(`kegiatan/${fileName}`);
        finalFotoUrl = publicUrlData.publicUrl;
      }

      const payload = { ...kegiatanForm, foto_url: finalFotoUrl };

      if (kegiatanForm.id) {
        const { id, ...dataToUpdate } = payload;
        const { error } = await supabase.from('pelaksanaan_kegiatan').update(dataToUpdate).eq('id', id);
        if (error) throw error;
        setKegiatanList(prev => prev.map(k => k.id === id ? { ...dataToUpdate, id } : k));
      } else {
        const { id, ...dataToInsert } = payload; // eslint-disable-line @typescript-eslint/no-unused-vars
        const { data, error } = await supabase.from('pelaksanaan_kegiatan').insert([dataToInsert]).select().single();
        if (error) throw error;
        if (data) setKegiatanList(prev => [data, ...prev]);
      }
      
      setIsSaving(false);
      resetFormKegiatan();
      setPesan({ type: "success", text: "Bukti Kegiatan berhasil disimpan!" });
      setTimeout(() => setPesan({ type: "", text: "" }), 3000);
    } catch (error) {
      setIsSaving(false);
      const errMessage = error instanceof Error ? error.message : "Gagal menyimpan kegiatan.";
      setPesan({ type: "error", text: errMessage });
    }
  };

  const deleteKegiatan = async (id?: number) => {
    if (!id || !window.confirm("Hapus bukti kegiatan ini?")) return;
    try {
      await supabase.from('pelaksanaan_kegiatan').delete().eq('id', id);
      setKegiatanList(prev => prev.filter(k => k.id !== id));
    } catch (error) { console.error(error); }
  };


  // ==========================================
  // RENDER UI
  // ==========================================
  if (isLoading && apbdesData.length === 0 && dokumenList.length === 0 && kegiatanList.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-bajo-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Manajemen Transparansi</h1>
        <div className="flex overflow-x-auto bg-white p-2 rounded-2xl shadow-sm border border-gray-200 gap-2 hide-scrollbar">
          {[
            { id: "dokumen", label: "Dokumen PDF", icon: "📄" },
            { id: "apbdes", label: "Anggaran & Realisasi", icon: "💰" },
            { id: "kegiatan", label: "Bukti Pembangunan", icon: "🏗️" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeTab === tab.id ? "bg-bajo-primary text-white shadow-md" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="text-lg">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {pesan.text && (
        <div className={`p-4 mb-6 rounded-xl font-medium border ${pesan.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
          {pesan.text}
        </div>
      )}

      {/* ========================================================
          TAB 1: DOKUMEN PDF (RPJMDes, APBDes, LPJ)
      ======================================================== */}
      {activeTab === "dokumen" && (
        <div className="space-y-6 animate-fadeIn w-full">
          {showFormDokumen && (
            <form onSubmit={saveDokumen} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 w-full">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-900">{dokumenForm.id ? "Edit Dokumen" : "Unggah Dokumen Baru"}</h2>
                <button type="button" onClick={resetFormDokumen} className="text-gray-400 hover:text-red-500 font-medium">✖ Tutup</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Judul Tampil Dokumen</label>
                  <input type="text" value={dokumenForm.judul} onChange={(e) => setDokumenForm({...dokumenForm, judul: e.target.value})} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary" placeholder="Cth: Dokumen RPJMDes 2024-2030" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tahun Berlaku / Terbit</label>
                  <input type="number" value={dokumenForm.tahun} onChange={(e) => setDokumenForm({...dokumenForm, tahun: Number(e.target.value)})} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Kategori Dokumen</label>
                  <select value={dokumenForm.jenis} onChange={(e) => setDokumenForm({...dokumenForm, jenis: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary">
                    <option value="RPJMDes">RPJMDes</option>
                    <option value="APBDes">APBDes</option>
                    <option value="LPJ">LPJ Realisasi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Pilih File PDF</label>
                  <input type="file" accept=".pdf" onChange={(e) => setFileDokumen(e.target.files ? e.target.files[0] : null)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                  {dokumenForm.file_url && !fileDokumen && <p className="text-xs text-blue-500 mt-2">File sudah terunggah. Pilih file baru jika ingin mengganti.</p>}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button type="submit" disabled={isSaving} className="px-8 py-3 rounded-xl font-bold text-white bg-bajo-primary hover:bg-bajo-dark transition-all shadow-md">{isSaving ? "Mengunggah..." : "Simpan Dokumen"}</button>
              </div>
            </form>
          )}

          {!showFormDokumen && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden w-full">
              <div className="p-5 md:p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Arsip Dokumen Desa</h2>
                <button onClick={() => setShowFormDokumen(true)} className="px-5 py-2.5 bg-bajo-primary text-white font-bold rounded-xl hover:bg-bajo-dark shadow-md shadow-bajo-primary/30 transition-all">+ Unggah PDF</button>
              </div>
              <div className="block w-full overflow-x-auto">
                <table className="w-full min-w-[600px] text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest border-b border-gray-200">
                      <th className="p-4 font-bold">Kategori</th>
                      <th className="p-4 font-bold">Judul & Tahun</th>
                      <th className="p-4 font-bold text-center">Status File</th>
                      <th className="p-4 font-bold text-center w-40">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dokumenList.map(item => (
                      <tr key={item.id} className="hover:bg-blue-50/50">
                        <td className="p-4 font-bold text-bajo-primary whitespace-nowrap">{item.jenis}</td>
                        <td className="p-4">
                          <p className="font-bold text-gray-900">{item.judul}</p>
                          <p className="text-sm text-gray-500">Tahun: {item.tahun}</p>
                        </td>
                        <td className="p-4 text-center">
                          {item.file_url ? <a href={item.file_url} target="_blank" className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-lg font-bold">Bisa Diunduh</a> : <span className="text-sm text-red-500">Kosong</span>}
                        </td>
                        <td className="p-4 text-center whitespace-nowrap">
                          <button onClick={() => { setDokumenForm(item); setShowFormDokumen(true); }} className="text-blue-600 hover:underline font-bold mr-3">Edit</button>
                          <button onClick={() => deleteDokumen(item.id)} className="text-red-500 hover:underline font-bold">Hapus</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 2: DATA APBDES (ASPEK & CABANG DINAMIS)
      ======================================================== */}
      {activeTab === "apbdes" && (
        <div className="space-y-6 animate-fadeIn w-full">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-end justify-between">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Tahun Anggaran</label>
              <input type="number" value={selectedTahunApbdes} onChange={(e) => setSelectedTahunApbdes(Number(e.target.value))} className="w-48 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary font-bold text-lg" />
            </div>
            <button onClick={() => loadApbdesData(selectedTahunApbdes)} className="px-6 py-3 font-bold text-bajo-primary bg-bajo-primary/10 hover:bg-bajo-primary hover:text-white rounded-xl transition-all">
              Load Data Tahun {selectedTahunApbdes}
            </button>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 w-full">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-gray-900">Struktur Anggaran {selectedTahunApbdes}</h2>
              <button onClick={addAspek} className="px-5 py-2.5 bg-bajo-dark text-white font-bold rounded-xl hover:bg-black transition-all">+ Tambah Aspek Baru</button>
            </div>

            {isLoading ? (
              <p className="text-center text-gray-500 py-10">Memuat data anggaran...</p>
            ) : apbdesData.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium mb-4">Belum ada struktur anggaran untuk tahun {selectedTahunApbdes}.</p>
                <button onClick={addAspek} className="px-5 py-2.5 bg-bajo-primary text-white font-bold rounded-xl hover:bg-bajo-dark transition-all">Mulai Buat Aspek Pertama</button>
              </div>
            ) : (
              <div className="space-y-8">
                {apbdesData.map((aspekItem, aspekIdx) => (
                  <div key={aspekIdx} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    {/* Header Aspek */}
                    <div className="bg-gray-50 p-4 border-b flex justify-between items-center gap-4">
                      <input type="text" value={aspekItem.aspek} onChange={(e) => updateAspekName(aspekIdx, e.target.value)} className="w-full md:w-1/2 px-4 py-2 bg-white border border-gray-300 rounded-lg font-bold text-bajo-dark outline-none focus:border-bajo-primary" placeholder="Nama Aspek (Cth: Pendapatan Desa)" />
                      <button onClick={() => removeAspek(aspekIdx)} className="text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition-all">Hapus Aspek</button>
                    </div>
                    
                    {/* Daftar Cabang */}
                    <div className="p-4 space-y-3 bg-white">
                      {aspekItem.cabang.map((cabang, cabangIdx) => (
                        <div key={cabangIdx} className="flex flex-col md:flex-row gap-3 items-center bg-gray-50 p-3 rounded-xl border border-gray-100 relative group">
                          <input type="text" value={cabang.nama} onChange={(e) => updateCabang(aspekIdx, cabangIdx, 'nama', e.target.value)} className="w-full md:w-2/5 p-2.5 bg-white border rounded-lg text-sm outline-none focus:border-bajo-primary" placeholder="Nama Cabang (Cth: Dana Desa)" />
                          <div className="w-full md:w-1/4 relative">
                            <span className="absolute left-3 top-3 text-xs text-gray-400 font-bold">Rp</span>
                            <input type="number" value={cabang.anggaran} onChange={(e) => updateCabang(aspekIdx, cabangIdx, 'anggaran', Number(e.target.value))} className="w-full pl-8 p-2.5 bg-white border rounded-lg text-sm outline-none focus:border-bajo-primary" placeholder="Anggaran" title="Anggaran" />
                          </div>
                          <div className="w-full md:w-1/4 relative">
                            <span className="absolute left-3 top-3 text-xs text-gray-400 font-bold">Rp</span>
                            <input type="number" value={cabang.realisasi} onChange={(e) => updateCabang(aspekIdx, cabangIdx, 'realisasi', Number(e.target.value))} className="w-full pl-8 p-2.5 bg-white border border-green-200 rounded-lg text-sm outline-none focus:border-green-500" placeholder="Realisasi" title="Realisasi" />
                          </div>
                          <button onClick={() => removeCabang(aspekIdx, cabangIdx)} className="text-red-400 hover:text-red-600 font-bold p-2">✖</button>
                        </div>
                      ))}
                      <button onClick={() => addCabang(aspekIdx)} className="mt-2 px-4 py-2 text-sm font-bold text-bajo-primary bg-bajo-primary/10 rounded-lg hover:bg-bajo-primary hover:text-white transition-all">+ Tambah Cabang</button>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button onClick={saveApbdesData} disabled={isSaving} className="px-8 py-3.5 rounded-xl font-bold text-white bg-bajo-primary hover:bg-bajo-dark transition-all shadow-lg">
                    {isSaving ? "Menyimpan APBDes..." : `💾 Simpan APBDes ${selectedTahunApbdes}`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: BUKTI KEGIATAN LPJ
      ======================================================== */}
      {activeTab === "kegiatan" && (
        <div className="space-y-6 animate-fadeIn w-full">
          {showFormKegiatan && (
            <form onSubmit={saveKegiatan} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 w-full">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-900">{kegiatanForm.id ? "Edit Kegiatan" : "Tambah Bukti Kegiatan"}</h2>
                <button type="button" onClick={resetFormKegiatan} className="text-gray-400 hover:text-red-500 font-medium">✖ Tutup</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tahun Pelaksanaan</label>
                    <input type="number" value={kegiatanForm.tahun} onChange={(e) => setKegiatanForm({...kegiatanForm, tahun: Number(e.target.value)})} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nama Kegiatan</label>
                    <input type="text" value={kegiatanForm.kegiatan} onChange={(e) => setKegiatanForm({...kegiatanForm, kegiatan: e.target.value})} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary" placeholder="Cth: Pembangunan Rabat Beton" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Bidang Pembangunan</label>
                    <input type="text" value={kegiatanForm.bidang} onChange={(e) => setKegiatanForm({...kegiatanForm, bidang: e.target.value})} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary" placeholder="Cth: Pembangunan Desa" />
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Total Biaya (Rp)</label>
                      <input type="number" value={kegiatanForm.biaya} onChange={(e) => setKegiatanForm({...kegiatanForm, biaya: Number(e.target.value)})} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary" />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Status Pengerjaan</label>
                      <input type="text" value={kegiatanForm.status} onChange={(e) => setKegiatanForm({...kegiatanForm, status: e.target.value})} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary" placeholder="Cth: Selesai 100%" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Foto Dokumentasi Kegiatan</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-2xl hover:border-bajo-primary transition-colors bg-gray-50">
                    <div className="space-y-1 text-center">
                      {(previewKegiatan || kegiatanForm.foto_url) ? (
                        <div className="relative mx-auto w-full max-w-xs h-40 mb-4 rounded-xl overflow-hidden shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={previewKegiatan || kegiatanForm.foto_url} alt="Preview" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => { setFileFotoKegiatan(null); setPreviewKegiatan(""); setKegiatanForm(prev => ({...prev, foto_url: ""})) }} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">Hapus</button>
                        </div>
                      ) : (
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      )}
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label className="relative cursor-pointer bg-white rounded-md font-bold text-bajo-primary hover:text-bajo-dark focus-within:outline-none">
                          <span>{previewKegiatan || kegiatanForm.foto_url ? "Ganti Foto" : "Unggah Foto Bukti"}</span>
                          <input type="file" accept="image/*" className="sr-only" onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setFileFotoKegiatan(e.target.files[0]);
                              setPreviewKegiatan(URL.createObjectURL(e.target.files[0]));
                            }
                          }} />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button type="submit" disabled={isSaving} className="px-8 py-3 rounded-xl font-bold text-white bg-bajo-primary hover:bg-bajo-dark transition-all shadow-md">{isSaving ? "Menyimpan..." : "Simpan Kegiatan"}</button>
              </div>
            </form>
          )}

          {!showFormKegiatan && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden w-full">
              <div className="p-5 md:p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Daftar Bukti Kegiatan</h2>
                <button onClick={() => setShowFormKegiatan(true)} className="px-5 py-2.5 bg-bajo-primary text-white font-bold rounded-xl hover:bg-bajo-dark shadow-md transition-all">+ Tambah Kegiatan</button>
              </div>
              <div className="block w-full overflow-x-auto">
                <table className="w-full min-w-[800px] text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest border-b border-gray-200">
                      <th className="p-4 font-bold w-16">Thn</th>
                      <th className="p-4 font-bold">Foto</th>
                      <th className="p-4 font-bold">Nama Kegiatan & Bidang</th>
                      <th className="p-4 font-bold">Biaya & Status</th>
                      <th className="p-4 font-bold text-center w-32">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {kegiatanList.map(item => (
                      <tr key={item.id} className="hover:bg-blue-50/50">
                        <td className="p-4 font-bold text-gray-600">{item.tahun}</td>
                        <td className="p-4">
                          <div className="w-16 h-12 bg-gray-200 rounded-lg overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            {item.foto_url && <img src={item.foto_url} alt="Foto" className="w-full h-full object-cover" />}
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-gray-900">{item.kegiatan}</p>
                          <p className="text-sm text-bajo-primary font-semibold">{item.bidang}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-gray-900">{formatRupiah(item.biaya)}</p>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md font-bold">{item.status}</span>
                        </td>
                        <td className="p-4 text-center whitespace-nowrap">
                          <button onClick={() => { setKegiatanForm(item); setShowFormKegiatan(true); }} className="text-blue-600 hover:underline font-bold mr-3">Edit</button>
                          <button onClick={() => deleteKegiatan(item.id)} className="text-red-500 hover:underline font-bold">Hapus</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}