import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { getUserInfo } from 'src/apis/user.api'
import { AuthContext } from 'src/context/AuthContext'

function Profile(props) {
  const { user } = useContext(AuthContext)
  const getMeQuery = useQuery({
    queryKey: ['user'],
    queryFn: () => {
      return getUserInfo()
    }
  })
  return <div>{user?.email}</div>
}
export default Profile
