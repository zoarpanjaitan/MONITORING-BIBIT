import Link from "next/link";

const data = {
  rosella: {
    nama: "Rosella",
    ilmiah: "Hibiscus sabdariffa",
    manfaat: "Membantu menjaga daya tahan tubuh dan kaya antioksidan.",
    emoji: "🌺",
  },
  binahong: {
    nama: "Binahong",
    ilmiah: "Anredera cordifolia",
    manfaat: "Membantu mempercepat penyembuhan luka.",
    emoji: "🌿",
  },
  "sambung-nyawa": {
    nama: "Sambung Nyawa",
    ilmiah: "Gynura procumbens",
    manfaat: "Tanaman herbal yang sering dimanfaatkan sebagai antioksidan.",
    emoji: "🍃",
  },
  "ubi-jalar-kuning": {
    nama: "Ubi Jalar Kuning",
    ilmiah: "Ipomoea batatas",
    manfaat: "Umbi bergizi tinggi dan kaya vitamin A.",
    emoji: "🍠",
  },
};

export default async function DetailTanaman({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tanaman = data[slug as keyof typeof data];

  if (!tanaman) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Tanaman tidak ditemukan.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F9F4]">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <Link href="/katalog" className="text-sm font-bold text-green-700">
            ← Kembali ke Katalog
          </Link>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl p-8 border">
          <div className="text-7xl mb-4">{tanaman.emoji}</div>

          <h1 className="text-4xl font-black">{tanaman.nama}</h1>

          <p className="italic text-gray-500 mt-2">{tanaman.ilmiah}</p>

          <div className="mt-8">
            <h2 className="font-black mb-2">Manfaat</h2>
            <p className="text-gray-700 leading-7">{tanaman.manfaat}</p>
          </div>

          <div className="mt-8">
            <h2 className="font-black mb-2">Deskripsi</h2>
            <p className="text-gray-700 leading-7">
              Halaman ini nantinya akan diisi lengkap dari database Supabase
              beserta foto tanaman.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}