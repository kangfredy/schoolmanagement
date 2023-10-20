/* eslint-disable react-hooks/exhaustive-deps */
import { Input, Modal, Spin, message } from 'antd'
import { useEffect, useState } from 'react'
import { Select, Space } from 'antd'
import { SiGoogleclassroom } from 'react-icons/si'
import { IHistorySeragam } from '@/interface/ui/state/dataHistorySeragamTable'
import { ModalEditHistorySeragamProps } from '@/interface/ui/props/ModalEditHistorySeragam'
import { dataHistoryPembayaranSeragamUpdate } from '@/helper/apiHelper/historyPembayaranSeragam'
import { RiShirtLine } from 'react-icons/ri'
import { ISelect } from '@/interface/ui/component/dropdown'
import { IDataHistorySeragamModal } from '@/interface/ui/state/dataHistorySeragamModal'
import { getUserInfoWithNullCheck } from '@/helper/util/userInfo'
import { addDecimalPoints } from '@/helper/util/number'

export function ModalEditHistorySeragam({
  open,
  action,
  setOpen,
  getData,
  setDataRowHistorySeragam,
  dataRowHistorySeragam,
  setDataPembayaranSeragamInput,
  dataPembayaranSeragamInput,
  showModal,
}: ModalEditHistorySeragamProps) {
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [userId, setUserId] = useState(0)
  const [userRole, setUserRole] = useState('')
  const [jumlahDibayar, setJumlahDibayar] = useState<number | undefined>(0)
  const [jumlahDibayarParsed, setJumlahDibayarParsed] = useState('')
  const [jumlahDibayarError, setJumlahDibayarError] = useState('')
  const [jumlahDiBayarAwal, setJumlahDiBayarAwal] = useState<number>(0)

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
    setJumlahDibayarParsed(
      addDecimalPoints(dataRowHistorySeragam?.jumlahDiBayar?.toString()),
    )
    setJumlahDibayar(dataRowHistorySeragam.jumlahDiBayar)
    setJumlahDiBayarAwal(dataRowHistorySeragam.jumlahDiBayar)
  }, [])

  const handleOk = () => {
    if (jumlahDibayar === 0 || jumlahDibayar === undefined) {
      setJumlahDibayarError(
        jumlahDibayar === 0 || jumlahDibayar === undefined ? 'Required' : '',
      )
      return
    }

    const currentData: IHistorySeragam = dataRowHistorySeragam
    currentData.updatedBy = userId
    currentData.jumlahDiBayar = jumlahDibayar

    dataHistoryPembayaranSeragamUpdate(
      currentData,
      dataPembayaranSeragamInput.siswaId,
      dataPembayaranSeragamInput.tunggakan,
      dataPembayaranSeragamInput.totalBayar,
      jumlahDiBayarAwal,
    )
      .then((response: any) => {
        // getData()
        // console.log(
        //   'dataHistoryPembayaranSppUpdate',
        //   response.data.updatePembayaranSpp,
        // )

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
        setConfirmLoading(false)
        message.success('Edit Sukses')
      })
      .then(response => {
        // setOpen(false)
        setOpen(false)
      })
      .catch((error: any) => {
        // setOpen(false)
        setOpen(false)
      })
  }

  const handleCancel = () => {
    setDataRowHistorySeragam({} as IHistorySeragam)
    setOpen(false)
    // setJumlahDibayarError('')
    // setJumlahDibayar(undefined)
    // setJumlahDibayarParsed('')
    // setOpen(false)
    // console.log('CANCEL CLICKED')
  }

  const handleJumlahDibayar = (e: any) => {
    console.log('VALUE E', e.target.value)
    setJumlahDibayarParsed(addDecimalPoints(e.target.value))
    setJumlahDibayar(Number(e.target.value.replace('.', '')))
    setJumlahDibayarError(
      Number(e.target.value.replace('.', '')) === 0 ||
        Number(e.target.value.replace('.', '')) === undefined
        ? 'Required'
        : '',
    )
  }

  return (
    <Modal
      title="Edit Pembayaran Seragam"
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
                value={jumlahDibayarParsed ? jumlahDibayarParsed : ''}
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
