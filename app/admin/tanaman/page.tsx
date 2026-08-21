import Link from "next/link";

export default function KelolaTanamanPage() {
  return (
    <main className="min-h-screen bg-[#F7F9F4]">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link href="/admin" className="text-sm font-bold text-green-700">
          ← Kembali
        </Link>

        <h1 className="text-3xl font-black mt-4">Kelola Tanaman per RW</h1>

        <div className="bg-white rounded-3xl p-8 border mt-8 space-y-5">
          <div>
            <label className="font-bold text-sm">Pilih RW</label>

            <select className="w-full mt-2 border rounded-xl p-3">
              <option>RW 01</option>
              <option>RW 02</option>
              <option>RW 03</option>
              <option>RW 04</option>
              <option>RW 05</option>
              <option>RW 06</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-sm">Nama Tanaman</label>

            <input
              className="w-full mt-2 border rounded-xl p-3"
              placeholder="Contoh: Tomat"
            />
          </div>

          <div>
            <label className="font-bold text-sm">Jumlah Bibit</label>

            <input
              type="number"
              className="w-full mt-2 border rounded-xl p-3"
              placeholder="20"
            />
          </div>

          <button className="bg-green-700 text-white px-5 py-3 rounded-xl font-bold">
            Simpan Tanaman
          </button>
        </div>
      </div>
    </main>
  );
}