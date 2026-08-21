"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [rw, setRw] = useState("RW 01");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      localStorage.setItem("user_rw", rw);
      router.push("/input");
    } else {
      alert("Password salah! (Gunakan: admin123)");
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-900/5">
        <div className="mb-8">
          <Link href="/" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition">
            ← Kembali ke Dashboard
          </Link>
          <span className="block bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider w-fit mt-4 mb-3">
            Otorisasi Pengurus
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Login Admin RW</h1>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Pilih wilayah RW Anda dan masukkan sandi akses untuk mulai memperbarui data monitoring harian.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block font-bold text-sm text-slate-700 mb-2">Pilih Wilayah RW</label>
            <select
              value={rw}
              onChange={(e) => setRw(e.target.value)}
              className="w-full border border-slate-200 rounded-2xl p-3.5 text-sm font-bold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="RW 01">RW 01</option>
              <option value="RW 02">RW 02</option>
              <option value="RW 03">RW 03</option>
              <option value="RW 04">RW 04</option>
              <option value="RW 05">RW 05</option>
              <option value="RW 06">RW 06</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-sm text-slate-700 mb-2">Password Akses</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-slate-200 rounded-2xl p-3.5 text-sm font-bold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white p-4 rounded-2xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20"
          >
            Masuk ke Halaman Input →
          </button>
        </form>
      </div>
    </main>
  );
}