"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  /* ===================== LOAD ===================== */
  const loadExperiences = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/experiences/");
      console.log("EXPERIENCES:", data);

      // 🔥 SUPPORT PAGINATION & NON-PAGINATION
      if (Array.isArray(data)) {
        setExperiences(data);
      } else if (Array.isArray(data.results)) {
        setExperiences(data.results);
      } else {
        setExperiences([]);
      }
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "Gagal memuat pengalaman");
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  /* ===================== FORM ===================== */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({ judul: "", deskripsi: "", tipe: "", tahun_mulai: "" });
    setEditingId(null);
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
          method: "PATCH",
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

      resetForm();
      await loadExperiences(); // 🔥 WAJIB await
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "Gagal menyimpan pengalaman");
    }
  };

  /* ===================== ACTIONS ===================== */
  const handleEdit = (exp: Experience) => {
    setForm({
      judul: exp.judul,
      deskripsi: exp.deskripsi,
      tipe: exp.tipe,
      tahun_mulai: String(exp.tahun_mulai),
    });
    setEditingId(exp.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus pengalaman ini?")) return;
    try {
      await apiFetch(`/experiences/${id}/`, { method: "DELETE" });
      await loadExperiences();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus pengalaman");
    }
  };
  router.push("/dashboard");
  router.refresh();

  /* ===================== UI ===================== */
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
          <h1 className="text-2xl font-bold text-blue-600 mb-2">
            Pengalaman
          </h1>

          {editingId && (
            <p className="text-sm text-yellow-600 mb-4">
              Sedang mengedit pengalaman — jangan lupa simpan perubahan
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 mb-8">
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

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {editingId ? "Update Pengalaman" : "Tambah Pengalaman"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Batal
                </button>
              )}
            </div>

            {message && (
              <p className="text-sm text-gray-600">{message}</p>
            )}
          </form>

          {loading ? (
            <p className="text-gray-500">Memuat pengalaman...</p>
          ) : experiences.length === 0 ? (
            <p className="text-gray-500">Belum ada pengalaman</p>
          ) : (
            <ul className="space-y-4">
              {experiences.map((exp) => (
                <li
                  key={exp.id}
                  className="border p-4 rounded flex justify-between items-start"
                >
                  <div>
                    <h3 className="font-semibold text-black">
                      {exp.judul} ({exp.tahun_mulai})
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {exp.deskripsi}
                    </p>
                    <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {exp.tipe}
                    </span>
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