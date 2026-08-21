"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [rw, setRw] = useState("RW 01");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulasi jeda autentikasi profesional ala sistem nasional
    setTimeout(() => {
      if (password === "admin123") {
        localStorage.setItem("user_rw", rw);
        router.push("/input");
      } else {
        setError("Autentikasi Gagal: Sandi akses wilayah tidak valid.");
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      
      {/* Background Glow Ornaments Ala SaaS Modern */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
        
        {/* Navigation & Badge */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/" 
            className="text-xs font-semibold text-slate-400 hover:text-emerald-400 transition flex items-center gap-1.5"
          >
            <span>←</span> Beranda Utama
          </Link>
          <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Secure Gateway
          </span>
        </div>

        {/* Heading Section */}
        <div className="space-y-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl font-bold mb-4">
            🌿
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Portal Admin RW
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Sistem Informasi Monitoring Bibit Tanaman Obat Keluarga (TOGA) Berbasis Wilayah Terpadu.
          </p>
        </div>

        {/* Error Notification Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-3 animate-shake">
            <span className="text-base">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form Authentication */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Pilih Wilayah RW Binaan
            </label>
            <div className="relative">
              <select
                value={rw}
                onChange={(e) => setRw(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition appearance-cursor"
              >
                <option value="RW 01" className="bg-slate-900">RW 01 - Desa Binaan Utama</option>
                <option value="RW 02" className="bg-slate-900">RW 02 - Sektor Konservasi</option>
                <option value="RW 03" className="bg-slate-900">RW 03 - Klaster Produktif</option>
                <option value="RW 04" className="bg-slate-900">RW 04 - Sentra Pembibitan</option>
                <option value="RW 05" className="bg-slate-900">RW 05 - Zona Mandiri</option>
                <option value="RW 06" className="bg-slate-900">RW 06 - Pengembangan Inovasi</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Sandi Akses Wilayah
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Default: admin123</span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm font-semibold text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold py-4 px-6 rounded-2xl transition duration-200 shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-95" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Memverifikasi Kredensial...</span>
              </>
            ) : (
              <span>Masuk ke Dashboard Input →</span>
            )}
          </button>
        </form>

        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-500 font-medium">
            Program Pemberdayaan Masyarakat Desa &bull; PPK Ormawa 2026
          </p>
        </div>

      </div>
    </main>
  );
}