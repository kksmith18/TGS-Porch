'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
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
  uploaded_at: string
}

function formatDate(photo: Photo) {
  if (!photo.date_year) return null
  const parts = [photo.date_year]
  if (photo.date_month) parts.unshift(photo.date_month)
  if (photo.date_month && photo.date_day) parts.unshift(photo.date_day)
  return photo.date_month
    ? `${photo.date_month}${photo.date_day ? '/' + photo.date_day : ''}/${photo.date_year}`
    : `${photo.date_year}`
}

export default function AdminDashboard() {
  const router = useRouter()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos`

  const fetchPhotos = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('photos')
      .select('id, title, subject, category, file_path, date_year, date_month, date_day, featured, uploaded_at')
      .order('uploaded_at', { ascending: false })
    setPhotos(data ?? [])
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
    setDeleting(null)
  }

  const toggleFeatured = async (photo: Photo) => {
    const supabase = createClient()
    const next = !photo.featured
    await supabase.from('photos').update({ featured: next }).eq('id', photo.id)
    setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, featured: next } : p))
  }

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

        <section className="mb-14">
          <h2 className="text-xs tracking-widest uppercase text-white/60 mb-6">Upload Photo</h2>
          <AdminUploadForm onUploaded={fetchPhotos} />
        </section>

        <section>
          <h2 className="text-xs tracking-widest uppercase text-white/60 mb-6">
            All Photos ({photos.length})
          </h2>
          {loading ? (
            <p className="text-white/30 text-sm">Loading...</p>
          ) : photos.length === 0 ? (
            <p className="text-white/30 text-sm">No photos uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {photos.map(photo => (
                <div key={photo.id}>
                  <div className="relative aspect-square overflow-hidden bg-white/5">
                    <Image
                      src={`${bucketUrl}/${photo.file_path}`}
                      alt={photo.subject ?? photo.title ?? 'Photo'}
                      fill
                      sizes="20vw"
                      className="object-cover"
                    />
                    {photo.featured && (
                      <span className="absolute top-1 left-1 text-xs bg-white text-black px-1">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="mt-1 space-y-0.5">
                    <p className="text-xs text-white/70 truncate">{photo.subject ?? '—'}</p>
                    <p className="text-xs text-white/30">{formatDate(photo) ?? '—'} · {photo.category}</p>
                    <div className="flex gap-2 pt-0.5">
                      <button
                        onClick={() => toggleFeatured(photo)}
                        className="text-xs text-white/30 hover:text-white transition-colors"
                      >
                        {photo.featured ? 'Unfeature' : 'Feature'}
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
