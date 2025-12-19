"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiFetch } from "@/lib/api";

type Experience = {
  id: number;
  judul: string;
  deskripsi: string;
  tipe: string;
  tahun_mulai: number;
};

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    judul: "",
    deskripsi: "",
    tipe: "",
    tahun_mulai: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  // ================= LOAD LIST =================
  const loadExperiences = async () => {
    try {
      const data = await apiFetch("/experiences/");
      setExperiences(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await apiFetch(`/experiences/${editingId}/`, {
          method: "PATCH",
          body: JSON.stringify(form),
        });
      } else {
        await apiFetch("/experiences/", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }

      setForm({ judul: "", deskripsi: "", tipe: "", tahun_mulai: "" });
      setEditingId(null);
      loadExperiences();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id: number) => {
    if (!confirm("Hapus pengalaman ini?")) return;

    try {
      await apiFetch(`/experiences/${id}/`, {
        method: "DELETE",
      });
      loadExperiences();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= EDIT =================
  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setForm({
      judul: exp.judul,
      deskripsi: exp.deskripsi,
      tipe: exp.tipe,
      tahun_mulai: String(exp.tahun_mulai),
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">
            Pengalaman
          </h1>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-3 mb-6">
            <input
              placeholder="Judul Pengalaman"
              value={form.judul}
              onChange={(e) => setForm({ ...form, judul: e.target.value })}
              className="w-full border px-4 py-2 rounded"
              required
            />

            <textarea
              placeholder="Deskripsi pengalaman"
              value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
              className="w-full border px-4 py-2 rounded"
              rows={3}
              required
            />

            <input
              placeholder="Tipe (Organisasi / Proyek / Kerja)"
              value={form.tipe}
              onChange={(e) => setForm({ ...form, tipe: e.target.value })}
              className="w-full border px-4 py-2 rounded"
            />

            <input
              placeholder="Tahun Mulai"
              value={form.tahun_mulai}
              onChange={(e) =>
                setForm({ ...form, tahun_mulai: e.target.value })
              }
              className="w-full border px-4 py-2 rounded"
            />

            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              {editingId ? "Simpan Perubahan" : "Tambah Pengalaman"}
            </button>
          </form>

          {/* LIST */}
          {loading ? (
            <p className="text-gray-500">Memuat...</p>
          ) : experiences.length === 0 ? (
            <p className="text-gray-500">Belum ada pengalaman</p>
          ) : (
            <ul className="space-y-4">
              {experiences.map((exp) => (
                <li
                  key={exp.id}
                  className="border rounded-lg p-4 flex justify-between items-start"
                >
                  <div>
                    <h3 className="font-semibold">{exp.judul}</h3>
                    <p className="text-sm text-gray-600">
                      {exp.tipe} · {exp.tahun_mulai}
                    </p>
                    <p className="text-gray-700 mt-1">{exp.deskripsi}</p>
                  </div>

                  <div className="flex gap-2">
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