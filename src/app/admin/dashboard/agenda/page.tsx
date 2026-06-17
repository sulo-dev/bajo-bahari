"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// ==========================================
// 1. TIPE DATA (INTERFACES)
// ==========================================
interface AgendaItem {
  id?: number;
  judul: string;
  tanggal: string; // Format YYYY-MM-DD dari database
  waktu: string;
  lokasi: string;
  deskripsi: string;
  status: string; // 'Akan Datang' | 'Hari Ini' | 'Selesai'
  warna_status: string;
}

export default function AgendaAdminPage() {
  const [agendaList, setAgendaList] = useState<AgendaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pesan, setPesan] = useState({ type: "", text: "" });
  const [showForm, setShowForm] = useState(false);

  // Form State Default
  const [formData, setFormData] = useState<AgendaItem>({
    judul: "",
    tanggal: new Date().toISOString().split("T")[0], // Default ke hari ini
    waktu: "",
    lokasi: "",
    deskripsi: "",
    status: "Akan Datang",
    warna_status: "bg-blue-100 text-blue-700 border-blue-200",
  });

  // ==========================================
  // 2. FETCH DATA AGENDA DESA
  // ==========================================
  useEffect(() => {
    const fetchAgenda = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("agenda_desa")
          .select("*")
          .order("tanggal", { ascending: false }); // Urutkan dari tanggal terbaru

        if (error) throw error;
        if (data) setAgendaList(data);
      } catch (error) {
        console.error(error);
        setPesan({ type: "error", text: "Gagal memuat daftar agenda." });
      }
      setIsLoading(false);
    };

    fetchAgenda();
  }, []);

  // ==========================================
  // 3. HANDLERS FORM & EVENT
  // ==========================================
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setShowForm(false);
    setFormData({
      judul: "",
      tanggal: new Date().toISOString().split("T")[0],
      waktu: "",
      lokasi: "",
      deskripsi: "",
      status: "Akan Datang",
      warna_status: "bg-blue-100 text-blue-700 border-blue-200",
    });
  };

  const editAgenda = (item: AgendaItem) => {
    setFormData(item);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper otomatisasi warna badge di halaman guest berdasarkan status pilihan
  const dapatkanWarnaStatus = (status: string): string => {
    switch (status) {
      case "Akan Datang":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Hari Ini":
        return "bg-green-100 text-green-700 border-green-200";
      case "Selesai":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  // ==========================================
  // 4. PENYIMPANAN DATA (INSERT / UPDATE)
  // ==========================================
  const saveAgenda = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setPesan({ type: "", text: "" });

    try {
      const warnaTerpilih = dapatkanWarnaStatus(formData.status);

      const payload = {
        judul: formData.judul,
        tanggal: formData.tanggal,
        waktu: formData.waktu,
        lokasi: formData.lokasi,
        deskripsi: formData.deskripsi,
        status: formData.status,
        warna_status: warnaTerpilih,
      };

      if (formData.id) {
        // PROSES UPDATE
        const { error } = await supabase
          .from("agenda_desa")
          .update(payload)
          .eq("id", formData.id);

        if (error) throw error;

        setAgendaList(prev =>
          prev.map(a => (a.id === formData.id ? { ...payload, id: formData.id } : a))
        );
        setPesan({ type: "success", text: "Agenda berhasil diperbarui!" });
      } else {
        // PROSES INSERT BARU
        const { data, error } = await supabase
          .from("agenda_desa")
          .insert([payload])
          .select()
          .single();

        if (error) throw error;

        if (data) {
          setAgendaList(prev => [data, ...prev]);
        }
        setPesan({ type: "success", text: "Agenda baru sukses ditambahkan!" });
      }

      setIsSaving(false);
      resetForm();
      setTimeout(() => setPesan({ type: "", text: "" }), 3000);
    } catch (error) {
      setIsSaving(false);
      const errMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat memproses data.";
      setPesan({ type: "error", text: errMessage });
    }
  };

  const deleteAgenda = async (id?: number) => {
    if (!id || !window.confirm("Apakah Anda yakin ingin menghapus agenda kegiatan ini?")) return;

    try {
      const { error } = await supabase.from("agenda_desa").delete().eq("id", id);
      if (error) throw error;

      setAgendaList(prev => prev.filter(a => a.id !== id));
      setPesan({ type: "success", text: "Agenda berhasil dihapus." });
      setTimeout(() => setPesan({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error(error);
      setPesan({ type: "error", text: "Gagal menghapus agenda dari database." });
    }
  };

  // Helper untuk memformat visual tanggal di tabel admin
  const formatTanggalTabel = (dateString: string) => {
    const opsi: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", opsi);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 w-full">
      <div className="mb-8 border-b pb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Manajemen Agenda Desa</h1>
        <p className="text-gray-500 mt-1">
          Kelola jadwal rapat, pengumuman penyaluran bantuan, kerja bakti, dan agenda penting desa.
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
          onSubmit={saveAgenda}
          className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 w-full animate-fadeIn"
        >
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {formData.id ? "Edit Agenda Kegiatan" : "Buat Agenda Baru"}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="text-gray-400 hover:text-red-500 font-medium"
            >
              ✖ Batal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Nama / Judul Kegiatan</label>
              <input
                type="text"
                name="judul"
                value={formData.judul}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary font-semibold text-gray-900"
                placeholder="Cth: Penyaluran Bantuan Bibit Rumput Laut"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Pelaksanaan</label>
              <input
                type="date"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Status Kegiatan</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary bg-white font-medium"
              >
                <option value="Akan Datang">Akan Datang</option>
                <option value="Hari Ini">Hari Ini</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Waktu / Jam</label>
              <input
                type="text"
                name="waktu"
                value={formData.waktu}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary"
                placeholder="Cth: 08:00 WITA - Selesai"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Lokasi / Tempat</label>
              <input
                type="text"
                name="lokasi"
                value={formData.lokasi}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary"
                placeholder="Cth: Dermaga Pesisir Bajo Bahari"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Keterangan / Deskripsi Agenda</label>
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleInputChange}
                rows={4}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-bajo-primary text-sm resize-none leading-relaxed"
                placeholder="Tulis rincian informasi acara, berkas bawaan atau imbauan pelengkap di sini..."
              />
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
              {isSaving ? "Menyimpan Jadwal..." : "💾 Simpan Agenda Kerja"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden w-full">
          <div className="p-5 md:p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">Jadwal Kegiatan Terdaftar</h2>
            <button
              onClick={() => setShowForm(true)}
              className="px-5 py-2.5 bg-bajo-primary text-white font-bold rounded-xl hover:bg-bajo-dark shadow-md shadow-bajo-primary/30 transition-all whitespace-nowrap"
            >
              + Tambah Agenda Baru
            </button>
          </div>

          <div className="block w-full overflow-x-auto">
            <table className="w-full min-w-[850px] text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest border-b border-gray-200">
                  <th className="p-4 font-bold w-44">Tanggal Acara</th>
                  <th className="p-4 font-bold">Nama Kegiatan / Agenda</th>
                  <th className="p-4 font-bold w-48">Waktu & Tempat</th>
                  <th className="p-4 font-bold text-center w-36">Status</th>
                  <th className="p-4 font-bold text-center w-36">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {agendaList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-gray-400 font-medium">
                      Belum ada jadwal agenda yang terdaftar.
                    </td>
                  </tr>
                ) : (
                  agendaList.map(item => (
                    <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-4 font-bold text-gray-700 whitespace-nowrap">
                        {formatTanggalTabel(item.tanggal)}
                      </td>
                      <td className="p-4">
                        <p className="font-extrabold text-gray-900 line-clamp-1 max-w-sm">
                          {item.judul}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-1 max-w-sm mt-0.5">
                          {item.deskripsi}
                        </p>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <p className="font-semibold">{item.waktu}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[180px]">📍 {item.lokasi}</p>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-3 py-1 border rounded-full text-xs font-bold ${
                            item.status === "Akan Datang"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : item.status === "Hari Ini"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-gray-50 text-gray-500 border-gray-200"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => editAgenda(item)}
                            className="text-blue-600 hover:text-white border border-blue-200 hover:bg-blue-500 px-3 py-1.5 rounded-lg text-sm font-bold transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteAgenda(item.id)}
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