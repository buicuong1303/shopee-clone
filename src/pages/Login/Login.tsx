import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Input from 'src/components/Input/Input'
import { getRules, LoginSchema, loginSchema } from 'src/utils/rule'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { authApi } from 'src/apis/auth.api'
import { isAxiosUnprocessableEntityError } from 'src/utils/util'
import { ErrorResponseApi } from 'src/types/util.type'
import { useContext } from 'react'
import { AuthContext } from 'src/context/AuthContext'
import Button from 'src/components/Button/Button'
import path from 'src/constants/path'
interface FormData {
  email: string
  password: string
}
function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues
  } = useForm<LoginSchema>({
    resolver: yupResolver(loginSchema)
  })
  const loginMutation = useMutation({
    mutationFn: (body: LoginSchema) => authApi.login(body)
  })
  const { setUser, setIsAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess(res, variables, context) {
        setUser(res.data.data.user)
        setIsAuthenticated(true)
        if (location.state) return navigate(location.state.pathname)
        return navigate(path.profile)
      },
      onError(error, variables, context) {
        if (isAxiosUnprocessableEntityError<ErrorResponseApi<FormData>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })
  const rules = getRules(getValues)
  return (
    <div className='bg-orange'>
      <button onClick={() => navigate('/')}>click</button>
      <div className='container'>
        <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10 '>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form onSubmit={onSubmit} className='p-10 rounded bg-white shadow-sm' noValidate>
              <div className='text-2xl'>Đăng nhập</div>
              <Input
                name='email'
                register={register}
                type='email'
                className='mt-8'
                errorMessage={errors.email?.message}
                placeholder='Email'
                // rules={rules.email}
              />
              <Input
                name='password'
                register={register}
                type='password'
                className='mt-2'
                errorMessage={errors.password?.message}
                placeholder='Password'
                autoComplete='on'
                // rules={rules.password}
              />
              <div className='mt-3'>
                <Button
                  disabled={loginMutation.isLoading}
                  isLoading={loginMutation.isLoading}
                  type='submit'
                  className='flex justify-center items-center w-full text-center py-4 px2 uppercase bg-orange text-white text-sm hover:bg-red-600'
                >
                  Đăng nhập
                </Button>
              </div>
              <div className='flex items-center justify-center mt-8 '>
                <span className='text-gray-300'>Bạn đã có tài khoản chưa?</span>
                <Link className='text-orange ml-1' to={path.register}>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
