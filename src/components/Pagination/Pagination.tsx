import classNames from 'classnames'
import { Link, createSearchParams } from 'react-router-dom'
import { QueryConfig } from 'src/pages/ProductList/ProductList'
interface Props {
  queryConfig: QueryConfig
  pageSize: number
}
/** 
 [1] 2 3 ... 19 20
 1 [2] 3 4 ...19 20
 1 2 [3] 4 5 ...19 20
 1 2 3 [4] 5 6 ... 19 20
 1 2 3 4 [5] 6 7 ... 19 20

 1 2 ... 4 5 [6] 7 8... 19 20
 1 2 ... 13 14 [15] 16 17... 19 20

 1 2 ...14 15 [16] 17 18 19 20
 1 2 ...15 16 [17] 18 19 20
 1 2 ...16 17 [18] 19 20
 1 2 ...17 18 [19] 20
 1 2 ...18 19 [20]

 */

const RANGE = 2

function Pagination({ queryConfig, pageSize }: Props) {
  const page = Number(queryConfig.page)
  const renderPagination = () => {
    let afterDot = false
    let beforeDot = false
    const renderBeforeDot = (index: number) => {
      if (!beforeDot) {
        beforeDot = true
        return (
          <span key={index} className='bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer border'>
            ...
          </span>
        )
      }
      return null
    }
    const renderAfterDot = (index: number) => {
      if (!afterDot) {
        afterDot = true
        return (
          <span key={index} className='bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer border'>
            ...
          </span>
        )
      }
      return null
    }
    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        //TH1: dấu ... ở sau
        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderAfterDot(index)
        } //TH2: Dấu ... ở trước và sau
        else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) return renderBeforeDot(index)
          else if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) return renderAfterDot(index)
        }
        //TH3: Dấu ... ở trước
        else if (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE)
          return renderBeforeDot(index)
        return (
          <Link
            to={{
              pathname: '/',
              search: createSearchParams({
                ...queryConfig,
                page: pageNumber.toString()
              }).toString()
            }}
            key={index}
            className={classNames('bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer border', {
              'border-cyan-500': pageNumber === page,
              'border-transparent': pageNumber !== page
            })}
          >
            {pageNumber}
          </Link>
        )
      })
  }
  return (
    <div className='flex flex-wrap mt-6 justify-center'>
      {page === 1 ? (
        <span className='bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-not-allowed bg-white/60 border'>Pre</span>
      ) : (
        <Link
          to={{
            pathname: '/',
            search: createSearchParams({
              ...queryConfig,
              page: (page - 1).toString()
            }).toString()
          }}
          className='bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer border'
        >
          Pre
        </Link>
      )}
      {renderPagination()}
      {page === pageSize ? (
        <span className='bg-white rounded px-3 py-2 cursor-not-allowed bg-white/60 shadow-sm mx-2 border'>Next</span>
      ) : (
        <Link
          to={{
            pathname: '/',
            search: createSearchParams({
              ...queryConfig,
              page: (page + 1).toString()
            }).toString()
          }}
          className='bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer border'
        >
          Next
        </Link>
      )}
    </div>
  )
}

export default Pagination
