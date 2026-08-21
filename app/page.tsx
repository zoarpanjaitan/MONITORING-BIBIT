import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      {/* Navbar / Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-600/20">
              🌱
            </div>
            <div>
              <p className="text-[10px] font-extrabold tracking-widest text-emerald-600 uppercase">
                PPK ORMAWA BEM FK UNNES
              </p>
              <h1 className="text-base font-black text-slate-900">
                Sistem Monitoring TOGA
              </h1>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm font-semibold text-slate-600">
            <Link href="/hasil" className="hover:text-emerald-600 transition">Hasil Monitoring</Link>
            <Link href="/katalog" className="hover:text-emerald-600 transition">Katalog TOGA</Link>
            <Link 
              href="/login?redirect=/input" 
              className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-sm hover:bg-emerald-700 transition"
            >
              Login Admin RW
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section dengan Background Foto Asli */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <div className="relative overflow-hidden rounded-3xl shadow-xl shadow-emerald-950/10 min-h-[420px] flex items-center">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center z-0 scale-105 transform transition-transform duration-1000"
            style={{ backgroundImage: `url('/foto/IMG_1943.JPG')` }}
          ></div>

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-950/40 z-10"></div>

          {/* Content */}
          <div className="relative z-20 p-8 md:p-14 max-w-2xl text-white">
            <span className="inline-block bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-6 backdrop-blur-md">
              Inovasi Keberlanjutan Desa Binaan
            </span>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Kondisi Pembibitan TOGA, <br />
              <span className="text-emerald-400">Terpantau Transparan.</span>
            </h2>

            <p className="mt-6 text-slate-200 text-base md:text-lg leading-relaxed font-medium">
              Platform digital kolaboratif berbasis IoT & Web untuk memonitoring pertumbuhan Tanaman Obat Keluarga di setiap RW demi mewujudkan kemandirian kesehatan warga desa.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/login?redirect=/input"
                className="bg-emerald-500 text-slate-950 font-bold px-6 py-3.5 rounded-2xl hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/30 flex items-center space-x-2"
              >
                <span>Mulai Input Monitoring</span>
                <span>→</span>
              </Link>
              <Link
                href="/hasil"
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-2xl transition border border-white/20 backdrop-blur-md"
              >
                Lihat Statistik RW
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Grand Final National Impact Stats (Statistik Unggulan) */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total RW Binaan</p>
            <h3 className="text-3xl font-black text-slate-900 mt-2">6 RW</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1">100% Aktif Melapor</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bibit Tertanam</p>
            <h3 className="text-3xl font-black text-slate-900 mt-2">480+</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1">Jenis TOGA Produktif</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Indeks Kesehatan</p>
            <h3 className="text-3xl font-black text-emerald-600 mt-2">91.8</h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">Kategori Sangat Baik</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sistem Status</p>
            <h3 className="text-3xl font-black text-blue-600 mt-2">Live</h3>
            <p className="text-xs text-blue-600 font-semibold mt-1">Sinkronisasi Real-time</p>
          </div>
        </div>
      </section>

      {/* Menu / Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h3 className="text-xl font-black text-slate-900">Modul & Navigasi Utama</h3>
            <p className="text-sm text-slate-500 mt-1">Pilih fitur sistem untuk pengelolaan data lapangan.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Link
            href="/login?redirect=/input"
            className="group bg-white rounded-3xl p-8 border border-slate-100 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold mb-6 group-hover:scale-110 transition-transform duration-300">
                📝
              </div>
              <h4 className="font-black text-xl text-slate-900 group-hover:text-emerald-600 transition">
                Input Monitoring
              </h4>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                Khusus pengurus RW terdaftar untuk memperbarui data perkembangan bibit harian.
              </p>
            </div>
            <div className="mt-8 flex items-center text-sm font-bold text-emerald-600 space-x-1">
              <span>Akses Halaman Login</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 2 */}
          <Link
            href="/hasil"
            className="group bg-white rounded-3xl p-8 border border-slate-100 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold mb-6 group-hover:scale-110 transition-transform duration-300">
                📊
              </div>
              <h4 className="font-black text-xl text-slate-900 group-hover:text-blue-600 transition">
                Hasil Monitoring
              </h4>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                Rekapitulasi nilai dan laporan kesehatan tanaman TOGA dari seluruh RW secara terbuka.
              </p>
            </div>
            <div className="mt-8 flex items-center text-sm font-bold text-blue-600 space-x-1">
              <span>Lihat Rekapitulasi</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 3 */}
          <Link
            href="/katalog"
            className="group bg-white rounded-3xl p-8 border border-slate-100 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold mb-6 group-hover:scale-110 transition-transform duration-300">
                🌿
              </div>
              <h4 className="font-black text-xl text-slate-900 group-hover:text-amber-600 transition">
                Katalog TOGA
              </h4>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                Ensiklopedi digital jenis tanaman obat keluarga beserta manfaat dan panduan perawatannya.
              </p>
            </div>
            <div className="mt-8 flex items-center text-sm font-bold text-amber-600 space-x-1">
              <span>Jelajahi Katalog</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-8 text-center text-xs text-slate-400 mt-10">
        <p>© 2026 PPK Ormawa BEM FK UNNES. All rights reserved. | Program Pemberdayaan Masyarakat Desa.</p>
      </footer>
    </main>
  );
}