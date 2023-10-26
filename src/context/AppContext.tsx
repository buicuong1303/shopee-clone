import React, { ReactNode, createContext, useMemo, useState } from 'react'
import { ExtendedPurchase } from 'src/types/purchase.type'
interface Props {
  children?: ReactNode
}
interface AppContextInterface {
  extendedPurchases: any[]
  setExtendedPurchases: React.Dispatch<React.SetStateAction<ExtendedPurchase[]>>
  resetExtendedPurchases: () => void
}
const AppContext = createContext<AppContextInterface>({
  extendedPurchases: [],
  setExtendedPurchases: () => null,
  resetExtendedPurchases: () => null
})

function AppContextProvider({ children }: Props) {
  const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchase[]>([])
  const resetExtendedPurchases = () => {
    setExtendedPurchases([])
  }
  const value = useMemo(
    () => ({
      extendedPurchases,
      setExtendedPurchases,
      resetExtendedPurchases
    }),
    [extendedPurchases]
  )
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export { AppContext, AppContextProvider }
