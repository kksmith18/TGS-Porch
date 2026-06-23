export const DIGITAL_PRICE_CENTS = 1000 // $10.00

export type PrintSizeId = '8x10' | '11x14' | '16x20' | '24x36'
export type FrameOptionId = 'none' | 'basic' | 'premium'

export const PRINT_SIZES: { id: PrintSizeId; label: string; priceCents: number }[] = [
  { id: '8x10',  label: '8×10',  priceCents: 3500  },
  { id: '11x14', label: '11×14', priceCents: 5000  },
  { id: '16x20', label: '16×20', priceCents: 8000  },
  { id: '24x36', label: '24×36', priceCents: 15000 },
]

export const FRAME_OPTIONS: { id: FrameOptionId; label: string; addedCents: Record<PrintSizeId, number> }[] = [
  {
    id: 'none',
    label: 'No Frame',
    addedCents: { '8x10': 0, '11x14': 0, '16x20': 0, '24x36': 0 },
  },
  {
    id: 'basic',
    label: 'Basic Frame',
    addedCents: { '8x10': 3500, '11x14': 4500, '16x20': 6500, '24x36': 9500 },
  },
  {
    id: 'premium',
    label: 'Premium Frame',
    addedCents: { '8x10': 6000, '11x14': 7500, '16x20': 10000, '24x36': 15000 },
  },
]

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export function getPrintTotal(sizeId: PrintSizeId, frameId: FrameOptionId): number {
  const size = PRINT_SIZES.find(s => s.id === sizeId)!
  const frame = FRAME_OPTIONS.find(f => f.id === frameId)!
  return size.priceCents + frame.addedCents[sizeId]
}
