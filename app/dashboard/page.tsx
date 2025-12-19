"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiFetch } from "@/lib/api";
import { logout } from "@/lib/auth";
import TalentProfileView from "@/components/TalentProfileView";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [talent, setTalent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        // 1️⃣ Ambil user
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const userRes = await fetch(
          `${API_BASE_URL}/api/accounts/me/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ).then((r) => r.json());

        setUser(userRes);

        // Admin tidak lewat jalur talent
        if (userRes.is_staff || userRes.is_superuser) {
          setLoading(false);
          return;
        }

        // 2️⃣ Ambil profile
        const profileRes = await apiFetch("/profiles/me/");
        setProfile(profileRes);

        // 3️⃣ Jika belum aktif → STOP
        if (!profileRes.is_active) {
          setTalent(null);
          setLoading(false);
          return;
        }

        // 4️⃣ Jika aktif → fetch public talent
        const talentRes = await fetch(
          `${API_BASE_URL}/api/public/talents/${userRes.username}/`
        );

        if (!talentRes.ok) {
          throw new Error("Talent publik tidak ditemukan");
        }

        const talentData = await talentRes.json();
        setTalent(talentData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">
            Dashboard Talenta UMS
          </h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Memuat data...</p>
        ) : (
          <>
            {/* INFO USER */}
            <div className="bg-white p-6 rounded-xl shadow mb-6">
              <h2 className="text-xl font-semibold text-blue-500 mb-2">
                Informasi Akun
              </h2>
              <p><strong>Username:</strong> {user?.username}</p>
              <p><strong>Email:</strong> {user?.email}</p>
            </div>

            {/* STATUS PROFILE */}
            {!profile?.is_active && (
              <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-5 rounded-xl mb-6">
                <p className="font-semibold text-lg mb-2">
                  Profil kamu belum tampil di halaman publik
                </p>
                <p className="text-sm mb-3">
                  Lengkapi semua syarat berikut agar profilmu muncul sebagai
                  talent publik:
                </p>
                <ul className="list-disc ml-5 text-sm space-y-1">
                  <li>Upload foto profil</li>
                  <li>Tambahkan minimal 1 skill</li>
                  <li>Tambahkan minimal 1 pengalaman</li>
                </ul>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => (window.location.href = "/profile")}
                    className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                  >
                    Edit Profil
                  </button>
                  <button
                    onClick={() => (window.location.href = "/skills")}
                    className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
                  >
                    Kelola Skill
                  </button>
                  <button
                    onClick={() => (window.location.href = "/experiences")}
                    className="bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
                  >
                    Pengalaman
                  </button>
                </div>
              </div>
            )}

            {/* PREVIEW PUBLIK */}
            {profile?.is_active && talent && (
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">
                  Preview Profil Publik
                </h2>

                <div className="border rounded-xl overflow-hidden">
                  <TalentProfileView talent={talent} />
                </div>

                <button
                  onClick={() =>
                    (window.location.href = `/public/talents/${user.username}`)
                  }
                  className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                >
                  Lihat Halaman Publik
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}