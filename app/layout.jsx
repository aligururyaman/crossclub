import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Cross Club",
  description: "Football Quiz Game",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col relative`}
      >
        {/* Futbol temalı arka plan */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {/* Saha çizgileri efekti */}
          <div className="absolute -top-1/2 -right-1/2 w-[150%] h-[150%] rotate-12 flex space-x-8 opacity-10">
            <div className="w-32 md:w-48 h-[200%] bg-gradient-to-b from-[#2E7D32] to-[#1B5E20] blur-xl"></div>
            <div className="w-32 md:w-48 h-[200%] bg-gradient-to-b from-[#388E3C] to-[#2E7D32] blur-xl"></div>
            <div className="w-32 md:w-48 h-[200%] bg-gradient-to-b from-[#43A047] to-[#388E3C] blur-xl"></div>
          </div>

          {/* Stadyum ışıkları efekti */}
          <div className="absolute top-0 left-0 w-96 h-96 opacity-20">
            <div className="w-full h-full bg-gradient-to-br from-white via-yellow-200 to-transparent rounded-full blur-3xl"></div>
          </div>

          {/* Saha dokusu */}
          <div className="absolute inset-0 bg-[url('/images/grass-pattern.png')] opacity-5"></div>

          {/* Tribün efekti */}
          <div className="absolute bottom-0 right-0 w-full h-48 bg-gradient-to-t from-[#1B5E20] to-transparent opacity-30"></div>
        </div>

        {/* Navbar */}
        <div className="relative z-10 border-b-2 border-gray-200/20 backdrop-blur-sm">
          <div className="p-4">
            <Navbar />
          </div>
        </div>

        {/* Ana içerik */}
        <main className="flex-grow relative z-10">
          {children}
        </main>

        {/* Footer */}
        <div className="relative z-10 backdrop-blur-sm">
          <Footer />
        </div>
      </body>
    </html>
  );
}
