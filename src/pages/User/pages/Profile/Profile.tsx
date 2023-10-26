import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'
import { toast } from 'react-toastify'
import { userApi } from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputFile from 'src/components/InputFile'
import InputNumber from 'src/components/InputNumber'
import { AuthContext } from 'src/context/AuthContext'
import { ErrorResponseApi } from 'src/types/util.type'
import { UserSchema, userSchema } from 'src/utils/rule'
import { getAvatarURL, isAxiosUnprocessableEntityError, setProfileToLS } from 'src/utils/util'
import DateSelect from '../../components/DateSelect'

type FormData = Pick<UserSchema, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>
type FormDataError = Omit<FormData, 'date_of_birth'> & {
  date_of_birth?: string
}

function Info() {
  const {
    register,
    control,
    formState: { errors }
  } = useFormContext<FormData>()
  return (
    <>
      <div className='mt-6 flex flex-wrap flex-col sm:flex-row'>
        <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Tên</div>
        <div className='sm:w-[80%] sm:pl-5'>
          <Input
            classNameInput='relative px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
            register={register}
            name='name'
            placeholder='Tên'
            errorMessage={errors.name?.message}
          />
        </div>
      </div>
      <div className='mt-2 flex flex-wrap flex-col sm:flex-row'>
        <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Số điện thoại</div>
        <div className='sm:w-[80%] sm:pl-5'>
          <Controller
            control={control}
            name='phone'
            render={({ field }) => (
              <InputNumber
                classNameInput='relative px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                errorMessage={errors.phone?.message}
                placeholder='Số điện thoại'
                {...field}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
    </>
  )
}

const profileSchema = userSchema.pick(['name', 'address', 'phone', 'date_of_birth', 'avatar'])
function Profile() {
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  })
  const { setProfile } = useContext(AuthContext)
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])
  const updateProfileMutation = useMutation(userApi.updateProfile)
  const uploadAvatarMutation = useMutation(userApi.uploadAvatar)
  const methods = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema as any)
  })
  const {
    register,
    control,
    formState: { errors },
    setError,
    setValue,
    handleSubmit,
    watch
  } = methods
  const avatar = watch('avatar')
  const profile = profileData?.data.data
  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('phone', profile.phone)
      setValue('address', profile.address)
      setValue('avatar', profile.avatar)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [profile, setValue])
  const onSubmit = handleSubmit(async (data) => {
    try {
      let avatarName = avatar
      if (file) {
        const formData = new FormData()
        formData.append('image', file)
        const uploadRes = await uploadAvatarMutation.mutateAsync(formData)
        avatarName = uploadRes.data.data
        setValue('avatar', avatarName)
      }
      const res = await updateProfileMutation.mutateAsync({
        ...data,
        avatar: avatarName
      } as any)
      refetch()
      toast.success('Cập nhật profile thành công', { autoClose: 500 })
      setProfile(res.data.data)
      setProfileToLS(res.data.data)
    } catch (error) {
      toast.error('Cập nhật profile thất bại', { autoClose: 500 })
      if (isAxiosUnprocessableEntityError<ErrorResponseApi<FormDataError>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key: string) => {
            setError(key as keyof FormDataError, {
              message: formError[key as keyof FormDataError],
              type: 'Server'
            })
          })
        }
      }
    }
  })
  const handleChangeFile = (file?: File) => {
    setFile(file)
  }
  return (
    <div className='rounded-sm bg-white px-2 md:px-7 pb-10 md:pb-20 shadow'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg capitalize font-medium text-gray-900'>Hồ sơ của tôi</h1>
        <div className='mt-1 text-sm text-gray-7000'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <FormProvider {...methods}>
        <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
          <div className='md:pr-20 mt-6 flex-grow pr-12 md:mt-0'>
            <div className='flex flex-wrap flex-col sm:flex-row'>
              <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Email</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <div className='pt-3 text-gray-700'>{profile?.email}</div>
              </div>
            </div>
            <Info />
            <div className='mt-2 flex flex-wrap flex-col sm:flex-row'>
              <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Địa chỉ</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Input
                  classNameInput='relative px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                  register={register}
                  name='address'
                  placeholder='Địa chỉ'
                  errorMessage={errors.address?.message}
                />
              </div>
            </div>
            <Controller
              control={control}
              name='date_of_birth'
              render={({ field }) => (
                //onChange của DataSelect đang trả về value trong khi field.onChange trả về event nhưng react-hook-form vẫn hiểu
                <DateSelect
                  errorMessage={errors.date_of_birth?.message}
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
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
          <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
            <div className='flex flex-col items-center'>
              <div className='my-5 h-24 w-24'>
                <img
                  src={previewImage || getAvatarURL(avatar ?? '')}
                  className='h-full w-full rounded-full object-cover'
                  alt=''
                />
              </div>
              <InputFile onChange={handleChangeFile} />
              <div className='mt-3 text-gray-400'>
                <div>Dung lượng tối đa 1 MB</div>
                <div>Định dạng: JPEG, .PNG</div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default Profile
