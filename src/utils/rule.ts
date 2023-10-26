// mẹo import interface
import type { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import * as yup from 'yup'
type Rules = { [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions }
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: 'Đây là trường bắt buộc'
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Email không hợp lệ'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 5 - 160 kí tự'
    },
    minLength: {
      value: 5,
      message: 'Độ dài từ 5 - 160 kí tự'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Đây là trường bắt buộc'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 6 - 160 kí tự'
    },
    minLength: {
      value: 6,
      message: 'Độ dài từ 6 - 160 kí tự'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Đây là trường bắt buộc'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 6 - 160 kí tự'
    },
    minLength: {
      value: 6,
      message: 'Độ dài từ 6 - 160 kí tự'
    },
    validate:
      typeof getValues === 'function'
        ? {
            checkConfirmPassword: (value) => {
              if (value === getValues('password')) return true
              return 'Confirm password không khớp'
            }
          }
        : undefined
  }
})
const handleConfirmPasswordYup = (ref: string) => {
  return yup
    .string()
    .required('Confirm password là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 kí tự')
    .max(160, 'Độ dài từ 6 - 160 kí tự')
    .oneOf([yup.ref(ref)], 'Confirm password không khớp')
}
export const schema = yup.object({
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không đúng định dạng')
    .min(5, 'Độ dài từ 5 - 160 kí tự')
    .max(160, 'Độ dài từ 5 - 160 kí tự'),
  password: yup
    .string()
    .required('Password là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 kí tự')
    .max(160, 'Độ dài từ 6 - 160 kí tự'),
  confirm_password: handleConfirmPasswordYup('password'),
  price_min: yup
    .string()
    .default('')
    .test({
      name: 'price-not-allowed',
      message: 'Giá không phù hợp',
      test: function (value) {
        const price_min = value
        const { price_max } = this.parent
        if (price_min !== '' && price_max !== '') {
          return Number(price_max) >= Number(price_min)
        }
        return price_min !== '' || price_max !== ''
      }
    }),
  price_max: yup
    .string()
    .default('')
    .test({
      name: 'price-not-allowed',
      message: 'Giá không phù hợp',
      test: function (value) {
        const price_max = value
        const { price_min } = this.parent
        if (price_min !== '' && price_max !== '') {
          return Number(price_max) >= Number(price_min)
        }
        return price_min !== '' || price_max !== ''
      }
    }),
  name: yup.string().trim().required('Tên sản phẩm là bắt buộc')
})
export const userSchema = yup.object({
  name: yup.string().max(160, 'Độ dài tối đa là 160 kí tự'),
  phone: yup.string().max(20, 'Độ dài tối đa là 20 kí tự'),
  address: yup.string().max(160, 'Độ dài tối đa là 160 kí tự'),
  date_of_birth: yup.date().max(new Date(), 'Hãy chọn một ngày trong quá khứ'),
  password: schema.fields['password'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  new_password: schema.fields['password'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  confirm_password: handleConfirmPasswordYup('new_password'),
  avatar: yup.string()
})

export const loginSchema = schema.pick(['email', 'password'])
export const registerSchema = schema.pick(['email', 'password', 'confirm_password'])
export const priceSchema = schema.pick(['price_max', 'price_min'])

export type LoginSchema = yup.InferType<typeof loginSchema>
export type Schema = yup.InferType<typeof schema>
export type RegisterSchema = yup.InferType<typeof registerSchema>
export type UserSchema = yup.InferType<typeof userSchema>
