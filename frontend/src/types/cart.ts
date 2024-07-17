import type { IProduct } from '@/api'

export interface CartItem {
  id: string
  cartId: string
  product: IProduct
  productId: string
  quantity: number
  reservationExpires: string | null
  createdAt: string
  updatedAt: string
}
