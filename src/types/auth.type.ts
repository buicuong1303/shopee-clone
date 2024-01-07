import { User } from './user.type'
import { SuccessResponseApi } from './util.type'
export type AuthResponse = SuccessResponseApi<{
  access_token: string
  refresh_token: string
  expires_refresh_token: number
  expires: number
  user: User
}>
export type RefreshTokenResponse = SuccessResponseApi<{
  access_token: string
}>
