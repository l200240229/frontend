"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
        window.location.href = "/dashboard";
    }
    }, []);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/token/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!res.ok) {
        throw new Error("Username atau password salah");
      }

      const data = await res.json();

      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden flex">

        {/* LEFT - FORM */}
        <div className="w-full md:w-1/2 p-10">
          <div className="mb-6">
            <Image src="/logo.png" alt="Logo" width={125} height={125} />
          </div>

          <h1 className="text-4xl font-bold mb-1 text-blue-500">Login</h1>
          <p className="text-gray-500 mb-6">Masuk ke akun Anda</p>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="
                w-full border rounded-lg px-4 py-3
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
              className="
                w-full border rounded-lg px-4 py-3
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
              className="
                bg-blue-600 text-white px-6 py-3 rounded-lg
                font-semibold hover:bg-blue-700 transition
                disabled:opacity-60
              "
            >
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6">
            Belum punya akun?{" "}
            <Link href="/register" className="text-blue-600 font-medium">
              Register
            </Link>
          </p>
        </div>

        {/* RIGHT - IMAGE */}
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