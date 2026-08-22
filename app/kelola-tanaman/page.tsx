"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface TanamanRw {
  id: number;
  rw: string;
  nama_tanaman: string;
  jumlah_target: number;
}

export default function KelolaTanamanPage() {
  const router = useRouter();
  const [rw, setRw] = useState("RW 01");
  const [tanamanList, setTanamanList] = useState<TanamanRw[]>([]);
  const [loading, setLoading] = useState(true);

  // State Form Tambah/Edit
  const [namaTanaman, setNamaTanaman] = useState("");
  const [jumlahTarget, setJumlahTarget] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const activeRw = localStorage.getItem("user_rw");
    if (!activeRw) {
      router.push("/login");
    } else {
      setRw(activeRw);
      fetchTanaman(activeRw);
    }
  }, [router]);

  const fetchTanaman = async (currentRw: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("target_tanaman_rw")
      .select("*")
      .eq("rw", currentRw)
      .order("id", { ascending: true });

    if (error) {
      console.error("Gagal mengambil data tanaman:", error.message);
    } else {
      setTanamanList(data || []);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaTanaman.trim() || !jumlahTarget) return;

    setSubmitting(true);
    if (editId !== null) {
      // Update
      const { error } = await supabase
        .from("target_tanaman_rw")
        .update({ nama_tanaman: namaTanaman, jumlah_target: parseInt(jumlahTarget) })
        .eq("id", editId);

      if (error) alert("Gagal mengupdate: " + error.message);
      else {
        alert("Target tanaman berhasil diperbarui!");
        resetForm();
        fetchTanaman(rw);
      }
    } else {
      // Insert Baru
      const { error } = await supabase
        .from("target_tanaman_rw")
        .insert([{ rw: rw, nama_tanaman: namaTanaman, jumlah_target: parseInt(jumlahTarget) }]);

      if (error) alert("Gagal menambahkan: " + error.message);
      else {
        alert("Tanaman baru berhasil ditambahkan ke daftar RW!");
        resetForm();
        fetchTanaman(rw);
      }
    }
    setSubmitting(false);
  };

  const handleEdit = (item: TanamanRw) => {
    setEditId(item.id);
    setNamaTanaman(item.nama_tanaman);
    setJumlahTarget(item.jumlah_target.toString());
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus tanaman ini dari daftar RW?")) return;

    const { error } = await supabase.from("target_tanaman_rw").delete().eq("id", id);
    if (error) alert("Gagal menghapus: " + error.message);
    else {
      alert("Tanaman berhasil dihapus.");
      fetchTanaman(rw);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setNamaTanaman("");
    setJumlahTarget("");
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
              <h1 className="text-base font-black text-slate-900">Kelola Tanaman Mandiri — {rw}</h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/input" className="text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-2xl transition border border-emerald-100">
              ← Kembali ke Form Input
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Kolom Form Tambah/Edit */}
          <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-xl shadow-slate-900/5 h-fit">
            <h2 className="text-xl font-black text-slate-900 mb-2">
              {editId !== null ? "Edit Target Tanaman" : "Tambah Tanaman Baru"}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Sesuaikan jenis tanaman dan jumlah target budidaya di wilayah {rw} untuk memastikan keberlanjutan program.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-bold text-xs text-slate-700 mb-1">Nama Tanaman / Rempah</label>
                <input
                  type="text"
                  placeholder="Contoh: Cabe Rawit, Jahe Merah"
                  value={namaTanaman}
                  onChange={(e) => setNamaTanaman(e.target.value)}
                  className="w-full border border-slate-200 rounded-2xl p-3.5 bg-slate-50 font-medium text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-xs text-slate-700 mb-1">Jumlah Target / Kapasitas</label>
                <input
                  type="number"
                  min="1"
                  placeholder="Contoh: 25"
                  value={jumlahTarget}
                  onChange={(e) => setJumlahTarget(e.target.value)}
                  className="w-full border border-slate-200 rounded-2xl p-3.5 bg-slate-50 font-bold text-sm text-emerald-600"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                {editId !== null && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl font-bold text-xs transition"
                  >
                    Batal
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className={`${editId !== null ? "w-1/2" : "w-full"} bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-bold text-xs transition shadow-lg shadow-emerald-600/20 disabled:opacity-50`}
                >
                  {submitting ? "Menyimpan..." : editId !== null ? "Update Target" : "+ Tambah Tanaman"}
                </button>
              </div>
            </form>
          </div>

          {/* Kolom List Daftar Tanaman RW */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-xl shadow-slate-900/5">
            <div className="mb-6">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">Daftar Aktif</span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">Tanaman Budidaya {rw}</h2>
              <p className="text-sm text-slate-500">Berikut adalah daftar tanaman yang terdaftar untuk dimonitor di wilayah Anda.</p>
            </div>

            {loading ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
                <p className="text-sm font-semibold text-slate-500 animate-pulse">Memuat data tanaman...</p>
              </div>
            ) : tanamanList.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
                <p className="text-base font-bold text-slate-700">Belum ada tanaman yang ditambahkan.</p>
                <p className="text-sm text-slate-400 mt-1">Gunakan form di samping untuk mulai menambahkan tanaman mandiri RW Anda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tanamanList.map((item) => (
                  <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center hover:border-emerald-300 transition">
                    <div>
                      <h3 className="font-black text-slate-900 text-base">{item.nama_tanaman}</h3>
                      <p className="text-xs font-bold text-emerald-600 mt-1">Target Budidaya: {item.jumlah_target} pohon/bibit</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition border border-amber-200"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition border border-red-200"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>
    </main>
  );
}