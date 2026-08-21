"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface MonitoringData {
  id: string;
  tanggal: string;
  rw: string;
  rosella_baik: number;
  sambung_nyawa_baik: number;
  binahong_baik: number;
  ubi_baik: number;
}

const TARGET_BIBIT_RW: Record<string, { rosella: number; binahong: number; sambung_nyawa: number; ubi: number }> = {
  "RW 01": { rosella: 20, binahong: 20, sambung_nyawa: 15, ubi: 50 },
  "RW 02": { rosella: 8,  binahong: 10, sambung_nyawa: 8,  ubi: 10 },
  "RW 03": { rosella: 10, binahong: 10, sambung_nyawa: 10, ubi: 20 },
  "RW 04": { rosella: 5,  binahong: 5,  sambung_nyawa: 5,  ubi: 0  },
  "RW 05": { rosella: 10, binahong: 10, sambung_nyawa: 10, ubi: 25 },
  "RW 06": { rosella: 10, binahong: 10, sambung_nyawa: 5,  ubi: 10 },
};

export default function HasilPage() {
  const [dataList, setDataList] = useState<MonitoringData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from("monitoring_bibit")
          .select("*")
          .order("tanggal", { ascending: false });

        if (error) {
          console.error("Error fetching data:", error);
        } else {
          setDataList(data || []);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Ambil daftar tanggal unik secara descending (terbaru di atas)
  const uniqueDates = Array.from(new Set(dataList.map((item) => item.tanggal)));

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-extrabold tracking-widest text-emerald-600 uppercase">
              PPK ORMAWA BEM FK UNNES
            </p>
            <h1 className="text-lg font-black text-slate-900">Arsip Laporan Harian</h1>
          </div>

          <Link 
            href="/" 
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl transition"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        
        {/* STATISTIK RINGKAS PERFORMANSI RW */}
        <div>
          <h2 className="text-xl font-black text-slate-900 mb-4">Statistik Performa RW Saat Ini</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(TARGET_BIBIT_RW).map((rwKey) => {
              const latest = dataList.find((d) => d.rw === rwKey);
              const target = TARGET_BIBIT_RW[rwKey];
              const totalTarget = target.rosella + target.binahong + target.sambung_nyawa + target.ubi;
              
              let score = 0;
              if (latest && totalTarget > 0) {
                const sehat = Number(latest.rosella_baik || 0) + Number(latest.sambung_nyawa_baik || 0) + Number(latest.binahong_baik || 0) + Number(latest.ubi_baik || 0);
                score = Math.min(100, Math.round((sehat / totalTarget) * 100));
              }

              return (
                <div key={rwKey} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-black text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">{rwKey}</span>
                    <span className="font-black text-emerald-600 text-lg">{score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${score}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* LIST TANGGAL LAPORAN (DESCENDING) */}
        <div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Riwayat Tanggal Monitoring</h2>
          <p className="text-sm text-slate-500 mb-4">
            Klik pada salah satu tanggal laporan di bawah untuk membuka halaman rincian data seluruh RW.
          </p>

          {loading ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-sm font-semibold text-slate-500 animate-pulse">Memuat arsip tanggal...</p>
            </div>
          ) : uniqueDates.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-base font-bold text-slate-700">Belum ada riwayat laporan yang diinput.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {uniqueDates.map((tgl) => (
                <Link
                  key={tgl}
                  href={`/hasil/${tgl}`}
                  className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-500 hover:shadow-md transition flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      📅
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-600 transition">
                        Monitoring Tanggal {tgl}
                      </h3>
                      <p className="text-xs text-slate-400">Klik untuk melihat laporan lengkap per-RW</p>
                    </div>
                  </div>

                  <span className="text-emerald-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
                    Buka Laporan →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

      </section>
    </main>
  );
}