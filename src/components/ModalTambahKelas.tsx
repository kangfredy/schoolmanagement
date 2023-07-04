import { Input, Modal, Spin, message } from 'antd'
import { useEffect, useState } from 'react'
import { Select, Space } from 'antd'
import { dataKelasUpdate, tambahKelas } from '@/helper/apiHelper/kelas'
import { SiGoogleclassroom } from 'react-icons/si'
import { getJurusan } from '@/helper/apiHelper/jurusan'
import { ISelect } from '@/interface/ui/component/dropdown'
import { IDataKelasModal } from '@/interface/ui/state/dataKelasModal'
import { ModalTambahKelasProps } from '@/interface/ui/props/ModalTambahKelas'
import { getUserInfoWithNullCheck } from '@/helper/util/userInfo'

export function ModalTambahKelas({
  action,
  open,
  setOpen,
  getData,
  setDataKelasInput,
  dataKelasInput,
}: ModalTambahKelasProps) {
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [dataJurusan, setDataJurusan] = useState<ISelect[]>([] as ISelect[])
  const [loading, setLoading] = useState<boolean>(false)
  const [kelasError, setKelasError] = useState('')
  const [jurusanError, setJurusanError] = useState<string | undefined>(
    undefined,
  )

  const handleChange = (e: { target: { name: string; value: any } }) => {
    const user = getUserInfoWithNullCheck()
    const updatedBy = user ? user.id : 0

    setDataKelasInput((prevState: any) => ({
      ...prevState,
      [e.target.name]: e.target.value,
      updatedBy: updatedBy,
    }))

    setKelasError(e.target.value.trim() === '' ? 'Required' : '')
  }

  const getJurusanData = () => {
    setLoading(true)
    getJurusan()
      .then(response => {
        let arrayTemp: any = []
        response.data.getJurusan.map(
          (value: { id: number; namaJurusan: string }) => {
            const objectData = {
              value: value.id,
              label: value.namaJurusan,
            }
            arrayTemp.push(objectData)
          },
        )
        setDataJurusan(arrayTemp)
      })
      .then(response => {
        setLoading(false)
      })
      .catch(error => {
        console.error(error.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    getJurusanData()
  }, [])

  const handleOk = () => {
    // if (action === 'tambah') {
    //   console.log('dataKelasInput TAMBAH', dataKelasInput)
    // } else if (action === 'edit') {
    //   console.log('dataKelasInput UPDATE', dataKelasInput)
    // }

    if (
      dataKelasInput?.namaKelas === '' ||
      dataKelasInput?.namaKelas === undefined ||
      dataKelasInput?.jurusanId === undefined

      // Add additional checks for other required fields
    ) {
      // Set the corresponding error state variables for the empty fields
      setKelasError(
        dataKelasInput?.namaKelas === '' ||
          dataKelasInput?.namaKelas === undefined
          ? 'Required'
          : '',
      )
      setJurusanError(dataKelasInput?.jurusanId === undefined ? 'Required' : '')

      // Return early without submitting the form
      return
    }

    setConfirmLoading(true)
    if (action === 'tambah') {
      tambahKelas(dataKelasInput)
        .then((response: any) => {
          getData()
          setDataKelasInput({} as IDataKelasModal)
          setConfirmLoading(false)
        })
        .then(response => {
          setOpen(false)
          message.success('Sukses Tambah Kelas')
        })
        .catch((error: any) => {
          message.error(error.message)
          setOpen(false)
        })
    } else if (action === 'edit') {
      dataKelasUpdate(dataKelasInput)
        .then((response: any) => {
          getData()
          setDataKelasInput({} as IDataKelasModal)
          setConfirmLoading(false)
        })
        .then(response => {
          setOpen(false)
          message.success('Sukses Edit Kelas')
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
    setDataKelasInput({} as IDataKelasModal)
    setKelasError('')
    setJurusanError(undefined)
    setOpen(false)
  }

  const handleJurusan = (value: number) => {
    setJurusanError('')
    const user = getUserInfoWithNullCheck()
    const updatedBy = user ? user.id : 0
    setDataKelasInput((prevState: any) => ({
      ...prevState,
      jurusanId: value,
      updatedBy: updatedBy,
    }))
  }

  return (
    <Modal
      title={
        action === 'detail'
          ? 'Detail Kelas'
          : action === 'edit'
          ? 'Edit Kelas'
          : 'Tambah Kelas'
      }
      open={open}
      onOk={handleOk}
      okButtonProps={{ className: 'bg-blue-500' }}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}>
      <Spin spinning={loading}>
        <div className="my-8">
          <div className="my-4 flex items-center">
            <div className="w-[25%]">Nama Kelas:</div>
            <div>
              <Input
                placeholder="Nama Kelas"
                name="namaKelas"
                disabled={action === 'detail' ? true : false}
                value={dataKelasInput.namaKelas}
                prefix={<SiGoogleclassroom />}
                onChange={e => handleChange(e)}
                className="ml-2 w-60"
                status={kelasError ? 'error' : undefined}
                required
              />
            </div>
            {kelasError && (
              <p style={{ color: 'red' }} className="ml-4">
                {' '}
                {kelasError}
              </p>
            )}
          </div>
          <div className="my-4 flex items-center">
            <div className="w-[25%]">Jurusan:</div>
            <div>
              <Select
                showSearch
                placeholder="Pilih Kelas"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onChange={handleJurusan}
                options={dataJurusan}
                status={jurusanError ? 'error' : undefined}
                className="ml-2 w-60"
                value={dataKelasInput.jurusanId}
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
