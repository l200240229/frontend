"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiFetch } from "@/lib/api";

type Skill = {
  id: number;
  nama_skill: string;
  level: string;
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [form, setForm] = useState({
    nama_skill: "",
    level: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadSkills = () => {
    setLoading(true);
    apiFetch("/skills/")
      .then((data) => {
        if (Array.isArray(data)) {
          setSkills(data);
        } else {
          setSkills(data?.results || []);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!form.nama_skill.trim()) {
      setMessage("Nama skill wajib diisi");
      return;
    }

    if (!form.level) {
      setMessage("Level wajib dipilih");
      return;
    }

    try {
      if (editingId) {
        await apiFetch(`/skills/${editingId}/`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        setMessage("Skill berhasil diperbarui");
      } else {
        await apiFetch("/skills/", {
          method: "POST",
          body: JSON.stringify(form),
        });
        setMessage("Skill berhasil ditambahkan");
      }

      setForm({ nama_skill: "", level: "" });
      setEditingId(null);
      loadSkills();
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "Terjadi kesalahan");
    }
  };

  const handleEdit = (skill: Skill) => {
    setForm({
      nama_skill: skill.nama_skill,
      level: skill.level,
    });
    setEditingId(skill.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus skill ini?")) return;

    try {
      await apiFetch(`/skills/${id}/`, { method: "DELETE" });
      loadSkills();
    } catch (err) {
      console.error(err);
      setMessage("Gagal menghapus skill");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">
            Kelola Skill
          </h1>

          <form onSubmit={handleSubmit} className="space-y-3 mb-6">
            <input
              name="nama_skill"
              placeholder="Nama Skill"
              value={form.nama_skill}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded text-black"
            />

            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded text-black"
            >
              <option value="">Pilih Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {editingId ? "Update Skill" : "Tambah Skill"}
            </button>

            {message && (
              <p className="text-sm text-gray-600">{message}</p>
            )}
          </form>

          {loading ? (
            <p className="text-gray-500">Memuat skill...</p>
          ) : skills.length === 0 ? (
            <p className="text-gray-500">Belum ada skill</p>
          ) : (
            <ul className="space-y-2">
              {skills.map((skill) => (
                <li
                  key={skill.id}
                  className="flex justify-between items-center border p-3 rounded"
                >
                  <div>
                    <p className="font-medium text-black">
                      {skill.nama_skill}
                    </p>
                    <p className="text-sm text-gray-500">
                      {skill.level}
                    </p>
                  </div>

                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="text-blue-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
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