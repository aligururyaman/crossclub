"use client"
import React from 'react'

function Page() {
  return (
    <div className='min-h-screen bg-gradient-to-br'>
      {/* Dekoratif Arka Plan Elementleri */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Çapraz Şeritler */}
        <div className="absolute -top-1/2 -right-1/2 w-[150%] h-[150%] rotate-12 flex space-x-8 opacity-20">
          <div className="w-32 md:w-48 h-[200%] bg-gradient-to-b from-purple-600 to-blue-600 blur-xl"></div>
          <div className="w-32 md:w-48 h-[200%] bg-gradient-to-b from-blue-600 to-cyan-400 blur-xl"></div>
          <div className="w-32 md:w-48 h-[200%] bg-gradient-to-b from-purple-600 to-pink-500 blur-xl"></div>
        </div>
      </div>

      {/* Sayfa İçeriği */}
      <div className='relative z-10 container mx-auto p-4'>
        <h1 className='text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
          Liderlik Tablosu
        </h1>

        {/* Buraya liderlik tablosu içeriği gelecek */}
      </div>
    </div>
  )
}

export default Page
