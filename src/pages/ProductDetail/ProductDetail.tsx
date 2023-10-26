import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { productApi } from 'src/apis/product.api'
import { purchaseApi } from 'src/apis/pursechase.api'
import ProductRating from 'src/components/ProductRating/ProductRating'
import QuantityController from 'src/components/QuantityController/QuantityController'
import { purchasesStatus } from 'src/constants/purchase'
import { ProductListConfig, Product as ProductType } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameId, rateSale } from 'src/utils/util'
import Product from '../ProductList/components/Product/Product'
import { toast } from 'react-toastify'
import path from 'src/constants/path'
function ProductDetail() {
  const { nameId } = useParams()
  const id = getIdFromNameId(nameId as string)
  const { data: productDetailData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProduct(id as string)
  })
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5])
  const [activeImg, setActiveImg] = useState('')
  const product = productDetailData?.data.data
  const currentImages = useMemo(
    () => (product ? product?.images.slice(...currentIndexImages) : []),
    [product, currentIndexImages]
  )
  const queryClient = useQueryClient()
  const queryConfig: ProductListConfig = { limit: 20, page: 1, category: product?.category._id }
  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig)
    },
    keepPreviousData: true,
    enabled: Boolean(product),
    staleTime: 3 * 60 * 1000
  })

  const addToCartMutation = useMutation({
    mutationFn: (body: { buy_count: number; product_id: string }) => purchaseApi.addToCard(body)
  })

  const addToCart = () => {
    addToCartMutation.mutate(
      { buy_count: quantity, product_id: product?._id as string },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
          toast.success(data.data.message, { autoClose: 2000 })
        }
      }
    )
  }
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (product && product.image.length > 0) setActiveImg(product.images[0])
  }, [product])
  const next = () => {
    if (currentIndexImages[1] < (product as ProductType)?.images.length) {
      setCurrentIndexImages((pre) => [pre[0] + 1, pre[1] + 1])
    }
  }
  const prev = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImages((pre) => [pre[0] - 1, pre[1] - 1])
    }
  }
  const chooseActive = (img: string) => setActiveImg(img)
  const handleZoom = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const image = imageRef.current as HTMLImageElement
    // lấy chiều cao nguyên bản
    const { naturalHeight, naturalWidth } = image

    // C1: Lấy offsetX, offsetY
    // Event bubble: khi hover(hoặc sự kiện nào đó) vào element con cũng đồng nghĩa với việc hover vào element cha
    // Dùng pointer-events-none cho thẻ con
    // const { offsetX, offsetY } = e.nativeEvent

    //C2:
    const offsetX = e.pageX - (rect.x + window.scrollX)
    const offsetY = e.pageY - (rect.y + window.scrollY)

    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }
  const resetZoom = () => {
    imageRef.current?.removeAttribute('style')
  }
  const handleChangeQuantity = (value: number) => {
    setQuantity(value)
  }
  const buyNow = async () => {
    const res = await addToCartMutation.mutateAsync({ buy_count: quantity, product_id: product?._id as string })
    const purchase = res.data.data
    navigate(path.cart, {
      state: {
        purchaseId: purchase._id
      }
    })
  }
  if (!product) return null
  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        <div className='bg-white p-4 shadow'>
          <div className='container'>
            <div className='grid grid-cols-12 gap-9'>
              <div className='col-span-5'>
                <div
                  className='relative w-full pt-[100%] shadow overflow-hidden cursor-zoom-in'
                  onMouseMove={(e) => handleZoom(e)}
                  onMouseLeave={resetZoom}
                >
                  <img
                    className='absolute pointer-events-none top-0 left-0 w-full h-full object-cover'
                    src={activeImg}
                    alt={product.name}
                    ref={imageRef}
                  />
                </div>
                <div className='relative mt-4 grid grid-cols-5 gap-1'>
                  <button
                    className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                    onClick={prev}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth='1.5'
                      stroke='currentColor'
                      className='w-6 h-5'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                    </svg>
                  </button>
                  <button
                    className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                    onClick={next}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth='1.5'
                      stroke='currentColor'
                      className='w-6 h-5'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                    </svg>
                  </button>
                  {currentImages.map((img, index) => {
                    const isActive = img === activeImg
                    return (
                      <div className='relative w-full pt-[100%]' key={index} onMouseEnter={() => chooseActive(img)}>
                        <img
                          className='absolute top-0 left-0 w-full cursor-pointer h-full object-cover'
                          src={img}
                          alt={product.name}
                        />
                        {isActive && <div className='absolute inset-0 border-2 border-orange'></div>}
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className='col-span-7'>
                <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
                <div className='mt-8 flex items-center'>
                  <div className='flex items-center'>
                    <span className='mr-1 border-b border-b-orange text-orange'>{product.rating}</span>
                    <ProductRating
                      rating={product.rating}
                      activeClassName='w-4 h-4 fill-orange text-orange-300'
                      nonActiveClassName='w-4 h-4 fill-gray-300 text-gray-300'
                    />
                  </div>
                  <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                  <div>
                    <span>{formatNumberToSocialStyle(product.sold)}</span>
                    <span className='ml-1 text-gray-500'>Đã bán</span>
                  </div>
                </div>
                <div className='mt-8 flex items-center bg-gray-50 px-5 py-4'>
                  <div className='text-gray-500 line-through'>₫{formatCurrency(product.price_before_discount)}</div>
                  <div className='ml-3 text-3xl text-orange font-medium'>₫{formatCurrency(product.price)}</div>
                  <div className='ml-4 round-sm bg-orange px-1 py-[2px] font-semibold text-xs uppercase text-white'>
                    {rateSale(product.price_before_discount, product.price)} giảm
                  </div>
                </div>
                <div className='mt-8 flex items-center'>
                  <div className='capitalize text-gray-500 mr-8'>Số lượng</div>
                  <QuantityController
                    value={quantity}
                    max={product.quantity}
                    onDecrease={handleChangeQuantity}
                    onIncrease={handleChangeQuantity}
                    onType={handleChangeQuantity}
                  />
                  <div className='ml-6 text-sm text-gray-500'>{product.quantity} Sản phẩm có sẵn</div>
                </div>

                <div className='mt-8 flex items-center'>
                  <button
                    onClick={addToCart}
                    className='flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5'
                  >
                    <svg
                      enableBackground='new 0 0 15 15'
                      viewBox='0 0 15 15'
                      x='0'
                      y='0'
                      className='h-5 w-5 fill-current stroke-orange text-orange mr-[10px]'
                    >
                      <g>
                        <g>
                          <polyline
                            fill='none'
                            points='.5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeMiterlimit='10'
                          ></polyline>
                          <circle cx='6' cy='13.5' r='1' stroke='none'></circle>
                          <circle cx='11.5' cy='13.5' r='1' stroke='none'></circle>
                        </g>
                        <line
                          fill='none'
                          strokeLinecap='round'
                          strokeMiterlimit='10'
                          x1='7.5'
                          x2='10.5'
                          y1='7'
                          y2='7'
                        ></line>
                        <line
                          fill='none'
                          strokeLinecap='round'
                          strokeMiterlimit='10'
                          x1='9'
                          x2='9'
                          y1='8.5'
                          y2='5.5'
                        ></line>
                      </g>
                    </svg>
                    Thêm vào giỏ hàng
                  </button>
                  <button
                    onClick={buyNow}
                    className='ml-4 h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orange px-5 capitalize text-white outline-none shadow-sm hover:bg-orange/90'
                  >
                    Mua ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-8 bg-white p-4 shadow'>
          <div className='rounded bg-gray-50 p-4 text-lg capitalize text-slate-700'>Mô tả sản phẩm</div>
          <div className='mx-4 mt-12 mb-4 text-sm leading-loose'>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.description)
              }}
            />
          </div>
        </div>
      </div>
      <div className='mt-8'>
        <div className='container'>
          <div className='uppercase text-gray-400'>Có thể bạn cũng thích</div>
          <div className='mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3'>
            {productsData &&
              productsData?.data.data.products.map((product) => (
                <div className='col-span-1' key={product._id}>
                  <Product product={product} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
