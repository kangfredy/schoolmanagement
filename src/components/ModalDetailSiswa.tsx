import { IModalDetailSiswaProps } from '@/interface/ui/props/ModalDetailSiswa'
import { Modal } from 'antd'
import { FormInput } from './FormInput'

export const ModalDetailSiswa = (props: IModalDetailSiswaProps) => {
  return (
    <>
      <Modal open={props.isOpen} width={'60%'}>
        <div className="flex flex-col h-[80%] items-start">
          <div className="flex">
            <div className="w-[25%] h-[15%]">
              <FormInput
                label="nama"
                isDisabled
                placeholder={'nama siswa'}
                values={props.DataSiswa.nama}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
