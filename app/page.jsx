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

  const goOnline = () => {
    router.push("/onlineWhoPlay");
  };

  return (
    <>
      <main className="flex flex-col min-h-screen p-5">
        <div className="relative w-full h-[200px] overflow-hidden rounded-lg">
          <Image
            src="https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3"
            alt="banner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <h1 className="absolute inset-0 flex items-center justify-center text-4xl md:text-5xl font-extrabold text-white text-center z-10">
            Futbol Bilgini Test Et
          </h1>
        </div>
        {/* Top Section */}
        <div className="flex md:flex-row flex-col gap-4 p-4 md:p-5 justify-center items-center">
          <section className="flex-1">
            <div className="flex flex-col gap-4 p-4 md:p-5 justify-center items-center">
              <div className="flex flex-col gap-4 justify-center items-center w-full max-w-4xl">
                <div className="flex flex-col gap-1 justify-between items-center">
                  <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
                    Kim Oynadı ?
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
                      Oyna
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
                    Online
                  </h1>
                  <HowToPlayModal />
                </div>
                <div className="flex justify-center items-center w-full mt-2 md:mt-4">
                  <Button className="h-28 md:h-40 w-full md:w-2/4 p-0 overflow-hidden relative rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm" onClick={goOnline} disabled>
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
              <span className="bg-white px-4 text-sm text-gray-500 font-medium rounded-lg">Tutorial Video</span>
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
