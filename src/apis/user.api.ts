import { AuthResponse } from 'src/types/auth.type'
import { http } from 'src/utils/http'

export const getUserInfo = () => http.get<AuthResponse>('/me')
