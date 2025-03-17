"use client"
import { useState, useEffect } from 'react'
import { db, auth } from '@/utils/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, setDoc, getDoc, onSnapshot, collection } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function OnlineGame() {
  const router = useRouter()
  const [gameMode, setGameMode] = useState(null) // 'create' veya 'random'
  const [roomId, setRoomId] = useState(null)
  const [waiting, setWaiting] = useState(false)

  // Oda oluşturma fonksiyonu
  const createRoom = async () => {
    const user = auth.currentUser
    if (!user) return

    const roomRef = doc(collection(db, 'gameRooms'))
    const roomData = {
      id: roomRef.id,
      host: {
        id: user.uid,
        name: user.displayName
      },
      guest: null,
      status: 'waiting', // waiting, playing, finished
      createdAt: new Date().toISOString(),
      gameData: {
        hostScore: 0,
        guestScore: 0,
        currentMatch: null
      }
    }

    await setDoc(roomRef, roomData)
    setRoomId(roomRef.id)
    setWaiting(true)
  }

  // Random eşleşme fonksiyonu
  const findRandomMatch = async () => {
    const user = auth.currentUser
    if (!user) return

    // Bekleyen odaları bul
    const waitingRooms = await getDocs(
      query(
        collection(db, 'gameRooms'),
        where('status', '==', 'waiting'),
        where('host.id', '!=', user.uid)
      )
    )

    if (!waitingRooms.empty) {
      // Varolan odaya katıl
      const room = waitingRooms.docs[0]
      await setDoc(doc(db, 'gameRooms', room.id), {
        ...room.data(),
        guest: {
          id: user.uid,
          name: user.displayName
        },
        status: 'playing'
      })
      setRoomId(room.id)
    } else {
      // Yeni oda oluştur
      createRoom()
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      {!gameMode ? (
        <>
          <Button
            onClick={() => setGameMode('create')}
            className="w-64 h-16 text-xl"
          >
            Oda Oluştur
          </Button>
          <Button
            onClick={() => setGameMode('random')}
            className="w-64 h-16 text-xl"
          >
            Random Eşleş
          </Button>
        </>
      ) : waiting ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Rakip Bekleniyor...</h2>
          {gameMode === 'create' && (
            <div className="bg-gray-100 p-4 rounded">
              <p className="mb-2">Arkadaşınızı davet edin:</p>
              <code className="block bg-white p-2 rounded">
                {`${window.location.origin}/join/${roomId}`}
              </code>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
