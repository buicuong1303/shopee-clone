import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button/Button'
import { Category } from 'src/types/category.type'
import classNames from 'classnames'
import InputNumber from 'src/components/InputNumber/InputNumber'
import { Controller, useForm } from 'react-hook-form'
import { schema } from 'src/utils/rule'
import { yupResolver } from '@hookform/resolvers/yup'
import { omit } from 'lodash'
import RatingStart from '../RatingStart/RatingStart'
import { QueryConfig } from 'src/hooks/useQueryConfig'
interface Props {
  queryConfig: QueryConfig
  categories: Category[]
}
type FormData = {
  price_min: string
  price_max: string
}
const priceSchema = schema.pick(['price_min', 'price_max'])
function AsideFilter({ queryConfig, categories }: Props) {
  const { category } = queryConfig
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      price_max: '',
      price_min: ''
    },
    shouldFocusError: false,
    resolver: yupResolver(priceSchema)
  })
  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: '/',
      search: createSearchParams({
        ...queryConfig,
        price_max: data.price_max,
        price_min: data.price_min
      }).toString()
    })
  })
  const navigate = useNavigate()
  const handelRemoveFilter = () => {
    navigate({
      pathname: '/',
      search: createSearchParams(omit(queryConfig, ['price_min', 'price_max', 'rating-filter'])).toString()
    })
  }
  return (
    <div className='py-4'>
      <Link to={'/'} className='flex items-center font-bold'>
        <svg viewBox='0 0 12 10' className='w-3 h-4 mr-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth='1'>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z'></path>
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z'></path>
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z'></path>
                </g>
              </g>
            </g>
          </g>
        </svg>
        Tất cả danh mục
      </Link>
      <div className='bg-gray-300 h-[1px] my-4'></div>
      <ul>
        {categories.map((categoryItem: Category) => (
          <li className='py-2' key={categoryItem._id}>
            <Link
              to={{
                pathname: '/',
                search: createSearchParams({
                  ...queryConfig,
                  category: categoryItem._id
                }).toString()
              }}
              className={classNames('relative px-2', {
                'text-orange font-semibold': categoryItem._id === category
              })}
            >
              {categoryItem._id === category && (
                <svg viewBox='0 0 4 7' className='fill-orange h-2 w-2 absolute top-1 left-[-10px]'>
                  <polygon points='4 3.5 0 0 0 7'></polygon>
                </svg>
              )}
              {categoryItem.name}
            </Link>
          </li>
        ))}
      </ul>
      <Link to={'/'} className='flex items-center font-bold mt-4 uppercase'>
        <svg
          enableBackground='new 0 0 15 15'
          viewBox='0 0 15 15'
          x='0'
          y='0'
          className='w-3 h-4 fill-current stroke-current mr-3'
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit='10'
            ></polyline>
          </g>
        </svg>
        Bộ lọc tìm kiếm
      </Link>
      <div className='bg-gray-300 h-[1px] my-4'></div>
      <div className='my-5'>
        <div>Khoảng giá</div>
        <form action='' className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-start justify-center'>
            <Controller
              name='price_min'
              control={control}
              render={({ field, formState, fieldState }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholder='₫ TỪ'
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    // value={field.value}
                    // ref={field.ref}
                    {...field}
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_max')
                    }}
                    classNameError='hidden'
                  />
                )
              }}
            />
            <div className='mt-1 mx-2 shrink-0'>-</div>
            <Controller
              name='price_max'
              control={control}
              render={({ field, formState, fieldState }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholder='₫ ĐẾN'
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    {...field}
                    // value={field.value}
                    // ref={field.ref}
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_min')
                    }}
                    classNameError='hidden'
                  />
                )
              }}
            />
          </div>
          <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm text-center'>{errors.price_min?.message}</div>
          <Button
            type='submit'
            className='w-full p-2 uppercase bg-orange text-white text-sm hover:bg-orange/80 flex justify-center items-center'
          >
            Áp dụng
          </Button>
        </form>
      </div>
      <div className='bg-gray-300 h-[1px] my-4'></div>
      <div className='text-sm'>Đánh giá</div>
      <RatingStart queryConfig={queryConfig} />
      <div className='bg-gray-300 h-[1px] my-4'></div>
      <Button
        className='w-full p-2 uppercase bg-orange text-white text-sm hover:bg-orange/80  flex justify-center items-center'
        onClick={handelRemoveFilter}
      >
        Xóa tất cả
      </Button>
    </div>
  )
}

export default AsideFilter
