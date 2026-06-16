import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // Ini benar karena filenya sejajar di folder app

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bajo Bahari",
  description: "Website Sistem Informasi Desa Bajo Bahari",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-gray-50 flex flex-col min-h-screen antialiased`}>
        {/* Navbar dan Footer tidak ada di sini, hanya children murni */}
        {children}
      </body>
    </html>
  );
}