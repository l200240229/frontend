"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiFetch } from "@/lib/api";

export default function ProfilePage() {
  const [form, setForm] = useState({
    nama: "",
    prodi: "",
    angkatan: "",
    bio: "",
    kontak_email: "",
    kontak_wa: "",
    instagram: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const normalizeWA = (value: string) => {
    if (value.startsWith("08")) {
      return "62" + value.slice(1);
    }
    return value;
  };

  
  const sanitizePhone = (value: string) => {
    let v = value.replace(/\D/g, "");

    if (v.startsWith("0")) {
      v = "62" + v.slice(1);
    }

    return v;
  };

const sanitizeInstagram = (value: string) => {
  return value.replace(/[@\s]/g, "");
};



  // === LOAD PROFILE ===
  useEffect(() => {
    apiFetch("/profiles/me/")
      .then((data) => {
        setForm({
          nama: data.nama || "",
          prodi: data.prodi || "",
          angkatan: data.angkatan || "",
          bio: data.bio || "",
          kontak_email: data.kontak_email || "",
          kontak_wa: data.kontak_wa || "",
          instagram: data.instagram || "",
        });
      })
      .catch((err) => {
        console.error(err);
        setMessage("Gagal memuat profil");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;

  let newValue = value;

  if (name === "kontak_wa") {
    newValue = sanitizePhone(value);
  }

  if (name === "instagram") {
    newValue = sanitizeInstagram(value);
  }

  setForm((prev) => ({ ...prev, [name]: newValue }));
};


  // === SAVE PROFILE ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
        const formData = new FormData();
        formData.append("nama", form.nama);
        formData.append("prodi", form.prodi);
        formData.append("angkatan", form.angkatan);
        formData.append("bio", form.bio);
        formData.append("kontak_email", form.kontak_email);
        formData.append("kontak_wa", form.kontak_wa);
        formData.append("instagram", form.instagram);

        if (foto) {
        formData.append("foto", foto);
        }

        await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/profiles/me/`,
        {
            method: "PATCH",
            headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: formData,
        }
        );

        setMessage("Profil berhasil disimpan");
    } catch (err) {
        console.error(err);
        setMessage("Gagal menyimpan profil");
    } finally {
        setSaving(false);
    }
    };


  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">
            Edit Profil
          </h1>

          {loading ? (
            <p className="text-gray-500">Memuat data...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
              <label className="text-gray-800 text-sm font-medium">Nama</label>
              <input
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Nama Lengkap"
                className="w-full border px-4 py-2 rounded text-black"
                required
              />
              </div>

              <div>
              <label className="text-gray-800 text-sm font-medium">Prodi</label>
              <input
                name="prodi"
                value={form.prodi}
                onChange={handleChange}
                placeholder="Program Studi"
                className="w-full border px-4 py-2 rounded text-black"
                required
              />
              </div>
              
              <div>
              <label className="text-gray-800 text-sm font-medium">Angkatan</label>
              <input
                name="angkatan"
                value={form.angkatan}
                onChange={handleChange}
                placeholder="Angkatan (contoh: 2022)"
                className="w-full border px-4 py-2 rounded text-black"
                required
              />
              </div>

              <div>
              <label className="text-gray-800 text-sm font-medium">Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Bio singkat"
                rows={4}
                className="w-full border px-4 py-2 rounded text-black"
              />
              </div>

              <div>
              <label className="text-gray-800 text-sm font-medium">Email</label>
              <input
                type="email"
                name="kontak_email"
                value={form.kontak_email}
                onChange={handleChange}
                placeholder="email"
                className="w-full border px-4 py-2 rounded text-black"
                required
              />
              </div>

              <div>
              <label className="text-gray-800 text-sm font-medium">WhatsApp</label>
              <input
                type="number"
                name="kontak_wa"
                value={form.kontak_wa}
                onChange={(e) =>
                  setForm({ ...form, kontak_wa: e.target.value })
                }
                onBlur={(e) =>
                  setForm({
                    ...form,
                    kontak_wa: normalizeWA(e.target.value),
                  })
                }
                placeholder="628123456789"
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full border px-4 py-2 rounded text-black"
              />
              <p className="text-xs text-gray-800">
                Gunakan format internasional tanpa +
              </p>
            </div>

            <div>
              <label className="text-gray-800 text-sm font-medium">Instagram</label>
              <input
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                placeholder="username instagram (tanpa @)"
                className="w-full border px-4 py-2 rounded text-black"
              />
            </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFoto(e.target.files?.[0] || null)}
                className="bg-green-600 text-white w-full px-6 py-2 rounded"
               />

              <button
                disabled={saving}
                className="bg-blue-600 text-white w-full px-6 py-2 rounded"
              >
                {saving ? "Menyimpan..." : "Simpan Profil"}
              </button>

              {message && (
                <p className="text-sm text-green-600 font-medium">
                  {message}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}