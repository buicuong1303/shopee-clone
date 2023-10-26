import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'
import { keyBy } from 'lodash'
import { useContext, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { purchaseApi } from 'src/apis/pursechase.api'
import noproduct from 'src/assets/images/no-product.png'
import Button from 'src/components/Button/Button'
import QuantityController from 'src/components/QuantityController/QuantityController'
import path from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchase'
import { AppContext } from 'src/context/AppContext'
import { Purchase, PurchaseStatus } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/util'

function Cart() {
  const { data: dataPurchaseInCart, refetch } = useQuery({
    queryKey: ['purchase', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart as PurchaseStatus })
  })
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)
  const queryClient = useQueryClient()

  const isAllChecked = useMemo(() => extendedPurchases.every((purchase) => purchase.checked), [extendedPurchases])
  const checkedPurchases = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])
  const totalCheckedPurchasePrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + current.product.price * current.buy_count
      }, 0),
    [checkedPurchases]
  )
  const totalCheckedPurchaseSavingPrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + (current.product.price_before_discount - current.product.price) * current.buy_count
      }, 0),
    [checkedPurchases]
  )
  const checkedPurchasesCount = checkedPurchases.length
  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch()
    }
  })
  const buyProductsMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      refetch()
      toast.success(data.data.message, {
        position: 'top-center',
        autoClose: 1000
      })
    }
  })
  const deletePurchaseMutation = useMutation({
    mutationFn: purchaseApi.deletePurchases,
    onSuccess: () => {
      refetch()
      queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
    }
  })
  const purchaseInCart = dataPurchaseInCart?.data.data

  const location = useLocation()
  const purchaseId = location.state?.purchaseId

  const handleBuyProducts = () => {
    if (checkedPurchasesCount > 0) {
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }))
      buyProductsMutation.mutate(body)
    }
  }

  const handleDeletePurchase = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex]._id
    deletePurchaseMutation.mutate([purchaseId])
  }

  const handleDeleteManyPurchases = () => () => {
    const purchaseIds = checkedPurchases.map((purchase) => purchase._id)
    deletePurchaseMutation.mutate(purchaseIds)
  }

  const handleChangeQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    const purchase = extendedPurchases[purchaseIndex]
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].disabled = enable
      })
    )
    enable &&
      updatePurchaseMutation.mutate({
        product_id: purchase.product._id,
        buy_count: value
      })
  }
  const handleTypeQuantity = (purchaseIndex: number, value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }
  const handleChecked = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].checked = event.target.checked
      })
    )
  }

  const toggleCheckAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    )
  }

  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchaseObject = keyBy(prev, '_id')

      return (
        purchaseInCart?.map((purchase) => {
          return {
            ...purchase,
            disabled: false,
            checked: purchaseId === purchase._id || Boolean(extendedPurchaseObject[purchase._id]?.checked) // tự động tick các item mua ngay ở trag detail hoặc các item được user chủ động tick
          }
        }) || []
      )
    })
  }, [purchaseInCart, purchaseId])
  useEffect(() => {
    return () => {
      //remove state trong location
      history.replaceState(null, '')
    }
  }, [])
  return (
    <>
      <div className='bg-neutral-100 py-16'>
        {extendedPurchases.length > 0 ? (
          <div className='container'>
            <div className='overflow-auto'>
              <div className='min-w-[1000px]'>
                <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitallize shadow text-gray-500'>
                  <div className='col-span-6 bg-white'>
                    <div className='flex items-center'>
                      <div className='flex flex-shrinks-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          className='h-5 w-5 accent-orange'
                          checked={isAllChecked}
                          onChange={toggleCheckAll}
                        />
                      </div>
                      <div className='text-black flex-1'>Sản phẩm</div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid grid-cols-5 text-center'>
                      <div className='col-span-2'>Đơn giá</div>
                      <div className='col-span-1'>Số lượng</div>
                      <div className='col-span-1'>Số tiền</div>
                      <div className='col-span-1'>Thao tác</div>
                    </div>
                  </div>
                </div>
                <div className='my-3 rounded-sm bg-white p-5 shadow'>
                  {extendedPurchases.map((purchase, index) => (
                    <div
                      key={purchase._id}
                      className='grid grid-cols-12 items-center text-center rounded-sm border border-gray-200 bg-white py-5 px-4 text-sm text-gray-500 mt-1 first:mt-5'
                    >
                      <div className='col-span-6'>
                        <div className='flex'>
                          <div className='flex flex-shrinks-0 items-center justify-center pr-3'>
                            <input
                              type='checkbox'
                              className='h-5 w-5 accent-orange'
                              checked={purchase.checked}
                              onChange={handleChecked(index)}
                            />
                          </div>
                          <div className='flex-grow'>
                            <div className='flex'>
                              <Link
                                className='h-20 w-20 flex-shrink-0'
                                to={`${path.home}${generateNameId({
                                  name: purchase.product.name,
                                  id: purchase.product._id
                                })}`}
                              >
                                <img src={purchase.product.image} alt={purchase.product.name} />
                              </Link>
                              <div className='flex-grow px-2 pt-1 pb-2 text-left ml-2'>
                                <Link
                                  to={`${path.home}${generateNameId({
                                    name: purchase.product.name,
                                    id: purchase.product._id
                                  })}`}
                                  className='line-clamp-2'
                                >
                                  {purchase.product.name}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-span-6'>
                        <div className='grid grid-cols-5 items-center'>
                          <div className='col-span-2'>
                            <div className='flex items-center justify-center'>
                              <span className='line-through text-gray-300'>
                                ₫ {formatCurrency(purchase.product.price_before_discount)}
                              </span>
                              <span className='ml-3'>{formatCurrency(purchase.product.price)}</span>
                            </div>
                          </div>
                          <div className='col-span-1'>
                            <QuantityController
                              value={purchase.buy_count}
                              max={purchase.product.quantity}
                              onIncrease={(value) =>
                                handleChangeQuantity(index, value, value <= purchase.product.quantity)
                              }
                              onDecrease={(value) =>
                                handleChangeQuantity(
                                  index,
                                  value,
                                  value >= 1 && (purchaseInCart as Purchase[])[index].buy_count !== 1
                                )
                              }
                              onType={(value) => handleTypeQuantity(index, value)}
                              onFocusOut={(value) =>
                                handleChangeQuantity(
                                  index,
                                  value,
                                  value >= 1 &&
                                    value <= purchase.product.quantity &&
                                    value !== (purchaseInCart as Purchase[])[index].buy_count
                                  // check change quantity để hạn chế gọi api khi quantity không thay đổi
                                )
                              }
                              disabled={purchase.disabled}
                            />
                          </div>
                          <div className='col-span-1'>
                            <div className='text-orange'>
                              ₫ {formatCurrency(purchase.product.price * Number(purchase.buy_count))}
                            </div>
                          </div>
                          <div className='col-span-1'>
                            <button
                              className='bg-none text-black transition-colors hover:text-orange'
                              onClick={handleDeletePurchase(index)}
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='sticky flex flex-col md:flex-row items-end bottom-0 z-10 md:items-center rounded-sm bg-white p-5 shadow border border-gray-100'>
              <div className='flex items-center'>
                <div className='flex flex-shrinks-0 items-center justify-center pr-3'>
                  <input
                    type='checkbox'
                    className='h-5 w-5 accent-orange'
                    checked={isAllChecked}
                    onChange={toggleCheckAll}
                  />
                </div>
                <button className='mx-3 border=none bg-none'>Chọn tất cả ({extendedPurchases.length})</button>
                <button className='mx-3 border=none bg-none' onClick={handleDeleteManyPurchases()}>
                  Xóa
                </button>
              </div>
              <div className='md:ml-auto mt-5 flex-col md:flex-row flex items:end md:items-center md:mt-0'>
                <div>
                  <div className='flex md:justify-end items-center'>
                    <div>Tổng thanh toán ({checkedPurchasesCount} sản phẩm)</div>
                    <div className='ml-2 text-2xl text-orange'> ₫{formatCurrency(totalCheckedPurchasePrice)}</div>
                  </div>
                  <div className='flex items-center justify-end text-sm'>
                    <div className='text-gray-500'>Tiết kiệm</div>
                    <div className='ml-6 text-orange'>₫ {formatCurrency(totalCheckedPurchaseSavingPrice)}</div>
                  </div>
                </div>
                <Button
                  disabled={buyProductsMutation.isLoading}
                  onClick={handleBuyProducts}
                  className='ml-auto md:ml-4 md:ml-4 mt-5 md:mt-0 flex h-10 w-52 justify-center items-center text-center uppercase bg-orange text-white text-sm hover:bg-red-600'
                >
                  Mua hàng
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className='p-2 flex flex-col items-center justify-center  h-[350px]'>
            <img className=' h-24 w-24' src={noproduct} alt='no purchases' />
            <div className='mt-2 capitalize'>Giỏ hàng của bạn còn trống</div>
          </div>
        )}
      </div>
    </>
  )
}

export default Cart
