'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { createClient } from '@/lib/supabaseClient'
import AdminUploadForm from '@/components/AdminUploadForm'

type Photo = {
  id: string
  title: string | null
  subject: string | null
  category: string
  file_path: string
  date_year: number | null
  date_month: number | null
  date_day: number | null
  featured: boolean
  featured_order: number | null
  uploaded_at: string
}

function formatDate(photo: Photo) {
  if (!photo.date_year) return null
  return photo.date_month
    ? `${photo.date_month}${photo.date_day ? '/' + photo.date_day : ''}/${photo.date_year}`
    : `${photo.date_year}`
}

function SortablePhoto({
  photo,
  bucketUrl,
  onUnfeature,
}: {
  photo: Photo
  bucketUrl: string
  onUnfeature: (photo: Photo) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: photo.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 py-2 border-b border-white/5">
      <button
        {...listeners}
        {...attributes}
        className="text-white/20 hover:text-white/60 cursor-grab active:cursor-grabbing px-1 text-lg select-none"
        aria-label="Drag to reorder"
      >
        ⠿
      </button>
      <div className="relative w-12 h-12 shrink-0 overflow-hidden bg-white/5">
        <Image
          src={`${bucketUrl}/${photo.file_path}`}
          alt={photo.subject ?? 'Photo'}
          fill
          sizes="48px"
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white truncate">{photo.subject ?? '—'}</p>
        <p className="text-xs text-white/30">{photo.category}</p>
      </div>
      <button
        onClick={() => onUnfeature(photo)}
        className="text-xs text-white/30 hover:text-white transition-colors shrink-0"
      >
        Unfeature
      </button>
    </div>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [featuredPhotos, setFeaturedPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos`

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const fetchPhotos = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('photos')
      .select('id, title, subject, category, file_path, date_year, date_month, date_day, featured, featured_order, uploaded_at')
      .order('uploaded_at', { ascending: false })

    const all = data ?? []
    setPhotos(all)
    setFeaturedPhotos(
      all
        .filter(p => p.featured)
        .sort((a, b) => (a.featured_order ?? 999) - (b.featured_order ?? 999))
    )
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchPhotos()
  }, [fetchPhotos])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin')
  }

  const handleDelete = async (photo: Photo) => {
    if (!confirm(`Delete "${photo.subject ?? photo.title ?? photo.file_path}"?`)) return
    setDeleting(photo.id)
    const supabase = createClient()
    await supabase.storage.from('photos').remove([photo.file_path])
    await supabase.from('photos').delete().eq('id', photo.id)
    setPhotos(prev => prev.filter(p => p.id !== photo.id))
    setFeaturedPhotos(prev => prev.filter(p => p.id !== photo.id))
    setDeleting(null)
  }

  const handleFeature = async (photo: Photo) => {
    const supabase = createClient()
    const nextOrder = featuredPhotos.length + 1
    await supabase.from('photos').update({ featured: true, featured_order: nextOrder }).eq('id', photo.id)
    const updated = { ...photo, featured: true, featured_order: nextOrder }
    setPhotos(prev => prev.map(p => p.id === photo.id ? updated : p))
    setFeaturedPhotos(prev => [...prev, updated])
  }

  const handleUnfeature = async (photo: Photo) => {
    const supabase = createClient()
    await supabase.from('photos').update({ featured: false, featured_order: null }).eq('id', photo.id)
    const updated = { ...photo, featured: false, featured_order: null }
    setPhotos(prev => prev.map(p => p.id === photo.id ? updated : p))
    const remaining = featuredPhotos.filter(p => p.id !== photo.id)
    setFeaturedPhotos(remaining)
    // Reassign order for remaining
    await Promise.all(
      remaining.map((p, i) =>
        supabase.from('photos').update({ featured_order: i + 1 }).eq('id', p.id)
      )
    )
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = featuredPhotos.findIndex(p => p.id === active.id)
    const newIndex = featuredPhotos.findIndex(p => p.id === over.id)
    const reordered = arrayMove(featuredPhotos, oldIndex, newIndex)

    setFeaturedPhotos(reordered)

    const supabase = createClient()
    await Promise.all(
      reordered.map((p, i) =>
        supabase.from('photos').update({ featured_order: i + 1 }).eq('id', p.id)
      )
    )
  }

  const nonFeaturedPhotos = photos.filter(p => !p.featured)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-xs tracking-widest uppercase text-white/40">Admin Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="text-xs tracking-widest uppercase text-white/40 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Upload */}
        <section className="mb-14">
          <h2 className="text-xs tracking-widest uppercase text-white/60 mb-6">Upload Photo</h2>
          <AdminUploadForm onUploaded={fetchPhotos} />
        </section>

        {/* Featured photos — drag to reorder */}
        <section className="mb-14">
          <h2 className="text-xs tracking-widest uppercase text-white/60 mb-2">
            Featured on Home Page ({featuredPhotos.length})
          </h2>
          <p className="text-white/20 text-xs mb-4">Drag to reorder how they appear on the home page.</p>
          {loading ? (
            <p className="text-white/30 text-sm">Loading...</p>
          ) : featuredPhotos.length === 0 ? (
            <p className="text-white/30 text-sm">No featured photos yet. Feature photos from the list below.</p>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={featuredPhotos.map(p => p.id)} strategy={verticalListSortingStrategy}>
                <div className="border border-white/10 px-4 py-2">
                  {featuredPhotos.map(photo => (
                    <SortablePhoto
                      key={photo.id}
                      photo={photo}
                      bucketUrl={bucketUrl}
                      onUnfeature={handleUnfeature}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </section>

        {/* All non-featured photos */}
        <section>
          <h2 className="text-xs tracking-widest uppercase text-white/60 mb-6">
            All Photos ({nonFeaturedPhotos.length} not featured)
          </h2>
          {loading ? (
            <p className="text-white/30 text-sm">Loading...</p>
          ) : nonFeaturedPhotos.length === 0 ? (
            <p className="text-white/30 text-sm">All photos are featured.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {nonFeaturedPhotos.map(photo => (
                <div key={photo.id}>
                  <div className="relative aspect-square overflow-hidden bg-white/5">
                    <Image
                      src={`${bucketUrl}/${photo.file_path}`}
                      alt={photo.subject ?? photo.title ?? 'Photo'}
                      fill
                      sizes="20vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-1 space-y-0.5">
                    <p className="text-xs text-white/70 truncate">{photo.subject ?? '—'}</p>
                    <p className="text-xs text-white/30">{formatDate(photo) ?? '—'} · {photo.category}</p>
                    <div className="flex gap-2 pt-0.5">
                      <button
                        onClick={() => handleFeature(photo)}
                        className="text-xs text-white/30 hover:text-white transition-colors"
                      >
                        Feature
                      </button>
                      <span className="text-white/20">·</span>
                      <button
                        onClick={() => handleDelete(photo)}
                        disabled={deleting === photo.id}
                        className="text-xs text-white/30 hover:text-red-400 transition-colors disabled:opacity-40"
                      >
                        {deleting === photo.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
