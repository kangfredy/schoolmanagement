import { Input, Modal, Spin, message } from 'antd'
import { useEffect, useState } from 'react'
import { IDataSeragamnModal } from '@/interface/ui/state/dataSeragamModal'
import { ModalTambahSeragamBaruProps } from '@/interface/ui/props/ModalTambahSeragamBaru'
import { dataSeragamUpdate } from '@/helper/apiHelper/seragam'
import { RiShirtLine } from 'react-icons/ri'
import { getUserInfoWithNullCheck } from '@/helper/util/userInfo'

export function ModalTambahSeragamBaru({
  open,
  setOpen,
  getData,
  setDataSeragamInput,
  dataSeragamInput,
}: ModalTambahSeragamBaruProps) {
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const user = getUserInfoWithNullCheck()
    const updatedBy = user ? user.id : 0

    const { name, value } = e.target
    const updatedValue = name === 'harga' ? Number(value) : value
    setDataSeragamInput((prevState: any) => ({
      ...prevState,
      [name]: updatedValue,
      updatedBy: updatedBy,
    }))
  }

  const handleOk = () => {
    setConfirmLoading(true)
    dataSeragamUpdate(dataSeragamInput)
      .then((response: any) => {
        getData()
        setDataSeragamInput({} as IDataSeragamnModal)
        setConfirmLoading(false)
      })
      .then((response: any) => {
        setOpen(false)
        message.success('Sukses Edit Seragam')
      })
      .catch((error: any) => {
        message.error(error.message)
        setOpen(false)
      })
  }

  const handleCancel = () => {
    setDataSeragamInput({} as IDataSeragamnModal)
    setOpen(false)
  }

  return (
    <Modal
      title="Edit Seragam"
      open={open}
      onOk={handleOk}
      okButtonProps={{ className: 'bg-blue-500' }}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}>
      <Spin spinning={loading}>
        <div className="my-8">
          <div className="my-4 flex items-center">
            <div className="w-[25%]">Nama Seragam:</div>
            <div>
              <Input
                placeholder="Seragam RPL (L)"
                name="nama"
                value={dataSeragamInput.nama}
                prefix={<RiShirtLine />}
                onChange={e => handleChange(e)}
                className="ml-2 w-60"
                required
              />
            </div>
          </div>
          <div className="my-4 flex items-center">
            <div className="w-[25%]">Harga:</div>
            <div>
              <Input
                placeholder="Harga"
                name="harga"
                value={dataSeragamInput.harga}
                prefix={<RiShirtLine />}
                onChange={e => handleChange(e)}
                className="ml-2 w-60"
                required
              />
            </div>
          </div>
        </div>
      </Spin>
    </Modal>
  )
}
