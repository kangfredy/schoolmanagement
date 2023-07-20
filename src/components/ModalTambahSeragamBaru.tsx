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
  const [namaSeragamError, setNamaSeragamError] = useState('')
  const [userData, setUserData] = useState<any>()

  const getUserData = async () => {
    const user = await getUserInfoWithNullCheck()
    setUserData(user)
  }

  useEffect(() => {
    getUserData()
  }, [])

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target
    setDataSeragamInput((prevState: any) => ({
      ...prevState,
      nama: value,
      updatedBy: userData.id,
    }))

    // Perform validation for the input field
    if (e.target.name === 'nama') {
      setNamaSeragamError(e.target.value.trim() === '' ? 'Required' : '')
    }
  }

  const handleOk = () => {
    if (
      dataSeragamInput?.nama === '' ||
      dataSeragamInput?.nama === undefined

      // Add additional checks for other required fields
    ) {
      // Set the corresponding error state variables for the empty fields
      setNamaSeragamError(
        dataSeragamInput?.nama === '' || dataSeragamInput?.nama === undefined
          ? 'Required'
          : '',
      )

      // Return early without submitting the form
      return
    }

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
    setNamaSeragamError('')
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
                status={namaSeragamError ? 'error' : undefined}
                required
              />
            </div>
            {namaSeragamError && (
              <p style={{ color: 'red' }} className="ml-4">
                {' '}
                {namaSeragamError}
              </p>
            )}
          </div>
          {/* <div className="my-4 flex items-center">
            <div className="w-[25%]">Harga:</div>
            <div>
              <Input
                placeholder="Harga"
                name="harga"
                value={
                  dataSeragamInput.harga !== 0 ? dataSeragamInput.harga : ''
                }
                prefix={<RiShirtLine />}
                onChange={e => handleChange(e)}
                className="ml-2 w-60"
                status={hargaSeragamError ? 'error' : undefined}
                required
              />
            </div>
            {hargaSeragamError && (
              <p style={{ color: 'red' }} className="ml-4">
                {' '}
                {hargaSeragamError}
              </p>
            )}
          </div> */}
        </div>
      </Spin>
    </Modal>
  )
}
