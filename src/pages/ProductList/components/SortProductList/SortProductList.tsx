import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import { QueryConfig } from '../../ProductList'
import classNames from 'classnames'
import { ProductListConfig } from 'src/types/product.type'
import { omit } from 'lodash'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}
function SortProductList({ queryConfig, pageSize }: Props) {
  const page = Number(queryConfig.page)
  const { sort_by = 'createAt', order = '' } = queryConfig
  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }
  const navigate = useNavigate()
  const handleSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: '/',
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            page: '1',
            sort_by: sortByValue
          },
          ['order']
        )
      ).toString()
    })
  }
  const handlePriceOrder = (orderValue: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      pathname: '/',
      search: createSearchParams({
        ...queryConfig,
        page: '1',
        sort_by: 'price',
        order: orderValue
      }).toString()
    })
  }

  return (
    <div className='bg-gray-300/40 py-5 px-3'>
      <div className='flex flex-wrap justify-between items-center gap-2'>
        <div className='flex items-center flex-wrap gap-2'>
          <div>Sắp xếp theo</div>
          <button
            onClick={() => handleSort('view')}
            className={classNames('h-8 px-4 py-2 capitalize text-center', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy('view'),
              'bg-white hover:bg-slate-100 text-black': !isActiveSortBy('view')
            })}
          >
            Phổ biến
          </button>
          <button
            onClick={() => handleSort('createdAt')}
            className={classNames('h-8 px-4 py-2 capitalize text-center', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy('createdAt'),
              'bg-white hover:bg-slate-100 text-black': !isActiveSortBy('createdAt')
            })}
          >
            Mới nhất
          </button>
          <button
            onClick={() => handleSort('sold')}
            className={classNames('h-8 px-4 py-2 capitalize text-center', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy('sold'),
              'bg-white hover:bg-slate-100 text-black': !isActiveSortBy('sold')
            })}
          >
            Bán chạy
          </button>
          <select
            value={order}
            className={classNames('h-8 px-4 outline-none text-sm capitalize text-left', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy('price'),
              'bg-white hover:bg-slate-100 text-black': !isActiveSortBy('price')
            })}
            onChange={(e) => handlePriceOrder(e.target.value as Exclude<ProductListConfig['order'], undefined>)}
          >
            <option className='bg-white text-black' value='' disabled>
              Giá
            </option>
            <option className='bg-white text-black' value='asc'>
              Giá thấp đến cao
            </option>
            <option className='bg-white text-black' value='desc'>
              Giá cao đến thấp
            </option>
          </select>
        </div>
        <div className='flex items-center'>
          <div>
            <span className='text-orange'>{page}</span>
            <span>/{pageSize}</span>
          </div>
          <div className='ml-2 flex'>
            {page === 1 ? (
              <span className='bg-white rounded-l-sm px-3 py-2 shadow-sm  cursor-not-allowed bg-white/60'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: '/',
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page - 1).toString()
                  }).toString()
                }}
                className='px-3 py-2 shadow-sm bg-white rounded-l-sm'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </Link>
            )}
            {page === pageSize ? (
              <span className='bg-white rounded-r-sm px-3 py-2 shadow-sm cursor-not-allowed bg-white/60'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: '/',
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page + 1).toString()
                  }).toString()
                }}
                className='rounded-r-sm px-3 py-2 shadow-sm bg-white'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SortProductList
