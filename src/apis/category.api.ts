import { Category } from 'src/types/category.type'
import { SuccessResponseApi } from 'src/types/util.type'
import { http } from 'src/utils/http'
export const categoryApi = {
  getCategories: () => http.get<SuccessResponseApi<Category[]>>('/categories'),
}
