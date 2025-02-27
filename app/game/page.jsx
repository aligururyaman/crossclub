"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import vs from '@/public/images/vs.png'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { Skeleton } from "@/components/ui/skeleton"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

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
    e.preventDefault()
    if (!inputValue.trim() || loading) return

    const player = suggestions.find(p =>
      p.name.toLowerCase() === inputValue.trim().toLowerCase()
    )

    if (player &&
      player.team.includes(teams[0]?.name) &&
      player.team.includes(teams[1]?.name)) {
      setScore(prev => prev + 10)
      setMessage('Doğru! +10 puan')
      setTimeout(() => setMessage(''), 2000)
      await getNewMatch()
    } else {
      setScore(prev => prev - 1)
      setMessage('Yanlış! -1 puan')
      setTimeout(() => setMessage(''), 2000)
      setInputValue('')
    }

    setSuggestions([])
  }

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

        {/* Sağ Alt Blob */}
        <div className="absolute bottom-0 right-0 w-96 h-96 opacity-30">
          <div className="w-full h-full bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-400 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className='flex flex-col items-center gap-4 pt-10'>
        {/* Kalan Süre - Üst kısım */}
        <div className='w-full max-w-xl p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-300 mx-auto'>
          <div className='flex justify-center items-center'>
            <div className='flex gap-2 items-center'>
              <span className='font-semibold text-gray-700'>{t('game.timeLeft')}:</span>
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
        <div className='flex flex-col w-full max-w-sm gap-2'>
          <div className='flex flex-col md:flex-row gap-2'>
            <Input
              type="text"
              placeholder={t('game.enterPlayerName')}
              value={inputValue}
              onChange={handleInputChange}
              className="w-full p-4 text-lg rounded-xl h-14 md:h-12"
            />
            <div className='flex gap-2'>
              <Button
                onClick={handleSubmit}
                className='flex-1 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all duration-300 h-14 md:h-12'
                disabled={loading}
              >
                {t('game.submit')}
              </Button>
              <Button
                onClick={handlePass}
                className='flex-1 px-4 border-2 border-blue-600 bg-white text-gray-700 hover:bg-white hover:border-purple-600 transition-colors duration-300 h-14 md:h-12'
                disabled={loading}
              >
                Pas
              </Button>
            </div>
          </div>

          {suggestions.length > 0 && (
            <div className='bg-white/90 rounded-lg p-2 mt-1'>
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className='cursor-pointer hover:bg-gray-100 p-1 rounded uppercase'
                  onClick={() => setInputValue(suggestion.name)}
                >
                  {suggestion.name}
                </div>
              ))}
            </div>
          )}
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
  )
}

