import type { IProduct } from '@/api'

export interface CartItem {
  id?: string
  product: IProduct
  quantity: number
}
