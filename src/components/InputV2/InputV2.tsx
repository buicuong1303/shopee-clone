import { InputHTMLAttributes, useState } from 'react'
import { UseControllerProps, useController } from 'react-hook-form'
export interface InputV2Props extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}

function InputV2(props: UseControllerProps<any> & InputV2Props) {
  const {
    type,
    onChange,
    errorMessage,
    className,
    classNameInput = 'p-3 w-ful outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
    classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
    value = '',
    ...rest
  } = props
  const { field } = useController(props)
  const [localValue, setLocalValue] = useState<string>(field.value)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valueFormInput = event.target.value
    const numberCondition = type === 'number' && (/^\d+$/.test(valueFormInput) || valueFormInput === '')
    if (numberCondition || type !== 'number') {
      setLocalValue(valueFormInput)
      field.onChange(event)
      onChange && onChange(event)
    }
  }
  return (
    <div className={className}>
      <input className={classNameInput} {...rest} {...field} value={value || localValue} onChange={handleChange} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}

export default InputV2
