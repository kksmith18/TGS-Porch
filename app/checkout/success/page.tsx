import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-6">
      <h1 className="text-3xl font-light tracking-widest uppercase">Thank You</h1>
      <p className="text-white/50 text-sm max-w-sm leading-7">
        Your order has been received. Thomas will be in touch via email shortly — digital files within 24 hours, prints within 5–7 business days.
      </p>
      <Link
        href="/"
        className="text-xs tracking-widest uppercase border border-white/20 px-8 py-3 hover:border-white/60 transition-colors mt-4"
      >
        Back to Gallery
      </Link>
    </div>
  )
}
