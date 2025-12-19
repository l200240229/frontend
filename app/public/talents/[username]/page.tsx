"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import TalentProfileView from "@/components/TalentProfileView";



const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const getImageUrl = (foto: string | null) => {
  if (!foto) return null;
  if (foto.startsWith("http")) return foto;
  return `${API_BASE_URL}${foto}`;
};

type Skill = {
  id: number;
  nama_skill: string;
  level: string;
};

type Experience = {
  id: number;
  judul: string;
  deskripsi: string;
  tipe: string;
  tahun_mulai: number;
};

type TalentDetail = {
  username: string;
  nama: string;
  prodi: string;
  angkatan: string;
  bio: string;
  foto: string | null;
  skills: Skill[];
  experiences: Experience[];
};

export default function TalentDetailPage() {
  const { username } = useParams();
  const [talent, setTalent] = useState<TalentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!API_BASE_URL || !username) return;

    fetch(`${API_BASE_URL}/public/talents/${username}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Talenta tidak ditemukan");
        return res.json();
      })
      .then((data) => setTalent(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return <p className="p-6 text-gray-500">Memuat profil...</p>;
  }

  if (error || !talent) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">{error || "Profil tidak ditemukan"}</p>
        <Link href="/" className="text-blue-600 underline">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return <TalentProfileView talent={talent} />;
}