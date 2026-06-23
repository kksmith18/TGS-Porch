'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Lightbox from './Lightbox'

export type Photo = {
  id: string
  title: string | null
  subject: string | null
  file_path: string
  uploaded_at: string
  date_year: number | null
  date_month: number | null
  date_day: number | null
  featured: boolean
  category: string
}

type GalleryProps = {
  photos: Photo[]
  bucketUrl: string
}

export default function Gallery({ photos, bucketUrl }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')

  const filtered = useMemo(() => {
    return photos
      .filter(p =>
        !searchQuery ||
        p.subject?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        const aDate = (a.date_year ?? 0) * 10000 + (a.date_month ?? 0) * 100 + (a.date_day ?? 0)
        const bDate = (b.date_year ?? 0) * 10000 + (b.date_month ?? 0) * 100 + (b.date_day ?? 0)
        return sortOrder === 'desc' ? bDate - aDate : aDate - bDate
      })
  }, [photos, searchQuery, sortOrder])

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="Search by subject..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 text-white placeholder-white/30 px-4 py-2 text-sm outline-none focus:border-white/30"
        />
        <div className="flex gap-0 border border-white/10">
          <button
            onClick={() => setSortOrder('desc')}
            className={`px-4 py-2 text-xs tracking-widest uppercase transition-colors ${
              sortOrder === 'desc' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            Most Recent
          </button>
          <button
            onClick={() => setSortOrder('asc')}
            className={`px-4 py-2 text-xs tracking-widest uppercase transition-colors border-l border-white/10 ${
              sortOrder === 'asc' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            Oldest
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-white/30 text-center py-20 text-sm tracking-widest">
          {searchQuery ? 'No photos match your search.' : 'No photos yet.'}
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
          {filtered.map((photo, i) => (
            <button
              key={photo.id}
              onClick={() => setLightboxIndex(i)}
              className="relative aspect-square overflow-hidden bg-white/5 hover:opacity-75 transition-opacity cursor-pointer"
            >
              <Image
                src={`${bucketUrl}/${photo.file_path}`}
                alt={photo.subject ?? photo.title ?? 'Photo'}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-end justify-end p-2 pointer-events-none select-none">
                <span className="text-white/30 text-[10px] tracking-wide">© Thomas G. Smith</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          photos={filtered}
          bucketUrl={bucketUrl}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}
