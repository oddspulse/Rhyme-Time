'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-7xl font-extrabold mb-2 text-white text-shadow">
          RHYME
        </h1>
        <h1 className="text-7xl font-extrabold mb-4 text-primary text-shadow">
          TIME
        </h1>
        <p className="text-xl text-gray-300">Say the word on beat!</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 w-full max-w-md"
      >
        <Link href="/game">
          <button className="w-full bg-primary text-black font-extrabold text-2xl py-6 px-8 rounded-2xl hover:scale-105 transition-transform shadow-lg">
            PLAY
          </button>
        </Link>

        <Link href="/daily">
          <button className="w-full bg-secondary text-white font-bold text-xl py-4 px-8 rounded-2xl hover:scale-105 transition-transform shadow-lg">
            DAILY CHALLENGE
          </button>
        </Link>

        <Link href="/settings">
          <button className="w-full bg-transparent border-2 border-primary text-primary font-bold text-lg py-3 px-8 rounded-2xl hover:scale-105 transition-transform">
            Settings
          </button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 text-center text-gray-400 text-sm"
      >
        <p>🎵 Tap cards on the beat • BPM increases • Don't miss! 🎵</p>
      </motion.div>
    </div>
  )
}
