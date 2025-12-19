"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Skill = {
  id: number;
  nama_skill: string;
  level: string;
};

type PublicTalent = {
  username: string;
  nama: string;
  prodi: string;
  angkatan: string;
  bio: string;
  foto: string | null;
  skills: Skill[];
};

export default function PublicDashboard() {
  const [talents, setTalents] = useState<PublicTalent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("");
  const [prodi, setProdi] = useState("");
  const getImageUrl = (foto: string | null) => {
    if (!foto) return null;
    if (foto.startsWith("http")) return foto;
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}${foto}`;
  };



  useEffect(() => {
    if (!API_BASE_URL) return;

    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (skill) params.append("skill", skill);
    if (prodi) params.append("prodi", prodi);

    fetch(`${API_BASE_URL}/public/talents/?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat talenta");
        return res.json();
      })
      .then((data) => setTalents(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, skill, prodi]);


  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <nav className="bg-blue-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-bold text-white-100 text-xl">
            Talenta Mahasiswa UMS
          </h1>

          <div className="space-x-6 text-sm">
            <Link href="/" className="text-white-600 hover:text-blue-100">
              Home
            </Link>
            <Link
              href="/login"
              className="bg-red-800 text-white px-4 py-2 rounded"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Talenta Mahasiswa UMS
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            Gerbang utama menuju sumber daya manusia unggul. Temukan profil mahasiswa berprestasi dan siap kerja dari berbagai program studi Universitas Muhammadiyah Surakarta.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-14 flex-1">
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <input
            placeholder="Cari nama atau username"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded text-black"
          />

          <input
            placeholder="Filter prodi"
            value={prodi}
            onChange={(e) => setProdi(e.target.value)}
            className="border px-4 py-2 rounded text-black"
          />

          <input
            placeholder="Filter skill (contoh: Python)"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="border px-4 py-2 rounded text-black"
          />
        </div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-blue-800">
            Daftar Talenta
          </h3>
          <Link
            href="/public/talents"
            className="inline- text-center bg-blue-600 text-sm text-white-600 rounded hover:bg-blue-700"
          >
            View All →
          </Link>
        </div>

        {loading && <p className="text-gray-500">Memuat data...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && talents.length === 0 && (
          <p className="text-gray-500">Belum ada talenta</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {talents.map((talent) => (
            <div
              key={talent.username}
              className="bg-white rounded-xl shadow p-5 flex flex-col"
            >
              <div className="flex items-center gap-4 mb-3">
                {talent.foto ? (
                  <img
                    src={getImageUrl(talent.foto)!}
                    alt={talent.nama}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-700">
                    {talent.nama?.[0] || "?"}
                  </div>
                )}

                <div>
                  <h2 className="font-semibold text-lg text-black">
                    {talent.nama}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {talent.prodi} · {talent.angkatan}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                {talent.bio || "Belum ada bio"}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {talent.skills.slice(0, 4).map((skill) => (
                  <span
                    key={skill.id}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                  >
                    {skill.nama_skill}
                  </span>
                ))}
              </div>

              <div className="mt-auto">
                <Link
                  href={`/public/talents/${talent.username}`}
                  className="inline-block text-center w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Lihat Profil
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-6 py-14 text-center">
          <h3 className="text-blue-500 text-2xl font-bold mb-3">
            Kamu Mahasiswa UMS?
          </h3>
          <p className="text-gray-600 mb-6">
            Tampilkan skill dan pengalamanmu sebagai talenta publik
          </p>
          <Link
            href="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded"
          >
            Daftar Sekarang
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-white font-semibold mb-3">
              Talenta Mahasiswa
            </h4>
            <p className="text-sm">
              Platform showcase talenta mahasiswa UMS.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">
              Quick Links
            </h4>
            <ul className="text-sm space-y-2">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/login">Login</Link></li>
              <li><Link href="/register">Register</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">
              Follow Us
            </h4>
            <p className="text-sm">Instagram · LinkedIn</p>
          </div>
        </div>

        <div className="text-center text-xs border-t border-gray-800 py-4">
          © 2025 Talenta Mahasiswa UMS
        </div>
      </footer>
    </div>
  );
}