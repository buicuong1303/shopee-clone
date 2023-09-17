import React, { useContext } from 'react'
import ProductList from './pages/ProductList/ProductList'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import RegisterLayout from './layouts/RegisterLayout/RegisterLayout'
import MainLayout from './layouts/MainLayout/MainLayout'
import Profile from './pages/Profile/Profile'
import { AuthContext } from './context/AuthContext'
import { useRoutes, useLocation, Outlet, Navigate } from 'react-router-dom'
import Setting from './pages/Setting/Setting'
import path from './constants/path'
import ProductDetail from './pages/ProductDetail/ProductDetail'

function ProtectedRoute() {
  const location = useLocation()
  const { isAuthenticated } = useContext(AuthContext)
  console.log(isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' state={location} />
}
function RejectedRoute() {
  const { isAuthenticated } = useContext(AuthContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}
export function Routes() {
  const element = useRoutes([
    // {
    //   path: '',
    //   index: true,
    //   element: (
    //     <React.Suspense fallback={<>...</>}>
    //       <MainLayout>
    //         <ProductList />
    //       </MainLayout>
    //     </React.Suspense>
    //   )
    // },
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <React.Suspense fallback={<>...</>}>
              <RegisterLayout>
                <Login />
              </RegisterLayout>
            </React.Suspense>
          )
        },
        {
          path: path.register,
          element: (
            <React.Suspense fallback={<>...</>}>
              <RegisterLayout>
                <Register />
              </RegisterLayout>
            </React.Suspense>
          )
        }
      ]
    }
    // {
    //   path: '',
    //   element: <ProtectedRoute />,
    //   children: [
    //     {
    //       path: path.profile,
    //       element: (
    //         <React.Suspense fallback={<>...</>}>
    //           <MainLayout>
    //             <Profile />
    //           </MainLayout>
    //         </React.Suspense>
    //       )
    //     },
    //     {
    //       path: path.setting,
    //       element: (
    //         <React.Suspense fallback={<>...</>}>
    //           <MainLayout>
    //             <Setting />
    //           </MainLayout>
    //         </React.Suspense>
    //       )
    //     }
    //   ]
    // },
    // {
    //   path: path.productDetail,
    //   index: true,
    //   element: (
    //     <React.Suspense fallback={<>...</>}>
    //       <MainLayout>
    //         <ProductDetail />
    //       </MainLayout>
    //     </React.Suspense>
    //   )
    // }
    // {
    //   path: '*',
    //   element: <NotFound />
    // }
  ])
  return element
}
