import { AuthResponse } from 'src/types/auth.type'
import { http } from 'src/utils/http'
export const authApi = {
  login: (body: { email: string; password: string }) => http.post<AuthResponse>('/login', body),
  registerAccount: (body: { email: string; password: string }) => http.post<AuthResponse>('/register', body),
  logout: () => http.post('/logout')
}
