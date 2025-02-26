"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import startButton from "@/public/images/startButton.png";
import HowToPlayModal from "@/components/main/HowToPlayModal";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const goGame = () => {
    router.push("/game");
  };

  return (
    <>
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Diagonal Stripes */}
        <div className="absolute -top-1/2 -right-1/2 w-[150%] h-[150%] rotate-12 flex space-x-8 opacity-20">
          <div className="w-32 md:w-48 h-[200%] bg-gradient-to-b from-purple-600 to-blue-600 blur-xl"></div>
          <div className="w-32 md:w-48 h-[200%] bg-gradient-to-b from-blue-600 to-cyan-400 blur-xl"></div>
          <div className="w-32 md:w-48 h-[200%] bg-gradient-to-b from-purple-600 to-pink-500 blur-xl"></div>
        </div>

        {/* Bottom Right Blob */}
        <div className="absolute bottom-0 right-0 w-96 h-96 opacity-30">
          <div className="w-full h-full bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-400 rounded-full blur-3xl"></div>
        </div>
      </div>

      <main className="flex flex-col min-h-screen pt-16">
        {/* Top Section */}
        <div className="flex flex-row gap-4 p-4 md:p-5 justify-center items-center">
          <section className="flex-1">
            <div className="flex flex-col gap-4 p-4 md:p-5 justify-center items-center">
              <div className="flex flex-col gap-4 justify-center items-center w-full max-w-4xl">
                <div className="flex flex-col gap-1 justify-between items-center">
                  <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
                    Cross Club
                  </h1>
                  <HowToPlayModal />
                </div>
                <div className="flex justify-center items-center w-full mt-2 md:mt-4">
                  <Button className="h-28 md:h-40 w-full md:w-2/4 p-0 overflow-hidden relative rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm" onClick={goGame}>
                    <Image
                      src={startButton}
                      alt="starButton"
                      className="w-full h-full object-cover hover:scale-105 transition-all duration-300 z-0"
                    />
                    <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
                    <span className="absolute inset-0 flex items-center justify-center text-white text-2xl md:text-4xl font-bold z-20 pointer-events-none drop-shadow-lg">
                      Play
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </section>
          <section className="flex-1">
            <div className="flex flex-col gap-4 p-4 md:p-5 justify-center items-center">
              <div className="flex flex-col gap-4 justify-center items-center w-full max-w-4xl">
                <div className="flex flex-col gap-1 justify-between items-center">
                  <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
                    Find Who is this
                  </h1>
                  <HowToPlayModal />
                </div>
                <div className="flex justify-center items-center w-full mt-2 md:mt-4">
                  <Button className="h-28 md:h-40 w-full md:w-2/4 p-0 overflow-hidden relative rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm" onClick={goGame} disabled>
                    <Image
                      src={startButton}
                      alt="starButton"
                      className="w-full h-full object-cover hover:scale-105 transition-all duration-300 z-0"
                    />
                    <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
                    <span className="absolute inset-0 flex items-center justify-center text-white text-2xl md:text-4xl font-bold z-20 pointer-events-none drop-shadow-lg">
                      Yapım Aşamasında
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
        {/* Divider */}
        <div className="w-full max-w-4xl mx-auto px-4 my-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-gray-500 font-medium">Tutorial Video</span>
            </div>
          </div>
        </div>

        {/* Video section */}
        <section className="w-full max-w-4xl mx-auto px-4 mb-8">
          <div className="aspect-video w-full bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/-HnT24YmmiA"
              title="Cross Club Tutorial"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </section>
      </main>
    </>
  );
}
