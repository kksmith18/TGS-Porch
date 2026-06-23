import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import NavBar from '@/components/NavBar'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "TGS Porch — Photography",
  description: 'Concert and nature photography',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.className} h-full`}>
      <body className="bg-[#0a0a0a] text-white min-h-full flex flex-col antialiased">
        <NavBar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10">
          {children}
        </main>
      </body>
    </html>
  )
}
