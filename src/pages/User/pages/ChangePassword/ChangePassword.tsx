import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { UserSchema, userSchema } from 'src/utils/rule'
import { useMutation } from '@tanstack/react-query'
import { userApi } from 'src/apis/user.api'
import omit from 'lodash/omit'
import { toast } from 'react-toastify'
import { ErrorResponseApi } from 'src/types/util.type'
import { isAxiosUnprocessableEntityError } from 'src/utils/util'
type FormData = Pick<UserSchema, 'password' | 'new_password' | 'confirm_password'>
const passwordSchema = userSchema.pick(['password', 'new_password', 'confirm_password'])

function ChangePassword() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    reset
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: ''
    },
    resolver: yupResolver(passwordSchema as any)
  })
  const updateProfileMutation = useMutation(userApi.updateProfile)
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateProfileMutation.mutateAsync(omit(data, 'confirm_password'))
      toast.success(res.data.message, { autoClose: 500 })
      reset()
    } catch (error) {
      toast.error('Cập nhật profile thất bại', { autoClose: 500 })
      if (isAxiosUnprocessableEntityError<ErrorResponseApi<FormData>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key: string) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: 'Server'
            })
          })
        }
      }
    }
  })
  return (
    <div className='rounded-sm bg-white px-2 md:px-7 pb-10 md:pb-20 shadow'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg capitalize font-medium text-gray-900'>Đổi mật khẩu</h1>
        <div className='mt-1 text-sm text-gray-7000'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form className='mt-8 mr-auto max-width-2xl' onSubmit={onSubmit}>
        <div className='md:pr-20 mt-6 flex-grow  md:mt-0'>
          <div className='md:pr-20 mt-6 flex-grow  md:mt-0'>
            <div className='mt-2 flex flex-wrap flex-col sm:flex-row'>
              <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Mật khẩu cũ</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Input
                  classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                  register={register}
                  name='password'
                  type='password'
                  placeholder='Mật khẩu mới'
                  errorMessage={errors.password?.message}
                  className='relative'
                />
              </div>
            </div>
          </div>
          <div className='md:pr-20 mt-6 flex-grow  md:mt-0'>
            <div className='mt-2 flex flex-wrap flex-col sm:flex-row'>
              <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Mật khẩu mới</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Input
                  classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                  register={register}
                  name='new_password'
                  type='password'
                  placeholder='Mật khẩu mới'
                  errorMessage={errors.new_password?.message}
                  className='relative'
                />
              </div>
            </div>
          </div>
          <div className='md:pr-20 mt-6 flex-grow  md:mt-0'>
            <div className='mt-2 flex flex-wrap flex-col sm:flex-row'>
              <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Nhập lại khẩu </div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Input
                  classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                  register={register}
                  name='confirm_password'
                  type='password'
                  placeholder='Mật lại mật khẩu'
                  errorMessage={errors.confirm_password?.message}
                  className='relative'
                />
              </div>
            </div>

            <div className='mt-2 flex flex-wrap flex-col sm:flex-row'>
              <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize' />
              <div className='sm:w-[80%] sm:pl-5'>
                <Button
                  className='flex items-center bg-orange px-5 py-2 text-center text-sm text-white hover:bg-orange/80 mt-3 rounded-sm'
                  type='submit'
                >
                  Lưu
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ChangePassword
