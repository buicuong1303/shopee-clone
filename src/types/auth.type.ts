import { User } from './user.type'
import { SuccessResponseApi } from './util.type'
export type AuthResponse = SuccessResponseApi<{
  access_token: string
  expires: string
  user: User
}>
