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
  const [dataSelectSeragam, setDataSelectSeragam] = useState<ISelect[]>(
    [] as ISelect[],
  )
  const [seragamId, setSeragamId] = useState<number | undefined>(undefined)
  const [userId, setUserId] = useState(0)
  const [userRole, setUserRole] = useState('')
  const [seragamError, setSeragamError] = useState('')

  const getUserData = async() => {
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
    setDataSelectSeragam(
      dataInputFilteredSeragam.map(seragam => ({
        value: seragam.id,
        label: seragam.nama,
      })),
    )
    getUserData()
  }, [dataInputFilteredSeragam])

  const handleOk = () => {
    if (seragamId === undefined) {
      setSeragamError(seragamId === undefined ? 'Required' : '')

      return
    }

    const pembayaranSeragamId = dataPembayaranSeragamInput.id

    const newHistorySeragam: IDataHistorySeragamModal = {
      pembayaranSeragamId: Number(pembayaranSeragamId),
      seragamId: Number(seragamId),
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
        setSeragamId(undefined)
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
    setSeragamId(undefined)
    setSeragamError('')
    setOpen(false)
    // console.log('CANCEL CLICKED')
  }

  const handleSeragamSelect = (value: number) => {
    // console.log('Selected Option:', value)
    setSeragamId(value)
    setSeragamError(value === 0 || value === undefined ? 'Required' : '')
  }

  return (
    <Modal
      title="Tambah Seragam Ke Table"
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
              <Select
                showSearch
                placeholder="Pilih Seragam"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onChange={handleSeragamSelect}
                options={dataSelectSeragam}
                value={seragamId}
                status={seragamError ? 'error' : undefined}
                className="ml-2 w-60"
              />
            </div>
            {seragamError && (
              <p style={{ color: 'red' }} className="ml-4">
                {' '}
                {seragamError}
              </p>
            )}
          </div>
        </div>
      </Spin>
    </Modal>
  )
}
