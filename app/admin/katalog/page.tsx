import Link from "next/link";

export default function KelolaKatalogPage() {
  return (
    <main className="min-h-screen bg-[#F7F9F4]">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link href="/admin" className="text-sm font-bold text-green-700">
          ← Kembali
        </Link>

        <h1 className="text-3xl font-black mt-4">Kelola Katalog TOGA</h1>

        <div className="bg-white rounded-3xl p-8 border mt-8">
          <button className="bg-green-700 text-white px-5 py-3 rounded-xl font-bold">
            + Tambah Tanaman
          </button>

          <p className="mt-6 text-gray-500">
            Nanti di sini akan ada upload foto, deskripsi, manfaat, edit &
            hapus.
          </p>
        </div>
      </div>
    </main>
  );
}