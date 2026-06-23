'use client'

import { useState } from 'react'
import {
  DIGITAL_PRICE_CENTS,
  PRINT_SIZES,
  FRAME_OPTIONS,
  formatPrice,
  getPrintTotal,
  type PrintSizeId,
  type FrameOptionId,
} from '@/lib/prices'
import { useCartStore } from '@/lib/cartStore'
import type { Photo } from './Gallery'

type Props = {
  photo: Photo
}

export default function PurchasePanel({ photo }: Props) {
  const [tab, setTab] = useState<'digital' | 'print'>('digital')
  const [selectedSize, setSelectedSize] = useState<PrintSizeId>('8x10')
  const [selectedFrame, setSelectedFrame] = useState<FrameOptionId>('none')
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(s => s.addItem)

  const printTotal = getPrintTotal(selectedSize, selectedFrame)
  const frameOption = FRAME_OPTIONS.find(f => f.id === selectedFrame)!
  const sizeOption = PRINT_SIZES.find(s => s.id === selectedSize)!

  const handleAddToCart = () => {
    if (tab === 'digital') {
      addItem({
        cartItemId: `${photo.id}-digital-${Date.now()}`,
        photoId: photo.id,
        photoSubject: photo.subject,
        photoTitle: photo.title,
        filePath: photo.file_path,
        type: 'digital',
        priceCents: DIGITAL_PRICE_CENTS,
      })
    } else {
      addItem({
        cartItemId: `${photo.id}-print-${selectedSize}-${selectedFrame}-${Date.now()}`,
        photoId: photo.id,
        photoSubject: photo.subject,
        photoTitle: photo.title,
        filePath: photo.file_path,
        type: 'print',
        sizeId: selectedSize,
        sizeLabel: sizeOption.label,
        frameId: selectedFrame,
        frameLabel: frameOption.label,
        priceCents: printTotal,
      })
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <p className="text-[10px] tracking-widest uppercase text-white/40 mb-4">
        Looking to Purchase?
      </p>

      {/* Tab toggle */}
      <div className="flex gap-0 border border-white/10 mb-5">
        <button
          onClick={() => setTab('digital')}
          className={`flex-1 py-2 text-[10px] tracking-widest uppercase transition-colors ${
            tab === 'digital' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white'
          }`}
        >
          Digital
        </button>
        <button
          onClick={() => setTab('print')}
          className={`flex-1 py-2 text-[10px] tracking-widest uppercase transition-colors border-l border-white/10 ${
            tab === 'print' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white'
          }`}
        >
          Print
        </button>
      </div>

      {tab === 'digital' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <div>
              <p className="text-xs text-white">High-Res Digital</p>
              <p className="text-[10px] text-white/40 mt-0.5">No watermark · Full resolution</p>
            </div>
            <p className="text-white text-sm">{formatPrice(DIGITAL_PRICE_CENTS)}</p>
          </div>
          <p className="text-[10px] text-white/30 leading-5">
            File delivered via email within 24 hours of purchase.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Size selection */}
          <div>
            <p className="text-[10px] tracking-widest uppercase text-white/40 mb-2">Size</p>
            <div className="grid grid-cols-2 gap-1.5">
              {PRINT_SIZES.map(size => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size.id)}
                  className={`py-2 text-[10px] tracking-wide border transition-colors ${
                    selectedSize === size.id
                      ? 'border-white text-white'
                      : 'border-white/15 text-white/40 hover:border-white/40'
                  }`}
                >
                  {size.label}
                  <span className="block text-[9px] mt-0.5 opacity-70">{formatPrice(size.priceCents)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Frame selection */}
          <div>
            <p className="text-[10px] tracking-widest uppercase text-white/40 mb-2">Frame</p>
            <div className="flex flex-wrap gap-1.5">
              {FRAME_OPTIONS.map(frame => {
                const added = frame.addedCents[selectedSize]
                return (
                  <button
                    key={frame.id}
                    onClick={() => setSelectedFrame(frame.id)}
                    className={`px-3 py-1.5 text-[10px] border transition-colors rounded-full ${
                      selectedFrame === frame.id
                        ? 'border-white text-white'
                        : 'border-white/15 text-white/40 hover:border-white/40'
                    }`}
                  >
                    {frame.label}
                    {added > 0 && <span className="ml-1 opacity-70">+{formatPrice(added)}</span>}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-white/10">
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Total</p>
            <p className="text-white text-sm">{formatPrice(printTotal)}</p>
          </div>
        </div>
      )}

      <button
        onClick={handleAddToCart}
        className={`mt-auto pt-4 w-full border text-[10px] tracking-widest uppercase py-3 transition-all ${
          added
            ? 'border-white/60 text-white/60'
            : 'border-white/20 text-white hover:border-white/60'
        }`}
      >
        {added ? 'Added to Cart ✓' : 'Add to Cart'}
      </button>
    </div>
  )
}
