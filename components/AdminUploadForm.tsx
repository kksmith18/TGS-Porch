'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabaseClient'

type Props = {
  onUploaded: () => void
}

export default function AdminUploadForm({ onUploaded }: Props) {
  const [category, setCategory] = useState<'concert' | 'nature'>('concert')
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [dateYear, setDateYear] = useState('')
  const [dateMonth, setDateMonth] = useState('')
  const [dateDay, setDateDay] = useState('')
  const [featured, setFeatured] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !dateYear) return

    setLoading(true)
    setError(null)

    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const filePath = `${category}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filePath, file)

    if (uploadError) {
      setError(uploadError.message)
      setLoading(false)
      return
    }

    const { error: dbError } = await supabase.from('photos').insert({
      title: title.trim() || null,
      subject: subject.trim() || null,
      category,
      file_path: filePath,
      date_year: parseInt(dateYear),
      date_month: dateMonth ? parseInt(dateMonth) : null,
      date_day: dateDay ? parseInt(dateDay) : null,
      featured,
    })

    if (dbError) {
      setError(dbError.message)
    } else {
      setTitle('')
      setSubject('')
      setDateYear('')
      setDateMonth('')
      setDateDay('')
      setFeatured(false)
      setFile(null)
      if (fileRef.current) fileRef.current.value = ''
      onUploaded()
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
      {/* Category */}
      <div className="flex gap-3">
        {(['concert', 'nature'] as const).map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`flex-1 py-2 text-xs tracking-widest uppercase border transition-colors ${
              category === cat
                ? 'border-white text-white'
                : 'border-white/20 text-white/40 hover:border-white/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Subject */}
      <input
        type="text"
        placeholder={category === 'concert' ? 'Band name (e.g. Widespread Panic)' : 'Subject (e.g. Buffalo)'}
        value={subject}
        onChange={e => setSubject(e.target.value)}
        className="bg-white/5 border border-white/10 text-white placeholder-white/30 px-4 py-3 text-sm outline-none focus:border-white/30"
      />

      {/* Date */}
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Year *"
          value={dateYear}
          onChange={e => setDateYear(e.target.value)}
          min={1900}
          max={2100}
          required
          className="w-24 bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-3 text-sm outline-none focus:border-white/30"
        />
        <input
          type="number"
          placeholder="Month"
          value={dateMonth}
          onChange={e => setDateMonth(e.target.value)}
          min={1}
          max={12}
          className="w-20 bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-3 text-sm outline-none focus:border-white/30"
        />
        <input
          type="number"
          placeholder="Day"
          value={dateDay}
          onChange={e => setDateDay(e.target.value)}
          min={1}
          max={31}
          className="w-20 bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-3 text-sm outline-none focus:border-white/30"
        />
      </div>

      {/* Title (optional) */}
      <input
        type="text"
        placeholder="Title (optional)"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="bg-white/5 border border-white/10 text-white placeholder-white/30 px-4 py-3 text-sm outline-none focus:border-white/30"
      />

      {/* Featured */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={featured}
          onChange={e => setFeatured(e.target.checked)}
          className="w-4 h-4 accent-white"
        />
        <span className="text-xs tracking-widest uppercase text-white/50 group-hover:text-white transition-colors">
          Feature on home page
        </span>
      </label>

      {/* File */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        required
        onChange={e => setFile(e.target.files?.[0] ?? null)}
        className="text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:border file:border-white/20 file:bg-transparent file:text-white/50 file:text-xs file:uppercase file:tracking-widest hover:file:border-white/40 file:cursor-pointer"
      />

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <button
        type="submit"
        disabled={loading || !file || !dateYear}
        className="border border-white/20 text-white text-xs tracking-widest uppercase py-3 hover:border-white/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? 'Uploading...' : 'Upload Photo'}
      </button>
    </form>
  )
}
