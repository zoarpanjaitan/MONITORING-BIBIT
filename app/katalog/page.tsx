"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface TogaItem {
  id: string;
  nama: string;
  latin: string;
  kategori: string;
  deskripsi: string;
  manfaat: string;
  perawatan: string;
  icon: string;
  rw: string;
  nama_penginput: string;
}

const RW_PASSWORDS: Record<string, string> = {
  "RW 01": "rw01_unnes",
  "RW 02": "rw02_unnes",
  "RW 03": "rw03_unnes",
  "RW 04": "rw04_unnes",
  "RW 05": "rw05_unnes",
  "RW 06": "rw06_unnes",
};

export default function KatalogPage() {
  const [katalogList, setKatalogList] = useState<TogaItem[]>([]);
  const [loading, setLoading] = useState(true);

  // State Kontrol Modal & Auth
  const [step, setStep] = useState<"view" | "auth" | "form">("view");
  const [selectedRw, setSelectedRw] = useState("RW 01");
  const [namaPenginput, setNamaPenginput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  // State Form Input / Edit Tanaman
  const [editId, setEditId] = useState<string | null>(null);
  const [nama, setNama] = useState("");
  const [latin, setLatin] = useState("");
  const [kategori, setKategori] = useState("Tanaman Herbal");
  const [deskripsi, setDeskripsi] = useState("");
  const [manfaat, setManfaat] = useState("");
  const [perawatan, setPerawatan] = useState("");
  const [icon, setIcon] = useState("🌿");
  const [submitting, setSubmitting] = useState(false);

  const fetchKatalog = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("katalog_toga")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching katalog:", error);
      } else {
        setKatalogList(data || []);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKatalog();
  }, []);

  const handleVerifyAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPenginput.trim()) {
      setAuthError("Nama penginput wajib diisi!");
      return;
    }
    if (RW_PASSWORDS[selectedRw] === passwordInput) {
      setAuthError("");
      setPasswordInput("");
      setStep("form");
    } else {
      setAuthError("Password RW salah! Silakan coba lagi.");
    }
  };

  const handleSaveTanaman = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editId) {
        const { error } = await supabase
          .from("katalog_toga")
          .update({ nama, latin, kategori, deskripsi, manfaat, perawatan, icon, rw: selectedRw, nama_penginput: namaPenginput })
          .eq("id", editId);

        if (error) alert("Gagal mengupdate: " + error.message);
        else {
          alert("Katalog tanaman berhasil diperbarui!");
          closeModal();
          fetchKatalog();
        }
      } else {
        const { error } = await supabase.from("katalog_toga").insert([
          { nama, latin, kategori, deskripsi, manfaat, perawatan, icon, rw: selectedRw, nama_penginput: namaPenginput },
        ]);

        if (error) alert("Gagal menambahkan tanaman: " + error.message);
        else {
          alert(`Tanaman baru berhasil dipublikasikan oleh ${namaPenginput} (${selectedRw})!`);
          closeModal();
          fetchKatalog();
        }
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item: TogaItem) => {
    const pwd = prompt(`Verifikasi Keamanan\nMasukkan password untuk ${item.rw || "Admin"} untuk menghapus data ini:`);
    if (!pwd) return;

    if (RW_PASSWORDS[item.rw] === pwd || pwd === "admin_unnes") {
      const { error } = await supabase.from("katalog_toga").delete().eq("id", item.id);
      if (error) alert("Gagal menghapus: " + error.message);
      else {
        alert("Tanaman berhasil dihapus dari katalog.");
        fetchKatalog();
      }
    } else {
      alert("Password salah! Penghapusan dibatalkan.");
    }
  };

  const handleOpenEdit = (item: TogaItem) => {
    const pwd = prompt(`Verifikasi Keamanan\nMasukkan password untuk ${item.rw || "Admin"} untuk mengedit data ini:`);
    if (!pwd) return;

    if (RW_PASSWORDS[item.rw] === pwd || pwd === "admin_unnes") {
      setEditId(item.id);
      setSelectedRw(item.rw || "RW 01");
      setNamaPenginput(item.nama_penginput || "");
      setNama(item.nama);
      setLatin(item.latin);
      setKategori(item.kategori);
      setDeskripsi(item.deskripsi);
      setManfaat(item.manfaat);
      setPerawatan(item.perawatan);
      setIcon(item.icon || "🌿");
      setStep("form");
    } else {
      alert("Password salah! Edit dibatalkan.");
    }
  };

  const closeModal = () => {
    setStep("view");
    setEditId(null);
    setPasswordInput("");
    setAuthError("");
    setNama("");
    setLatin("");
    setDeskripsi("");
    setManfaat("");
    setPerawatan("");
  };

  return (
    <main className="min-h-screen text-slate-800 font-sans relative overflow-hidden pb-20">
      
      {/* Background Foto 71 dengan Blur Elegan */}
      <div 
        className="absolute inset-0 bg-cover bg-center fixed z-0 filter blur-[8px] scale-105"
        style={{ backgroundImage: `url('/foto/71.JPG')` }}
      />
      
      {/* Overlay Putih Cerah */}
      <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px] fixed z-0" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-4 flex justify-between items-center relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-md">
              🌱
            </div>
            <div>
              <p className="text-[10px] font-extrabold tracking-widest text-emerald-600 uppercase">
                PPK ORMAWA BEM FK UNNES
              </p>
              <h1 className="text-base font-black text-slate-900">
                Ensiklopedi Katalog TOGA
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setStep("auth")}
              className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-2xl transition shadow-md shadow-emerald-600/20"
            >
              + Tambah Tanaman RW
            </button>
            <Link 
              href="/" 
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-4 py-2.5 rounded-2xl transition border border-emerald-100"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content (Lebar Penuh 1440px) */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-10 space-y-10 relative z-10">
        
        {/* Hero Section Katalog */}
        <div className="bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white shadow-xl shadow-slate-900/5 text-center max-w-3xl mx-auto">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Edukasi & Pustaka Tanaman Warga
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-4 tracking-tight">
            Kenali Jenis Tanaman Obat Keluarga
          </h2>
          <p className="text-sm text-slate-500 mt-3 leading-relaxed">
            Pusat informasi digital interaktif. Scan barcode di samping tanaman untuk langsung membaca khasiat dan panduan perawatannya.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 bg-white/90 rounded-3xl border border-white shadow-sm">
            <p className="text-sm font-semibold text-slate-500 animate-pulse">Memuat data katalog tanaman...</p>
          </div>
        ) : katalogList.length === 0 ? (
          <div className="text-center py-20 bg-white/90 rounded-3xl border border-white shadow-sm">
            <p className="text-base font-bold text-slate-700">Belum ada katalog tanaman yang ditambahkan.</p>
            <p className="text-sm text-slate-400 mt-1">Silakan verifikasi RW dan klik tombol "Tambah Tanaman RW" di atas.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {katalogList.map((item) => (
              <div key={item.id} className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-xl shadow-slate-900/5 hover:shadow-2xl transition flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl shadow-inner">
                      {item.icon || "🌿"}
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full uppercase">
                        {item.rw || "RW 01"}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        Oleh: {item.nama_penginput || "Warga/Kader"}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900">{item.nama}</h3>
                  <p className="text-xs font-semibold italic text-slate-400 mt-0.5">{item.latin}</p>
                  
                  <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                    {item.deskripsi}
                  </p>

                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">Khasiat & Manfaat:</h4>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      {item.manfaat}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100/60 text-xs text-slate-600">
                    <strong className="text-slate-900 block font-bold mb-1">🌱 Tips Perawatan:</strong>
                    <p>{item.perawatan}</p>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3.5 py-2 rounded-xl transition border border-amber-200"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl transition border border-red-200"
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MODAL AUTH RW */}
      {step === "auth" && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-1">Otorisasi Akses RW</h3>
            <p className="text-xs text-slate-500 mb-6">
              Masukkan identitas Anda dan password akses wilayah untuk mempublikasikan tanaman ke katalog.
            </p>

            <form onSubmit={handleVerifyAuth} className="space-y-4 text-sm">
              <div>
                <label className="block font-bold text-xs text-slate-700 mb-1">Nama Penginput / Kader</label>
                <input
                  type="text"
                  placeholder="Contoh: Ibu Siti / Budi Santoso"
                  value={namaPenginput}
                  onChange={(e) => setNamaPenginput(e.target.value)}
                  className="w-full border rounded-2xl p-3.5 bg-slate-50 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-xs text-slate-700 mb-1">Pilih Wilayah RW</label>
                <select
                  value={selectedRw}
                  onChange={(e) => setSelectedRw(e.target.value)}
                  className="w-full border rounded-2xl p-3.5 bg-slate-50 font-bold"
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
                <label className="block font-bold text-xs text-slate-700 mb-1">Password RW</label>
                <input
                  type="password"
                  placeholder="Masukkan password..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full border rounded-2xl p-3.5 bg-slate-50 font-medium"
                  required
                />
              </div>

              {authError && <p className="text-xs font-bold text-red-500">{authError}</p>}

              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-bold transition shadow-lg shadow-emerald-600/20"
                >
                  Verifikasi →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FORM INPUT / EDIT TANAMAN */}
      {step === "form" && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase">
                  {selectedRw} | Oleh: {namaPenginput}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  {editId ? "Edit Katalog Tanaman" : "Tambah Tanaman TOGA Baru"}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTanaman} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-xs text-slate-700 mb-1">Nama Tanaman</label>
                  <input
                    type="text"
                    placeholder="Contoh: Kencur"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full border rounded-2xl p-3 bg-slate-50 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-xs text-slate-700 mb-1">Nama Latin (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: Kaempferia galanga"
                    value={latin}
                    onChange={(e) => setLatin(e.target.value)}
                    className="w-full border rounded-2xl p-3 bg-slate-50 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-xs text-slate-700 mb-1">Kategori</label>
                  <input
                    type="text"
                    placeholder="Contoh: Tanaman Rimpang"
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full border rounded-2xl p-3 bg-slate-50 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-xs text-slate-700 mb-1">Icon Emoji</label>
                  <input
                    type="text"
                    placeholder="🌿 / 🌺 / 🍠"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full border rounded-2xl p-3 bg-slate-50 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-xs text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea
                  placeholder="Penjelasan umum mengenai tanaman..."
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="w-full border rounded-2xl p-3 bg-slate-50 h-20 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-xs text-slate-700 mb-1">Khasiat & Manfaat Kesehatan</label>
                <textarea
                  placeholder="Sebutkan khasiat utamanya..."
                  value={manfaat}
                  onChange={(e) => setManfaat(e.target.value)}
                  className="w-full border rounded-2xl p-3 bg-slate-50 h-20 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-xs text-slate-700 mb-1">Tips Perawatan</label>
                <textarea
                  placeholder="Cara penyiraman atau kondisi tanah yang dibutuhkan..."
                  value={perawatan}
                  onChange={(e) => setPerawatan(e.target.value)}
                  className="w-full border rounded-2xl p-3 bg-slate-50 h-20 font-medium"
                  required
                />
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-bold transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Publikasikan Tanaman"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}