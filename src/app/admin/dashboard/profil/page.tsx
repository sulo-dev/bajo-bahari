"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// 1. Tipe Data / Interfaces
type TimelineItem = { year: string; title: string; description: string };
type KarakteristikItem = { label: string; deskripsi: string };
type UmurItem = { label: string; count: number; percent: number };
type PekerjaanItem = { job: string; percent_text: string };

interface ProfilFormData {
  id: number | null;
  visi: string;
  misi: string[];
  sejarah: string;
  sejarah_timeline: TimelineItem[];
  geografi_peta_url: string;
  batas_utara: string;
  batas_selatan: string;
  batas_timur: string;
  batas_barat: string;
  karakteristik_wilayah: KarakteristikItem[];
  total_penduduk: number;
  total_laki_laki: number;
  total_perempuan: number;
  demografi_umur: UmurItem[];
  demografi_pekerjaan: PekerjaanItem[];
}

export default function ProfilDesaPage() {
  const [activeTab, setActiveTab] = useState("visimisi");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pesan, setPesan] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState<ProfilFormData>({
    id: null,
    visi: "",
    misi: [""],
    sejarah: "",
    sejarah_timeline: [{ year: "", title: "", description: "" }],
    geografi_peta_url: "",
    batas_utara: "",
    batas_selatan: "",
    batas_timur: "",
    batas_barat: "",
    karakteristik_wilayah: [{ label: "", deskripsi: "" }],
    total_penduduk: 0,
    total_laki_laki: 0,
    total_perempuan: 0,
    demografi_umur: [{ label: "", count: 0, percent: 0 }],
    demografi_pekerjaan: [{ job: "", percent_text: "" }],
  });

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const { data, error } = await supabase.from("profil_desa").select("*").limit(1).single();
        if (error && error.code !== "PGRST116") throw error;

        if (data) {
          // Fungsi parse aman menggunakan generic <T>
          const parseArray = <T,>(dbValue: string | null, fallbackTemplate: T): T[] => {
            if (!dbValue) return [fallbackTemplate];
            try {
              const parsed = JSON.parse(dbValue);
              return Array.isArray(parsed) && parsed.length > 0 ? parsed : [fallbackTemplate];
            } catch (e) {
              return [fallbackTemplate];
            }
          };

          setFormData({
            id: data.id,
            visi: data.visi || "",
            sejarah: data.sejarah || "",
            geografi_peta_url: data.geografi_peta_url || "",
            batas_utara: data.batas_utara || "",
            batas_selatan: data.batas_selatan || "",
            batas_timur: data.batas_timur || "",
            batas_barat: data.batas_barat || "",
            total_penduduk: data.total_penduduk || 0,
            total_laki_laki: data.total_laki_laki || 0,
            total_perempuan: data.total_perempuan || 0,
            misi: parseArray<string>(data.misi, ""),
            sejarah_timeline: parseArray<TimelineItem>(data.sejarah_timeline, { year: "", title: "", description: "" }),
            karakteristik_wilayah: parseArray<KarakteristikItem>(data.karakteristik_wilayah, { label: "", deskripsi: "" }),
            demografi_umur: parseArray<UmurItem>(data.demografi_umur, { label: "", count: 0, percent: 0 }),
            demografi_pekerjaan: parseArray<PekerjaanItem>(data.demografi_pekerjaan, { job: "", percent_text: "" }),
          });
        }
        setIsLoading(false);
      } catch (error) {
        setPesan({ type: "error", text: "Gagal memuat data dari database." });
        setIsLoading(false);
      }
    };
    fetchProfil();
  }, []);

  // =========================================================
  // HANDLERS (TYPE-SAFE, TANPA ANY)
  // =========================================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({ ...prev, [name as keyof ProfilFormData]: type === "number" ? Number(value) : value }));
  };

  // --- Misi Handlers ---
  const updateMisi = (index: number, value: string) => {
    setFormData((prev) => {
      const newArr = [...prev.misi];
      newArr[index] = value;
      return { ...prev, misi: newArr };
    });
  };
  const addMisi = () => setFormData((prev) => ({ ...prev, misi: [...prev.misi, ""] }));
  const removeMisi = (index: number) => setFormData((prev) => ({ ...prev, misi: prev.misi.filter((_, i) => i !== index) }));

  // --- Timeline Handlers ---
  const updateTimeline = <K extends keyof TimelineItem>(index: number, key: K, value: TimelineItem[K]) => {
    setFormData((prev) => {
      const newArr = [...prev.sejarah_timeline];
      newArr[index] = { ...newArr[index], [key]: value };
      return { ...prev, sejarah_timeline: newArr };
    });
  };
  const addTimeline = () => setFormData((prev) => ({ ...prev, sejarah_timeline: [...prev.sejarah_timeline, { year: "", title: "", description: "" }] }));
  const removeTimeline = (index: number) => setFormData((prev) => ({ ...prev, sejarah_timeline: prev.sejarah_timeline.filter((_, i) => i !== index) }));

  // --- Karakteristik Handlers ---
  const updateKarakteristik = <K extends keyof KarakteristikItem>(index: number, key: K, value: KarakteristikItem[K]) => {
    setFormData((prev) => {
      const newArr = [...prev.karakteristik_wilayah];
      newArr[index] = { ...newArr[index], [key]: value };
      return { ...prev, karakteristik_wilayah: newArr };
    });
  };
  const addKarakteristik = () => setFormData((prev) => ({ ...prev, karakteristik_wilayah: [...prev.karakteristik_wilayah, { label: "", deskripsi: "" }] }));
  const removeKarakteristik = (index: number) => setFormData((prev) => ({ ...prev, karakteristik_wilayah: prev.karakteristik_wilayah.filter((_, i) => i !== index) }));

  // --- Umur Handlers ---
  const updateUmur = <K extends keyof UmurItem>(index: number, key: K, value: UmurItem[K]) => {
    setFormData((prev) => {
      const newArr = [...prev.demografi_umur];
      newArr[index] = { ...newArr[index], [key]: value };
      return { ...prev, demografi_umur: newArr };
    });
  };
  const addUmur = () => setFormData((prev) => ({ ...prev, demografi_umur: [...prev.demografi_umur, { label: "", count: 0, percent: 0 }] }));
  const removeUmur = (index: number) => setFormData((prev) => ({ ...prev, demografi_umur: prev.demografi_umur.filter((_, i) => i !== index) }));

  // --- Pekerjaan Handlers ---
  const updatePekerjaan = <K extends keyof PekerjaanItem>(index: number, key: K, value: PekerjaanItem[K]) => {
    setFormData((prev) => {
      const newArr = [...prev.demografi_pekerjaan];
      newArr[index] = { ...newArr[index], [key]: value };
      return { ...prev, demografi_pekerjaan: newArr };
    });
  };
  const addPekerjaan = () => setFormData((prev) => ({ ...prev, demografi_pekerjaan: [...prev.demografi_pekerjaan, { job: "", percent_text: "" }] }));
  const removePekerjaan = (index: number) => setFormData((prev) => ({ ...prev, demografi_pekerjaan: prev.demografi_pekerjaan.filter((_, i) => i !== index) }));

  // =========================================================
  // PENYIMPANAN DATA
  // =========================================================

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setPesan({ type: "", text: "" });

    try {
      // Pisahkan ID agar tidak masuk ke payload pembaruan
      const { id, ...dataToSave } = formData;

      const payload = {
        ...dataToSave,
        misi: JSON.stringify(formData.misi.filter((item) => item.trim() !== "")),
        sejarah_timeline: JSON.stringify(formData.sejarah_timeline.filter((item) => item.year.trim() !== "")),
        karakteristik_wilayah: JSON.stringify(formData.karakteristik_wilayah.filter((item) => item.label.trim() !== "")),
        demografi_umur: JSON.stringify(formData.demografi_umur.filter((item) => item.label.trim() !== "")),
        demografi_pekerjaan: JSON.stringify(formData.demografi_pekerjaan.filter((item) => item.job.trim() !== "")),
      };

      if (id) {
        // JIKA ID SUDAH ADA -> LAKUKAN UPDATE
        const { error } = await supabase
          .from("profil_desa")
          .update({ ...payload, updated_at: new Date() })
          .eq("id", id);
        if (error) throw error;
      } else {
        // JIKA ID BELUM ADA -> LAKUKAN INSERT LALU AMBIL KEMBALI DATANYA (.select)
        const { data, error } = await supabase.from("profil_desa").insert([payload]).select().single();
        if (error) throw error;

        // PENTING: Perbarui state formData dengan ID yang baru saja digenerate oleh Supabase
        // Sehingga jika admin menekan "Simpan" lagi, sistem akan melakukan UPDATE, bukan INSERT.
        if (data) {
          setFormData((prev) => ({ ...prev, id: data.id }));
        }
      }

      setIsSaving(false);
      setPesan({ type: "success", text: "Data profil desa berhasil disimpan!" });
      setTimeout(() => setPesan({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error(error);
      setIsSaving(false);
      setPesan({ type: "error", text: "Terjadi kesalahan saat menyimpan data." });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-bajo-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const tabs = [
    { id: "visimisi", label: "Visi & Misi", icon: "🎯" },
    { id: "sejarah", label: "Sejarah", icon: "📜" },
    { id: "geografi", label: "Geografi", icon: "🗺️" },
    { id: "demografi", label: "Demografi", icon: "👥" },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Konfigurasi Profil Desa</h1>
        <div className="flex overflow-x-auto bg-white p-2 rounded-2xl shadow-sm border border-gray-200 gap-2 hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeTab === tab.id ? "bg-bajo-primary text-white shadow-md shadow-bajo-primary/30" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="text-lg">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {pesan.text && <div className={`p-4 mb-6 rounded-xl font-medium border ${pesan.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>{pesan.text}</div>}

      <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-10 min-h-[400px]">
          {/* TAB: VISI MISI */}
          {activeTab === "visimisi" && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Visi Utama Desa</label>
                <textarea
                  name="visi"
                  value={formData.visi}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-bajo-primary/50 focus:border-bajo-primary outline-none transition-all text-gray-800"
                  placeholder="Mewujudkan Desa Bajo Bahari yang..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Daftar Misi Desa</label>
                <div className="space-y-3">
                  {formData.misi.map((item, index) => (
                    <div key={index} className="flex gap-3 items-start group">
                      <div className="mt-1 w-10 h-10 flex-shrink-0 bg-bajo-primary/10 text-bajo-primary rounded-xl flex items-center justify-center font-bold">{index + 1}</div>
                      <textarea
                        value={item}
                        onChange={(e) => updateMisi(index, e.target.value)}
                        rows={2}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary text-gray-800 transition-all"
                        placeholder="Tuliskan misi..."
                      />
                      <button type="button" onClick={() => removeMisi(index)} className="mt-1 p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100">
                        ✖
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addMisi} className="mt-4 px-5 py-2.5 text-sm font-bold text-bajo-primary bg-bajo-primary/10 hover:bg-bajo-primary hover:text-white rounded-xl transition-colors">
                  + Tambah Poin Misi
                </button>
              </div>
            </div>
          )}

          {/* TAB: SEJARAH */}
          {activeTab === "sejarah" && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Sejarah Singkat (Paragraf Pengantar)</label>
                <textarea
                  name="sejarah"
                  value={formData.sejarah}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-bajo-primary text-gray-800 transition-all"
                  placeholder="Ceritakan pengantar sejarah desa..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Jejak Langkah (Timeline)</label>
                <div className="space-y-4">
                  {formData.sejarah_timeline.map((item, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-100 group relative">
                      <div className="w-full md:w-48 flex-shrink-0">
                        <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wider font-bold">Masa / Tahun</label>
                        <input type="text" value={item.year} onChange={(e) => updateTimeline(index, "year", e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:border-bajo-primary" placeholder="Cth: 2012" />
                      </div>
                      <div className="flex-grow space-y-3">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wider font-bold">Judul Peristiwa</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateTimeline(index, "title", e.target.value)}
                            className="w-full p-3 border rounded-xl font-bold outline-none focus:border-bajo-primary"
                            placeholder="Pemekaran Desa..."
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wider font-bold">Deskripsi</label>
                          <textarea
                            value={item.description}
                            onChange={(e) => updateTimeline(index, "description", e.target.value)}
                            rows={2}
                            className="w-full p-3 border rounded-xl text-sm outline-none focus:border-bajo-primary"
                            placeholder="Deskripsi kejadian..."
                          />
                        </div>
                      </div>
                      <button type="button" onClick={() => removeTimeline(index)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                        ✖
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addTimeline} className="mt-4 px-5 py-2.5 text-sm font-bold text-bajo-primary bg-bajo-primary/10 hover:bg-bajo-primary hover:text-white rounded-xl transition-colors">
                  + Tambah Era/Tahun Baru
                </button>
              </div>
            </div>
          )}

          {/* TAB: GEOGRAFI */}
          {activeTab === "geografi" && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Link Iframe Google Maps</label>
                <input
                  type="text"
                  name="geografi_peta_url"
                  value={formData.geografi_peta_url}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-bajo-primary transition-all text-sm"
                  placeholder="<iframe src='...' ></iframe>"
                />
                <p className="text-xs text-gray-500 mt-2">Dapatkan dari Google Maps &gt; Bagikan &gt; Sematkan Peta (Embed Map)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                {["utara", "selatan", "timur", "barat"].map((arah) => {
                  const keyName = `batas_${arah}` as keyof ProfilFormData;
                  return (
                    <div key={arah}>
                      <label className="block text-sm font-bold text-gray-700 mb-2 capitalize">Batas {arah}</label>
                      <input
                        type="text"
                        name={keyName}
                        value={formData[keyName] as string}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-bajo-primary"
                        placeholder={`Batas wilayah ${arah}...`}
                      />
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Karakteristik Topografi & Iklim</label>
                <div className="space-y-3">
                  {formData.karakteristik_wilayah.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-3 relative group">
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => updateKarakteristik(index, "label", e.target.value)}
                        className="sm:w-1/3 p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-bajo-primary"
                        placeholder="Label (Cth: Iklim)"
                      />
                      <input
                        type="text"
                        value={item.deskripsi}
                        onChange={(e) => updateKarakteristik(index, "deskripsi", e.target.value)}
                        className="sm:w-2/3 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-bajo-primary"
                        placeholder="Deskripsi..."
                      />
                      <button
                        type="button"
                        onClick={() => removeKarakteristik(index)}
                        className="absolute sm:relative -top-2 -right-2 sm:top-auto sm:right-auto p-3 text-red-500 hover:bg-red-50 rounded-xl sm:opacity-0 group-hover:opacity-100"
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addKarakteristik} className="mt-4 px-5 py-2.5 text-sm font-bold text-bajo-primary bg-bajo-primary/10 hover:bg-bajo-primary hover:text-white rounded-xl">
                  + Tambah Karakteristik
                </button>
              </div>
            </div>
          )}

          {/* TAB: DEMOGRAFI */}
          {activeTab === "demografi" && (
            <div className="space-y-10 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Total Penduduk (Jiwa)</label>
                  <input
                    type="number"
                    name="total_penduduk"
                    value={formData.total_penduduk}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl font-extrabold text-2xl text-bajo-dark outline-none focus:border-bajo-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Laki-Laki (Jiwa)</label>
                  <input
                    type="number"
                    name="total_laki_laki"
                    value={formData.total_laki_laki}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl font-extrabold text-2xl text-blue-600 outline-none focus:border-bajo-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Perempuan (Jiwa)</label>
                  <input
                    type="number"
                    name="total_perempuan"
                    value={formData.total_perempuan}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl font-extrabold text-2xl text-pink-600 outline-none focus:border-bajo-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Distribusi Kelompok Umur</label>
                  <div className="space-y-3">
                    {formData.demografi_umur.map((item, index) => (
                      <div key={index} className="flex gap-2 items-center group">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => updateUmur(index, "label", e.target.value)}
                          className="w-2/5 p-3 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:border-bajo-primary"
                          placeholder="0-14 Thn"
                        />
                        <input
                          type="number"
                          value={item.count}
                          onChange={(e) => updateUmur(index, "count", Number(e.target.value))}
                          className="w-1/5 p-3 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none"
                          placeholder="Jiwa"
                        />
                        <input
                          type="number"
                          value={item.percent}
                          onChange={(e) => updateUmur(index, "percent", Number(e.target.value))}
                          className="w-1/5 p-3 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none"
                          placeholder="%"
                        />
                        <button type="button" onClick={() => removeUmur(index)} className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100">
                          ✖
                        </button>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={addUmur} className="mt-4 px-4 py-2 text-xs font-bold text-bajo-primary bg-bajo-primary/10 rounded-lg">
                    + Kelompok Umur
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Mata Pencaharian</label>
                  <div className="space-y-3">
                    {formData.demografi_pekerjaan.map((item, index) => (
                      <div key={index} className="flex gap-2 items-center group">
                        <input
                          type="text"
                          value={item.job}
                          onChange={(e) => updatePekerjaan(index, "job", e.target.value)}
                          className="w-3/5 p-3 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:border-bajo-primary"
                          placeholder="Nelayan"
                        />
                        <input
                          type="text"
                          value={item.percent_text}
                          onChange={(e) => updatePekerjaan(index, "percent_text", e.target.value)}
                          className="w-1/5 p-3 bg-gray-50 rounded-xl text-sm border border-gray-200 text-center outline-none"
                          placeholder="55%"
                        />
                        <button type="button" onClick={() => removePekerjaan(index)} className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100">
                          ✖
                        </button>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={addPekerjaan} className="mt-4 px-4 py-2 text-xs font-bold text-bajo-primary bg-bajo-primary/10 rounded-lg">
                    + Mata Pencaharian
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-end items-center gap-4">
          <span className="text-sm text-gray-500">Perubahan akan diterapkan di semua halaman publik</span>
          <button
            type="submit"
            disabled={isSaving}
            className={`px-8 py-3.5 rounded-xl font-bold text-white transition-all shadow-lg ${isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-bajo-primary hover:bg-bajo-dark shadow-bajo-primary/30 hover:-translate-y-0.5"}`}
          >
            {isSaving ? "Menyimpan Data..." : "💾 Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
