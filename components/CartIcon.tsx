'use client'

import { useCartStore } from '@/lib/cartStore'

export default function CartIcon() {
  const { items, openCart } = useCartStore()
  const count = items.length

  return (
    <button
      onClick={openCart}
      className="relative text-white/50 hover:text-white transition-colors"
      aria-label="Open cart"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  )
}
