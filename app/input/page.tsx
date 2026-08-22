"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface TargetTanaman {
  id: number;
  nama_tanaman: string;
  jumlah_target: number;
}

export default function InputMonitoringPage() {
  const router = useRouter();
  const [rw, setRw] = useState("RW 01");
  const [loading, setLoading] = useState(false);
  const [fetchingTarget, setFetchingTarget] = useState(true);

  const [tanggal, setTanggal] = useState("");
  const [targetList, setTargetList] = useState<TargetTanaman[]>([]);
  const [inputBaik, setInputBaik] = useState<Record<string, string>>({});

  const [kegiatan, setKegiatan] = useState("");
  const [masalah, setMasalah] = useState("");
  const [solusi, setSolusi] = useState("");

  useEffect(() => {
    const activeRw = localStorage.getItem("user_rw");
    if (!activeRw) {
      router.push("/login");
    } else {
      setRw(activeRw);
      fetchTargetTanaman(activeRw);
    }
    setTanggal(new Date().toISOString().split("T")[0]);
  }, [router]);

  // Mengambil data tanaman dinamis dari Supabase sesuai RW yang login
  const fetchTargetTanaman = async (currentRw: string) => {
    setFetchingTarget(true);
    const { data, error } = await supabase
      .from("target_tanaman_rw")
      .select("*")
      .eq("rw", currentRw)
      .order("id", { ascending: true });

    if (error) {
      console.error("Gagal mengambil target tanaman:", error.message);
    } else {
      setTargetList(data || []);
      const initialBaik: Record<string, string> = {};
      data?.forEach((item) => {
        initialBaik[item.nama_tanaman] = "0";
      });
      setInputBaik(initialBaik);
    }
    setFetchingTarget(false);
  };

  const handleInputChange = (namaTanaman: string, val: string) => {
    setInputBaik((prev) => ({ ...prev, [namaTanaman]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payloadData: Record<string, any> = {
      rw,
      tanggal,
      kegiatan,
      masalah,
      solusi,
    };

    targetList.forEach((item) => {
      const baik = parseInt(inputBaik[item.nama_tanaman]) || 0;
      const buruk = Math.max(0, item.jumlah_target - baik);
      
      payloadData[`${item.nama_tanaman.toLowerCase().replace(/\s+/g, '_')}_baik`] = baik;
      payloadData[`${item.nama_tanaman.toLowerCase().replace(/\s+/g, '_')}_buruk`] = buruk;
    });

    const { error } = await supabase.from("monitoring_bibit").insert([payloadData]);

    if (error) {
      alert("Gagal menyimpan: " + error.message);
    } else {
      alert("Berhasil menyimpan data monitoring!");
      router.push("/hasil");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen text-slate-800 font-sans relative overflow-hidden pb-20">
      <div className="absolute inset-0 bg-cover bg-center fixed z-0 filter blur-[8px] scale-105" style={{ backgroundImage: `url('/foto/71.JPG')` }} />
      <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px] fixed z-0" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-4 flex justify-between items-center relative z-10">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-md">🌱</div>
             <div>
                <p className="text-[10px] font-extrabold tracking-widest text-emerald-600 uppercase">PPK ORMAWA BEM FK UNNES</p>
                <h1 className="text-base font-black text-slate-900">Form Monitoring {rw}</h1>
             </div>
          </div>
          <button 
            onClick={() => { localStorage.removeItem("user_rw"); router.push("/login"); }} 
            className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-2xl transition"
          >
            Keluar
          </button>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-10 relative z-10">
        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white shadow-xl shadow-slate-900/5">
          <div className="mb-10 pb-6 border-b border-slate-200 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Input Data Pertumbuhan Bibit TOGA</h2>
              <p className="text-sm text-slate-500 mt-2">
                Daftar tanaman di bawah ini otomatis sinkron dengan data yang Anda atur di menu <strong>Kelola Tanaman TOGA</strong>.
              </p>
            </div>
          </div>

          {fetchingTarget ? (
            <div className="text-center py-20">
              <p className="text-sm font-semibold text-slate-500 animate-pulse">Memuat rincian tanaman wilayah Anda...</p>
            </div>
          ) : targetList.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
              <p className="text-base font-bold text-slate-700">Belum ada tanaman yang terdaftar untuk wilayah {rw}.</p>
              <p className="text-sm text-slate-400 mt-2 mb-6">Silakan tambahkan jenis tanaman terlebih dahulu di menu Kelola Tanaman.</p>
              <Link href="/kelola-tanaman" className="bg-emerald-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md inline-block">
                Buka Kelola Tanaman TOGA →
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="block font-bold text-sm text-slate-700 mb-2">Tanggal Laporan</label>
                  <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="w-full border border-slate-200 rounded-2xl p-4 bg-slate-50 font-bold" required />
                </div>
                
                <h3 className="font-black text-sm uppercase text-slate-900 pt-4">Rincian Tanaman RW</h3>
                
                {targetList.map((item) => {
                  const valBaik = inputBaik[item.nama_tanaman] || "0";
                  const valBuruk = Math.max(0, item.jumlah_target - (parseInt(valBaik) || 0));

                  return (
                    <div key={item.id} className="grid grid-cols-3 gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div>
                        <span className="font-bold text-sm text-slate-800 block">{item.nama_tanaman}</span>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-lg mt-1 inline-block">
                          Target: {item.jumlah_target}
                        </span>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Kondisi Baik</label>
                        <input 
                          type="number" 
                          min="0"
                          max={item.jumlah_target}
                          value={valBaik} 
                          onChange={(e) => handleInputChange(item.nama_tanaman, e.target.value)} 
                          className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-white font-bold text-emerald-600" 
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">Buruk (Auto)</label>
                        <input 
                          type="number" 
                          value={valBuruk} 
                          readOnly 
                          className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-200 font-bold text-red-600 cursor-not-allowed" 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-6">
                {[ { label: "Kegiatan Perawatan", val: kegiatan, set: setKegiatan, ph: "Contoh: Penyiraman rutin..." },
                   { label: "Kendala", val: masalah, set: setMasalah, ph: "Contoh: Ada ulat daun..." },
                   { label: "Solusi", val: solusi, set: setSolusi, ph: "Contoh: Pestisida nabati..." } ].map((f, i) => (
                  <div key={i}>
                    <label className="block font-bold text-sm text-slate-700 mb-2">{f.label}</label>
                    <textarea value={f.val} onChange={(e) => f.set(e.target.value)} placeholder={f.ph} className="w-full border border-slate-200 rounded-2xl p-4 h-28 bg-slate-50 font-medium text-sm" />
                  </div>
                ))}
                
                <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white p-5 rounded-2xl font-black hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20">
                  {loading ? "Menyimpan..." : "Simpan & Publikasikan Laporan →"}
                </button>
              </div>
            </div>
          )}
        </form>
      </section>
    </main>
  );
}