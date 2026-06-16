"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Import client yang baru dibuat

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // Fungsi bawaan Supabase untuk login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg("Email atau password salah. Silakan coba lagi.");
      } else if (data.user) {
        // Jika berhasil, arahkan ke halaman dashboard
        alert("Login Berhasil!");
        router.push("/admin/dashboard");
      }
    } catch (error) {
      setErrorMsg("Terjadi kesalahan pada server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ornamen */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-bajo-primary blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-bajo-light blur-3xl"></div>
      </div>

      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-bajo-dark">Login Sistem</h2>
          <p className="mt-2 text-sm text-gray-600">Panel Admin Desa Bajo Bahari</p>
        </div>

        {/* Notifikasi Error jika login gagal */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
            {errorMsg}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 border text-bajo-primary border-gray-300 rounded-lg focus:ring-2 focus:ring-bajo-primary focus:border-bajo-primary outline-none"
              placeholder="admin@bajobahari.desa.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 border text-bajo-primary border-gray-300 rounded-lg focus:ring-2 focus:ring-bajo-primary focus:border-bajo-primary outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-bajo-secondary hover:bg-bajo-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bajo-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Memproses..." : "Masuk ke Dashboard"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-bajo-primary flex items-center justify-center gap-2">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}