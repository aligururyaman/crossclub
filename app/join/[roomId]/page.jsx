"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/utils/firestore'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

export default function JoinRoom({ params }) {
  const router = useRouter()
  const { roomId } = params

  useEffect(() => {
    const joinRoom = async () => {
      const user = auth.currentUser
      if (!user) {
        router.push('/login?redirect=' + encodeURIComponent(`/join/${roomId}`))
        return
      }

      const roomRef = doc(db, 'gameRooms', roomId)
      const roomSnap = await getDoc(roomRef)

      if (!roomSnap.exists()) {
        alert('Oda bulunamadı!')
        router.push('/onlineGame')
        return
      }

      const roomData = roomSnap.data()
      if (roomData.status !== 'waiting') {
        alert('Bu oda dolu veya oyun başlamış!')
        router.push('/onlineGame')
        return
      }

      await updateDoc(roomRef, {
        guest: {
          id: user.uid,
          name: user.displayName
        },
        status: 'playing'
      })

      router.push(`/game/${roomId}`)
    }

    joinRoom()
  }, [roomId, router])

  return <div>Odaya katılınıyor...</div>
} 