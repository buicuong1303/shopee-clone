import { Product } from './product.type'

export type PurchaseStatus = -1 | 1 | 2 | 3 | 4 | 5
// -1: Lấy sp trong giỏ
// 0: Lấy tất cả sản phẩm
// 1: Sp đang đợi xác nhận từ chủ sop
// 2: Sp đang được lấy hàng
// 3: Sp đang được vận chuyển
// 4: sp đã được giao
// 5: sp đã bị hủy
export type PurchaseListStatus = PurchaseStatus | 0

export interface Purchase {
  _id: string
  buy_count: number
  price: number
  price_before_discount: number
  status: PurchaseStatus
  user: string
  product: Product
  createdAt: string
  updatedAt: string
}
export interface ExtendedPurchase extends Purchase {
  disabled: boolean
  checked: boolean
}
