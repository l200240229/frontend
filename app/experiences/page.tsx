"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiFetch } from "@/lib/api";

type Experience = {
  id: number;
  judul: string;
  deskripsi: string;
  tipe: "organisasi" | "lomba" | "kerja";
  tahun_mulai: number;
};

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [form, setForm] = useState({
    judul: "",
    deskripsi: "",
    tipe: "",
    tahun_mulai: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadExperiences = () => {
    setLoading(true);
    apiFetch("/experiences/")
      .then((data) => setExperiences(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!form.judul.trim()) {
      setMessage("Judul wajib diisi");
      return;
    }

    if (form.deskripsi.trim().length < 10) {
      setMessage("Deskripsi minimal 10 karakter");
      return;
    }

    if (!form.tipe) {
      setMessage("Tipe pengalaman wajib dipilih");
      return;
    }

    if (!/^\d{4}$/.test(form.tahun_mulai)) {
      setMessage("Tahun harus 4 digit (contoh: 2022)");
      return;
    }

    const payload = {
      judul: form.judul,
      deskripsi: form.deskripsi,
      tipe: form.tipe,
      tahun_mulai: Number(form.tahun_mulai),
    };

    try {
      if (editingId) {
        await apiFetch(`/experiences/${editingId}/`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setMessage("Pengalaman berhasil diperbarui");
      } else {
        await apiFetch("/experiences/", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage("Pengalaman berhasil ditambahkan");
      }

      setForm({ judul: "", deskripsi: "", tipe: "", tahun_mulai: "" });
      setEditingId(null);
      loadExperiences();
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "Gagal menyimpan pengalaman");
    }
  };

  const handleEdit = (exp: Experience) => {
    setForm({
      judul: exp.judul,
      deskripsi: exp.deskripsi,
      tipe: exp.tipe,
      tahun_mulai: String(exp.tahun_mulai),
    });
    setEditingId(exp.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus pengalaman ini?")) return;
    await apiFetch(`/experiences/${id}/`, { method: "DELETE" });
    loadExperiences();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">
            Pengalaman
          </h1>

          <form onSubmit={handleSubmit} className="space-y-3 mb-6">
            <input
              name="judul"
              placeholder="Judul Pengalaman"
              value={form.judul}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded text-black"
            />

            <textarea
              name="deskripsi"
              placeholder="Deskripsi pengalaman"
              value={form.deskripsi}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded text-black"
              rows={4}
            />

            <select
              name="tipe"
              value={form.tipe}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded text-black"
            >
              <option value="">Pilih Tipe</option>
              <option value="organisasi">Organisasi</option>
              <option value="lomba">Lomba</option>
              <option value="kerja">Kerja</option>
            </select>

            <input
              name="tahun_mulai"
              placeholder="Tahun Mulai (contoh: 2022)"
              value={form.tahun_mulai}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded text-black"
            />

            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              {editingId ? "Update Pengalaman" : "Tambah Pengalaman"}
            </button>

            {message && (
              <p className="text-sm text-gray-600">{message}</p>
            )}
          </form>

          {loading ? (
            <p className="text-gray-500">Memuat pengalaman...</p>
          ) : experiences.length === 0 ? (
            <p className="text-gray-500">Belum ada pengalaman</p>
          ) : (
            <ul className="space-y-3">
              {experiences.map((exp) => (
                <li
                  key={exp.id}
                  className="border p-4 rounded flex justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-black">
                      {exp.judul} ({exp.tahun_mulai})
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {exp.deskripsi}
                    </p>
                    <p className="text-xs text-gray-500">
                      Tipe: {exp.tipe}
                    </p>
                  </div>

                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="text-blue-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="text-red-600 text-sm"
                    >
                      Hapus
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}