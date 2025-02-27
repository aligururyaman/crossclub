"use client"
import { useState, useEffect } from 'react';

export default function YouTubePlayer() {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('youtube-container');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div id="youtube-container" className="aspect-video w-full bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg">
      {isInView ? (
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/-HnT24YmmiA?rel=0&modestbranding=1"
          title="Cross Club Tutorial"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
          <span className="text-gray-500">Video yükleniyor...</span>
        </div>
      )}
    </div>
  );
} 