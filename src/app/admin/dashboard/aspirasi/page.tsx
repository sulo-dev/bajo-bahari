"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// ==========================================
// 1. TIPE DATA (INTERFACES)
// ==========================================
interface AspirasiItem {
  id: number;
  nama_pengirim: string;
  nik: string | null;
  kategori: string;
  pesan: string;
  lampiran_url: string | null;
  is_anonim: boolean;
  status: string; // 'Menunggu', 'Diproses', 'Selesai'
  created_at: string;
}

export default function AspirasiAdminPage() {
  const [aspirasiList, setAspirasiList] = useState<AspirasiItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pesanNotif, setPesanNotif] = useState({ type: "", text: "" });

  // State untuk Pop-up Detail
  const [selectedAspirasi, setSelectedAspirasi] = useState<AspirasiItem | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // ==========================================
  // 2. FETCH DATA DARI SUPABASE
  // ==========================================
  useEffect(() => {
    const fetchAspirasi = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('aspirasi')
          .select('*')
          .order('created_at', { ascending: false }); // Yang terbaru di atas

        if (error) throw error;
        if (data) setAspirasiList(data);
      } catch (error) {
        console.error(error);
        setPesanNotif({ type: "error", text: "Gagal memuat data aspirasi." });
      }
      setIsLoading(false);
    };

    fetchAspirasi();
  }, []);

  // ==========================================
  // 3. HANDLERS (UBAH STATUS & HAPUS)
  // ==========================================
  const updateStatus = async (id: number, newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const { error } = await supabase
        .from('aspirasi')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      // Perbarui UI
      setAspirasiList(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      
      // Jika modal sedang terbuka, perbarui juga state modalnya
      if (selectedAspirasi && selectedAspirasi.id === id) {
        setSelectedAspirasi({ ...selectedAspirasi, status: newStatus });
      }

      setPesanNotif({ type: "success", text: `Status berhasil diubah menjadi ${newStatus}` });
      setTimeout(() => setPesanNotif({ type: "", text: "" }), 3000);
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "Gagal mengubah status.";
      setPesanNotif({ type: "error", text: errMessage });
    }
    setIsUpdatingStatus(false);
  };

  const deleteAspirasi = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus aspirasi ini? (Biasanya untuk pesan spam/hoaks)")) return;

    try {
      const { error } = await supabase.from('aspirasi').delete().eq('id', id);
      if (error) throw error;

      setAspirasiList(prev => prev.filter(item => item.id !== id));
      setSelectedAspirasi(null); // Tutup modal jika yang dihapus sedang dibuka
      setPesanNotif({ type: "success", text: "Aspirasi berhasil dihapus." });
      setTimeout(() => setPesanNotif({ type: "", text: "" }), 3000);
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "Gagal menghapus aspirasi.";
      setPesanNotif({ type: "error", text: errMessage });
    }
  };

  // ==========================================
  // 4. FORMAT TANGGAL & WARNA STATUS
  // ==========================================
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Menunggu': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Diproses': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Selesai': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getKategoriFormat = (kat: string) => {
    const mapKat: Record<string, string> = {
      infrastruktur: "🏗️ Infrastruktur",
      pelayanan: "📄 Pelayanan Publik",
      kebersihan: "🧹 Kebersihan",
      sosial: "🤝 Sosial & Bantuan",
      lainnya: "💬 Lainnya"
    };
    return mapKat[kat] || kat;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-bajo-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Menghitung ringkasan data
  const totalMasuk = aspirasiList.length;
  const totalMenunggu = aspirasiList.filter(a => a.status === 'Menunggu').length;

  return (
    <div className="max-w-7xl mx-auto pb-20 w-full relative">
      <div className="mb-8 border-b pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Kotak Aspirasi Warga</h1>
          <p className="text-gray-500 mt-1">Tinjau laporan, kritik, dan saran yang masuk dari masyarakat.</p>
        </div>
        
        {/* Indikator Cepat */}
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 text-center">
            <p className="text-xs text-gray-500 font-bold uppercase">Total Masuk</p>
            <p className="text-xl font-extrabold text-bajo-dark">{totalMasuk}</p>
          </div>
          <div className="bg-yellow-50 px-4 py-2 rounded-xl shadow-sm border border-yellow-200 text-center">
            <p className="text-xs text-yellow-700 font-bold uppercase">Perlu Ditinjau</p>
            <p className="text-xl font-extrabold text-yellow-800">{totalMenunggu}</p>
          </div>
        </div>
      </div>

      {pesanNotif.text && (
        <div className={`p-4 mb-6 rounded-xl font-medium border ${pesanNotif.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
          {pesanNotif.text}
        </div>
      )}

      {/* ==========================================
          TABEL DAFTAR ASPIRASI
      ========================================== */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden w-full">
        <div className="block w-full overflow-x-auto">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest border-b border-gray-200">
                <th className="p-4 font-bold w-32">Tanggal</th>
                <th className="p-4 font-bold w-48">Pengirim</th>
                <th className="p-4 font-bold w-48">Kategori</th>
                <th className="p-4 font-bold">Cuplikan Pesan</th>
                <th className="p-4 font-bold text-center w-32">Status</th>
                <th className="p-4 font-bold text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {aspirasiList.length === 0 ? (
                <tr><td colSpan={6} className="p-10 text-center text-gray-400 font-medium">Belum ada aspirasi yang masuk.</td></tr>
              ) : (
                aspirasiList.map(item => (
                  <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(item.created_at)}</td>
                    <td className="p-4">
                      {item.is_anonim ? (
                        <span className="font-bold text-gray-900 flex items-center gap-2">
                          <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">🕵️</span>
                          Warga (Anonim)
                        </span>
                      ) : (
                        <div>
                          <p className="font-bold text-gray-900 whitespace-nowrap">{item.nama_pengirim}</p>
                          {item.nik && <p className="text-xs text-gray-500 font-mono">NIK: {item.nik}</p>}
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-gray-700 whitespace-nowrap">
                      {getKategoriFormat(item.kategori)}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      <div className="max-w-xs truncate">{item.pesan}</div>
                      {item.lampiran_url && <span className="inline-block mt-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 font-bold">📎 Ada Lampiran</span>}
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <select 
                        value={item.status} 
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                        disabled={isUpdatingStatus}
                        className={`text-xs font-bold border rounded-lg px-2 py-1 outline-none cursor-pointer ${getStatusColor(item.status)}`}
                      >
                        <option value="Menunggu">Menunggu</option>
                        <option value="Diproses">Diproses</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <button 
                        onClick={() => setSelectedAspirasi(item)} 
                        className="text-bajo-primary hover:text-white border border-bajo-primary hover:bg-bajo-primary px-3 py-1.5 rounded-lg text-sm font-bold transition-all"
                      >
                        Baca Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==========================================
          MODAL / POP-UP BACA DETAIL ASPIRASI
      ========================================== */}
      {selectedAspirasi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Detail Aspirasi Masuk</h2>
              <button onClick={() => setSelectedAspirasi(null)} className="text-gray-400 hover:text-red-500 font-bold">✖ Tutup</button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto flex-grow space-y-6">
              <div className="flex flex-wrap justify-between gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Pengirim</p>
                  <p className="font-bold text-gray-900">{selectedAspirasi.is_anonim ? "Warga Desa (Anonim)" : selectedAspirasi.nama_pengirim}</p>
                  {!selectedAspirasi.is_anonim && selectedAspirasi.nik && <p className="text-sm text-gray-600 font-mono">NIK: {selectedAspirasi.nik}</p>}
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Kategori</p>
                  <p className="font-bold text-bajo-primary">{getKategoriFormat(selectedAspirasi.kategori)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Tanggal Masuk</p>
                  <p className="text-sm font-medium text-gray-700">{formatDate(selectedAspirasi.created_at)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">Isi Laporan / Saran:</p>
                <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedAspirasi.pesan}
                </div>
              </div>

              {selectedAspirasi.lampiran_url && (
                <div>
                  <p className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">📎 Foto Lampiran Bukti:</p>
                  <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selectedAspirasi.lampiran_url} alt="Lampiran Warga" className="w-full h-auto object-contain max-h-96 bg-gray-100" />
                  </div>
                  <a href={selectedAspirasi.lampiran_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm font-bold text-blue-600 hover:underline">
                    Buka gambar layar penuh ↗
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer (Action) */}
            <div className="p-6 border-t bg-gray-50 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-700">Ubah Status Penanganan:</span>
                <select 
                  value={selectedAspirasi.status} 
                  onChange={(e) => updateStatus(selectedAspirasi.id, e.target.value)}
                  disabled={isUpdatingStatus}
                  className={`text-sm font-bold border rounded-xl px-3 py-2 outline-none cursor-pointer ${getStatusColor(selectedAspirasi.status)}`}
                >
                  <option value="Menunggu">Menunggu Tinjauan</option>
                  <option value="Diproses">Sedang Diproses</option>
                  <option value="Selesai">Telah Selesai</option>
                </select>
              </div>
              <button 
                onClick={() => deleteAspirasi(selectedAspirasi.id)} 
                className="text-red-500 hover:text-white border border-red-200 hover:bg-red-500 px-4 py-2 rounded-xl text-sm font-bold transition-all"
              >
                Hapus Laporan
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}