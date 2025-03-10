import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function HowToPlayModal() {
  return (
    <Dialog>
      <DialogTrigger className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-300 underline underline-offset-2">
        Nasıl Oynanır?
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Cross Club Nasıl Oynanır?
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">
            Cross Club, her turda size verilen iki takımda da oynamış ortak oyuncuyu bulmanız gereken bir futbol bilgi oyunudur.
          </p>
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">Oyun Kuralları:</h3>
            <ul className="list-disc pl-4 space-y-1 text-gray-600">
              <li>Size iki farklı futbol kulübü gösterilecek</li>
              <li>Göreviniz her iki takımda da oynamış bir oyuncuyu bulmak</li>
              <li>Oyuncunun adını yazın ve cevabınızı gönderin</li>
              <li>Her doğru cevap için puan kazanın</li>
              <li>Mümkün olan en yüksek puanı elde etmeye çalışın!</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default HowToPlayModal