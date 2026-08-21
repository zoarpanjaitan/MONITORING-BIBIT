"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface MonitoringData {
  id: string;
  tanggal: string;
  rw: string;
  rosella_baik: number;
  rosella_buruk: number;
  sambung_nyawa_baik: number;
  sambung_nyawa_buruk: number;
  binahong_baik: number;
  binahong_buruk: number;
  ubi_baik: number;
  ubi_buruk: number;
  kegiatan: string;
  masalah: string;
  solusi: string;
}

const TARGET_BIBIT_RW: Record<string, { rosella: number; binahong: number; sambung_nyawa: number; ubi: number }> = {
  "RW 01": { rosella: 20, binahong: 20, sambung_nyawa: 15, ubi: 50 },
  "RW 02": { rosella: 8,  binahong: 10, sambung_nyawa: 8,  ubi: 10 },
  "RW 03": { rosella: 10, binahong: 10, sambung_nyawa: 10, ubi: 20 },
  "RW 04": { rosella: 5,  binahong: 5,  sambung_nyawa: 5,  ubi: 0  },
  "RW 05": { rosella: 10, binahong: 10, sambung_nyawa: 10, ubi: 25 },
  "RW 06": { rosella: 10, binahong: 10, sambung_nyawa: 5,  ubi: 10 },
};

export default function DetailTanggalPage({ params }: { params: Promise<{ tanggal: string }> }) {
  const resolvedParams = use(params);
  const tanggal = resolvedParams.tanggal;

  const [dataList, setDataList] = useState<MonitoringData[]>([]);
  const [loading, setLoading] = useState(true);

  // State untuk Modal Edit
  const [editingItem, setEditingItem] = useState<MonitoringData | null>(null);

  async function fetchDetail() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("monitoring_bibit")
        .select("*")
        .eq("tanggal", tanggal);

      if (error) {
        console.error("Error fetching detail:", error);
      } else {
        setDataList(data || []);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDetail();
  }, [tanggal]);

  // Fungsi Hapus Laporan
  const handleDelete = async (id: string, rw: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus laporan dari ${rw} pada tanggal ${tanggal}?`)) {
      const { error } = await supabase.from("monitoring_bibit").delete().eq("id", id);
      if (error) {
        alert("Gagal menghapus data: " + error.message);
      } else {
        alert("Laporan berhasil dihapus.");
        fetchDetail(); // Refresh data otomatis
      }
    }
  };

  // Fungsi Simpan Perubahan Edit
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const { error } = await supabase
      .from("monitoring_bibit")
      .update({
        rosella_baik: Number(editingItem.rosella_baik),
        rosella_buruk: Number(editingItem.rosella_buruk),
        sambung_nyawa_baik: Number(editingItem.sambung_nyawa_baik),
        sambung_nyawa_buruk: Number(editingItem.sambung_nyawa_buruk),
        binahong_baik: Number(editingItem.binahong_baik),
        binahong_buruk: Number(editingItem.binahong_buruk),
        ubi_baik: Number(editingItem.ubi_baik),
        ubi_buruk: Number(editingItem.ubi_buruk),
        kegiatan: editingItem.kegiatan,
        masalah: editingItem.masalah,
        solusi: editingItem.solusi,
      })
      .eq("id", editingItem.id);

    if (error) {
      alert("Gagal memperbarui data: " + error.message);
    } else {
      alert("Laporan berhasil diperbarui!");
      setEditingItem(null);
      fetchDetail(); // Refresh data otomatis
    }
  };

  const calculateHealth = (item: MonitoringData) => {
    const targetRw = TARGET_BIBIT_RW[item.rw] || { rosella: 0, binahong: 0, sambung_nyawa: 0, ubi: 0 };
    const totalTargetMaster = targetRw.rosella + targetRw.binahong + targetRw.sambung_nyawa + targetRw.ubi;
    const totalSehat = 
      Number(item.rosella_baik || 0) + 
      Number(item.sambung_nyawa_baik || 0) + 
      Number(item.binahong_baik || 0) + 
      Number(item.ubi_baik || 0);

    return totalTargetMaster > 0 
      ? Math.min(100, Number(((totalSehat / totalTargetMaster) * 100).toFixed(1))) 
      : 0;
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-extrabold tracking-widest text-emerald-600 uppercase">
              REKAPITULASI HARIAN RW
            </p>
            <h1 className="text-lg font-black text-slate-900">Laporan Tanggal {tanggal}</h1>
          </div>

          <Link 
            href="/hasil" 
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl transition"
          >
            ← Kembali ke Arsip
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Daftar Laporan Seluruh RW</h2>
            <p className="text-sm text-slate-500 mt-1">
              Anda dapat melakukan koreksi data (edit) atau menghapus laporan jika ditemukan kesalahan input.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-sm font-semibold text-slate-500 animate-pulse">Memuat laporan harian...</p>
          </div>
        ) : dataList.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-base font-bold text-slate-700">Tidak ada data laporan untuk tanggal ini.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {dataList.map((item) => {
              const indeksKesehatan = calculateHealth(item);
              const targetRw = TARGET_BIBIT_RW[item.rw] || { rosella: 0, binahong: 0, sambung_nyawa: 0, ubi: 0 };

              return (
                <div key={item.id} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-100 gap-4">
                    <div>
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1.5 rounded-full">
                        {item.rw}
                      </span>
                      <h3 className="text-xl font-black text-slate-900 mt-2">Laporan Pertumbuhan & Kesehatan</h3>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-left md:text-right bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                        <span className="text-xs font-bold text-slate-400 block uppercase">Indeks Kesehatan RW</span>
                        <span className="text-2xl font-black text-emerald-600">{indeksKesehatan}%</span>
                      </div>

                      {/* Tombol Aksi Edit & Hapus */}
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold px-3 py-1.5 rounded-xl text-xs transition border border-amber-200"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.rw)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-xl text-xs transition border border-red-200"
                        >
                          🗑️ Hapus
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Rincian Tanaman */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-500">🌺 Rosella (Target: {targetRw.rosella})</p>
                      <p className="text-sm font-semibold mt-1">
                        Sehat: <span className="text-emerald-600 font-bold">{item.rosella_baik}</span> | Buruk: <span className="text-red-500 font-bold">{item.rosella_buruk}</span>
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-500">🍃 Sambung Nyawa (Target: {targetRw.sambung_nyawa})</p>
                      <p className="text-sm font-semibold mt-1">
                        Sehat: <span className="text-emerald-600 font-bold">{item.sambung_nyawa_baik}</span> | Buruk: <span className="text-red-500 font-bold">{item.sambung_nyawa_buruk}</span>
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-500">🌿 Binahong (Target: {targetRw.binahong})</p>
                      <p className="text-sm font-semibold mt-1">
                        Sehat: <span className="text-emerald-600 font-bold">{item.binahong_baik}</span> | Buruk: <span className="text-red-500 font-bold">{item.binahong_buruk}</span>
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-500">🍠 Ubi Jalar (Target: {targetRw.ubi})</p>
                      <p className="text-sm font-semibold mt-1">
                        Sehat: <span className="text-emerald-600 font-bold">{item.ubi_baik}</span> | Buruk: <span className="text-red-500 font-bold">{item.ubi_buruk}</span>
                      </p>
                    </div>
                  </div>

                  {/* Catatan Lapangan */}
                  <div className="bg-emerald-50/40 border border-emerald-100/60 rounded-2xl p-5 grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-bold text-emerald-900 block text-xs uppercase tracking-wider">Kegiatan Perawatan</span>
                      <p className="text-slate-600 mt-1">{item.kegiatan || "-"}</p>
                    </div>
                    <div>
                      <span className="font-bold text-amber-900 block text-xs uppercase tracking-wider">Kendala / Masalah</span>
                      <p className="text-slate-600 mt-1">{item.masalah || "-"}</p>
                    </div>
                    <div>
                      <span className="font-bold text-blue-900 block text-xs uppercase tracking-wider">Solusi / Tindak Lanjut</span>
                      <p className="text-slate-600 mt-1">{item.solusi || "-"}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* MODAL EDIT DATA */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full">
                  Koreksi Data : {editingItem.rw}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">Edit Laporan Monitoring</h3>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
                  <p className="font-bold text-xs text-slate-700">🌺 Rosella</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400">Baik</label>
                      <input
                        type="number"
                        value={editingItem.rosella_baik}
                        onChange={(e) => setEditingItem({ ...editingItem, rosella_baik: Number(e.target.value) })}
                        className="w-full border rounded-xl p-2 text-sm font-bold text-emerald-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400">Buruk</label>
                      <input
                        type="number"
                        value={editingItem.rosella_buruk}
                        onChange={(e) => setEditingItem({ ...editingItem, rosella_buruk: Number(e.target.value) })}
                        className="w-full border rounded-xl p-2 text-sm font-bold text-red-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
                  <p className="font-bold text-xs text-slate-700">🍃 Sambung Nyawa</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400">Baik</label>
                      <input
                        type="number"
                        value={editingItem.sambung_nyawa_baik}
                        onChange={(e) => setEditingItem({ ...editingItem, sambung_nyawa_baik: Number(e.target.value) })}
                        className="w-full border rounded-xl p-2 text-sm font-bold text-emerald-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400">Buruk</label>
                      <input
                        type="number"
                        value={editingItem.sambung_nyawa_buruk}
                        onChange={(e) => setEditingItem({ ...editingItem, sambung_nyawa_buruk: Number(e.target.value) })}
                        className="w-full border rounded-xl p-2 text-sm font-bold text-red-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
                  <p className="font-bold text-xs text-slate-700">🌿 Binahong</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400">Baik</label>
                      <input
                        type="number"
                        value={editingItem.binahong_baik}
                        onChange={(e) => setEditingItem({ ...editingItem, binahong_baik: Number(e.target.value) })}
                        className="w-full border rounded-xl p-2 text-sm font-bold text-emerald-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400">Buruk</label>
                      <input
                        type="number"
                        value={editingItem.binahong_buruk}
                        onChange={(e) => setEditingItem({ ...editingItem, binahong_buruk: Number(e.target.value) })}
                        className="w-full border rounded-xl p-2 text-sm font-bold text-red-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
                  <p className="font-bold text-xs text-slate-700">🍠 Ubi Jalar</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400">Baik</label>
                      <input
                        type="number"
                        value={editingItem.ubi_baik}
                        onChange={(e) => setEditingItem({ ...editingItem, ubi_baik: Number(e.target.value) })}
                        className="w-full border rounded-xl p-2 text-sm font-bold text-emerald-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400">Buruk</label>
                      <input
                        type="number"
                        value={editingItem.ubi_buruk}
                        onChange={(e) => setEditingItem({ ...editingItem, ubi_buruk: Number(e.target.value) })}
                        className="w-full border rounded-xl p-2 text-sm font-bold text-red-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kegiatan Perawatan</label>
                  <textarea
                    value={editingItem.kegiatan || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, kegiatan: e.target.value })}
                    className="w-full border rounded-xl p-3 text-sm h-20 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kendala / Masalah</label>
                  <textarea
                    value={editingItem.masalah || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, masalah: e.target.value })}
                    className="w-full border rounded-xl p-3 text-sm h-20 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Solusi / Tindak Lanjut</label>
                  <textarea
                    value={editingItem.solusi || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, solusi: e.target.value })}
                    className="w-full border rounded-xl p-3 text-sm h-20 bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-2xl font-bold transition shadow-lg shadow-amber-600/20"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}