"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
        window.location.href = "/dashboard";
    }
    }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/register/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Registrasi gagal");
      }

      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Gagal mendaftar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden flex">

        <div className="w-full md:w-1/2 p-10">
          <div className="mb-6">
            <Image src="/logo.png" alt="Logo" width={125} height={125} />
          </div>

          <h1 className="text-4xl font-bold mb-1 text-blue-500">Register</h1>
          <p className="text-gray-500 mb-6">Buat Akun Dulu</p>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border rounded-lg px-4 py-3
                bg-white
                text-gray-800
                placeholder-gray-400
                caret-blue-500
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-lg px-4 py-3
                bg-white
                text-gray-800
                placeholder-gray-400
                caret-blue-600
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded-lg px-4 py-3
                bg-white
                text-gray-800
                placeholder-gray-400
                caret-blue-600
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-blue-600 font-medium">
              Login
            </Link>
          </p>
        </div>

        <div className="hidden md:flex w-1/2 bg-blue-600 items-center justify-center">
          <Image
            src="/robot.png"
            alt="Illustration"
            width={420}
            height={420}
            priority
          />
        </div>
      </div>
    </div>
  );
}