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
  "RW 02": { rosella: 8, binahong: 10, sambung_nyawa: 8, ubi: 10 },
  "RW 03": { rosella: 10, binahong: 10, sambung_nyawa: 10, ubi: 20 },
  "RW 04": { rosella: 5, binahong: 5, sambung_nyawa: 5, ubi: 0 },
  "RW 05": { rosella: 10, binahong: 10, sambung_nyawa: 10, ubi: 25 },
  "RW 06": { rosella: 10, binahong: 10, sambung_nyawa: 5, ubi: 10 },
};

export default function HasilPage() {
  const [dataList, setDataList] = useState<MonitoringData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from("monitoring_bibit").select("*").order("tanggal", { ascending: false });
      setDataList(data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const uniqueDates = Array.from(new Set(dataList.map((item) => item.tanggal)));

  return (
    <main className="min-h-screen text-slate-800 font-sans relative overflow-hidden pb-20">
      
      {/* Background Foto 71 dengan Blur Elegan */}
      <div 
        className="absolute inset-0 bg-cover bg-center fixed z-0 filter blur-[8px] scale-105"
        style={{ backgroundImage: `url('/foto/71.JPG')` }}
      />
      
      {/* Overlay Putih Cerah (Supaya tetap bersih dan tidak kusam) */}
      <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px] fixed z-0" />

      {/* Header dengan Identitas Lengkap */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-md">
              🌱
            </div>
            <div>
              <p className="text-[10px] font-extrabold tracking-widest text-emerald-600 uppercase">
                PPK ORMAWA BEM FK UNNES
              </p>
              <h1 className="text-base font-black text-slate-900">
                Arsip Laporan Harian
              </h1>
            </div>
          </div>

          <Link 
            href="/" 
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-4 py-2.5 rounded-2xl transition border border-emerald-100"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 pt-10 space-y-10 relative z-10">
        
        {/* STATISTIK PERFORMA RW */}
        <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-xl shadow-slate-900/5">
          <div className="mb-6">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Executive Summary
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">Statistik Performa RW Saat Ini</h2>
            <p className="text-sm text-slate-500">Persentase kesehatan tanaman berdasarkan data laporan terakhir.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                <div key={rwKey} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-300 transition">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-black text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-xl">{rwKey}</span>
                    <span className="font-black text-emerald-600 text-lg">{score}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${score}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIWAYAT TANGGAL LAPORAN */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900">Riwayat Tanggal Monitoring</h2>
            <p className="text-sm text-slate-500 mt-1">
              Klik pada salah satu tanggal laporan untuk membuka rincian data lengkap seluruh wilayah RW.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16 bg-white/90 rounded-3xl border border-white shadow-sm">
              <p className="text-sm font-semibold text-slate-500 animate-pulse">Memuat arsip laporan...</p>
            </div>
          ) : uniqueDates.length === 0 ? (
            <div className="text-center py-16 bg-white/90 rounded-3xl border border-white shadow-sm">
              <p className="text-base font-bold text-slate-700">Belum ada riwayat laporan yang diinput.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {uniqueDates.map((tgl) => (
                <Link
                  key={tgl}
                  href={`/hasil/${tgl}`}
                  className="group bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-sm hover:border-emerald-500 hover:shadow-xl transition-all flex items-center justify-between"
                >
                  <div className="flex items-center space-x-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xl group-hover:scale-110 transition">
                      📅
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition">
                        Monitoring Tanggal {tgl}
                      </h3>
                      <p className="text-sm text-slate-400 mt-0.5">Klik untuk melihat rincian data per-RW</p>
                    </div>
                  </div>

                  <span className="bg-slate-900 text-white group-hover:bg-emerald-600 font-bold text-sm px-6 py-3 rounded-xl transition flex items-center gap-2">
                    Buka Laporan
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}