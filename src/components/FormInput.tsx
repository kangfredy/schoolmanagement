import { IFormInput } from '@/interface/ui/component/IformInput'
import { Input } from 'antd'

export const FormInput = (props: IFormInput) => {
  return (
    <div className="flex w-[100%]">
      <div className="flex w-[50%]">{props.label}</div>
      <div className="flex w-[50%]">
        <Input
          placeholder={props.placeholder}
          prefix={props.icons}
          onChange={e => props.onChange(e)}
          disabled={props.isDisabled}
          value={props.values}
        />
      </div>
    </div>
  )
}
