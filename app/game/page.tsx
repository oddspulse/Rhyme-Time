'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { RHYME_PACKS } from '@/src/data/packs'
import { RhymeItem } from '@/src/types'

export default function GamePage() {
  const router = useRouter()
  const [cards, setCards] = useState<RhymeItem[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [bpm, setBpm] = useState(90)
  const [beatCount, setBeatCount] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    const pack = RHYME_PACKS[0]
    const shuffled = [...pack.items].sort(() => Math.random() - 0.5).slice(0, 8)
    setCards(shuffled)
    setBpm(pack.bpmStart)
  }, [])

  const startGame = () => {
    setGameStarted(true)
    startTimeRef.current = Date.now()
  }

  useEffect(() => {
    if (!gameStarted || cards.length === 0) return

    const beatInterval = (60 / bpm) * 1000
    let beatTimer: NodeJS.Timeout

    const nextBeat = () => {
      if (beatCount >= 16) {
        router.push(\`/results?score=\${score}&bpm=\${bpm}&accuracy=85\`)
        return
      }

      const randomIndex = Math.floor(Math.random() * cards.length)
      setActiveIndex(randomIndex)
      setBeatCount(prev => prev + 1)

      beatTimer = setTimeout(nextBeat, beatInterval)
    }

    beatTimer = setTimeout(nextBeat, beatInterval)

    return () => clearTimeout(beatTimer)
  }, [gameStarted, beatCount, bpm, cards, score, router])

  const handleCardTap = (word: string, index: number) => {
    if (index !== activeIndex) return

    const currentTime = Date.now()
    const expectedTime = startTimeRef.current + beatCount * ((60 / bpm) * 1000)
    const diff = Math.abs(currentTime - expectedTime)

    let judgement = 'miss'

    if (diff <= 80) {
      judgement = 'PERFECT! ⭐'
      setScore(prev => prev + 100)
    } else if (diff <= 150) {
      judgement = 'GOOD ✓'
      setScore(prev => prev + 50)
    } else {
      judgement = 'MISS ✗'
      setLives(prev => prev - 1)
    }

    setFeedback(judgement)
    setTimeout(() => setFeedback(null), 500)

    if (lives <= 1 && judgement === 'MISS ✗') {
      router.push(\`/results?score=\${score}&bpm=\${bpm}&accuracy=65\`)
    }
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <button
          onClick={startGame}
          className="bg-primary text-black font-extrabold text-3xl py-8 px-12 rounded-2xl hover:scale-105 transition-transform"
        >
          START GAME
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="text-center">
            <div className="text-sm text-gray-400">LIVES</div>
            <div className="text-2xl">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i}>{i < lives ? '❤️' : '🖤'}</span>
              ))}
            </div>
          </div>

          <div className="text-center">
            <div className="text-primary text-sm">BPM</div>
            <div className="text-primary text-5xl font-extrabold">{bpm}</div>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-400">SCORE</div>
            <div className="text-2xl font-bold">{score}</div>
          </div>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: \`\${(beatCount / 16) * 100}%\` }}
          />
        </div>
      </div>

      {feedback && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-extrabold text-center z-50"
        >
          {feedback}
        </motion.div>
      )}

      <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
        {cards.map((item, index) => (
          <motion.button
            key={index}
            onClick={() => handleCardTap(item.word, index)}
            className={\`aspect-square rounded-2xl p-4 flex flex-col items-center justify-center transition-all \${
              index === activeIndex
                ? 'bg-primary text-black scale-105 shadow-2xl shadow-primary/50'
                : 'bg-gray-800 text-white'
            }\`}
            animate={index === activeIndex ? { scale: [1, 1.06, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <div className="text-4xl mb-2">{item.imageAsset}</div>
            <div className="text-sm font-bold">{item.word}</div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
