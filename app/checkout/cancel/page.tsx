import Link from 'next/link'

export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-6">
      <h1 className="text-3xl font-light tracking-widest uppercase">Order Cancelled</h1>
      <p className="text-white/50 text-sm max-w-sm">
        No charge was made. Your cart items are still saved if you want to try again.
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
