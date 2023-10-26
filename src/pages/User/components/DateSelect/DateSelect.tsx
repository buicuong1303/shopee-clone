import { range } from 'lodash'
import { useState, useEffect } from 'react'

interface Props {
  onChange?: (value: Date) => void
  value?: Date
  errorMessage?: string
}
function DateSelect({ value, onChange, errorMessage }: Props) {
  const [date, setDate] = useState({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990
  })

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value: valueFromSelect } = event.target
    const newDate = {
      date: value?.getDate() || date.date,
      month: value?.getMonth() || date.month,
      year: value?.getFullYear() || date.year,
      [name]: +valueFromSelect
    }
    setDate(newDate)
    if (onChange) onChange(new Date(newDate.year, newDate.month, newDate.date))
  }
  useEffect(() => {
    if (value)
      setDate({
        date: value?.getDate(),
        month: value?.getMonth(),
        year: value?.getFullYear() || 1990
      })
  }, [value])
  return (
    <div className='mt-2 flex flex-wrap flex-col sm:flex-row'>
      <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Ngày sinh</div>
      <div className='sm:w-[80%] sm:pl-5'>
        <div className='flex justify-between'>
          <select
            onChange={handleChange}
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-orange cursor-pointer'
            name='date'
            value={value?.getDate() || date.date}
          >
            <option>Ngày</option>
            {range(1, 32).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-orange cursor-pointer'
            name='month'
            onChange={handleChange}
            value={value?.getMonth() || date.month}
          >
            <option>Tháng</option>
            {range(0, 12).map((item) => (
              <option value={item} key={item}>
                {item + 1}
              </option>
            ))}
          </select>
          <select
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-orange cursor-pointer'
            name='year'
            onChange={handleChange}
            value={value?.getFullYear() || date.year}
          >
            <option>Năm</option>
            {range(1990, new Date().getFullYear() + 1).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>{errorMessage}</div>
      </div>
    </div>
  )
}

export default DateSelect
