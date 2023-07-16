/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import {
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Modal,
  Spin,
  message,
  Select,
  Space,
  Button,
  Popconfirm,
} from 'antd'
import { dataSiswaUpdate, tambahSiswa } from '@/helper/apiHelper/dataSiswa'
import {
  pembayaranSppGenerate,
  dataPembayaranSppNaikKelas,
} from '@/helper/apiHelper/pembayaranSpp'
import { getDataKelas } from '@/helper/apiHelper/kelas'
import { ISelect } from '@/interface/ui/component/dropdown'
import { IDataSiswaModal } from '@/interface/ui/state/dataSiswaModal'
import { ModalTambahSiswaProps } from '@/interface/ui/props/ModalTambahSiswa'
import { UserOutlined, IdcardOutlined } from '@ant-design/icons'
import { BiMapAlt } from 'react-icons/bi'
import { FaSchool } from 'react-icons/fa'
import { getUserInfoWithNullCheck } from '@/helper/util/userInfo'
import dayjs from 'dayjs'

export function ModalTambahSiswa({
  action,
  open,
  setOpen,
  getData,
  setDataSiswaInput,
  dataSiswaInput,
  initialClassId,
}: ModalTambahSiswaProps) {
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [dataKelas, setDataKelas] = useState<ISelect[]>([] as ISelect[])
  const [loading, setLoading] = useState<boolean>(false)
  const [namaError, setNamaError] = useState('')
  // const [nimError, setNimError] = useState('')
  const [asalSekolahError, setAsalSekolahError] = useState('')
  const [alamatError, setAlamatError] = useState('')
  const [tanggalLahirError, setTanggalLahirError] = useState<
    string | undefined
  >(undefined)
  const [agamaError, setAgamaError] = useState<string | undefined>(undefined)
  const [jenisKelaminError, setJenisKelaminError] = useState<
    string | undefined
  >(undefined)
  const [tanggalMasukError, setTanggalMasukError] = useState<
    string | undefined
  >(undefined)
  const [kelasError, setKelasError] = useState<string | undefined>(undefined)
  const [naikKelasError, setNaikKelasError] = useState<string | undefined>(
    undefined,
  )
  const [userData, setUserData] = useState<any>()

  const handleChange = (e: { target: { name: string; value: any } }) => {

    setDataSiswaInput((prevState: any) => ({
      ...prevState,
      [e.target.name]: e.target.value,
      updatedBy: userData.id,
    }))

    // Perform validation for the input field
    switch (e.target.name) {
      case 'nama':
        setNamaError(e.target.value.trim() === '' ? 'Required' : '')
        break
      // case 'nim':
      //   setNimError(e.target.value.trim() === '' ? 'Required' : '')
      //   break
      case 'asalSekolah':
        setAsalSekolahError(e.target.value.trim() === '' ? 'Required' : '')
        break
      case 'alamat':
        setAlamatError(e.target.value.trim() === '' ? 'Required' : '')
        break
      default:
        break
    }
  }

  const getKelasData = () => {
    setLoading(true)
    getDataKelas()
      .then(response => {
        // console.log('KELAS RESPONSE', response)
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
        // console.log('DATA KELAS', arrayTemp)
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

  const getUserData = async () => {
    const user = await getUserInfoWithNullCheck()
    setUserData(user)
  }

  useEffect(() => {
    getKelasData()
    getUserData()
  }, [])

  const handleOk = () => {
    // if (action === 'tambah') {
    //   console.log('dataSiswaInput TAMBAH', dataSiswaInput)
    // } else if (action === 'edit') {
    //   console.log('dataSiswaInput UPDATE', dataSiswaInput)
    // }

    // console.log('NAME VALUE TYPE', typeof dataSiswaInput.nama)

    if (
      dataSiswaInput?.nama === '' ||
      dataSiswaInput?.nama === undefined ||
      dataSiswaInput?.asalSekolah === '' ||
      dataSiswaInput?.asalSekolah === undefined ||
      dataSiswaInput?.alamat === '' ||
      dataSiswaInput?.alamat === undefined ||
      dataSiswaInput?.tanggalLahir === undefined ||
      dataSiswaInput?.agama === undefined ||
      dataSiswaInput?.jenisKelamin === undefined ||
      dataSiswaInput?.tanggalMasuk === undefined ||
      dataSiswaInput?.kelasId === undefined

      // Add additional checks for other required fields
    ) {
      // Set the corresponding error state variables for the empty fields
      setNamaError(
        dataSiswaInput?.nama === '' || dataSiswaInput?.nama === undefined
          ? 'Required'
          : '',
      )
      // setNimError(
      //   dataSiswaInput?.nim?.trim() === '' || dataSiswaInput?.nim === undefined
      //     ? 'Required'
      //     : '',
      // )
      setAsalSekolahError(
        dataSiswaInput?.asalSekolah?.trim() === '' ||
          dataSiswaInput?.asalSekolah === undefined
          ? 'Required'
          : '',
      )
      setAlamatError(
        dataSiswaInput?.alamat?.trim() === '' ||
          dataSiswaInput?.alamat === undefined
          ? 'Required'
          : '',
      )
      setTanggalLahirError(
        dataSiswaInput?.tanggalLahir === undefined ? 'Required' : '',
      )
      setAgamaError(dataSiswaInput?.agama === undefined ? 'Required' : '')
      setJenisKelaminError(
        dataSiswaInput?.jenisKelamin === undefined ? 'Required' : '',
      )
      setTanggalMasukError(
        dataSiswaInput?.tanggalMasuk === undefined ? 'Required' : '',
      )
      setKelasError(dataSiswaInput?.kelasId === undefined ? 'Required' : '')

      // Return early without submitting the form
      return
    }

    // console.log('UNTUK KE API', dataSiswaInput)
    // console.log('INITIAL CLASS ID', initialClassId)
    // console.log('CURRENT CLASS ID', dataSiswaInput.kelasId)
    if (action === 'edit') {
      if (initialClassId !== dataSiswaInput.kelasId) {
        setNaikKelasError('<- Gunakan Tombol Naik Kelas')
        return
      }
    }

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

          // console.log('RESPONSE DATA', response)

          const generatedSiswaId = response.data.tambahSiswaData.id
          const updatedByUserId = response.data.tambahSiswaData.updatedBy

          pembayaranSppGenerate(generatedSiswaId, updatedByUserId)
            .then((response: any) => {
              // console.log('pembayaranSppGenerate', response)
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
      // console.log('UNTUK EDIT', dataSiswaInput)
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
    setNamaError('')
    // setNimError('')
    setAlamatError('')
    setAsalSekolahError('')
    setTanggalLahirError(undefined)
    setAgamaError(undefined)
    setJenisKelaminError(undefined)
    setTanggalMasukError(undefined)
    setKelasError(undefined)
    setNaikKelasError(undefined)
    setOpen(false)
  }

  const handleKelamin = (value: number) => {
    setJenisKelaminError('')

    setDataSiswaInput(prevState => ({
      ...prevState,
      jenisKelamin: value,
      updatedBy: userData.id,
    }))
  }

  const handleAgama = (value: number) => {
    setAgamaError('')

    setDataSiswaInput((prevState: any) => ({
      ...prevState,
      agama: value,
      updatedBy: userData.id,
    }))
  }

  const onChangeTanggalLahir: DatePickerProps['onChange'] = (
    date,
    dateString,
  ) => {
    setTanggalLahirError('')

    const formattedDate = date?.toISOString()
    setDataSiswaInput((prevState: any) => ({
      ...prevState,
      tanggalLahir: formattedDate,
      updatedBy: userData.id,
    }))
  }

  const onChangeTanggalMasuk: DatePickerProps['onChange'] = (
    date,
    dateString,
  ) => {
    setTanggalMasukError('')

    const formattedDate = date?.toISOString()
    setDataSiswaInput(prevState => ({
      ...prevState,
      tanggalMasuk: formattedDate,
      updatedBy: userData.id,
    }))
  }

  const handleKelas = (value: number) => {
    setKelasError('')
    setNaikKelasError('')

    setDataSiswaInput((prevState: any) => ({
      ...prevState,
      kelasId: value,
      updatedBy: userData.id,
    }))
  }

  const handleNaikKelas = () => {
    if (initialClassId === dataSiswaInput.kelasId) {
      setNaikKelasError('Kelas Belum Berubah')
      return
    }

    if (
      dataSiswaInput?.nama === '' ||
      dataSiswaInput?.nama === undefined ||
      dataSiswaInput?.asalSekolah === '' ||
      dataSiswaInput?.asalSekolah === undefined ||
      dataSiswaInput?.alamat === '' ||
      dataSiswaInput?.alamat === undefined ||
      dataSiswaInput?.tanggalLahir === undefined ||
      dataSiswaInput?.agama === undefined ||
      dataSiswaInput?.jenisKelamin === undefined ||
      dataSiswaInput?.tanggalMasuk === undefined ||
      dataSiswaInput?.kelasId === undefined

      // Add additional checks for other required fields
    ) {
      // Set the corresponding error state variables for the empty fields
      setNamaError(
        dataSiswaInput?.nama === '' || dataSiswaInput?.nama === undefined
          ? 'Required'
          : '',
      )
      // setNimError(
      //   dataSiswaInput?.nim?.trim() === '' || dataSiswaInput?.nim === undefined
      //     ? 'Required'
      //     : '',
      // )
      setAsalSekolahError(
        dataSiswaInput?.asalSekolah?.trim() === '' ||
          dataSiswaInput?.asalSekolah === undefined
          ? 'Required'
          : '',
      )
      setAlamatError(
        dataSiswaInput?.alamat?.trim() === '' ||
          dataSiswaInput?.alamat === undefined
          ? 'Required'
          : '',
      )
      setTanggalLahirError(
        dataSiswaInput?.tanggalLahir === undefined ? 'Required' : '',
      )
      setAgamaError(dataSiswaInput?.agama === undefined ? 'Required' : '')
      setJenisKelaminError(
        dataSiswaInput?.jenisKelamin === undefined ? 'Required' : '',
      )
      setTanggalMasukError(
        dataSiswaInput?.tanggalMasuk === undefined ? 'Required' : '',
      )
      setKelasError(dataSiswaInput?.kelasId === undefined ? 'Required' : '')

      // Return early without submitting the form
      return
    }

    // console.log('DATA UNTUK UPDATE', dataSiswaInput)
    setConfirmLoading(true)
    dataPembayaranSppNaikKelas(dataSiswaInput)
      .then((response: any) => {
        getData()
        setDataSiswaInput({} as IDataSiswaModal)
        setConfirmLoading(false)
      })
      .then(response => {
        setOpen(false)
        message.success('Sukses Mengganti Kelas')
      })
      .catch((error: any) => {
        message.error(error.message)
        setOpen(false)
      })
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
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={[
        <div key="footerButtons" className="flex justify-between">
          <div className="flex items-center">
            {initialClassId === dataSiswaInput.kelasId ? (
              <Button
                onClick={handleNaikKelas}
                disabled={action === 'tambah'}
                type="primary"
                style={
                  action === 'tambah'
                    ? {}
                    : { backgroundColor: '#1890ff', borderColor: '#1890ff' }
                }>
                Naik Kelas
              </Button>
            ) : (
              <Popconfirm
                title="Yakin Ingin Berganti to Kelas?"
                onConfirm={handleNaikKelas}
                okButtonProps={{
                  style: { backgroundColor: '#1890ff', borderColor: '#1890ff' },
                }}
                okText="Yes"
                cancelText="No">
                <Button
                  type="primary"
                  disabled={action === 'tambah'}
                  style={
                    action === 'tambah'
                      ? {}
                      : { backgroundColor: '#1890ff', borderColor: '#1890ff' }
                  }>
                  Naik Kelas
                </Button>
              </Popconfirm>
            )}
            {naikKelasError && (
              <p style={{ color: 'red' }} className="ml-4">
                {naikKelasError}
              </p>
            )}
          </div>
          <div>
            <Button key="cancelButton" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              key="okButton"
              type="primary"
              onClick={handleOk}
              style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}>
              OK
            </Button>
          </div>
        </div>,
      ]}>
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
                status={namaError ? 'error' : undefined}
                required
              />
            </div>
            {namaError && (
              <p style={{ color: 'red' }} className="ml-4">
                {' '}
                {namaError}
              </p>
            )}
          </div>
          <div className="my-4 flex items-center">
            <div className="w-[25%]">NISN:</div>
            <div>
              <Input
                placeholder="NISN"
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
            <div className="w-[25%]">Asal Sekolah:</div>
            <div>
              <Input
                placeholder="Asal Sekolah"
                name="asalSekolah"
                disabled={action === 'detail' ? true : false}
                value={dataSiswaInput.asalSekolah}
                prefix={<FaSchool />}
                onChange={e => handleChange(e)}
                className="ml-2 w-60"
                status={asalSekolahError ? 'error' : undefined}
                required
              />
            </div>
            {asalSekolahError && (
              <p style={{ color: 'red' }} className="ml-4">
                {' '}
                {asalSekolahError}
              </p>
            )}
          </div>
          <div className="my-4 flex items-center">
            <div className="w-[25%]">Tanggal Lahir:</div>
            <div>
              <DatePicker
                onChange={onChangeTanggalLahir}
                name="tanggal_lahir"
                className="ml-2 w-60"
                allowClear={false}
                status={tanggalLahirError ? 'error' : undefined}
                value={
                  dataSiswaInput?.tanggalLahir
                    ? dayjs(dataSiswaInput.tanggalLahir)
                    : null
                }
              />
            </div>
            {tanggalLahirError && (
              <p style={{ color: 'red' }} className="ml-4">
                {' '}
                {tanggalLahirError}
              </p>
            )}
          </div>
          <div className="my-4 flex items-center">
            <div className="w-[25%]">Alamat:</div>
            <div>
              <Input.TextArea
                placeholder="Alamat"
                name="alamat"
                disabled={action === 'detail' ? true : false}
                value={dataSiswaInput.alamat}
                onChange={e => handleChange(e)}
                className="ml-2 w-60"
                status={alamatError ? 'error' : undefined}
                required
              />
            </div>
            {alamatError && (
              <p style={{ color: 'red' }} className="ml-4">
                {' '}
                {alamatError}
              </p>
            )}
          </div>
          <div className="my-4 flex items-center">
            <div className="w-[25%]">Agama:</div>
            <div>
              <Select
                showSearch
                placeholder="Pilih Agama"
                status={agamaError ? 'error' : undefined}
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
            {agamaError && (
              <p style={{ color: 'red' }} className="ml-4">
                {' '}
                {agamaError}
              </p>
            )}
          </div>
          <div className="my-4 flex items-center">
            <div className="w-[25%]">Jenis Kelamin:</div>
            <div>
              <Select
                showSearch
                placeholder="Pilih Jenis Kelamin"
                status={jenisKelaminError ? 'error' : undefined}
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
            {jenisKelaminError && (
              <p style={{ color: 'red' }} className="ml-4">
                {' '}
                {jenisKelaminError}
              </p>
            )}
          </div>
          <div className="my-4 flex items-center">
            <div className="w-[25%]">Tanggal Masuk:</div>
            <div>
              <DatePicker
                onChange={onChangeTanggalMasuk}
                name="tanggal_masuk"
                className="ml-2 w-60"
                allowClear={false}
                status={tanggalMasukError ? 'error' : undefined}
                value={
                  dataSiswaInput?.tanggalMasuk
                    ? dayjs(dataSiswaInput.tanggalMasuk)
                    : null
                }
              />
            </div>
            {tanggalMasukError && (
              <p style={{ color: 'red' }} className="ml-4">
                {' '}
                {tanggalMasukError}
              </p>
            )}
          </div>
          <div className="my-4 flex items-center">
            <div className="w-[25%]">Kelas:</div>
            <div className='w-[75%]'>
              <Select
                showSearch
                placeholder="Pilih Kelas"
                status={kelasError ? 'error' : undefined}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onChange={handleKelas}
                options={dataKelas}
                className="ml-2 w-[100%]"
                value={dataSiswaInput.kelasId}
              />
            </div>
            {kelasError && (
              <p style={{ color: 'red' }} className="ml-4">
                {' '}
                {kelasError}
              </p>
            )}
          </div>
        </div>
      </Spin>
    </Modal>
  )
}
