import { InputHTMLAttributes, forwardRef, useState } from 'react'
export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}

function InputNumber(
  {
    errorMessage,
    className,
    classNameInput = 'p-3 w-ful outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
    classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
    onChange,
    value = '',
    ...rest
  }: InputNumberProps,
  ref: any
) {
  const [localValue, setLocalValue] = useState<string>(value as string)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d+$/.test(value) || value === '') {
      onChange && onChange(e)
      setLocalValue(value)
    }
  }
  return (
    <div className={className}>
      <input className={classNameInput} value={value || localValue} onChange={handleChange} {...rest} ref={ref} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}

export default forwardRef<HTMLInputElement, InputNumberProps>(InputNumber)
