/* eslint-disable react-hooks/exhaustive-deps */
import { Input, Modal, Spin, message } from 'antd'
import { useEffect, useState } from 'react'
import { Select, Space } from 'antd'
import { SiGoogleclassroom } from 'react-icons/si'
import { IDataSeragamnModal } from '@/interface/ui/state/dataSeragamModal'
import { ModalTambahHistorySeragamProps } from '@/interface/ui/props/ModalTambahHistorySeragam'
import { tambahHistoryPembayaranSeragam } from '@/helper/apiHelper/historyPembayaranSeragam'
import { RiShirtLine } from 'react-icons/ri'
import { ISelect } from '@/interface/ui/component/dropdown'
import { IDataHistorySeragamModal } from '@/interface/ui/state/dataHistorySeragamModal'
import { getUserInfoWithNullCheck } from '@/helper/util/userInfo'

export function ModalTambahHistorySeragam({
  open,
  action,
  setOpen,
  getData,
  setDataSeragam,
  dataSeragam,
  setDataInputFilteredSeragam,
  dataInputFilteredSeragam,
  setDataPembayaranSeragamInput,
  dataPembayaranSeragamInput,
  showModal,
  getHistoryPembayaranSeragamByPembayaranSeragamId,
}: ModalTambahHistorySeragamProps) {
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [userId, setUserId] = useState(0)
  const [userRole, setUserRole] = useState('')
  const [jumlahDibayar, setJumlahDibayar] = useState(0)
  const [jumlahDibayarError, setJumlahDibayarError] = useState('')

  const getUserData = async () => {
    const user = await getUserInfoWithNullCheck()
    if (user) {
      setUserId(user.id)
      setUserRole(user.role)
      // console.log('USER ID ModalTambahHistorySeragam', user.id)
      // console.log('USER ROLE ModalTambahHistorySeragam', user.role)
    } else {
      console.log('LOCALSTORAGE IS EMPTY')
    }
  }

  useEffect(() => {
    getUserData()
  }, [dataInputFilteredSeragam])

  const handleOk = () => {
    if (jumlahDibayar === 0 || jumlahDibayar === undefined) {
      setJumlahDibayarError(
        jumlahDibayar === 0 || jumlahDibayar === undefined ? 'Required' : '',
      )

      return
    }

    const pembayaranSeragamId = dataPembayaranSeragamInput.id

    const currentDate = new Date().toISOString()

    const newHistorySeragam: IDataHistorySeragamModal = {
      pembayaranSeragamId: Number(pembayaranSeragamId),
      tanggalPembayaran: currentDate,
      jumlahDiBayar: Number(jumlahDibayar),
      updatedBy: userId,
    }

    // console.log('newHistorySeragam', newHistorySeragam)

    setConfirmLoading(true)
    tambahHistoryPembayaranSeragam(
      newHistorySeragam,
      dataPembayaranSeragamInput.siswaId,
      dataPembayaranSeragamInput.tunggakan,
      dataPembayaranSeragamInput.totalBayar,
    )
      .then((response: any) => {
        let dataInput = {
          id: response.data.updatePembayaranSeragam.id,
          siswaId: response.data.updatePembayaranSeragam.siswaId,
          tunggakan: response.data.updatePembayaranSeragam.tunggakan,
          totalBayar: response.data.updatePembayaranSeragam.totalBayar,
          siswa: dataPembayaranSeragamInput.siswa,
          kelas: dataPembayaranSeragamInput.siswa.kelas,
          jurusan: dataPembayaranSeragamInput.siswa?.kelas.jurusan,
          updatedAt: response.data.updatePembayaranSeragam.updatedAt,
          updatedBy: response.data.updatePembayaranSeragam.updatedBy,
          user: dataPembayaranSeragamInput.user,
        }
        showModal(action, dataInput)
        getData()
        // getHistoryPembayaranSeragamByPembayaranSeragamId(
        //   pembayaranSeragamId,
        //   action,
        // )
        setConfirmLoading(false)
      })
      .then((response: any) => {
        setOpen(false)
        message.success('Tambah Data Sukses')
      })
      .catch((error: any) => {
        message.error(error.message)
        setOpen(false)
      })
  }

  const handleCancel = () => {
    setJumlahDibayarError('')
    setOpen(false)
    // console.log('CANCEL CLICKED')
  }

  const handleJumlahDibayar = (e: any) => {
    // console.log('VALUE E', e.target.value)
    setJumlahDibayar(e.target.value)
    setJumlahDibayarError(
      e.target.value.trim() === '' || e.target.value.trim() === 0
        ? 'Required'
        : '',
    )
  }

  return (
    <Modal
      title="Tambah Pembayaran Seragam"
      open={open}
      onOk={handleOk}
      okButtonProps={{ className: 'bg-blue-500' }}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}>
      <Spin spinning={loading}>
        <div className="my-8">
          <div className="my-4 flex items-center">
            <div className="w-[25%]">Jumlah Dibayar:</div>
            <div>
              <Input
                placeholder="Masukkan Jumlah Dibayar"
                name="jumlahDibayar"
                onChange={e => handleJumlahDibayar(e)}
                className="w-60 my-1"
                status={jumlahDibayarError ? 'error' : undefined}
                required
              />
            </div>
            {jumlahDibayarError && (
              <p style={{ color: 'red' }} className="ml-4">
                {' '}
                {jumlahDibayarError}
              </p>
            )}
          </div>
        </div>
      </Spin>
    </Modal>
  )
}
