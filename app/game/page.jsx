"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import vs from '@/public/images/vs.png'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/utils/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'


function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export default function Page() {
  const router = useRouter()
  const [isStarted, setIsStarted] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const [teams, setTeams] = useState([null, null])
  const [previousTeams, setPreviousTeams] = useState([])
  const [currentPlayer, setCurrentPlayer] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(180) // 3 dakika
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [correctPlayer, setCorrectPlayer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [previousMatches, setPreviousMatches] = useState([])
  const [isLastTenSeconds, setIsLastTenSeconds] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [messageType, setMessageType] = useState(null)
  const suggestionsRef = React.useRef(null)
  const [authChecked, setAuthChecked] = useState(false)


  const getNewMatch = async () => {
    setLoading(true)
    setSuggestions([])
    setInputValue('')

    try {
      const response = await fetch(
        `/api/game/new-match?previous=${previousTeams.join(',')}&previousMatches=${previousMatches.join(',')}`
      )

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()

      if (data.retry) {
        setTimeout(() => getNewMatch(), 500)
        return
      }

      if (data.resetPrevious) {
        setPreviousTeams([])
        setPreviousMatches([])
        setTimeout(() => getNewMatch(), 500)
        return
      }

      if (!data.teams || !data.teams[0] || !data.teams[1]) {
        throw new Error('Invalid team data')
      }

      setTeams(data.teams)
      setCorrectPlayer(data.player || null)
      setCurrentPlayer(data.player || null)
      setPreviousTeams(prev => {
        const newTeams = [...prev, data.teams[0].name, data.teams[1].name].slice(-6)
        return newTeams
      })
      setPreviousMatches(prev => [...prev, data.matchId])

    } catch (error) {
      console.error('Hata:', error)
      setTimeout(() => getNewMatch(), 500)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = async (e) => {
    const value = e.target.value
    setInputValue(value)

    if (value.trim().length > 0 && teams.length === 2) {
      try {
        const encodedValue = encodeURIComponent(value)
        const response = await fetch(
          `/api/game/suggestions?q=${encodedValue}&team1=${teams[0]?.name}&team2=${teams[1]?.name}`
        )
        const data = await response.json()
        setSuggestions(data.players || [])
      } catch (error) {
        console.error('Öneriler yüklenirken hata:', error)
        setSuggestions([])
      }
    } else {
      setSuggestions([])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    try {
      // Önce suggestions API'den oyuncuyu kontrol et
      const searchResponse = await fetch(
        `/api/game/suggestions?q=${encodeURIComponent(inputValue.trim())}`
      );
      const searchData = await searchResponse.json();

      // Bulunan oyuncular arasından tam eşleşeni bul
      const player = searchData.players.find(
        p => p.name.toLowerCase() === inputValue.trim().toLowerCase()
      );

      console.log('Aranan oyuncu:', inputValue.trim());
      console.log('Bulunan oyuncu:', player);
      console.log('Mevcut takımlar:', teams[0].name, teams[1].name);
      console.log('Oyuncunun takımları:', player?.team);

      // Oyuncu bulunduysa ve her iki takımda da oynamışsa
      if (player &&
        player.team.includes(teams[0].name) &&
        player.team.includes(teams[1].name)) {
        // Doğru cevap
        setScore(prev => prev + 10);
        setMessage('Doğru! +10 puan');
        setTimeout(() => setMessage(''), 2000);
        await getNewMatch();
      } else {
        // Yanlış cevap
        setScore(prev => prev - 1);
        setMessage('Yanlış! -1 puan');
        setTimeout(() => setMessage(''), 2000);
        setInputValue('');
      }
    } catch (error) {
      console.error('Hata:', error);
      setMessage('Bir hata oluştu');
      setTimeout(() => setMessage(''), 2000);
    }

    setSuggestions([]);
  };

  const handlePass = async () => {
    if (loading) return
    setScore(prev => prev - 1)
    setMessage('Pas! -1 puan')
    setTimeout(() => setMessage(''), 2000)
    await getNewMatch()
    setInputValue('')
    setSuggestions([])
  }

  useEffect(() => {
    getNewMatch().then(() => setIsInitialLoad(false))
  }, [])

  useEffect(() => {
    if (isStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            setGameOver(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isStarted, timeLeft])

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }

    if (countdown === 0) {
      setCountdown(null);
      setIsStarted(true);
    }
  }, [countdown]);

  const handleAnswer = async (answer) => {
    if (answer === 'pass') {
      setMessageType('pass');
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        getNewMatch();
      }, 1500);
      return;
    }

    if (answer === 'correct') {
      setMessageType('success');
      setScore(prev => prev + 1);
    } else {
      setMessageType('error');
    }

    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
      getNewMatch();
    }, 1500);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setSuggestions([])
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auth kontrolü
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthChecked(true)
      if (!user) {
        router.push('/login')
      }
    })

    return () => unsubscribe()
  }, [router])

  // Oyun bittiğinde skoru kaydet
  const saveScore = async (finalScore) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Kullanıcının mevcut skorunu kontrol et
      const userRef = doc(db, "scores", user.uid);
      const userDoc = await getDoc(userRef);
      const currentHighScore = userDoc.exists() ? userDoc.data().score : 0;

      // Eğer yeni skor daha yüksekse güncelle
      if (finalScore > currentHighScore) {
        await setDoc(userRef, {
          userId: user.uid,
          username: user.displayName || user.email.split('@')[0],
          score: finalScore,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Skor kaydedilirken hata:", error);
    }
  };

  // Süre bittiğinde çağrılan fonksiyon
  useEffect(() => {
    if (timeLeft === 0) {
      setGameOver(true);
      saveScore(score);
    }
  }, [timeLeft, score]);

  // Auth kontrolü tamamlanana kadar loading göster
  if (!authChecked) {
    return (
      <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Futbol temalı arka plan */}


      {/* Ana içerik */}
      <div className="relative z-10">
        <div className='flex flex-col items-center gap-4 pt-10'>
          {/* Kalan Süre - Üst kısım */}
          <div className='w-full max-w-xl p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-300 mx-auto'>
            <div className='flex justify-center items-center'>
              <div className='flex gap-2 items-center'>
                <span className='font-semibold text-gray-700'>Kalan Süre:</span>
                <span
                  className={`font-mono text-2xl font-bold
                    ${isLastTenSeconds
                      ? 'bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent animate-pulse'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                    }`}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>

          {/* Takım logoları kısmı */}
          <div className="w-full max-w-xl p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-300">
            <div className='flex items-center justify-between'>
              <div className='text-center'>
                <div className='relative w-[150px] h-[150px] mx-auto'>
                  {teams[0] && (
                    <div className="relative w-full h-full">
                      <Image
                        src={teams[0]?.img || vs}
                        alt={teams[0]?.name || 'Team 1'}
                        fill
                        className='object-contain'
                        priority
                      />
                    </div>
                  )}
                </div>
                <h2 className='text-xl font-bold mt-2'>{teams[0]?.name}</h2>
              </div>

              <div className='relative w-[100px] h-[100px]'>
                <Image src={vs} alt='VS' fill className='object-contain' priority />
              </div>

              <div className='text-center'>
                <div className='relative w-[150px] h-[150px] mx-auto'>
                  {teams[1] && (
                    <div className="relative w-full h-full">
                      <Image
                        src={teams[1]?.img || vs}
                        alt={teams[1]?.name || 'Team 2'}
                        fill
                        className='object-contain'
                        priority
                      />
                    </div>
                  )}
                </div>
                <h2 className='text-xl font-bold mt-2'>{teams[1]?.name}</h2>
              </div>
            </div>
          </div>

          {/* Skor kısmı */}
          <div className='flex flex-col items-center gap-4 p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-300'>
            <div className='flex gap-2 items-center'>
              <span className='font-semibold text-gray-700'>Skor:</span>
              <span className='font-mono text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold'>
                {score}
              </span>
            </div>
          </div>

          {/* Alt kısım - Cevap giriş alanı */}
          <div className="flex flex-col items-center justify-center gap-4 p-4">
            <div className="flex flex-col md:flex-col w-full max-w-4xl gap-4">
              <div className="w-full relative">
                <div className="w-full">
                  <Input
                    type="text"
                    placeholder="Oyuncu adını yazın..."
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      handleInputChange(e);
                    }}
                    className="w-full bg-white/80 backdrop-blur-sm"
                  />
                </div>

                {suggestions.length > 0 && (
                  <div className="absolute w-full" ref={suggestionsRef}>
                    <ScrollArea className="w-full mt-1 max-h-[200px] rounded-md border bg-white/80 backdrop-blur-sm z-50">
                      <div className="p-1">
                        {suggestions.map((player, index) => (
                          <div
                            key={index}
                            className="px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer text-sm"
                            onClick={() => {
                              setInputValue(player.name);
                              setSuggestions([]);
                            }}
                          >
                            {player.name}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>

              <div className="flex flex-row md:flex-row gap-2 w-full md:w-auto">
                <Button
                  className="flex-1 md:flex-none md:w-32 bg-gradient-to-r from-red-600 to-purple-600 text-white hover:opacity-90 transition-all duration-300"
                  onClick={handlePass}
                >
                  Pas
                </Button>
                <Button
                  className="flex-1 md:flex-none md:w-32 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all duration-300"
                  onClick={handleSubmit}
                  disabled={!inputValue}
                >
                  Gönder
                </Button>

              </div>
            </div>
          </div>
        </div>

        {/* Overlay'ler */}
        {(!isStarted || gameOver) && (
          <div className='fixed inset-0 flex items-center justify-center z-50'>
            {!isStarted && (
              <div className='fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50'>
                {countdown === null ? (
                  <div className='flex flex-col items-center gap-4'>
                    <Button
                      onClick={() => {
                        setCountdown(3);
                      }}
                      className='px-16 py-8 text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                               hover:opacity-90 transition-all duration-300 rounded-2xl shadow-xl 
                               hover:shadow-blue-500/20 hover:scale-105 transform'
                    >
                      START
                    </Button>
                    <Link href="/">
                      <Button
                        className='px-8 py-3 text-lg bg-white text-gray-700 hover:bg-gray-100 
                                 transition-all duration-300 rounded-xl shadow-md 
                                 hover:shadow-blue-500/10 border border-gray-200'
                      >
                        Geri Git
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className='text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent 
                                animate-bounce transform transition-all duration-300'>
                    {countdown}
                  </div>
                )}
              </div>
            )}

            {gameOver && (
              <div className='fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50'>
                <div className='bg-white p-8 rounded-xl shadow-lg text-center'>
                  <h2 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4'>
                    Oyun Bitti!
                  </h2>
                  <p className='text-xl text-gray-700 mb-2'>Toplam Puanınız:</p>
                  <p className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4'>
                    {score}
                  </p>
                  <div className='flex gap-4'>
                    <Button
                      onClick={() => window.location.reload()}
                      className='bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 px-8 py-3 text-lg'
                    >
                      Tekrar Oyna
                    </Button>
                    <Button
                      onClick={() => router.push('/')}
                      className='bg-gradient-to-r from-blue-600 to-red-600 text-white hover:opacity-90 px-8 py-3 text-lg'
                    >
                      Çıkış Yap
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Doğru cevap modalı */}
        {showCorrectAnswer && (
          <div className='fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50'>
            <div className='bg-white p-8 rounded-xl shadow-lg transform transition-all duration-300 scale-100 animate-bounce'>
              <div className='text-center'>
                <h2 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2'>
                  Tebrikler!
                </h2>
                <p className='text-gray-600'>+10 Puan Kazandınız</p>
              </div>
            </div>
          </div>
        )}

        {/* Message Toast */}
        {showMessage && (
          <div className='fixed inset-0 flex items-center justify-center z-50'>
            <div className={`
              transform transition-all duration-500 
              ${showMessage ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
              px-16 py-8 rounded-2xl shadow-xl backdrop-blur-sm
              ${messageType === 'success' ? 'bg-gradient-to-r from-blue-600/90 to-purple-600/90' :
                messageType === 'error' ? 'bg-gradient-to-r from-red-600/90 to-pink-600/90' :
                  'bg-gradient-to-r from-yellow-600/90 to-orange-600/90'}
            `}>
              <div className='text-4xl font-bold text-white text-center'>
                {messageType === 'success' && (
                  <div className='flex items-center gap-3'>
                    <span>✓</span>
                    <span>Doğru Cevap!</span>
                  </div>
                )}
                {messageType === 'error' && (
                  <div className='flex items-center gap-3'>
                    <span>✕</span>
                    <span>Yanlış Cevap!</span>
                  </div>
                )}
                {messageType === 'pass' && (
                  <div className='flex items-center gap-3'>
                    <span>↷</span>
                    <span>Pas Geçildi</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Loading Spinner - Tam ekran */}
        {loading && !isInitialLoad && (
          <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Mesaj komponenti */}
        {message && (
          <div className='fixed inset-0 flex items-center justify-center z-[9999]'>
            <div className={`px-8 py-4 rounded-xl text-2xl font-bold shadow-xl
                          animate-bounce backdrop-blur-sm text-white
                          ${message.includes('Doğru')
                ? 'bg-gradient-to-r from-blue-600/90 via-green-500/90 to-purple-600/90'
                : message.includes('Yanlış')
                  ? 'bg-gradient-to-r from-red-600/90 to-purple-600/90'
                  : 'bg-gradient-to-r from-blue-600/90 to-purple-600/90'
              }`}>
              {message}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

