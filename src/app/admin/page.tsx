"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  // Proteksi: Cek apakah user sudah login sebelumnya
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push("/admin/dashboard");
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg("Email atau password salah. Pastikan akses Anda terdaftar.");
      } else {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (error) {
      setErrorMsg("Terjadi kesalahan pada koneksi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gray-50">
      {/* Background Ornamen yang lebih soft */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-bajo-primary blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-bajo-secondary blur-3xl"></div>
      </div>

      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-bajo-primary/10 text-bajo-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Login Admin</h2>
          <p className="mt-2 text-sm text-gray-500">Panel Kelola Desa Bajo Bahari</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 font-medium">
            {errorMsg}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Admin</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-bajo-primary/50 focus:border-bajo-primary transition-all"
              placeholder="admin@bajobahari.desa.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-bajo-primary/50 focus:border-bajo-primary transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 rounded-xl text-sm font-bold text-white bg-bajo-dark hover:bg-bajo-primary focus:outline-none transition-all shadow-md shadow-bajo-dark/20 disabled:opacity-70"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Memverifikasi...
              </div>
            ) : "Masuk ke Dashboard"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm font-bold text-gray-400 hover:text-bajo-primary transition-colors flex items-center justify-center gap-2">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}