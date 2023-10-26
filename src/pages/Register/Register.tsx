import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import * as _ from 'lodash'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { authApi } from 'src/apis/auth.api'
import Button from 'src/components/Button/Button'
import Input from 'src/components/Input/Input'
import path from 'src/constants/path'
import { ErrorResponseApi } from 'src/types/util.type'
import { RegisterSchema, registerSchema } from 'src/utils/rule'
import { isAxiosUnprocessableEntityError } from 'src/utils/util'
function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<RegisterSchema>({
    resolver: yupResolver(registerSchema)
  })
  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<RegisterSchema, 'confirm_password'>) => authApi.registerAccount(body)
  })
  const onSubmit = handleSubmit((data) => {
    registerAccountMutation.mutate(_.omit(data, ['confirm_password']), {
      onSuccess: (data) => console.log(data),
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponseApi<Omit<RegisterSchema, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<RegisterSchema, 'confirm_password'>, {
                message: formError[key as keyof Omit<RegisterSchema, 'confirm_password'>],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })
  // const rules = getRules(getValues)
  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10 '>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-10 rounded bg-white shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng ký</div>
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
              <Input
                name='confirm_password'
                register={register}
                type='password'
                className='mt-2'
                errorMessage={errors.confirm_password?.message}
                placeholder='Confirm password'
                autoComplete='on'
                // rules={rules.confirm_password}
              />
              <div className='mt-2'>
                <Button
                  disabled={registerAccountMutation.isLoading}
                  isLoading={registerAccountMutation.isLoading}
                  type='submit'
                  className='flex items-center justify-center w-full text-center py-4 px2 uppercase bg-orange text-white text-sm hover:bg-red-600'
                >
                  Đăng ký
                </Button>
              </div>
              <div className='flex items-center justify-center mt-8 '>
                <span className='text-gray-300'>Bạn đã có tài khoản chưa?</span>
                <Link className='text-orange ml-1' to={path.login}>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
