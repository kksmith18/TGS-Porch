import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4">

      {/* ── TOM'S PHOTO ───────────────────────────────────────────────────
          Place your dad's photo in site/public/ named "about.jpg"
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

      <h1 className="text-3xl font-light tracking-widest uppercase mb-2">
        Thomas G. Smith
      </h1>
      <p className="text-white/40 text-xs tracking-widest uppercase mb-10">
        Concert &amp; Nature Photographer
      </p>

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

      {/* ── KYLE'S SECTION ────────────────────────────────────────────────
          Place your photo in site/public/ named "kyle.jpg"
      ──────────────────────────────────────────────────────────────────── */}
      <div className="mt-16 border-t border-white/10 pt-12">
        <div className="relative w-48 h-48 mb-8 overflow-hidden rounded-full">
          <Image
            src="/kyle.jpg"
            alt="Kyle Smith"
            fill
            className="object-cover"
            sizes="192px"
          />
        </div>

        <h2 className="text-2xl font-light tracking-widest uppercase mb-2">
          Kyle Smith
        </h2>
        <p className="text-white/40 text-xs tracking-widest uppercase mb-8">
          Developer &amp; Thomas G. Smith&apos;s Son
        </p>

        <div className="text-white/70 text-sm leading-7">
          <p>
            I&apos;m a Computer Science and Business graduate from Lehigh University and the developer
            behind TGS Porch. I built this site so my dad could finally share his life&apos;s work
            with the world!
          </p>
        </div>
      </div>

      {/* ── PRINTS SECTION ──────────────────────────────────────────────── */}
      <div className="mt-16 border-t border-white/10 pt-10">
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
