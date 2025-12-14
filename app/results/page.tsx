'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const score = parseInt(searchParams.get('score') || '0')
  const bpm = parseInt(searchParams.get('bpm') || '90')
  const accuracy = parseInt(searchParams.get('accuracy') || '0')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="text-8xl mb-4">🎉</div>
        <h1 className="text-5xl font-extrabold mb-2 text-primary">AMAZING!</h1>
        <p className="text-xl text-gray-300">Nice work!</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-6 mb-12 w-full max-w-2xl"
      >
        <div className="bg-gray-800 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-2">🎯</div>
          <div className="text-3xl font-extrabold text-white mb-1">{score.toLocaleString()}</div>
          <div className="text-sm text-gray-400">SCORE</div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-2">⚡</div>
          <div className="text-3xl font-extrabold text-white mb-1">{bpm}</div>
          <div className="text-sm text-gray-400">MAX BPM</div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-2">✓</div>
          <div className="text-3xl font-extrabold text-white mb-1">{accuracy}%</div>
          <div className="text-sm text-gray-400">ACCURACY</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4 w-full max-w-md"
      >
        <button
          onClick={() => router.push('/game')}
          className="w-full bg-primary text-black font-extrabold text-xl py-4 px-8 rounded-2xl hover:scale-105 transition-transform"
        >
          🔄 PLAY AGAIN
        </button>

        <button
          onClick={() => router.push('/')}
          className="w-full bg-transparent border-2 border-primary text-primary font-bold text-lg py-3 px-8 rounded-2xl hover:scale-105 transition-transform"
        >
          ← HOME
        </button>
      </motion.div>
    </div>
  )
}
