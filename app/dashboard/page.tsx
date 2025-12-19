"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiFetch } from "@/lib/api";
import { logout } from "@/lib/auth";
import TalentProfileView from "@/components/TalentProfileView";


let isDownloading = false;

const handleDownloadCV = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (isDownloading) return;
    isDownloading = true;

    try {
        const token = localStorage.getItem("access_token");
        if (!token) {
            alert("Token tidak ditemukan");
            return;
        }

        const response = await fetch("/api/cv", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
        });

        if (!response.ok) throw new Error("Gagal download");

        const blob = await response.blob();
        if (blob.size === 0) return;

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "CV.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error(err);
    } finally {
        isDownloading = false;
    }
};

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [talent, setTalent] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        // ambil user dulu
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/me/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((userData) => {
                setUser(userData);

                // 🔥 ADMIN TIDAK BOLEH MASUK ALUR TALENT
                if (userData.is_staff || userData.is_superuser) {
                    return null;
                }

                return fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/public/talents/${userData.username}/`
                );
            })
            .then((res) => {
                if (!res) return null; // admin
                if (!res.ok) throw new Error("Talent tidak ditemukan");
                return res.json();
            })
            .then((talentData) => {
                if (talentData) setTalent(talentData);
            })
            .finally(() => setLoading(false));
    }, []);


    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-100 p-6 ">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-blue-600">Dashboard Talenta UMS</h1>
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
                        {/* GRID ATAS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* PROFIL */}
                            <div className="bg-white p-6 rounded-xl shadow">
                                <h2 className="text-3xl font-semibold mb-4 text-blue-500">
                                    Profil Mahasiswa
                                </h2>
                                <div className="space-y-2 text-sm">
                                    <p className="text-gray-800"><strong>Username:</strong> {user?.username}</p>
                                    <p className="text-gray-800"><strong>Email:</strong> {user?.email}</p>
                                    <p className="text-gray-600">
                                        Yuk, lengkapi profilmu! Satu langkah lagi untuk menjadi bagian dari komunitas talenta hebat UMS.                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow md:col-span-2">
                                <h2 className="text-3xl font-semibold mb-4 text-blue-500">
                                    Biodata Talents
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <button
                                        onClick={() => (window.location.href = "/profile")}
                                        className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600"
                                    >
                                        Edit Profil
                                    </button>

                                    <button
                                        onClick={() => (window.location.href = "/skills")}
                                        className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600"
                                    >
                                        Kelola Skill
                                    </button>

                                    <button
                                        onClick={() => (window.location.href = "/experiences")}
                                        className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600"
                                    >
                                        Pengalaman
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDownloadCV}
                                        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                                    >
                                        Download CV
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow w-full">
                            <h2 className="text-2xl font-bold text-blue-600 mb-4">
                                Preview Talents Public
                            </h2>

                            {talent ? (
                                <div className="border rounded-xl overflow-hidden">
                                    <TalentProfileView talent={talent} />
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-20">
                                    Preview Talent Belum adaa
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={() => (window.location.href = "/")}
                                className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                            >
                                Lihat beranda anda
                            </button>
                        </div>
                    </>
                )}
            </div>
        </ProtectedRoute>
    );
}