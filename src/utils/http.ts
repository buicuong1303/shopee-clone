import axios, { AxiosError, HttpStatusCode, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { toast } from 'react-toastify'
import { AuthResponse } from 'src/types/auth.type'
import { clearLS } from './util'
class Http {
  instance: AxiosInstance
  private token: string | null
  constructor() {
    //Lấy token ở disk lần đầu, các lần sau lấy từ ram
    this.token = localStorage.getItem('accessToken')
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.token) config.headers['Authorization'] = this.token
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use(
      (response) => {
        if (response.config.url === '/login') {
          this.token = (response.data as AuthResponse).data.access_token
          window.localStorage.setItem('accessToken', this.token)
          window.localStorage.setItem('user', JSON.stringify(response.data.data.user))
        } else if (response.config.url === '/logout') {
          clearLS()
        }
        return response
      },
      function (error: AxiosError) {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          const data: any | undefined = error.response?.data
          const message = data.message || error.message
          toast.error(message)
        }
        return Promise.reject(error)
      }
    )
  }
}
export const http = new Http().instance
