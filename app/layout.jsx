import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cross Club",
  description: "Cross Club - Football Player Guessing Game",
  other: {
    'preload': [
      {
        'as': 'image',
        'href': '/images/startButton.png',
        'imageSrcSet': '/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FstartButton.99c342e0.png&w=640 1x, /_next/image?url=%2F_next%2Fstatic%2Fmedia%2FstartButton.99c342e0.png&w=750 2x'
      }
    ]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
