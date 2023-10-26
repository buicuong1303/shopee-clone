import { useEffect, useContext } from 'react'
import { Routes } from './routes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { LocalStorageEventTarget } from './utils/util'
import { AuthContext } from './context/AuthContext'
import { AppContext } from './context/AppContext'
function App() {
  const { resetAuthenticated } = useContext(AuthContext)
  const { resetExtendedPurchases } = useContext(AppContext)
  useEffect(() => {
    const handleReset = () => {
      resetAuthenticated()
      resetExtendedPurchases()
    }
    LocalStorageEventTarget.addEventListener('clearLS', handleReset)
    return () => LocalStorageEventTarget.removeEventListener('clearLS', handleReset)
  }, [resetAuthenticated, resetExtendedPurchases])
  return (
    <div>
      <Routes />
      <ToastContainer />
    </div>
  )
}

export default App
