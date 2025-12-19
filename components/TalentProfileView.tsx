"use client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getImageUrl = (foto: string | null) => {
  if (!foto) return null;
  if (foto.startsWith("http")) return foto;
  return `${API_BASE_URL}${foto}`;
};

export default function TalentProfileView({ talent }: { talent: any }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-5xl mx-auto px-6 py-14 flex gap-6 items-center">
          {talent.foto ? (
            <img
              src={getImageUrl(talent.foto)!}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white/30 flex items-center justify-center text-3xl font-bold">
              {talent.nama?.[0]}
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold">{talent.nama}</h1>
            <p className="text-blue-100">
              {talent.prodi} · Angkatan {talent.angkatan}
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-blue-800 font-semibold text-2xl mb-2">
              Tentang Saya
            </h2>
            <p className="text-gray-700">{talent.bio || "Belum ada bio"}</p>
          </section>

          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-blue-800 font-semibold text-2xl mb-4">
              Pengalaman
            </h2>

            {talent.experiences.length === 0 ? (
              <p className="text-gray-500">Belum ada pengalaman</p>
            ) : (
              <ul className="space-y-4">
                {talent.experiences.map((exp: any) => (
                  <li
                    key={exp.id}
                    className="text-gray-800 border-l-4 border-blue-600 pl-4"
                  >
                    <h3 className="font-semibold">
                      {exp.judul} ({exp.tahun_mulai})
                    </h3>
                    <p className="text-sm text-gray-500">{exp.tipe}</p>
                    <p className="text-gray-700 mt-1">{exp.deskripsi}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-blue-800 font-semibold text-2xl mb-3">
              Skill
            </h2>

            {talent.skills.length === 0 ? (
              <p className="text-gray-500">Belum ada skill</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {talent.skills.map((skill: any) => (
                  <span
                    key={skill.id}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill.nama_skill}
                  </span>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
        <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-blue-800 font-semibold text-2xl mb-3">
              Kontak
            </h2>

            <div className="space-y-2 text-gray-700">
              {talent.kontak_email && (
                <p>
                  {" "}
                  <a
                    href={`mailto:${talent.kontak_email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {talent.kontak_email}
                  </a>
                </p>
              )}

              {talent.kontak_wa && (
                <p>
                  {" "}
                  <a
                    href={`https://wa.me/${talent.kontak_wa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline"
                  >
                    WhatsApp
                  </a>
                </p>
              )}

              {talent.instagram && (
                <p>
                  {" "}
                  <a
                    href={`https://instagram.com/${talent.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:underline"
                  >
                    @{talent.instagram}
                  </a>
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}