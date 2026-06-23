import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4">

      {/* ── PHOTO ─────────────────────────────────────────────────────────
          Place your photo in site/public/ named "about.jpg"
          Change width/height if your photo has different proportions.
      ──────────────────────────────────────────────────────────────────── */}
      <div className="relative w-full aspect-[4/3] mb-12 overflow-hidden">
        <Image
          src="/about.jpg"
          alt="Thomas G. Smith"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 672px"
          priority
        />
      </div>

      {/* ── NAME & TAGLINE ────────────────────────────────────────────────
          Edit the name and tagline below.
      ──────────────────────────────────────────────────────────────────── */}
      <h1 className="text-3xl font-light tracking-widest uppercase mb-2">
        Thomas G. Smith
      </h1>
      <p className="text-white/40 text-xs tracking-widest uppercase mb-10">
        Concert &amp; Nature Photographer
      </p>

      {/* ── BIO ───────────────────────────────────────────────────────────
          Replace this paragraph with your dad's actual bio.
          You can add more <p> tags below it for additional paragraphs.
      ──────────────────────────────────────────────────────────────────── */}
      <div className="space-y-5 text-white/70 text-sm leading-7">
        <p>
          My name is Tom, and I&apos;m a photographer based in Rochester, NY. For over 40 years
          I&apos;ve had a camera in my hand chasing light in the wilderness and getting great shots of
          live music.
        </p>
        <p>
          This site is my way of sharing that work with the world. If a photo speaks to you,
          I&apos;d love for it to find a home — whether that&apos;s on your wall as a print or
          on your screen as a digital download. Every image here was taken with passion, and I&apos;m
          grateful you&apos;re here to see them!
        </p>
      </div>

      {/* ── PRINTS SECTION ────────────────────────────────────────────────
          Edit the pricing and details below to match what your dad wants to charge.
      ──────────────────────────────────────────────────────────────────── */}
      <div className="mt-14 border-t border-white/10 pt-10">
        <h2 className="text-xs tracking-widest uppercase text-white/40 mb-6">
          Prints &amp; Digital Downloads
        </h2>
        <div className="space-y-4 text-white/60 text-sm leading-7">
          <p>
            Each photo on this site is available for purchase. Clicking any image will show
            you pricing for both digital and physical formats.
          </p>
          <p>
            <span className="text-white">Digital Downloads</span> — Receive a high-resolution
            file delivered directly to you, perfect for personal use or digital display.
          </p>
          <p>
            <span className="text-white">Physical Prints</span> — Professionally printed and
            personally fulfilled by Tom. Standard sizes are priced per image.
          </p>
          <p>
            <span className="text-white">Custom Framing</span> — Want it framed or need a
            specific size? Reach out directly and Tom will work with you on the details.{' '}
            {/* ── Replace with Tom's actual email once tgsporch.com is set up ── */}
            <a
              href="mailto:contact@tgsporch.com"
              className="text-white underline underline-offset-4 hover:text-white/70 transition-colors"
            >
              contact@tgsporch.com
            </a>
          </p>
        </div>
      </div>

    </div>
  )
}
