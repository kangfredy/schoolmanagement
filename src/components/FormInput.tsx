import { IFormInput } from '@/interface/ui/component/IformInput'
import { Input } from 'antd'
import TextArea from 'antd/lib/input/TextArea'

export const FormInput = (props: IFormInput) => {
  return (
    <div className="flex">
      <div className="w-[25%]">{props.label}</div>
      <div className="w-[75%]">
        {!props.isArea ? (
          <Input
            placeholder={props.placeholder}
            prefix={props.icons}
            onChange={e => props.onChange(e)}
            disabled={props.isDisabled}
            value={props.values}
          />
        ) : (
          <TextArea
            placeholder={props.placeholder}
            value={props.values}
            bordered
            disabled={props.isDisabled}
          />
        )}
      </div>
    </div>
  )
}
