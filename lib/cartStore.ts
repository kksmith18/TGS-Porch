import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  cartItemId: string
  photoId: string
  photoSubject: string | null
  photoTitle: string | null
  filePath: string
  type: 'digital' | 'print'
  sizeId?: string
  sizeLabel?: string
  frameId?: string
  frameLabel?: string
  priceCents: number
}

type CartStore = {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (cartItemId: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (item) =>
        set(state => ({ items: [...state.items, item], isOpen: true })),
      removeItem: (cartItemId) =>
        set(state => ({ items: state.items.filter(i => i.cartItemId !== cartItemId) })),
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    { name: 'tgs-porch-cart' }
  )
)
