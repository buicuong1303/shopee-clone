import React, { useContext, lazy } from 'react'
import RegisterLayout from './layouts/RegisterLayout/RegisterLayout'
import MainLayout from './layouts/MainLayout/MainLayout'
import { AuthContext } from './context/AuthContext'
import { useRoutes, useLocation, Outlet, Navigate } from 'react-router-dom'
import path from './constants/path'
import CartLayout from './layouts/CartLayout/CartLayout'
import UserLayout from './pages/User/layouts/UserLayout'
import NotFound from './pages/User/pages/NotFound'

const Login = lazy(() => import('./pages/Login/Login'))
const Register = lazy(() => import('./pages/Register/Register'))
const Cart = lazy(() => import('./pages/Cart/Cart'))
const Profile = lazy(() => import('./pages/User/pages/Profile'))
const HistoryPurchase = lazy(() => import('./pages/User/pages/HistoryPurchase'))
const ChangePassword = lazy(() => import('./pages/User/pages/ChangePassword'))
const ProductDetail = lazy(() => import('./pages/ProductDetail/ProductDetail'))
const Setting = lazy(() => import('./pages/Setting/Setting'))
const ProductList = lazy(() => import('./pages/ProductList/ProductList'))

function ProtectedRoute() {
  const location = useLocation()
  const { isAuthenticated } = useContext(AuthContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' state={location} />
}
function RejectedRoute() {
  const { isAuthenticated } = useContext(AuthContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}
export function Routes() {
  const element = useRoutes([
    {
      path: '',
      index: true,
      element: (
        <React.Suspense fallback={<>...</>}>
          <MainLayout>
            <ProductList />
          </MainLayout>
        </React.Suspense>
      )
    },
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
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.setting,
          element: (
            <React.Suspense fallback={<>...</>}>
              <MainLayout>
                <Setting />
              </MainLayout>
            </React.Suspense>
          )
        },
        {
          path: path.cart,
          element: (
            <React.Suspense fallback={<>...</>}>
              <CartLayout>
                <Cart />
              </CartLayout>
            </React.Suspense>
          )
        },
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: path.profile,
              element: (
                <React.Suspense fallback={<>...</>}>
                  <Profile />
                </React.Suspense>
              )
            },
            {
              path: path.changePassword,
              element: (
                <React.Suspense fallback={<>...</>}>
                  <ChangePassword />
                </React.Suspense>
              )
            },
            {
              path: path.historyPurchase,
              element: (
                <React.Suspense fallback={<>...</>}>
                  <HistoryPurchase />
                </React.Suspense>
              )
            }
          ]
        }
      ]
    },
    {
      path: path.productDetail,
      element: (
        <React.Suspense fallback={<>...</>}>
          <MainLayout>
            <ProductDetail />
          </MainLayout>
        </React.Suspense>
      )
    },
    {
      path: '*',
      element: (
        <MainLayout>
          <NotFound />
        </MainLayout>
      )
    }
  ])
  return element
}
