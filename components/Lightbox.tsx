'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import type { Photo } from './Gallery'

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
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-5 text-white/50 hover:text-white text-4xl leading-none"
        aria-label="Close"
      >
        &times;
      </button>

      {index > 0 && (
        <button
          onClick={e => { e.stopPropagation(); prev() }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-5xl leading-none select-none"
          aria-label="Previous photo"
        >
          ‹
        </button>
      )}

      <div
        className="relative w-full h-full max-w-5xl max-h-[88vh] mx-16"
        onClick={e => e.stopPropagation()}
      >
        <Image
          src={`${bucketUrl}/${photo.file_path}`}
          alt={photo.title ?? 'Photo'}
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
        {photo.title && (
          <p className="absolute bottom-0 left-0 right-0 text-center text-white/50 text-xs tracking-widest pb-2">
            {photo.title}
          </p>
        )}
        <div className="absolute inset-0 flex items-end justify-end p-4 pointer-events-none select-none">
          <span className="text-white/25 text-xs tracking-wide">© Thomas Smith</span>
        </div>
      </div>

      {index < photos.length - 1 && (
        <button
          onClick={e => { e.stopPropagation(); next() }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-5xl leading-none select-none"
          aria-label="Next photo"
        >
          ›
        </button>
      )}

      <p className="absolute bottom-4 right-4 text-white/30 text-xs">
        {index + 1} / {photos.length}
      </p>
    </div>
  )
}
