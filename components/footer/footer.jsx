import Link from 'next/link';
import { FaYoutube, FaInstagram, FaTiktok } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="mt-auto py-6 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Sosyal Medya Linkleri */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <h3 className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Bizi Takip Edin
            </h3>
            <div className="flex space-x-6">
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <FaYoutube size={24} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transition-colors"
              >
                <FaInstagram size={24} />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-black transition-colors"
              >
                <FaTiktok size={24} />
              </a>
            </div>
          </div>

          {/* Bağış Butonu */}
          <div>
            <Link 
              href="/bagis" 
              className="px-4 py-2 bg-white/80 backdrop-blur-sm text-sm font-medium rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent border-2 border-blue-600/20 hover:border-purple-600/40"
            >
              Bağış Yap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}  