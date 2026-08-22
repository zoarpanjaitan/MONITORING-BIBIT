"use client";

import Link from "next/link";

const LeaderboardRow = ({ rank, rw, score, status }: any) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-3 hover:border-emerald-200 transition-colors">
    <div className="flex items-center gap-4">
      <span className={`w-8 h-8 flex items-center justify-center rounded-full font-black text-sm ${rank === 1 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>#{rank}</span>
      <span className="font-bold text-slate-900">{rw}</span>
    </div>
    <div className="flex items-center gap-4">
      <span className="font-mono font-bold text-emerald-600">{score}%</span>
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${status === 'Optimal' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{status}</span>
    </div>
  </div>
);

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-600/20">🌱</div>
            <div>
              <p className="text-[10px] font-extrabold tracking-widest text-emerald-600 uppercase">PPK ORMAWA BEM FK UNNES</p>
              <h1 className="text-base font-black text-slate-900 tracking-tight">Sistem Monitoring TOGA</h1>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm font-semibold text-slate-600">
            <Link href="/hasil" className="hover:text-emerald-600 transition">Hasil Monitoring</Link>
            {/* Tambahan Menu Kelola Tanaman TOGA di sini */}
            <Link href="/login?redirect=/kelola-tanaman" className="hover:text-emerald-600 transition">Kelola Tanaman TOGA</Link>
            <Link href="/katalog" className="hover:text-emerald-600 transition">Katalog TOGA</Link>
            <Link href="/login?redirect=/input" className="bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition font-bold">Login Admin RW</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-8 pb-4">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-emerald-950/15 min-h-[460px] flex items-center border border-slate-100">
          <div className="absolute inset-0 bg-cover bg-center z-0 scale-105 transform transition-transform duration-1000" style={{ backgroundImage: `url('/foto/IMG_1943.JPG')` }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40 z-10"></div>
          <div className="relative z-20 p-8 md:p-14 max-w-3xl text-white">
            <span className="inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-6 backdrop-blur-md">Inovasi Keberlanjutan Desa Binaan</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">Kondisi Pembibitan TOGA, <br /><span className="text-emerald-400">Terpantau Transparan.</span></h2>
            <p className="mt-6 text-slate-200 text-base md:text-lg leading-relaxed font-medium">Platform digital kolaboratif berbasis IoT & Web untuk memonitoring pertumbuhan Tanaman Obat Keluarga di setiap RW demi mewujudkan kemandirian kesehatan warga desa.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/login?redirect=/input" className="bg-emerald-500 text-slate-950 font-extrabold px-7 py-4 rounded-2xl hover:bg-emerald-400 transition shadow-xl shadow-emerald-500/30 flex items-center space-x-2 text-sm"><span>Mulai Input Monitoring</span><span>→</span></Link>
              <Link href="/hasil" className="bg-white/10 hover:bg-white/20 text-white font-extrabold px-7 py-4 rounded-2xl transition border border-white/20 backdrop-blur-md text-sm">Lihat Statistik RW</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistik */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[ { label: "Total RW Binaan", val: "6 RW", sub: "100% Aktif Melapor" }, { label: "Bibit Tertanam", val: "480+", sub: "Jenis TOGA Produktif" }, { label: "Indeks Kesehatan", val: "91.8", sub: "Kategori Sangat Baik" }, { label: "Sistem Status", val: "Live", sub: "Sinkronisasi Real-time" } ].map((item, i) => (
            <div key={i} className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2">{item.val}</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Analitik & Leaderboard */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-6">Leaderboard Performa RW</h3>
            <LeaderboardRow rank={1} rw="RW 04" score="98.5" status="Optimal" />
            <LeaderboardRow rank={2} rw="RW 01" score="92.1" status="Optimal" />
            <LeaderboardRow rank={3} rw="RW 06" score="89.4" status="Normal" />
          </div>
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-center">
            <h3 className="text-lg font-black mb-4">Sistem Terintegrasi</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">Data ini disinkronisasi secara otomatis dari sensor IoT di lapangan dan diverifikasi oleh admin tingkat desa. Sistem dirancang untuk mendukung pengambilan kebijakan berbasis data akurat.</p>
            <div className="flex items-center gap-4 text-xs font-bold text-emerald-400"><span>● Real-time Monitoring</span><span>● Validasi Berjenjang</span></div>
          </div>
        </div>
      </section>

      {/* Modul */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-6 mb-12">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-6">Modul & Navigasi Utama</h3>
        {/* Ubah grid jadi 4 kolom agar pas dengan menu baru */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[ 
            { icon: "📝", title: "Input Monitoring", desc: "Perbarui data perkembangan bibit harian.", link: "/login?redirect=/input", color: "text-emerald-600" }, 
            { icon: "📊", title: "Hasil Monitoring", desc: "Rekapitulasi data kesehatan tanaman secara terbuka.", link: "/hasil", color: "text-blue-600" }, 
            { icon: "⚙️", title: "Kelola Tanaman", desc: "Atur target jenis dan jumlah tanaman mandiri.", link: "/login?redirect=/kelola-tanaman", color: "text-purple-600" },
            { icon: "🌿", title: "Katalog TOGA", desc: "Ensiklopedi digital tanaman obat keluarga.", link: "/katalog", color: "text-amber-600" } 
          ].map((card, i) => (
            <Link key={i} href={card.link} className="group bg-white rounded-3xl p-8 border border-slate-100 hover:border-emerald-500/50 hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className={`w-14 h-14 rounded-2xl bg-slate-50 ${card.color} flex items-center justify-center text-2xl font-bold mb-6 group-hover:scale-110 transition-transform`}>{card.icon}</div>
                <h4 className="font-black text-xl text-slate-900">{card.title}</h4>
                <p className="text-sm text-slate-500 mt-3">{card.desc}</p>
              </div>
              <div className="mt-8 text-sm font-bold text-emerald-600">Selengkapnya →</div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="bg-white border-t border-slate-100 py-8 text-center text-xs text-slate-400 mt-10">
        <p>© 2026 PPK Ormawa BEM FK UNNES. All rights reserved. | Program Pemberdayaan Masyarakat Desa.</p>
      </footer>
    </main>
  );
}