import { Product, ProductList, ProductListConfig } from 'src/types/product.type'
import { SuccessResponseApi } from 'src/types/util.type'
import { http } from 'src/utils/http'
export const productApi = {
  getProducts: (params: ProductListConfig) => http.get<SuccessResponseApi<ProductList>>('/products', { params }),
  getProduct: (id: string) => http.get<SuccessResponseApi<Product>>(`/products/${id}`)
}
