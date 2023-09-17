export interface ErrorResponseApi<Data> {
  message: string
  data?: Data
}
export interface SuccessResponseApi<Data> {
  data: Data
}
