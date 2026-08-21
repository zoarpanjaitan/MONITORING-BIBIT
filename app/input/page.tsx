"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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
    if (!activeRw) router.push("/login");
    else setRw(activeRw);
    setTanggal(new Date().toISOString().split("T")[0]);
  }, [router]);

  const currentTarget = TARGET_BIBIT_RW[rw] || { rosella: 0, binahong: 0, sambung_nyawa: 0, ubi: 0 };
  const rosellaBuruk = Math.max(0, currentTarget.rosella - (parseInt(rosellaBaik) || 0));
  const sambungBuruk = Math.max(0, currentTarget.sambung_nyawa - (parseInt(sambungBaik) || 0));
  const binahongBuruk = Math.max(0, currentTarget.binahong - (parseInt(binahongBaik) || 0));
  const ubiBuruk = Math.max(0, currentTarget.ubi - (parseInt(ubiBaik) || 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("monitoring_bibit").insert([{
      rw, tanggal, kegiatan, masalah, solusi,
      rosella_baik: parseInt(rosellaBaik) || 0, rosella_buruk: rosellaBuruk,
      sambung_nyawa_baik: parseInt(sambungBaik) || 0, sambung_nyawa_buruk: sambungBuruk,
      binahong_baik: parseInt(binahongBaik) || 0, binahong_buruk: binahongBuruk,
      ubi_baik: parseInt(ubiBaik) || 0, ubi_buruk: ubiBuruk,
    }]);

    if (error) alert("Gagal menyimpan: " + error.message);
    else { alert("Berhasil menyimpan data!"); router.push("/hasil"); }
    setLoading(false);
  };

  return (
    <main className="min-h-screen text-slate-800 font-sans relative overflow-hidden pb-20">
      <div className="absolute inset-0 bg-cover bg-center fixed z-0 filter blur-[8px] scale-105" style={{ backgroundImage: `url('/foto/71.JPG')` }} />
      <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px] fixed z-0" />

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-4 flex justify-between items-center relative z-10">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-md">🌱</div>
             <div>
                <p className="text-[10px] font-extrabold tracking-widest text-emerald-600 uppercase">PPK ORMAWA BEM FK UNNES</p>
                <h1 className="text-base font-black text-slate-900">Form Monitoring {rw}</h1>
             </div>
          </div>
          <button onClick={() => { localStorage.removeItem("user_rw"); router.push("/login"); }} className="text-xs font-bold text-red-600 bg-red-50 px-4 py-2.5 rounded-2xl transition">Keluar</button>
        </div>
      </header>

      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-10 relative z-10">
        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white shadow-xl shadow-slate-900/5">
          <div className="mb-10 pb-6 border-b border-slate-200">
            <h2 className="text-2xl font-black text-slate-900">Input Data Pertumbuhan Bibit TOGA</h2>
            <p className="text-sm text-slate-500 mt-2">Kondisi Buruk/Mati akan dihitung otomatis oleh sistem.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <label className="block font-bold text-sm text-slate-700">Tanggal Laporan</label>
              <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="w-full border border-slate-200 rounded-2xl p-4 bg-slate-50 font-bold" required />
              
              <h3 className="font-black text-sm uppercase text-slate-900 pt-4">Rincian Tanaman</h3>
              {[ { label: "Rosella", target: currentTarget.rosella, val: rosellaBaik, set: setRosellaBaik, buruk: rosellaBuruk },
                 { label: "Sambung Nyawa", target: currentTarget.sambung_nyawa, val: sambungBaik, set: setSambungBaik, buruk: sambungBuruk },
                 { label: "Binahong", target: currentTarget.binahong, val: binahongBaik, set: setBinahongBaik, buruk: binahongBuruk },
                 { label: "Ubi Jalar", target: currentTarget.ubi, val: ubiBaik, set: setUbiBaik, buruk: ubiBuruk } ].map((item, i) => (
                <div key={i} className="grid grid-cols-3 gap-4 items-center bg-slate-50 p-4 rounded-2xl">
                  <span className="font-bold text-sm">{item.label} <br/> <span className="text-[10px] text-slate-400">Target: {item.target}</span></span>
                  <input type="number" value={item.val} onChange={(e) => item.set(e.target.value)} className="border rounded-xl p-3 font-bold text-emerald-600" />
                  <input type="number" value={item.buruk} readOnly className="border rounded-xl p-3 font-bold text-red-600 bg-slate-100" />
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {[ { label: "Kegiatan Perawatan", val: kegiatan, set: setKegiatan, ph: "Contoh: Penyiraman rutin..." },
                 { label: "Kendala", val: masalah, set: setMasalah, ph: "Contoh: Ada ulat daun..." },
                 { label: "Solusi", val: solusi, set: setSolusi, ph: "Contoh: Pestisida nabati..." } ].map((f, i) => (
                <div key={i}>
                  <label className="block font-bold text-sm text-slate-700 mb-2">{f.label}</label>
                  <textarea value={f.val} onChange={(e) => f.set(e.target.value)} placeholder={f.ph} className="w-full border border-slate-200 rounded-2xl p-4 h-28 bg-slate-50 font-medium" />
                </div>
              ))}
              <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white p-5 rounded-2xl font-black hover:bg-emerald-700 transition shadow-lg">
                {loading ? "Menyimpan..." : "Simpan & Publikasikan Laporan →"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}