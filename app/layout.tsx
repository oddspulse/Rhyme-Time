import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rhyme Time - Say the Word on Beat!',
  description: 'Viral rhythm game - tap rhyming words on the beat!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-[#1a1a2e] to-[#16213e] min-h-screen">
        {children}
      </body>
    </html>
  )
}
