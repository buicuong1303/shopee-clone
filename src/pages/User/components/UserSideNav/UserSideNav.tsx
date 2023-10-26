import classNames from 'classnames'
import { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import path from 'src/constants/path'
import { AuthContext } from 'src/context/AuthContext'
import { getAvatarURL } from 'src/utils/util'
function UserSideNav() {
  const { profile } = useContext(AuthContext)
  return (
    <div>
      <div className='flex items-center border-b border-b-gray-200 py-4'>
        <Link to={path.profile} className='h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-black/10'>
          <img src={getAvatarURL(profile?.avatar)} alt='' className='w-full h-full object-cover rounded-full' />
        </Link>
        <div className='flex-grow pl-4'>
          <div className='mb-1 font-semibold text-gray-600'>cuongbq</div>
          <NavLink
            to={path.profile}
            className={({ isActive }) =>
              classNames('flex items-center capitalize text-gray-500', {
                'text-orange': isActive
              })
            }
          >
            <svg
              width='12'
              height='12'
              viewBox='0 0 12 12'
              xmlns='http://www.w3.org/2000/svg'
              style={{ marginRight: '4px' }}
            >
              <path
                d='M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48'
                fill='#9B9B9B'
                fillRule='evenodd'
              ></path>
            </svg>
            Sửa hồ sơ
          </NavLink>
        </div>
      </div>
      <div className='mt-7'>
        <NavLink
          to={path.profile}
          className={({ isActive }) =>
            classNames('mt-4 flex items-center capitalize text-gray-500', {
              'text-orange': isActive
            })
          }
        >
          <div className='mr-3 h-[22px] w-[22px]'>
            <img
              src='https://down-vn.img.susercontent.com/file/sg-11134004-7rbm4-lluo27hsyiiz2c'
              className='h-full w-full'
              alt=''
            />
          </div>
          Tài khoản của tôi
        </NavLink>
        <NavLink
          to={path.changePassword}
          className={({ isActive }) =>
            classNames('mt-4 flex items-center capitalize text-gray-500', {
              'text-orange': isActive
            })
          }
        >
          <div className='mr-3 h-[22px] w-[22px]'>
            <img
              src='https://down-vn.img.susercontent.com/file/ba61750a46794d8847c3f463c5e71cc4'
              className='h-full w-full'
              alt=''
            />
          </div>
          Đổi mật khẩu
        </NavLink>
        <NavLink
          to={path.historyPurchase}
          className={({ isActive }) =>
            classNames('mt-4 flex items-center capitalize text-gray-500', {
              'text-orange': isActive
            })
          }
        >
          <div className='mr-3 h-[22px] w-[22px]'>
            <img
              src='https://down-vn.img.susercontent.com/file/f0049e9df4e536bc3e7f140d071e9078'
              className='h-full w-full'
              alt=''
            />
          </div>
          Đơn mua
        </NavLink>
      </div>
    </div>
  )
}

export default UserSideNav
