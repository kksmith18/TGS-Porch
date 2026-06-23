'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import type { Photo } from './Gallery'
import PurchasePanel from './PurchasePanel'

type LightboxProps = {
  photos: Photo[]
  bucketUrl: string
  startIndex: number
  onClose: () => void
}

export default function Lightbox({ photos, bucketUrl, startIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(startIndex)

  const prev = useCallback(() => setIndex(i => Math.max(0, i - 1)), [])
  const next = useCallback(() => setIndex(i => Math.min(photos.length - 1, i + 1)), [photos.length])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, prev, next])

  const photo = photos[index]

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex">

      {/* Image area */}
      <div className="flex-1 flex items-center justify-center relative min-w-0">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white text-3xl leading-none z-10"
          aria-label="Close"
        >
          &times;
        </button>

        {index > 0 && (
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-5xl leading-none select-none z-10"
            aria-label="Previous photo"
          >
            ‹
          </button>
        )}

        <div className="relative w-full h-full max-h-screen p-12">
          <Image
            src={`${bucketUrl}/${photo.file_path}`}
            alt={photo.subject ?? photo.title ?? 'Photo'}
            fill
            className="object-contain"
            sizes="70vw"
            priority
          />
          <div className="absolute inset-0 flex items-end justify-end p-4 pointer-events-none select-none">
            <span className="text-white/25 text-xs tracking-wide">© Thomas G. Smith</span>
          </div>
        </div>

        {index < photos.length - 1 && (
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-5xl leading-none select-none z-10"
            aria-label="Next photo"
          >
            ›
          </button>
        )}

        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 text-xs">
          {index + 1} / {photos.length}
        </p>
      </div>

      {/* Purchase panel */}
      <div className="w-72 shrink-0 border-l border-white/10 bg-black/60 p-6 hidden md:flex flex-col">
        <PurchasePanel photo={photo} />
      </div>

      {/* Mobile purchase button */}
      <div className="md:hidden absolute bottom-12 left-1/2 -translate-x-1/2">
        <MobilePurchaseDrawer photo={photo} />
      </div>
    </div>
  )
}

function MobilePurchaseDrawer({ photo }: { photo: Photo }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="border border-white/30 text-white text-[10px] tracking-widest uppercase px-6 py-2 bg-black/80"
      >
        Purchase
      </button>
      {open && (
        <div className="fixed inset-0 z-60 bg-black/95 flex flex-col p-6 overflow-y-auto">
          <button
            onClick={() => setOpen(false)}
            className="self-end text-white/50 hover:text-white text-3xl leading-none mb-6"
          >
            &times;
          </button>
          <PurchasePanel photo={photo} />
        </div>
      )}
    </>
  )
}
