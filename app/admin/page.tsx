import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#F7F9F4]">
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-black">Admin Panel</h1>

          <Link href="/" className="text-sm font-bold text-green-700">
            ← Dashboard
          </Link>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/admin/katalog"
            className="bg-white rounded-3xl p-7 border hover:shadow-lg"
          >
            <div className="text-4xl mb-3">🌿</div>
            <h2 className="font-black text-xl">Kelola Katalog</h2>
            <p className="text-sm text-gray-600 mt-2">
              Tambah, edit, dan hapus tanaman TOGA.
            </p>
          </Link>

          <Link
            href="/admin/tanaman"
            className="bg-white rounded-3xl p-7 border hover:shadow-lg"
          >
            <div className="text-4xl mb-3">🌱</div>
            <h2 className="font-black text-xl">Kelola Tanaman RW</h2>
            <p className="text-sm text-gray-600 mt-2">
              Tambahkan tanaman baru beserta jumlahnya pada RW tertentu.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}