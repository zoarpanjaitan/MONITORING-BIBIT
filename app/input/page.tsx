"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// Data Target Master Sebaran Bibit Awal per RW
const TARGET_BIBIT_RW: Record<string, { rosella: number; binahong: number; sambung_nyawa: number; ubi: number }> = {
  "RW 01": { rosella: 20, binahong: 20, sambung_nyawa: 15, ubi: 50 },
  "RW 02": { rosella: 8,  binahong: 10, sambung_nyawa: 8,  ubi: 10 },
  "RW 03": { rosella: 10, binahong: 10, sambung_nyawa: 10, ubi: 20 },
  "RW 04": { rosella: 5,  binahong: 5,  sambung_nyawa: 5,  ubi: 0  },
  "RW 05": { rosella: 10, binahong: 10, sambung_nyawa: 10, ubi: 25 },
  "RW 06": { rosella: 10, binahong: 10, sambung_nyawa: 5,  ubi: 10 },
};

export default function InputMonitoringPage() {
  const router = useRouter();
  const [rw, setRw] = useState("RW 01");
  const [loading, setLoading] = useState(false);

  // State form sesuai kolom tabel Supabase (Hanya simpan kondisi Baik, Buruk dihitung otomatis)
  const [tanggal, setTanggal] = useState("");
  const [rosellaBaik, setRosellaBaik] = useState("0");
  const [sambungBaik, setSambungBaik] = useState("0");
  const [binahongBaik, setBinahongBaik] = useState("0");
  const [ubiBaik, setUbiBaik] = useState("0");
  const [kegiatan, setKegiatan] = useState("");
  const [masalah, setMasalah] = useState("");
  const [solusi, setSolusi] = useState("");

  useEffect(() => {
    const activeRw = localStorage.getItem("user_rw");
    if (!activeRw) {
      router.push("/login");
    } else {
      setRw(activeRw);
    }

    const today = new Date().toISOString().split("T")[0];
    setTanggal(today);
  }, [router]);

  // Ambil target master untuk RW yang sedang login
  const currentTarget = TARGET_BIBIT_RW[rw] || { rosella: 0, binahong: 0, sambung_nyawa: 0, ubi: 0 };

  // Kalkulasi otomatis kondisi buruk (Target Master - Input Sehat), minimal 0
  const rosellaBuruk = Math.max(0, currentTarget.rosella - (parseInt(rosellaBaik) || 0));
  const sambungBuruk = Math.max(0, currentTarget.sambung_nyawa - (parseInt(sambungBaik) || 0));
  const binahongBuruk = Math.max(0, currentTarget.binahong - (parseInt(binahongBaik) || 0));
  const ubiBuruk = Math.max(0, currentTarget.ubi - (parseInt(ubiBaik) || 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("monitoring_bibit").insert([
        {
          rw: rw,
          tanggal: tanggal,
          rosella_baik: parseInt(rosellaBaik) || 0,
          rosella_buruk: rosellaBuruk,
          sambung_nyawa_baik: parseInt(sambungBaik) || 0,
          sambung_nyawa_buruk: sambungBuruk,
          binahong_baik: parseInt(binahongBaik) || 0,
          binahong_buruk: binahongBuruk,
          ubi_baik: parseInt(ubiBaik) || 0,
          ubi_buruk: ubiBuruk,
          kegiatan: kegiatan,
          masalah: masalah,
          solusi: solusi,
        },
      ]);

      if (error) {
        console.error("Gagal menyimpan ke Supabase:", error);
        alert("Gagal menyimpan data: " + error.message);
      } else {
        alert(`Berhasil menyimpan data monitoring untuk ${rw}!`);
        router.push("/hasil");
      }
    } catch (err) {
      console.error("Terjadi kesalahan:", err);
      alert("Terjadi kesalahan tak terduga.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_rw");
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-16">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
              Area Input : {rw}
            </span>
            <h1 className="text-lg font-black text-slate-900 mt-1">Form Monitoring Harian</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 px-3.5 py-2 rounded-xl transition"
          >
            Keluar (Logout)
          </button>
        </div>
      </header>

      {/* Form Content */}
      <section className="max-w-4xl mx-auto px-6 pt-10">
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm">
          <div className="mb-8 pb-6 border-b border-slate-100">
            <h2 className="text-xl font-black text-slate-900">Input Data Pertumbuhan Bibit TOGA</h2>
            <p className="text-sm text-slate-500 mt-1">
              Masukkan jumlah tanaman yang dalam kondisi **Baik/Sehat**. Kondisi Buruk/Mati akan dihitung otomatis oleh sistem berdasarkan target awal wilayah Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Tanggal Laporan */}
            <div>
              <label className="block font-bold text-sm text-slate-700 mb-2">Tanggal Laporan</label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full md:w-1/2 border border-slate-200 rounded-2xl p-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                required
              />
            </div>

            {/* Grid Input Tanaman */}
            <div className="space-y-4">
              <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">Rincian Jumlah Tanaman</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Rosella */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-black text-slate-800">🌺 Rosella</h4>
                    <span className="text-xs font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-lg">Target: {currentTarget.rosella}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Kondisi Baik</label>
                      <input
                        type="number"
                        min="0"
                        max={currentTarget.rosella}
                        value={rosellaBaik}
                        onChange={(e) => setRosellaBaik(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-white font-bold text-emerald-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Kondisi Buruk (Auto)</label>
                      <input
                        type="number"
                        value={rosellaBuruk}
                        readOnly
                        className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-200 font-bold text-red-600 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Sambung Nyawa */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-black text-slate-800">🍃 Sambung Nyawa</h4>
                    <span className="text-xs font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-lg">Target: {currentTarget.sambung_nyawa}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Kondisi Baik</label>
                      <input
                        type="number"
                        min="0"
                        max={currentTarget.sambung_nyawa}
                        value={sambungBaik}
                        onChange={(e) => setSambungBaik(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-white font-bold text-emerald-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Kondisi Buruk (Auto)</label>
                      <input
                        type="number"
                        value={sambungBuruk}
                        readOnly
                        className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-200 font-bold text-red-600 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Binahong */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-black text-slate-800">🌿 Binahong</h4>
                    <span className="text-xs font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-lg">Target: {currentTarget.binahong}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Kondisi Baik</label>
                      <input
                        type="number"
                        min="0"
                        max={currentTarget.binahong}
                        value={binahongBaik}
                        onChange={(e) => setBinahongBaik(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-white font-bold text-emerald-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Kondisi Buruk (Auto)</label>
                      <input
                        type="number"
                        value={binahongBuruk}
                        readOnly
                        className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-200 font-bold text-red-600 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Ubi Jalar Kuning */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-black text-slate-800">🍠 Ubi Jalar Kuning</h4>
                    <span className="text-xs font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-lg">Target: {currentTarget.ubi}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Kondisi Baik</label>
                      <input
                        type="number"
                        min="0"
                        max={currentTarget.ubi}
                        value={ubiBaik}
                        onChange={(e) => setUbiBaik(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-white font-bold text-emerald-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Kondisi Buruk (Auto)</label>
                      <input
                        type="number"
                        value={ubiBuruk}
                        readOnly
                        className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-200 font-bold text-red-600 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Catatan Lapangan */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">Catatan Lapangan & Evaluasi</h3>

              <div>
                <label className="block font-bold text-sm text-slate-700 mb-1">Kegiatan Perawatan Hari Ini</label>
                <textarea
                  value={kegiatan}
                  onChange={(e) => setKegiatan(e.target.value)}
                  placeholder="Contoh: Melakukan penyiraman rutin dan pemupukan organik..."
                  className="w-full border border-slate-200 rounded-2xl p-3.5 text-sm h-24 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-bold text-sm text-slate-700 mb-1">Kendala / Masalah yang Ditemui</label>
                <textarea
                  value={masalah}
                  onChange={(e) => setMasalah(e.target.value)}
                  placeholder="Contoh: Ada beberapa daun yang terserang ulat daun..."
                  className="w-full border border-slate-200 rounded-2xl p-3.5 text-sm h-24 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-bold text-sm text-slate-700 mb-1">Solusi / Tindak Lanjut</label>
                <textarea
                  value={solusi}
                  onChange={(e) => setSolusi(e.target.value)}
                  placeholder="Contoh: Menyemprotkan pestisida nabati buatan warga..."
                  className="w-full border border-slate-200 rounded-2xl p-3.5 text-sm h-24 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                />
              </div>
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white p-4 rounded-2xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              {loading ? "Menyimpan ke Database..." : "Simpan & Publikasikan Data Monitoring →"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}