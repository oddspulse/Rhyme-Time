'use client'

import Link from 'next/link'

export default function DailyChallenge() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-extrabold mb-4">🗓️ DAILY CHALLENGE</h1>
      <p className="text-gray-400 mb-8">Coming soon!</p>
      <Link href="/">
        <button className="bg-primary text-black font-bold py-3 px-8 rounded-xl">
          ← Back
        </button>
      </Link>
    </div>
  )
}
