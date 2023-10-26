import { User } from 'src/types/user.type'
import { SuccessResponseApi } from 'src/types/util.type'
import { http } from 'src/utils/http'

interface BodyUpdateProfile extends Omit<User, '_id' | 'email' | 'roles' | 'createdAt' | 'updatedAt'> {
  password?: string
  newPassword?: string
}
export const userApi = {
  getProfile: () => http.get<SuccessResponseApi<User>>('me'),
  updateProfile(body: BodyUpdateProfile) {
    return http.put<SuccessResponseApi<User>>('user', body)
  },
  uploadAvatar(body: FormData) {
    return http.post<SuccessResponseApi<string>>('user/upload-avatar', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
