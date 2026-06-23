import Stripe from 'stripe'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const resend = new Resend(process.env.RESEND_API_KEY!)

type OrderItem = {
  subject: string
  type: string
  size?: string
  frame?: string
  price: string
}

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook signature invalid' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  // Use unknown then narrow — avoids Stripe SDK type version issues
  const raw = event.data.object as unknown as Record<string, unknown>

  const customerDetails = raw.customer_details as { email?: string; name?: string } | null
  const customerEmail = customerDetails?.email ?? 'Unknown'
  const customerName = customerDetails?.name ?? 'Customer'

  const metadata = raw.metadata as Record<string, string> | null
  const items: OrderItem[] = JSON.parse(metadata?.items ?? '[]')
  const note = metadata?.note ?? ''

  const amountTotal = raw.amount_total as number | null
  const total = amountTotal ? `$${(amountTotal / 100).toFixed(2)}` : 'N/A'

  const shippingDetails = raw.shipping_details as {
    address?: {
      line1?: string
      line2?: string
      city?: string
      state?: string
      postal_code?: string
      country?: string
    }
  } | null

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding:6px 0;color:#ccc;">${item.subject}</td>
      <td style="padding:6px 0;color:#ccc;">${item.type === 'digital' ? 'Digital Download' : `${item.size ?? ''} Print${item.frame ? ` · ${item.frame}` : ''}`}</td>
      <td style="padding:6px 0;color:#ccc;text-align:right;">${item.price}</td>
    </tr>
  `).join('')

  const shippingHtml = shippingDetails?.address
    ? `<p style="color:#ccc;">
        ${shippingDetails.address.line1 ?? ''}<br/>
        ${shippingDetails.address.line2 ? shippingDetails.address.line2 + '<br/>' : ''}
        ${shippingDetails.address.city ?? ''}, ${shippingDetails.address.state ?? ''} ${shippingDetails.address.postal_code ?? ''}<br/>
        ${shippingDetails.address.country ?? ''}
      </p>`
    : '<p style="color:#999;">Digital only — no shipping needed.</p>'

  await resend.emails.send({
    from: 'TGS Porch Orders <orders@tgsporch.com>',
    to: process.env.DAD_EMAIL!,
    subject: `New Order — ${total} from ${customerName}`,
    html: `
      <div style="background:#0a0a0a;color:#fff;font-family:Arial,sans-serif;padding:32px;max-width:600px;">
        <h2 style="color:#fff;font-weight:300;letter-spacing:4px;text-transform:uppercase;margin-bottom:24px;">New Order</h2>
        <p style="color:#999;">Customer: ${customerName} (${customerEmail})</p>
        <p style="color:#999;">Total: ${total}</p>
        <table style="width:100%;border-top:1px solid #333;margin:16px 0;">
          <tr style="border-bottom:1px solid #333;">
            <th style="padding:8px 0;color:#666;text-align:left;font-weight:normal;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Photo</th>
            <th style="padding:8px 0;color:#666;text-align:left;font-weight:normal;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Type</th>
            <th style="padding:8px 0;color:#666;text-align:right;font-weight:normal;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Price</th>
          </tr>
          ${itemsHtml}
        </table>
        ${note ? `<p style="color:#999;border-top:1px solid #333;padding-top:16px;"><strong style="color:#fff;">Customer note:</strong> ${note}</p>` : ''}
        <div style="border-top:1px solid #333;padding-top:16px;margin-top:8px;">
          <p style="color:#666;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Shipping address</p>
          ${shippingHtml}
        </div>
      </div>
    `,
  })

  await resend.emails.send({
    from: 'Thomas G. Smith <orders@tgsporch.com>',
    to: customerEmail,
    subject: 'Order Confirmed — TGS Porch',
    html: `
      <div style="background:#0a0a0a;color:#fff;font-family:Arial,sans-serif;padding:32px;max-width:600px;">
        <h2 style="color:#fff;font-weight:300;letter-spacing:4px;text-transform:uppercase;margin-bottom:8px;">Thank You</h2>
        <p style="color:#999;">Your order has been received and is being personally prepared by Thomas G. Smith.</p>
        <table style="width:100%;border-top:1px solid #333;margin:16px 0;">
          <tr style="border-bottom:1px solid #333;">
            <th style="padding:8px 0;color:#666;text-align:left;font-weight:normal;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Photo</th>
            <th style="padding:8px 0;color:#666;text-align:left;font-weight:normal;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Type</th>
            <th style="padding:8px 0;color:#666;text-align:right;font-weight:normal;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Price</th>
          </tr>
          ${itemsHtml}
        </table>
        <div style="border-top:1px solid #333;padding-top:16px;margin-top:8px;">
          <p style="color:#999;font-size:13px;">
            ${items.some(i => i.type === 'digital') ? '📁 <strong style="color:#fff;">Digital files</strong> will be sent to this email within 24 hours.<br/>' : ''}
            ${items.some(i => i.type === 'print') ? '📦 <strong style="color:#fff;">Physical prints</strong> will be shipped within 5–7 business days.' : ''}
          </p>
          ${note ? `<p style="color:#777;font-size:12px;">Your note: "${note}"</p>` : ''}
        </div>
        <p style="color:#555;font-size:11px;margin-top:24px;">Questions? Reach out at <a href="mailto:contact@tgsporch.com" style="color:#999;">contact@tgsporch.com</a></p>
      </div>
    `,
  })

  return NextResponse.json({ received: true })
}
