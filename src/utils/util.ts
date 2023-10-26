import axios, { AxiosError, HttpStatusCode } from 'axios'
import { config } from 'src/constants/config'
import { User } from 'src/types/user.type'
import userImage from 'src/assets/images/no-product.png'
export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}
export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}
export function getProfileFromLS() {
  const profile = window.localStorage.getItem('profile')
  if (profile) return JSON.parse(profile)
  return null
}
export const setProfileToLS = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}
export const LocalStorageEventTarget = new EventTarget()

export function clearLS() {
  window.localStorage.removeItem('accessToken')
  window.localStorage.removeItem('profile')
  const clearLSEvent = new Event('clearLS')
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}

export function formatCurrency(currency: number) {
  return new Intl.NumberFormat('de-DE').format(currency)
}
export function rateSale(origin: number, sale: number) {
  return Math.round(((origin - sale) * 100) / origin) + '%'
}
export function formatNumberToSocialStyle(value: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(value)
    .replace('.', ',')
    .toLowerCase()
}

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i-${id}`
}
export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-i-')
  return arr.pop()
}
export const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')

export const getAvatarURL = (avatarName: string) => {
  return avatarName ? `${config.BASE_URL}/images/${avatarName}` : userImage
}
