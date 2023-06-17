import { Input, Modal, Spin, message } from 'antd'
import { useEffect, useState } from 'react'
import { Select, Space } from 'antd'
import { dataJurusanUpdate, tambahJurusan } from '@/helper/apiHelper/jurusan'
import { SiGoogleclassroom } from 'react-icons/si'
import { getJurusan } from '@/helper/apiHelper/jurusan'
import { ISelect } from '@/interface/ui/component/dropdown'
import { IDataJurusanModal } from '@/interface/ui/state/dataJurusanModal'
import { ModalTambahJurusanProps } from '@/interface/ui/props/ModalTambahJurusan'
import { MdWarehouse } from 'react-icons/md'
import { getUserInfoWithNullCheck } from '@/helper/util/userInfo'

export function ModalTambahJurusan({
  action,
  open,
  setOpen,
  getData,
  setDataJurusanInput,
  dataJurusanInput,
}: ModalTambahJurusanProps) {
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [jurusanError, setJurusanError] = useState('')

  const handleChange = (e: { target: { name: string; value: any } }) => {
    const user = getUserInfoWithNullCheck()
    const updatedBy = user ? user.id : 0

    setDataJurusanInput((prevState: any) => ({
      ...prevState,
      [e.target.name]: e.target.value,
      updatedBy: updatedBy,
    }))

    setJurusanError(e.target.value.trim() === '' ? 'Required' : '')
  }

  useEffect(() => {}, [])

  const handleOk = () => {
    // if (action === 'tambah') {
    //   console.log('dataJurusanInput TAMBAH', dataJurusanInput)
    // } else if (action === 'edit') {
    //   console.log('dataJurusanInput UPDATE', dataJurusanInput)
    // }

    if (
      dataJurusanInput?.namaJurusan === '' ||
      dataJurusanInput?.namaJurusan === undefined
    ) {
      setJurusanError(
        dataJurusanInput?.namaJurusan === '' ||
          dataJurusanInput?.namaJurusan === undefined
          ? 'Required'
          : '',
      )
      return
    }

    setConfirmLoading(true)
    if (action === 'tambah') {
      tambahJurusan(dataJurusanInput)
        .then((response: any) => {
          getData()
          setDataJurusanInput({} as IDataJurusanModal)
          setConfirmLoading(false)
        })
        .then((response: any) => {
          setOpen(false)
          message.success('Sukses Tambah Jurusan')
        })
        .catch((error: any) => {
          message.error(error.message)
          setOpen(false)
        })
    } else if (action === 'edit') {
      dataJurusanUpdate(dataJurusanInput)
        .then((response: any) => {
          getData()
          setDataJurusanInput({} as IDataJurusanModal)
          setConfirmLoading(false)
        })
        .then((response: any) => {
          setOpen(false)
          message.success('Sukses Edit Jurusan')
        })
        .catch((error: any) => {
          message.error(error.message)
          setOpen(false)
        })
    } else {
      setConfirmLoading(false)
      setOpen(false)
    }
  }

  const handleCancel = () => {
    setDataJurusanInput({} as IDataJurusanModal)
    setJurusanError('')
    setOpen(false)
  }

  return (
    <Modal
      title={
        action === 'detail'
          ? 'Detail Jurusan'
          : action === 'edit'
          ? 'Edit Jurusan'
          : 'Tambah Jurusan'
      }
      open={open}
      onOk={handleOk}
      okButtonProps={{ className: 'bg-blue-500' }}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}>
      <Spin spinning={loading}>
        <div className="my-8">
          <div className="my-4 flex items-center">
            <div className="w-[25%]">Nama Jurusan:</div>
            <div>
              <Input
                placeholder="Nama Jurusan"
                name="namaJurusan"
                disabled={action === 'detail' ? true : false}
                value={dataJurusanInput.namaJurusan}
                prefix={<MdWarehouse />}
                onChange={e => handleChange(e)}
                className="ml-2 w-60"
                status={jurusanError ? 'error' : undefined}
                required
              />
            </div>
            {jurusanError && (
              <p style={{ color: 'red' }} className="ml-4">
                {' '}
                {jurusanError}
              </p>
            )}
          </div>
        </div>
      </Spin>
    </Modal>
  )
}
