import { useState } from 'react'

export const useLocalStorage = (key: string, defaultValue: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(key)
      if (value) {
        return JSON.parse(value)
      } else {
        return defaultValue
      }
    } catch (error) {
      return defaultValue
    }
  })
  const setValueToLocalStorage = (newValue: any) => {
    if (typeof newValue === 'string') window.localStorage.setItem(key, newValue)
    else window.localStorage.setItem(key, JSON.stringify(newValue))
    setStoredValue(newValue)
  }
  return [storedValue, setValueToLocalStorage]
}
