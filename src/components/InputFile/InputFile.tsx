import { useRef } from 'react'
import { toast } from 'react-toastify'
import { config } from 'src/constants/config'
interface Props {
  onChange?: (file?: File) => void
}
function InputFile({ onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleUpload = () => {
    fileInputRef.current?.click()
  }
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    if (
      fileFromLocal &&
      (fileFromLocal.size >= config.MAX_SIZE_UPLOAD_AVATAR || !fileFromLocal.type.includes('image'))
    ) {
      toast.error('Dung lượng file tối đa 1MB, định dạng JPEG/PNG')
    } else {
      onChange && onChange(fileFromLocal)
    }
  }
  return (
    <>
      <input
        ref={fileInputRef}
        className='hidden'
        type='file'
        accept='.jpg,.jpeg,.png'
        onChange={onFileChange}
        onClick={(e: any) => (e.target.value = null)}
      />
      <button
        className='flex h-10 items-center justify-end rounded-sm bg-white px-6 text-sm text-gray-600 shadow-sm border'
        type='button'
        onClick={handleUpload}
      >
        Chọn ảnh
      </button>
    </>
  )
}

export default InputFile
