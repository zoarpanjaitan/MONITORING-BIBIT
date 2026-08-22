"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/input";

  const [rw, setRw] = useState("RW 01");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      if (password === "admin123") {
        localStorage.setItem("user_rw", rw);
        router.push(redirectTo);
      } else {
        setError("Password salah! (Gunakan: admin123)");
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="mb-6">
          <Link href="/" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition">
            ← Kembali ke Beranda
          </Link>
          <h1 className="text-2xl font-black text-white tracking-tight mt-4">Login Admin RW</h1>
          <p className="text-sm text-slate-400 mt-1">
            Pilih wilayah RW Anda dan masukkan sandi akses.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Pilih Wilayah RW Binaan
            </label>
            <select
              value={rw}
              onChange={(e) => setRw(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Password Akses
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-2xl font-bold transition shadow-lg shadow-emerald-600/20 text-sm disabled:opacity-50"
          >
            {isLoading ? "Memproses..." : "Masuk ke Sistem →"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Memuat...</div>}>
      <LoginForm />
    </Suspense>
  );
}