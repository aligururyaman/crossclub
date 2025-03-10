"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/utils/firestore'
import { signOut } from 'firebase/auth'
import { toast } from 'sonner'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Auth durumunu dinle
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Başarıyla çıkış yapıldı");
      router.push("/");
    } catch (error) {
      toast.error("Çıkış yapılırken bir hata oluştu");
    }
  };

  const handleAuthClick = () => {
    if (user) {
      handleLogout();
    } else {
      router.push("/login");
    }
  };

  return (
    <div className='flex flex-col w-full rounded-lg'>
      <div className='flex rounded-lg justify-between items-center p-4 bg-white/80 backdrop-blur-sm shadow-sm'>
        <div className='flex items-center gap-8'>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" onClick={() => router.push("/")} style={{ cursor: "pointer" }}>
            Futbol Quiz
          </h1>
          <button
            onClick={() => router.push("/scoreboard")}
            className='hidden md:block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium hover:opacity-80 transition-colors duration-300'
          >
            Liderlik Tablosu
          </button>
        </div>

        {/* Desktop Menu */}
        <div className='hidden md:flex gap-6 items-center'>
          {user && (
            <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium'>
              {user.displayName || user.email}
            </span>
          )}
          <button
            onClick={handleAuthClick}
            className='px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-all duration-300'
          >
            {user ? 'Çıkış Yap' : 'Giriş Yap'}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-700 hover:text-blue-600 transition-colors duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className='md:hidden flex flex-col gap-4 p-4 bg-white/80 backdrop-blur-sm shadow-sm'>
          <button
            onClick={() => router.push("/scoreboard")}
            className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium hover:opacity-80 transition-colors duration-300'
          >
            Liderlik Tablosu
          </button>
          {user && (
            <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium text-center'>
              {user.displayName || user.email}
            </span>
          )}
          <button
            onClick={handleAuthClick}
            className='px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-all duration-300'
          >
            {user ? 'Çıkış Yap' : 'Giriş Yap'}
          </button>
        </div>
      )}
    </div>
  )
}

export default Navbar
