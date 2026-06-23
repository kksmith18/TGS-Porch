import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabaseServer'

export const revalidate = 60

export default async function Home() {
  const supabase = await createClient()
  const { data: featured } = await supabase
    .from('photos')
    .select('id, title, subject, file_path, category')
    .eq('featured', true)
    .order('uploaded_at', { ascending: false })

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos`

  return (
    <div className="flex flex-col items-center min-h-[70vh]">
      <div className="text-center mt-16 mb-12">
        <h1 className="text-5xl md:text-7xl font-light tracking-widest uppercase mb-4">
          Thomas G. Smith
        </h1>
        <p className="text-white/40 text-xs tracking-widest uppercase">
          Concert &amp; Nature Photography
        </p>
      </div>

      {featured && featured.length > 0 && (
        <section className="w-full max-w-5xl mb-14">
          <p className="text-xs tracking-widest uppercase text-white/30 mb-4 text-center">Featured</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
            {featured.map(photo => (
              <Link
                key={photo.id}
                href={`/${photo.category}`}
                className="relative aspect-square overflow-hidden bg-white/5 hover:opacity-75 transition-opacity"
              >
                <Image
                  src={`${bucketUrl}/${photo.file_path}`}
                  alt={photo.subject ?? photo.title ?? 'Featured photo'}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-end justify-end p-2 pointer-events-none select-none">
                  <span className="text-white/30 text-[10px] tracking-wide">© Thomas G. Smith</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="flex gap-6">
        <Link
          href="/concert"
          className="text-xs tracking-widest uppercase border border-white/20 px-10 py-4 hover:border-white/60 transition-colors"
        >
          Concert
        </Link>
        <Link
          href="/nature"
          className="text-xs tracking-widest uppercase border border-white/20 px-10 py-4 hover:border-white/60 transition-colors"
        >
          Nature
        </Link>
      </div>
    </div>
  )
}
