/* eslint-disable react-hooks/exhaustive-deps */
import { Input, Modal, Spin, message } from 'antd'
import { useEffect, useState } from 'react'
import { IDataSeragamnModal } from '@/interface/ui/state/dataSeragamModal'
import { ModalTambahSeragamBaruProps } from '@/interface/ui/props/ModalTambahSeragamBaru'
import { dataSeragamUpdate } from '@/helper/apiHelper/seragam'
import { RiShirtLine } from 'react-icons/ri'
import { getUserInfoWithNullCheck } from '@/helper/util/userInfo'
import { addDecimalPoints } from '@/helper/util/number'

export function ModalTambahSeragamBaru({
  open,
  setOpen,
  getData,
  setDataSeragamInput,
  dataSeragamInput,
}: ModalTambahSeragamBaruProps) {
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [namaSeragam, setNamaSeragam] = useState('')
  const [harga, setHarga] = useState<number | undefined>(0)
  const [hargaParsed, setHargaParsed] = useState('')
  const [namaSeragamError, setNamaSeragamError] = useState('')
  const [hargaSeragamError, setHargaSeragamError] = useState('')
  const [userData, setUserData] = useState<any>()

  const getUserData = async () => {
    const user = await getUserInfoWithNullCheck()
    setUserData(user)
  }

  useEffect(() => {
    getUserData()
    setNamaSeragam(dataSeragamInput.nama)
    setHarga(dataSeragamInput.harga)
    setHargaParsed(addDecimalPoints(dataSeragamInput?.harga?.toString()))
  }, [])

  const handleSeragamInput = (e: any) => {
    // console.log('VALUE E', e.target.value)
    setNamaSeragam(e.target.value)
    setNamaSeragamError(e.target.value.trim() === '' ? 'Required' : '')
  }

  const handleHargaInput = (e: any) => {
    setHargaParsed(addDecimalPoints(e.target.value))
    const hargaWithoutDots = e.target.value.replace(/\./g, '')
    setHarga(hargaWithoutDots)
    setHargaSeragamError(
      Number(e.target.value.replace('.', '')) === 0 ||
        Number(e.target.value.replace('.', '')) === undefined
        ? 'Required'
        : '',
    )
  }

  const handleOk = () => {
    if (
      namaSeragam === '' ||
      namaSeragam === undefined ||
      harga === 0 ||
      harga === undefined
    ) {
      setNamaSeragamError(
        namaSeragam === '' || namaSeragam === undefined ? 'Required' : '',
      )
      setHargaSeragamError(harga === 0 || harga === undefined ? 'Required' : '')
      return
    }

    const editSeragam: IDataSeragamnModal = {
      id: dataSeragamInput.id,
      nama: namaSeragam,
      harga: Number(harga),
      updatedBy: userData.id,
    }
    // console.log('DATA KE API', editSeragam)

    setConfirmLoading(true)
    dataSeragamUpdate(editSeragam)
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
                value={namaSeragam}
                prefix={<RiShirtLine />}
                onChange={e => handleSeragamInput(e)}
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
          <div className="my-4 flex items-center">
            <div className="w-[25%]">Harga:</div>
            <div>
              <Input
                placeholder="Harga"
                name="harga"
                value={hargaParsed}
                prefix={<RiShirtLine />}
                onChange={e => handleHargaInput(e)}
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
          </div>
        </div>
      </Spin>
    </Modal>
  )
}
