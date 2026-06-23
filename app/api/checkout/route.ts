import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import type { CartItem } from '@/lib/cartStore'
import { formatPrice } from '@/lib/prices'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const { items, note }: { items: CartItem[]; note: string } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const hasPhysical = items.some(i => i.type === 'print')
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.type === 'digital'
            ? `Digital Download — ${item.photoSubject ?? item.photoTitle ?? 'Photo'}`
            : `${item.sizeLabel} Print${item.frameId !== 'none' ? ` (${item.frameLabel})` : ''} — ${item.photoSubject ?? item.photoTitle ?? 'Photo'}`,
          description: item.type === 'digital'
            ? 'High-resolution file, no watermark, delivered via email within 24 hours.'
            : `${item.sizeLabel} print${item.frameId !== 'none' ? ` with ${item.frameLabel}` : ''}. Personally fulfilled by Thomas G. Smith.`,
        },
        unit_amount: item.priceCents,
      },
      quantity: 1,
    }))

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      ...(hasPhysical && { shipping_address_collection: { allowed_countries: ['US', 'CA'] } }),
      custom_fields: note ? [] : [],
      custom_text: {
        submit: { message: 'Your order will be fulfilled personally by Thomas G. Smith.' },
      },
      metadata: {
        items: JSON.stringify(items.map(i => ({
          subject: i.photoSubject ?? i.photoTitle ?? 'Photo',
          type: i.type,
          size: i.sizeLabel ?? null,
          frame: i.frameId !== 'none' ? i.frameLabel : null,
          price: formatPrice(i.priceCents),
        }))),
        note: note || '',
      },
      success_url: `${siteUrl}/checkout/success`,
      cancel_url: `${siteUrl}/checkout/cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
