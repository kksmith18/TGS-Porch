import { createClient } from '@/lib/supabaseServer'
import Gallery from '@/components/Gallery'

export const revalidate = 60

export default async function ConcertPage() {
  const supabase = await createClient()
  const { data: photos } = await supabase
    .from('photos')
    .select('id, title, subject, file_path, uploaded_at, date_year, date_month, date_day, featured, category')
    .eq('category', 'concert')
    .order('uploaded_at', { ascending: false })

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos`

  return (
    <div>
      <h2 className="text-xs tracking-widest uppercase text-white/40 mb-8">Concert</h2>
      <Gallery photos={photos ?? []} bucketUrl={bucketUrl} />
    </div>
  )
}
