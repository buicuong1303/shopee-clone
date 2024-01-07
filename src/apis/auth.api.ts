import { AuthResponse } from 'src/types/auth.type'
import { http } from 'src/utils/http'
export const URL_LOGIN = 'login'
export const URL_REGISTER = 'register'
export const URL_REFRESH_ACCESS_TOKEN = 'refresh-access-token'
export const URL_LOGOUT = 'logout'
export const authApi = {
  login: (body: { email: string; password: string }) => http.post<AuthResponse>(URL_LOGIN, body),
  registerAccount: (body: { email: string; password: string }) => http.post<AuthResponse>(URL_REGISTER, body),
  logout: () => http.post(URL_LOGOUT)
}
