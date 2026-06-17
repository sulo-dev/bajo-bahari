"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// ==========================================
// TIPE DATA (INTERFACES)
// ==========================================
interface JamOperasional { senin_kamis: string; jumat: string; sabtu_minggu: string; }
interface KontakFormData { id: number | null; alamat: string; email: string; no_whatsapp: string; jam_operasional: JamOperasional; }
interface PerangkatItem { id?: number; nama_lengkap: string; jabatan: string; urutan_tampil: number; foto_url: string; }

export default function PemerintahanPage() {
  const [activeTab, setActiveTab] = useState("perangkat");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pesan, setPesan] = useState({ type: "", text: "" });

  const [kontakData, setKontakData] = useState<KontakFormData>({
    id: null, alamat: "", email: "", no_whatsapp: "",
    jam_operasional: { senin_kamis: "08:00 - 15:00", jumat: "08:00 - 11:30", sabtu_minggu: "Libur" }
  });

  const [perangkatList, setPerangkatList] = useState<PerangkatItem[]>([]);
  const [showFormPerangkat, setShowFormPerangkat] = useState(false);
  const [perangkatForm, setPerangkatForm] = useState<PerangkatItem>({
    nama_lengkap: "", jabatan: "Kepala Desa", urutan_tampil: 1, foto_url: ""
  });

  // ==========================================
  // STATE KHUSUS UNTUK UPLOAD FOTO
  // ==========================================
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: kontak, error: errKontak } = await supabase.from('kontak_desa').select('*').limit(1).single();
        if (errKontak && errKontak.code !== 'PGRST116') throw errKontak;
        
        if (kontak) {
          let parsedJam = { senin_kamis: "", jumat: "", sabtu_minggu: "" };
          if (kontak.jam_operasional) {
            parsedJam = typeof kontak.jam_operasional === 'string' ? JSON.parse(kontak.jam_operasional) : kontak.jam_operasional;
          }
          setKontakData({
            id: kontak.id, alamat: kontak.alamat || "", email: kontak.email || "", no_whatsapp: kontak.no_whatsapp || "",
            jam_operasional: parsedJam.senin_kamis ? parsedJam : { senin_kamis: "08:00 - 15:00", jumat: "08:00 - 11:30", sabtu_minggu: "Libur" }
          });
        }

        const { data: perangkat, error: errPerangkat } = await supabase.from('perangkat_desa').select('*').order('urutan_tampil', { ascending: true });
        if (errPerangkat) throw errPerangkat;
        if (perangkat) setPerangkatList(perangkat);

        setIsLoading(false);
      } catch (error) {
        setPesan({ type: "error", text: "Gagal memuat data dari database." });
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // ==========================================
  // HANDLER KONTAK
  // ==========================================
  const handleKontakChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setKontakData(prev => ({ ...prev, [name as keyof KontakFormData]: value }));
  };

  const handleJamChange = (key: keyof JamOperasional, value: string) => {
    setKontakData(prev => ({ ...prev, jam_operasional: { ...prev.jam_operasional, [key]: value } }));
  };

  const saveKontak = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setPesan({ type: "", text: "" });

    try {
      const { id, ...payload } = kontakData;
      if (id) {
        const { error } = await supabase.from('kontak_desa').update(payload).eq('id', id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('kontak_desa').insert([payload]).select().single();
        if (error) throw error;
        if (data) setKontakData(prev => ({ ...prev, id: data.id }));
      }
      setIsSaving(false);
      setPesan({ type: "success", text: "Data Kontak berhasil disimpan!" });
      setTimeout(() => setPesan({ type: "", text: "" }), 3000);
    } catch (error) {
      setIsSaving(false);
      setPesan({ type: "error", text: "Gagal menyimpan Kontak." });
    }
  };

  // ==========================================
  // HANDLER PERANGKAT (DENGAN UPLOAD GAMBAR)
  // ==========================================
  const handlePerangkatFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPerangkatForm(prev => ({ ...prev, [name]: name === 'urutan_tampil' ? Number(value) : value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const editPerangkat = (item: PerangkatItem) => {
    setPerangkatForm(item);
    setImageFile(null);
    setPreviewUrl(item.foto_url || "");
    setShowFormPerangkat(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetPerangkatForm = () => {
    setShowFormPerangkat(false);
    setPerangkatForm({ nama_lengkap: "", jabatan: "Kepala Desa", urutan_tampil: 1, foto_url: "" });
    setImageFile(null);
    setPreviewUrl("");
  };

  const deletePerangkat = async (id?: number) => {
    if (!id) return;
    const confirm = window.confirm("Yakin ingin menghapus perangkat ini?");
    if (!confirm) return;

    try {
      const { error } = await supabase.from('perangkat_desa').delete().eq('id', id);
      if (error) throw error;
      setPerangkatList(prev => prev.filter(p => p.id !== id));
      setPesan({ type: "success", text: "Perangkat berhasil dihapus!" });
      setTimeout(() => setPesan({ type: "", text: "" }), 3000);
    } catch (error) {
      setPesan({ type: "error", text: "Gagal menghapus perangkat." });
    }
  };

  const savePerangkat = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setPesan({ type: "", text: "" });

    try {
      let finalFotoUrl = perangkatForm.foto_url;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `perangkat-${Date.now()}.${fileExt}`;
        const filePath = `perangkat/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('media-desa')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('media-desa')
          .getPublicUrl(filePath);

        finalFotoUrl = publicUrlData.publicUrl;
      }

      const payload = { ...perangkatForm, foto_url: finalFotoUrl };

      if (perangkatForm.id) {
        const { id, ...dataToUpdate } = payload;
        const { error } = await supabase.from('perangkat_desa').update(dataToUpdate).eq('id', id);
        if (error) throw error;
        setPerangkatList(prev => prev.map(p => p.id === id ? { ...dataToUpdate, id } : p).sort((a, b) => a.urutan_tampil - b.urutan_tampil));
        setPesan({ type: "success", text: "Perangkat berhasil diperbarui!" });
      } else {
        const { id, ...dataToInsert } = payload; // eslint-disable-line @typescript-eslint/no-unused-vars
        const { data, error } = await supabase.from('perangkat_desa').insert([dataToInsert]).select().single();
        if (error) throw error;
        if (data) setPerangkatList(prev => [...prev, data].sort((a, b) => a.urutan_tampil - b.urutan_tampil));
        setPesan({ type: "success", text: "Perangkat baru berhasil ditambahkan!" });
      }
      
      setIsSaving(false);
      resetPerangkatForm();
      setTimeout(() => setPesan({ type: "", text: "" }), 3000);
      
    } catch (error) { // <-- PERBAIKAN: Menghapus 'any'
      console.error(error);
      setIsSaving(false);
      // Pengecekan Type-Safe menggunakan instanceof
      const errMessage = error instanceof Error ? error.message : "Gagal menyimpan perangkat.";
      setPesan({ type: "error", text: errMessage });
    }
  };

  const pilihanJabatan = [
    { nama: "Kepala Desa", urutan: 1 }, { nama: "Sekretaris Desa", urutan: 2 }, { nama: "Ketua BPD", urutan: 3 },
    { nama: "Kaur Umum & Perencanaan", urutan: 4 }, { nama: "Kaur Keuangan", urutan: 4 },
    { nama: "Kasi Pemerintahan", urutan: 5 }, { nama: "Kasi Kesejahteraan", urutan: 5 },
    { nama: "Kepala Dusun 1", urutan: 6 }, { nama: "Kepala Dusun 2", urutan: 6 }, { nama: "Kepala Dusun 3", urutan: 6 },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-bajo-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 w-full">
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Manajemen Pemerintahan</h1>
        <div className="flex overflow-x-auto bg-white p-2 rounded-2xl shadow-sm border border-gray-200 gap-2 hide-scrollbar">
          <button onClick={() => setActiveTab("perangkat")} className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === "perangkat" ? "bg-bajo-primary text-white shadow-md" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}>
            <span className="text-lg">👔</span> Perangkat Desa & Struktur
          </button>
          <button onClick={() => setActiveTab("kontak")} className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === "kontak" ? "bg-bajo-primary text-white shadow-md" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}>
            <span className="text-lg">📞</span> Kontak & Jam Operasional
          </button>
        </div>
      </div>

      {pesan.text && (
        <div className={`p-4 mb-6 rounded-xl font-medium border ${pesan.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>{pesan.text}</div>
      )}

      {/* TAB 1: PERANGKAT DESA */}
      {activeTab === "perangkat" && (
        <div className="space-y-6 animate-fadeIn w-full">
          
          {showFormPerangkat && (
            <form onSubmit={savePerangkat} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 w-full">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-900">{perangkatForm.id ? "Edit Perangkat" : "Tambah Perangkat Baru"}</h2>
                <button type="button" onClick={resetPerangkatForm} className="text-gray-400 hover:text-red-500 font-medium">✖ Tutup Form</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap (beserta Gelar)</label>
                    <input type="text" name="nama_lengkap" value={perangkatForm.nama_lengkap} onChange={handlePerangkatFormChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary" placeholder="Cth: Bapak Budi Santoso, S.E." />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Jabatan (Sesuai Struktur)</label>
                    <select name="jabatan" value={perangkatForm.jabatan} onChange={(e) => {
                      handlePerangkatFormChange(e);
                      const selected = pilihanJabatan.find(p => p.nama === e.target.value);
                      if(selected) setPerangkatForm(prev => ({...prev, urutan_tampil: selected.urutan}));
                    }} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary">
                      {pilihanJabatan.map(jab => <option key={jab.nama} value={jab.nama}>{jab.nama}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tingkat Hierarki (Urutan Tampil)</label>
                    <input type="number" name="urutan_tampil" value={perangkatForm.urutan_tampil} onChange={handlePerangkatFormChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary" />
                    <p className="text-xs text-gray-500 mt-1">Makin kecil angka, makin di atas posisinya di halaman Struktur.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Foto Perangkat Desa</label>
                  
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-2xl hover:border-bajo-primary transition-colors bg-gray-50">
                    <div className="space-y-1 text-center">
                      
                      {previewUrl ? (
                        <div className="relative mx-auto w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button" 
                            onClick={() => { setImageFile(null); setPreviewUrl(""); setPerangkatForm(prev => ({...prev, foto_url: ""})) }} 
                            className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                          >
                            Hapus
                          </button>
                        </div>
                      ) : (
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}

                      <div className="flex text-sm text-gray-600 justify-center">
                        <label className="relative cursor-pointer bg-white rounded-md font-bold text-bajo-primary hover:text-bajo-dark focus-within:outline-none">
                          <span>{previewUrl ? "Ganti Foto" : "Unggah Foto Baru"}</span>
                          <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageSelect} />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG, WEBP hingga 5MB</p>
                    </div>
                  </div>
                </div>

              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={resetPerangkatForm} className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all">Batal</button>
                <button type="submit" disabled={isSaving} className="px-8 py-3 rounded-xl font-bold text-white bg-bajo-primary hover:bg-bajo-dark transition-all shadow-md">{isSaving ? "Menyimpan & Mengunggah..." : "Simpan Perangkat"}</button>
              </div>
            </form>
          )}

          {!showFormPerangkat && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden w-full">
              <div className="p-5 md:p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-xl font-bold text-gray-900">Daftar Pejabat Desa</h2>
                <button onClick={() => { resetPerangkatForm(); setShowFormPerangkat(true); }} className="px-5 py-2.5 bg-bajo-primary text-white font-bold rounded-xl hover:bg-bajo-dark shadow-md shadow-bajo-primary/30 transition-all whitespace-nowrap">
                  + Tambah Pejabat
                </button>
              </div>
              
              <div className="block w-full overflow-x-auto">
                <table className="w-full min-w-[600px] text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest border-b border-gray-200">
                      <th className="p-4 font-bold w-20 text-center">Hierarki</th>
                      <th className="p-4 font-bold">Profil</th>
                      <th className="p-4 font-bold">Jabatan</th>
                      <th className="p-4 font-bold text-center w-40">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {perangkatList.length === 0 ? (
                      <tr><td colSpan={4} className="p-10 text-center text-gray-400 font-medium">Belum ada data perangkat desa yang terdaftar.</td></tr>
                    ) : (
                      perangkatList.map(item => (
                        <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="p-4 text-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-700 font-bold text-sm">
                              {item.urutan_tampil}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                {item.foto_url ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={item.foto_url} alt={item.nama_lengkap} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">👤</div>
                                )}
                              </div>
                              <span className="font-bold text-gray-900 whitespace-nowrap">{item.nama_lengkap}</span>
                            </div>
                          </td>
                          <td className="p-4 text-bajo-primary font-semibold whitespace-nowrap">{item.jabatan}</td>
                          <td className="p-4 text-center whitespace-nowrap">
                            <div className="flex justify-center gap-2">
                              <button onClick={() => editPerangkat(item)} className="text-blue-600 hover:text-white border border-blue-200 hover:bg-blue-500 px-3 py-1.5 rounded-lg text-sm font-bold transition-all">Edit</button>
                              <button onClick={() => deletePerangkat(item.id)} className="text-red-500 hover:text-white border border-red-200 hover:bg-red-500 px-3 py-1.5 rounded-lg text-sm font-bold transition-all">Hapus</button>
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
      )}

      {/* TAB 2: KONTAK & JAM OPERASIONAL */}
      {activeTab === "kontak" && (
        <form onSubmit={saveKontak} className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-200 animate-fadeIn w-full">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">📍 Alamat & Kontak Digital</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Alamat Kantor Desa Lengkap</label>
              <textarea name="alamat" value={kontakData.alamat} onChange={handleKontakChange} rows={3} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary transition-all text-gray-800" placeholder="Jl. Poros Desa Bajo Bahari..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Resmi</label>
              <input type="email" name="email" value={kontakData.email} onChange={handleKontakChange} className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary transition-all text-gray-800" placeholder="pemdes@bajobahari.desa.id" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nomor WhatsApp / Telp</label>
              <input type="text" name="no_whatsapp" value={kontakData.no_whatsapp} onChange={handleKontakChange} className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary transition-all text-gray-800" placeholder="+62 812-3456-7890" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">🕒 Jam Operasional Pelayanan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Senin - Kamis</label>
              <input type="text" value={kontakData.jam_operasional.senin_kamis} onChange={(e) => handleJamChange('senin_kamis', e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-bajo-primary text-center font-medium" placeholder="08:00 - 15:00" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 text-bajo-primary">Jumat</label>
              <input type="text" value={kontakData.jam_operasional.jumat} onChange={(e) => handleJamChange('jumat', e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-bajo-primary text-center font-medium" placeholder="08:00 - 11:30" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 text-red-500">Sabtu - Minggu</label>
              <input type="text" value={kontakData.jam_operasional.sabtu_minggu} onChange={(e) => handleJamChange('sabtu_minggu', e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-bajo-primary text-center font-medium text-gray-500" placeholder="Libur" />
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-100">
            <button type="submit" disabled={isSaving} className={`px-8 py-3.5 rounded-xl font-bold text-white transition-all shadow-lg ${isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-bajo-primary hover:bg-bajo-dark shadow-bajo-primary/30 hover:-translate-y-0.5"}`}>
              {isSaving ? "Menyimpan Data..." : "💾 Simpan Info Kontak"}
            </button>
          </div>
        </form>
      )}

    </div>
  );
}