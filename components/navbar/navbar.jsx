"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <div className='flex flex-col w-full rounded-lg'>
      <div className='flex rounded-lg justify-between items-center p-4 bg-white/80 backdrop-blur-sm shadow-sm'>
        <div className='flex flex-row items-baseline gap-10'>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            onClick={() => router.push("/")}
            style={{ cursor: "pointer" }}>
            Cross Club
          </h1>
          <h1 className='text-lg font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent' onClick={() => router.push("/leaderSystem")} style={{ cursor: "pointer" }}>
            Liderlik Sistemi
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className='hidden md:flex gap-6 items-center'>
          <span className='text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300'>
            Kullanıcı Adı
          </span>
          <button className='px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-all duration-300'>
            Giriş/Çıkış
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
          <span className='text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300 text-center'>
            Kullanıcı Adı
          </span>
          <button className='px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-all duration-300'>
            Giriş/Çıkış
          </button>
        </div>
      )}
    </div>
  )
}

export default Navbar
