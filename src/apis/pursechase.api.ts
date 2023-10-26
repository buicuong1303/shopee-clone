import { Purchase, PurchaseListStatus } from 'src/types/purchase.type'
import { SuccessResponseApi } from 'src/types/util.type'
import { http } from 'src/utils/http'

const URL = 'purchases'
export const purchaseApi = {
  addToCard: (body: { product_id: string; buy_count: number }) =>
    http.post<SuccessResponseApi<Purchase>>(`${URL}/add-to-cart`, body),
  getPurchases: (params: { status: PurchaseListStatus }) =>
    http.get<SuccessResponseApi<Purchase[]>>(`${URL}`, {
      params
    }),
  buyProducts: (body: { product_id: string; buy_count: number }[]) =>
    http.post<SuccessResponseApi<Purchase[]>>(`${URL}/buy-products`, body),
  updatePurchase: (body: { product_id: string; buy_count: number }) =>
    http.put<SuccessResponseApi<Purchase>>(`${URL}/update-purchase`, body),
  deletePurchases: (purchaseIds: string[]) =>
    http.delete<SuccessResponseApi<{ deleted_countL: number }>>(`${URL}`, {
      // gửi mảng id với method delete
      data: purchaseIds
    })
}
