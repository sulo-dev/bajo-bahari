import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-bajo-dark text-white pt-16 pb-8 border-t-4 border-bajo-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Kolom 1: Tentang Desa */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">
              Bajo<span className="text-bajo-primary">-Bahari</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Website Sistem Informasi Desa Bajo Bahari. Mewujudkan tata kelola pemerintahan yang transparan, inovatif, dan berfokus pada kesejahteraan masyarakat pesisir.
            </p>
          </div>

          {/* Kolom 2: Tautan Cepat */}
          <div>
            <h4 className="text-lg font-semibold text-bajo-light mb-4">Tautan Cepat</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/profil/sejarah" className="hover:text-bajo-primary transition-colors">Sejarah Desa</Link>
              </li>
              <li>
                <Link href="/transparansi/apbdes" className="hover:text-bajo-primary transition-colors">Transparansi APBDes</Link>
              </li>
              <li>
                <Link href="/layanan/surat" className="hover:text-bajo-primary transition-colors">Pengurusan Surat</Link>
              </li>
              <li>
                <Link href="/potensi/umkm" className="hover:text-bajo-primary transition-colors">Produk UMKM</Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Kontak & Alamat */}
          <div>
            <h4 className="text-lg font-semibold text-bajo-light mb-4">Kontak Kami</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-bajo-primary mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Jl. Poros Desa Bajo Bahari No. 1<br/>Kecamatan, Kabupaten</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-bajo-primary mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>pemdes@bajobahari.desa.id</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bagian Bawah: Copyright & SuloDev */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400 text-center md:text-left">
            &copy; 2026 Pemerintah Desa Bajo Bahari. Hak Cipta Dilindungi.
          </p>
          
          {/* Powered By SuloDev */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Powered by</span>
            <div className="flex items-center gap-1.5 group cursor-pointer">
              {/* Logo SuloDev (Placeholder SVG) - Ganti tag <svg> ini dengan <img src="/logo-sulodev.png" /> jika sudah ada filenya */}
              <img src="/SuloDev-circle.png" className="w-6 h-6" alt="" />
              <span className="font-bold text-white tracking-wide group-hover:text-bajo-light transition-colors">
                SuloDev
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}