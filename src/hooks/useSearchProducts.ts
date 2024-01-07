import { createSearchParams, useNavigate } from 'react-router-dom'
import useQueryConfig from './useQueryConfig'
import omit from 'lodash/omit'
import path from 'src/constants/path'
import { useForm } from 'react-hook-form'
import { Schema, schema } from 'src/utils/rule'
import { yupResolver } from '@hookform/resolvers/yup'
type FormData = Pick<Schema, 'name'>
const nameSchema = schema.pick(['name'])

function useSearchProducts() {
  const queryConfig = useQueryConfig()
  const navigate = useNavigate()
  const { handleSubmit, register } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(nameSchema)
  })
  const onSubmitSearch = handleSubmit((data) => {
    const config = queryConfig.order
      ? omit({ ...queryConfig, name: data.name }, ['order', 'sort_by'])
      : { ...queryConfig, name: data.name }

    navigate({
      pathname: path.home,
      search: createSearchParams(config).toString()
    })
  })
  return { onSubmitSearch, register }
}

export default useSearchProducts
