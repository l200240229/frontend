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

export default function PublicTalentsPage() {
  const [talents, setTalents] = useState<PublicTalent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("");
  const [prodi, setProdi] = useState("");


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
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-blue-600 text-lg">
            Talenta Mahasiswa
          </Link>

          <div className="space-x-6 text-sm">
            <Link href="/" className="text-gray-600 hover:text-blue-600">
              Home
            </Link>
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-bold mb-3">
            Daftar Talenta Mahasiswa
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Jelajahi profil mahasiswa berbakat Universitas Muhammadiyah Surakarta
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 flex-1">
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-2xl font-bold text-blue-800">
            Semua Talenta
          </h2>

          <p className="text-sm text-gray-500">
            Total: {talents.length} talenta
          </p>
        </div>

        {loading && (
          <p className="text-gray-500 text-center">
            Memuat data talenta...
          </p>
        )}

        {error && (
          <p className="text-red-500 text-center">{error}</p>
        )}

        {!loading && talents.length === 0 && (
          <p className="text-gray-500 text-center">
            Belum ada talenta yang tersedia
          </p>
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
                    src={talent.foto}
                    alt={talent.nama}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-700">
                    {talent.nama?.[0] || "?"}
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-lg text-black">
                    {talent.nama}
                  </h3>
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

      <footer className="bg-gray-900 text-gray-400 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-10 text-center text-sm">
          © 2025 Talenta Mahasiswa UMS · Error Makers Team
        </div>
      </footer>
    </div>
  );
}