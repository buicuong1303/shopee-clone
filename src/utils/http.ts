import axios, { AxiosError, HttpStatusCode, type AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'react-toastify'
import { AuthResponse, RefreshTokenResponse } from 'src/types/auth.type'
import { clearLS, isAxiosExpiredTokenEntityError, isAxiosUnauthorizedEntityError } from './util'
import { config } from 'src/constants/config'
import { URL_LOGIN, URL_LOGOUT, URL_REFRESH_ACCESS_TOKEN } from 'src/apis/auth.api'
import { ErrorResponseApi } from 'src/types/util.type'

// purchase: 1 - 3
// me: 2 - 5
// Refresh token cho purchase 3 - 4 (sau bước này sé set refreshTokenRequest =  null)
// gọi lại purchase: 4 - 6
// Refresh token cho me: 5 - 6
class Http {
  instance: AxiosInstance
  private token: string | null
  private refreshToken: string | null
  private refreshTokenRequest: Promise<string> | null
  constructor() {
    //Lấy token ở disk lần đầu, các lần sau lấy từ ram
    this.token = localStorage.getItem('accessToken')
    this.refreshTokenRequest = null
    this.refreshToken = localStorage.getItem('refreshToken')
    this.instance = axios.create({
      baseURL: config.BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'expire-access-token': 60 * 30,
        'expire-refresh-token': 60 * 60
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
        if (response.config.url === URL_LOGIN) {
          this.token = (response?.data as AuthResponse).data.access_token
          this.refreshToken = (response?.data as AuthResponse).data.refresh_token
          window.localStorage.setItem('accessToken', this.token)
          window.localStorage.setItem('refreshToken', this.refreshToken)
          window.localStorage.setItem('profile', JSON.stringify(response?.data.data.user))
        } else if (response.config.url === URL_LOGOUT) {
          this.token = ''
          this.refreshToken = ''
          clearLS()
        }
        return response
      },
      (error: AxiosError) => {
        //chỉ toast lỗi k liên quan tới 422 và 401 (token expired)
        if (
          ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)
        ) {
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          toast.error(message)
        }
        // Lỗi 401 có nhiều trường hợp
        // - Token k đúng
        // - Không truyền token
        // - Token hêt hạn
        if (
          isAxiosUnauthorizedEntityError<
            ErrorResponseApi<{
              name: string
              message: string
            }>
          >(error)
        ) {
          //trường hợp token hết hạn và request đó không phải là của request refresh token
          //thì chúng ta mới tiến hành gọi refresh token
          const config = error.response?.config || ({ headers: {} } as InternalAxiosRequestConfig)
          const { url } = config
          if (isAxiosExpiredTokenEntityError(error) && url !== URL_REFRESH_ACCESS_TOKEN) {
            //hạn chế gọi 2 lân refresh token
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefresh().finally(() => {
                  // giữ request refresh token trong 10s nếu có api nào phải gọi để refresh token
                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 10000)
                })

            return this.refreshTokenRequest.then((access_token) => {
              if (config.headers) config.headers.authorization = access_token
              //gọi lại request cũ vừa bị lỗi
              return this.instance(config)
            })
          }
          clearLS()
          toast.error(error.response?.data.message)
          this.token = ''
          this.refreshToken = ''
        }
        return Promise.reject(error)
      }
    )
  }
  private handleRefresh() {
    return this.instance
      .post<RefreshTokenResponse>(URL_REFRESH_ACCESS_TOKEN, {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const { access_token } = res.data.data
        window.localStorage.setItem('accessToken', access_token)
        this.token = access_token
        return access_token
      })
      .catch((error) => {
        clearLS()
        this.token = ''
        this.refreshToken = ''
        throw error
      })
  }
}
export const http = new Http().instance
