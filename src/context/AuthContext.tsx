import { ReactNode, useMemo, createContext, useState } from 'react'
import { getProfileFromLS } from 'src/utils/util'
interface Props {
  children?: ReactNode
}
interface AuthContextInterface {
  profile: any
  setProfile: (value: any) => void
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  resetAuthenticated: () => void
}
const AuthContext = createContext<AuthContextInterface>({
  profile: getProfileFromLS(),
  setProfile: () => null,
  isAuthenticated: !!window.localStorage.getItem('accessToken'),
  setIsAuthenticated: () => null,
  resetAuthenticated: () => null
})
const AuthProvider = ({ children }: Props) => {
  const [profile, setProfile] = useState(getProfileFromLS())
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!window.localStorage.getItem('accessToken'))
  const resetAuthenticated = () => {
    setIsAuthenticated(false)
    setProfile(null)
  }
  const value = useMemo(
    () => ({
      profile,
      setProfile,
      isAuthenticated,
      setIsAuthenticated,
      resetAuthenticated
    }),
    [profile, isAuthenticated]
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export { AuthProvider, AuthContext }
