import { ReactNode, useMemo, createContext, useState } from 'react'
import { getUserFromLS } from 'src/utils/util'
interface Props {
  children?: ReactNode
}
interface AuthContextInterface {
  user: any
  setUser: (value: any) => void
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}
const AuthContext = createContext<AuthContextInterface>({
  user: getUserFromLS(),
  setUser: () => null,
  isAuthenticated: !!window.localStorage.getItem('accessToken'),
  setIsAuthenticated: () => null
})
const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState(getUserFromLS())
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!window.localStorage.getItem('accessToken'))
  const value = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated,
      setIsAuthenticated
    }),
    [user, isAuthenticated]
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export { AuthProvider, AuthContext }
