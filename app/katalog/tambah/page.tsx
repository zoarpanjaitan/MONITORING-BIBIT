"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function TambahKatalogPage() {
  const router = useRouter();
  const [rw, setRw] = useState("");
  const [loading, setLoading] = useState(false);

  const [namaTanaman, setNamaTanaman] = useState("");
  const [namaLatin, setNamaLatin] = useState("");
  const [kategori, setKategori] = useState("Tanaman Herbal");
  const [deskripsi, setDeskripsi] = useState("");
  const [manfaat, setManfaat] = useState("");
  const [perawatan, setPerawatan] = useState("");
  const [penulis, setPenulis] = useState("");

  useEffect(() => {
    const activeRw = localStorage.getItem("user_rw");
    if (!activeRw) {
      alert("Silakan login terlebih dahulu sebagai Admin RW untuk menambahkan katalog.");
      router.push("/login?redirect=/katalog/tambah");
    } else {
      setRw(activeRw);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("katalog_toga").insert([
        {
          nama_tanaman: namaTanaman,
          nama_latin: namaLatin,
          kategori: kategori,
          deskripsi: deskripsi,
          manfaat: manfaat,
          perawatan: perawatan,
          rw_pembuat: rw,
          penulis: penulis || "Pengurus RW",
        },
      ]);

      if (error) {
        alert("Gagal menyimpan katalog: " + error.message);
      } else {
        alert(`Berhasil menambahkan tanaman baru ke katalog oleh ${rw}!`);
        router.push("/katalog");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan tak terduga.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-20">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
              Kontributor : {rw}
            </span>
            <h1 className="text-lg font-black text-slate-900 mt-1">Tambah Tanaman Katalog TOGA</h1>
          </div>
          <Link href="/katalog" className="text-sm font-bold text-slate-600 hover:text-slate-900">
            ← Kembali
          </Link>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 pt-10">
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-bold text-sm text-slate-700 mb-1">Nama Penulis / Kontributor</label>
              <input
                type="text"
                value={penulis}
                onChange={(e) => setPenulis(e.target.value)}
                placeholder="Contoh: Budi Santoso (Kader PKK RW 01)"
                className="w-full border rounded-2xl p-3.5 text-sm bg-slate-50 font-medium"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-sm text-slate-700 mb-1">Nama Tanaman</label>
                <input
                  type="text"
                  value={namaTanaman}
                  onChange={(e) => setNamaTanaman(e.target.value)}
                  placeholder="Contoh: Kencur / Jahe Merah"
                  className="w-full border rounded-2xl p-3.5 text-sm bg-slate-50 font-medium"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-sm text-slate-700 mb-1">Nama Ilmiah (Latin)</label>
                <input
                  type="text"
                  value={namaLatin}
                  onChange={(e) => setNamaLatin(e.target.value)}
                  placeholder="Contoh: Kaempferia galanga"
                  className="w-full border rounded-2xl p-3.5 text-sm bg-slate-50 font-medium italic"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-sm text-slate-700 mb-1">Kategori Tanaman</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full border rounded-2xl p-3.5 text-sm bg-slate-50 font-bold"
              >
                <option value="Tanaman Herbal">Tanaman Herbal</option>
                <option value="Tanaman Rimpang / Umbi">Tanaman Rimpang / Umbi</option>
                <option value="Tanaman Daun / Sayur">Tanaman Daun / Sayur</option>
                <option value="Tanaman Batang / Kayu">Tanaman Batang / Kayu</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-sm text-slate-700 mb-1">Deskripsi Singkat</label>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Jelaskan karakteristik umum tanaman ini..."
                className="w-full border rounded-2xl p-3.5 text-sm h-24 bg-slate-50"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-sm text-slate-700 mb-1">Khasiat & Manfaat Kesehatan</label>
              <textarea
                value={manfaat}
                onChange={(e) => setManfaat(e.target.value)}
                placeholder="Sebutkan khasiat utamanya bagi kesehatan..."
                className="w-full border rounded-2xl p-3.5 text-sm h-24 bg-slate-50"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-sm text-slate-700 mb-1">Tips Perawatan & Budidaya</label>
              <textarea
                value={perawatan}
                onChange={(e) => setPerawatan(e.target.value)}
                placeholder="Bagaimana cara merawat tanaman ini di pekarangan?"
                className="w-full border rounded-2xl p-3.5 text-sm h-24 bg-slate-50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white p-4 rounded-2xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20"
            >
              {loading ? "Menyimpan..." : "Publikasikan ke Katalog TOGA →"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}