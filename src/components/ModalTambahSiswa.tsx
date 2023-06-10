import { useEffect, useState } from 'react'
import {
  DatePicker,
  DatePickerProps,
  Input,
  Modal,
  Spin,
  message,
  Select,
  Space,
} from 'antd'
import { dataSiswaUpdate, tambahSiswa } from '@/helper/apiHelper/dataSiswa'
import { pembayaranSppGenerate } from '@/helper/apiHelper/pembayaranSpp'
import { getDataKelas } from '@/helper/apiHelper/kelas'
import { ISelect } from '@/interface/ui/component/dropdown'
import { IDataSiswaModal } from '@/interface/ui/state/dataSiswaModal'
import { ModalTambahSiswaProps } from '@/interface/ui/props/ModalTambahSiswa'
import { UserOutlined, IdcardOutlined } from '@ant-design/icons'
import { BiMapAlt } from 'react-icons/bi'

export function ModalTambahSiswa({
  action,
  open,
  setOpen,
  getData,
  setDataSiswaInput,
  dataSiswaInput,
}: ModalTambahSiswaProps) {
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [dataKelas, setDataKelas] = useState<ISelect[]>([] as ISelect[])
  const [loading, setLoading] = useState<boolean>(false)

  const handleChange = (e: { target: { name: string; value: any } }) =>
    setDataSiswaInput(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))

  const getKelasData = () => {
    setLoading(true)
    getDataKelas()
      .then(response => {
        console.log('KELAS RESPONSE', response)
        let arrayTemp: any = []
        response.data.getKelas.map(
          (value: { id: number; namaKelas: string }) => {
            const objectData = {
              value: value.id,
              label: value.namaKelas,
            }
            arrayTemp.push(objectData)
          },
        )
        console.log('DATA KELAS', arrayTemp)
        setDataKelas(arrayTemp)
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
    getKelasData()
  }, [])

  const handleOk = () => {
    setConfirmLoading(true)
    if (action === 'tambah') {
      // console.log('UNTUK TAMBAH', dataSiswaInput)
      tambahSiswa(dataSiswaInput)
        .then((response: any) => {
          getData()
          setDataSiswaInput({} as IDataSiswaModal)
          setConfirmLoading(false)
          return response
        })
        .then(response => {
          setOpen(false)
          message.success('Sukses Tambah Siswa')

          console.log('RESPONSE DATA', response)

          const generatedSiswaId = response.data.tambahSiswaData.id

          pembayaranSppGenerate(generatedSiswaId)
            .then((response: any) => {
              console.log('pembayaranSppGenerate', response)
            })
            .catch((error: any) => {
              message.error(error.message)
            })
        })
        .catch((error: any) => {
          message.error(error.message)
          setOpen(false)
        })
    } else if (action === 'edit') {
      console.log('UNTUK EDIT', dataSiswaInput)
      dataSiswaUpdate(dataSiswaInput)
        .then((response: any) => {
          getData()
          setDataSiswaInput({} as IDataSiswaModal)
          setConfirmLoading(false)
        })
        .then(response => {
          setOpen(false)
          message.success('Sukses Edit Siswa')
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
    setDataSiswaInput({} as IDataSiswaModal)
    setOpen(false)
  }

  const handleKelamin = (value: number) => {
    setDataSiswaInput(prevState => ({
      ...prevState,
      ['jenisKelamin']: value,
    }))
  }

  const handleAgama = (value: number) => {
    setDataSiswaInput(prevState => ({
      ...prevState,
      ['agama']: value,
    }))
  }

  const onChangeTanggalLahir: DatePickerProps['onChange'] = (
    date,
    dateString,
  ) => {
    const formattedDate = date?.toISOString()
    setDataSiswaInput(prevState => ({
      ...prevState,
      ['tanggalLahir']: formattedDate,
    }))
  }
  const onChangeTanggalMasuk: DatePickerProps['onChange'] = (
    date,
    dateString,
  ) => {
    const formattedDate = date?.toISOString()
    setDataSiswaInput(prevState => ({
      ...prevState,
      ['tanggalMasuk']: formattedDate,
    }))
  }

  const handleKelas = (value: number) => {
    setDataSiswaInput({ ...dataSiswaInput, kelasId: value })
  }

  return (
    <Modal
      title={
        action === 'detail'
          ? 'Detail Siswa'
          : action === 'edit'
          ? 'Edit Siswa'
          : 'Tambah Siswa'
      }
      open={open}
      onOk={handleOk}
      okButtonProps={{ className: 'bg-blue-500' }}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}>
      <Spin spinning={loading}>
        <div className="my-8">
          <div className="my-4 flex items-center">
            <div className="w-[25%]">Nama Siswa:</div>
            <div>
              <Input
                placeholder="Nama Siswa"
                name="nama"
                disabled={action === 'detail' ? true : false}
                value={dataSiswaInput.nama}
                prefix={<UserOutlined />}
                onChange={e => handleChange(e)}
                className="ml-2 w-60"
                required
              />
            </div>
          </div>
          <div className="my-4 flex items-center">
            <div className="w-[25%]">NIM:</div>
            <div>
              <Input
                placeholder="NIM"
                name="nim"
                disabled={action === 'detail' ? true : false}
                value={dataSiswaInput.nim}
                prefix={<IdcardOutlined />}
                onChange={e => handleChange(e)}
                className="ml-2 w-60"
                required
              />
            </div>
          </div>
          <div className="my-4 flex items-center">
            <div className="w-[25%]">Tanggal Lahir:</div>
            <div>
              <DatePicker
                onChange={onChangeTanggalLahir}
                name="tanggal_lahir"
                className="ml-2 w-60"
              />
            </div>
          </div>
          <div className="my-4 flex items-center">
            <div className="w-[25%]">Alamat:</div>
            <div>
              <Input
                placeholder="Alamat"
                name="alamat"
                disabled={action === 'detail' ? true : false}
                value={dataSiswaInput.alamat}
                prefix={<BiMapAlt />}
                onChange={e => handleChange(e)}
                className="ml-2 w-60"
                required
              />
            </div>
          </div>
          <div className="my-4 flex items-center">
            <div className="w-[25%]">Agama:</div>
            <div>
              <Select
                showSearch
                placeholder="Pilih Agama"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onChange={handleAgama}
                options={[
                  {
                    value: 1,
                    label: 'Islam',
                  },
                  {
                    value: 2,
                    label: 'Kristen',
                  },
                  {
                    value: 3,
                    label: 'Katolik',
                  },
                  {
                    value: 4,
                    label: 'Hindu',
                  },
                  {
                    value: 5,
                    label: 'Budha',
                  },
                  {
                    value: 6,
                    label: 'Konghucu',
                  },
                ]}
                className="ml-2 w-60"
                value={dataSiswaInput.agama}
              />
            </div>
          </div>
          <div className="my-4 flex items-center">
            <div className="w-[25%]">Jenis Kelamin:</div>
            <div>
              <Select
                showSearch
                placeholder="Pilih Jenis Kelamin"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onChange={handleKelamin}
                options={[
                  {
                    value: 1,
                    label: 'Laki-laki',
                  },
                  {
                    value: 2,
                    label: 'Perempuan',
                  },
                ]}
                className="ml-2 w-60"
                value={dataSiswaInput.jenisKelamin}
              />
            </div>
          </div>

          <div className="my-4 flex items-center">
            <div className="w-[25%]">Tanggal Masuk:</div>
            <div>
              <DatePicker
                onChange={onChangeTanggalMasuk}
                name="tanggal_masuk"
                className="ml-2 w-60"
              />
            </div>
          </div>
          <div className="my-4 flex items-center">
            <div className="w-[25%]">Kelas:</div>
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
                onChange={handleKelas}
                options={dataKelas}
                className="ml-2 w-60"
                value={dataSiswaInput.kelasId}
              />
            </div>
          </div>
        </div>
      </Spin>
    </Modal>
  )
}
