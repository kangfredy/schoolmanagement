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
  const [seragamId, setSeragamId] = useState(0)
  const [seragamHarga, setSeragamHarga] = useState(0)
  const [userId, setUserId] = useState(0)
  const [userRole, setUserRole] = useState('')

  const getSelectSeragamData = () => {
    setLoading(true)
    let arrayTemp: any = []
    dataSeragam.map((value: { id: number; nama: string }) => {
      const objectData = {
        value: value.id,
        label: value.nama,
      }
      arrayTemp.push(objectData)
    })
    setDataSelectSeragam(arrayTemp)
    // console.log('setDataSelectSeragam', arrayTemp)
    setLoading(false)
  }

  useEffect(() => {
    getSelectSeragamData()
    const user = getUserInfoWithNullCheck()
    if (user) {
      setUserId(user.id)
      setUserRole(user.role)
      // console.log('USER ID ModalTambahHistorySeragam', user.id)
      // console.log('USER ROLE ModalTambahHistorySeragam', user.role)
    } else {
      console.log('LOCALSTORAGE IS EMPTY')
    }
  }, [])

  const handleOk = () => {
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
    // setDataSeragamInput({} as IDataSeragamnModal)
    setOpen(false)
  }

  const handleSeragamSelect = (value: number) => {
    // console.log('Selected Option:', value)
    setSeragamId(value)
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
                className="ml-2 w-60"
              />
            </div>
          </div>
        </div>
      </Spin>
    </Modal>
  )
}
