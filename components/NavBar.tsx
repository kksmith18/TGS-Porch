'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import CartIcon from './CartIcon'
import Cart from './Cart'

export default function NavBar() {
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) return null

  return (
    <>
      <nav className="border-b border-white/10 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
          <Link href="/" className="text-lg font-semibold tracking-wide text-white">
            TGS Porch
          </Link>
          <div className="flex items-center gap-8">
            <Link
              href="/concert"
              className={`text-xs tracking-widest uppercase transition-colors ${
                pathname === '/concert' ? 'text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              Concert
            </Link>
            <Link
              href="/nature"
              className={`text-xs tracking-widest uppercase transition-colors ${
                pathname === '/nature' ? 'text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              Nature
            </Link>
            <Link
              href="/about"
              className={`text-xs tracking-widest uppercase transition-colors ${
                pathname === '/about' ? 'text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              About
            </Link>
            <CartIcon />
          </div>
        </div>
      </nav>
      <Cart />
    </>
  )
}
