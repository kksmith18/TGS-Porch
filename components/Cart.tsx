'use client'

import { useCartStore } from '@/lib/cartStore'
import { formatPrice } from '@/lib/prices'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'

export default function Cart() {
  const { items, isOpen, closeCart, removeItem, clearCart } = useCartStore()
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos`
  const totalCents = items.reduce((sum, item) => sum + item.priceCents, 0)

  const handleCheckout = async () => {
    setLoading(true)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, note }),
    })
    const { url, error } = await res.json()
    if (error) {
      alert('Something went wrong. Please try again.')
      setLoading(false)
      return
    }
    clearCart()
    router.push(url)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60" onClick={closeCart} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-[#111] border-l border-white/10 flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h2 className="text-xs tracking-widest uppercase text-white/60">Cart ({items.length})</h2>
          <button onClick={closeCart} className="text-white/40 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-white/30 text-sm">Your cart is empty.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map(item => (
                <div key={item.cartItemId} className="flex gap-3">
                  <div className="relative w-16 h-16 shrink-0 overflow-hidden bg-white/5">
                    <Image
                      src={`${bucketUrl}/${item.filePath}`}
                      alt={item.photoSubject ?? 'Photo'}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate">{item.photoSubject ?? item.photoTitle ?? 'Photo'}</p>
                    <p className="text-xs text-white/40 mt-0.5">
                      {item.type === 'digital'
                        ? 'Digital Download'
                        : `${item.sizeLabel} Print${item.frameId !== 'none' ? ` · ${item.frameLabel}` : ''}`}
                    </p>
                    <p className="text-xs text-white/70 mt-1">{formatPrice(item.priceCents)}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.cartItemId)}
                    className="text-white/20 hover:text-red-400 transition-colors text-xs shrink-0"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="px-6 py-5 border-t border-white/10 space-y-4">
              <textarea
                placeholder="Special requests (optional) — size preferences, dedications, etc."
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={2}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-3 py-2 text-xs outline-none focus:border-white/30 resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40 uppercase tracking-widest">Total</span>
                <span className="text-white font-light">{formatPrice(totalCents)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full border border-white/20 text-white text-xs tracking-widest uppercase py-3 hover:border-white/60 transition-colors disabled:opacity-40"
              >
                {loading ? 'Redirecting...' : 'Checkout'}
              </button>
              <p className="text-white/20 text-[10px] text-center">Secure payment via Stripe</p>
            </div>
          </>
        )}
      </div>
    </>
  )
}
