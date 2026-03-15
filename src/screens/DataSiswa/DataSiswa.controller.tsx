import { SearchOutlined } from '@ant-design/icons'
import { InputRef, Spin, Popconfirm, message } from 'antd'
import { Button, Input, Space } from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import { useEffect, useRef, useState } from 'react'
import { getDataSiswa, dataSiswaDelete } from '@/helper/apiHelper/dataSiswa'
import { IDataSiswaModal } from '@/interface/ui/state/dataSiswaModal'
import { Isiswa } from '@/interface/ui/state/dataSiswaTable'
import { checkAgama } from '@/helper/util/agama'
import { historyPembayaranSppBySiswaId } from '@/helper/apiHelper/historyPembayaranSpp'
import { historyPembayaranSeragamBySiswaId } from '@/helper/apiHelper/historyPembayaranSeragam'
import { IHistorySpp } from '@/interface/ui/state/dataHistorySppTable'
import { IHistorySeragam } from '@/interface/ui/state/dataHistorySeragamTable'
import { getUserInfoWithNullCheck } from '@/helper/util/userInfo'
import { useUserSession } from '@/hook/useUserSession'
import { convertDateTime } from '@/helper/util/time'

type DataIndex = keyof Isiswa

export function useDataSiswaController() {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)
  const [open, setOpen] = useState(false)
  const [actions, setActions] = useState('')
  const [dataSiswa, setDataSiswa] = useState<Isiswa[]>([])
  const [dataSiswaSelected, setDataSiswaSelected] = useState<Isiswa>(
    {} as Isiswa,
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [dataSiswaInput, setDataSiswaInput] = useState<IDataSiswaModal>(
    {} as IDataSiswaModal,
  )
  const [initialClassId, setInitialClassId] = useState<number | undefined>(
    undefined,
  )
  const [openDetail, setOpenDetail] = useState(false)
  const [dataHistorySpp, setDataHistorySpp] = useState<IHistorySpp[]>([])
  const [dataHistorySeragam, setDataHistorySeragam] = useState<
    IHistorySeragam[]
  >([])
  const { userId, userRole } = useUserSession()

  const getHistoryPembayaranSppBySiswaId = async (siswaId: number) => {
    try {
      const responseSpp = await historyPembayaranSppBySiswaId(siswaId)
      const arrayHistorySppTemp: IHistorySpp[] = []
      responseSpp.data.getHistoryPembayaranSppBySiswaId?.map((datas: any) => {
        const objectHistorySpp: IHistorySpp = {
          id: datas?.id,
          pembayaranSppId: datas?.pembayaranSppId,
          jatuhTempo: datas?.jatuhTempo,
          jumlah: datas?.jumlah,
          sudahDibayar: datas?.sudahDibayar,
          tanggalPembayaran: datas?.tanggalPembayaran,
          pembayaranSpp: datas?.pembayaranSpp,
          updatedAt: datas?.updatedAt,
          updatedBy: datas?.updatedBy,
          user: datas?.user,
        }
        arrayHistorySppTemp.push(objectHistorySpp)
      })
      setDataHistorySpp(arrayHistorySppTemp)

      const responseSeragam = await historyPembayaranSeragamBySiswaId(siswaId)
      const arrayHistorySeragamTemp: IHistorySeragam[] = []
      responseSeragam.data.getHistoryPembayaranSeragamBySiswaId?.map(
        (datas: any) => {
          const objectHistorySeragam: IHistorySeragam = {
            id: datas?.id,
            pembayaranSeragamId: datas?.pembayaranSeragamId,
            jumlahDiBayar: datas?.jumlahDiBayar,
            tanggalPembayaran: datas?.tanggalPembayaran,
            pembayaranSeragam: datas?.pembayaranSeragam,
            updatedAt: datas?.updatedAt,
            updatedBy: datas?.updatedBy,
            user: datas?.user,
          }
          arrayHistorySeragamTemp.push(objectHistorySeragam)
        },
      )
      setDataHistorySeragam(arrayHistorySeragamTemp)
    } catch (error: any) {
      console.error(error.message)
    }
  }

  const showModal = (action: string, data: Isiswa) => {
    if (action == 'detail') {
      getHistoryPembayaranSppBySiswaId(data.id)
      setDataSiswaSelected(data)
      setOpenDetail(true)
    } else {
      const dataInput = {
        id: data?.id,
        nama: data?.nama,
        nim: data?.nim,
        tanggalMasuk: data?.tanggalMasuk,
        tanggalLahir: data?.tanggalLahir,
        alamat: data?.alamat,
        kelasId: data?.kelas?.id,
        jenisKelamin: data?.jenisKelamin,
        agama: data?.agama,
        updatedAt: data?.updatedAt,
        updatedBy: data?.updatedBy,
        user: data?.user,
        asalSekolah: data?.asalSekolah,
      }
      setDataSiswaInput(dataInput)
      setInitialClassId(data?.kelas?.id)
      setActions(action)
      setOpen(true)
    }
  }

  const initiateData = async () => {
    try {
      setLoading(true)
      const response = await getDataSiswa()
      const arrayTemp: Isiswa[] = []
      response.data.dataSiswaData?.map((datas: any) => {
        const object1: Isiswa = {
          id: datas?.id,
          nama: datas?.nama,
          nim: datas?.nim,
          tanggalMasuk: datas?.tanggalMasuk,
          tanggalLahir: datas?.tanggalLahir,
          alamat: datas?.alamat,
          kelas: datas?.kelas,
          jenisKelamin: datas?.jenisKelamin,
          jenisKelaminDisplay:
            datas?.jenisKelamin === 1 ? 'Laki-laki' : 'Perempuan',
          agama: datas?.agama,
          agamaDisplay: checkAgama(datas?.agama),
          updatedAt: datas?.updatedAt,
          updatedBy: datas?.updatedBy,
          user: datas?.user,
          asalSekolah: datas?.asalSekolah,
        }
        arrayTemp.push(object1)
      })
      setDataSiswa(arrayTemp)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    initiateData()
  }, [])

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (
    clearFilters: () => void,
    confirm: (param?: FilterConfirmProps) => void,
  ) => {
    clearFilters()
    setSearchText('')
    confirm()
  }

  const handleConfirmDelete = async (clickedData: any) => {
    try {
      setLoading(true)
      await dataSiswaDelete({ id: clickedData.id, updatedBy: userId })
      message.success('Sukses Delete Siswa')
      await initiateData()
    } catch (error: any) {
      message.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getColumnSearchProps = (dataIndex: any): ColumnType<Isiswa> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Input Search`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
            className="text-black">
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
            size="small"
            style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false })
              setSearchText((selectedKeys as string[])[0])
              setSearchedColumn(dataIndex)
            }}>
            Filter
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      let data = record
      for (const key of dataIndex) {
        data = (data as any)[key]
        if (data === undefined) return false
      }
      return data
        .toString()
        .toLowerCase()
        .includes(value.toString().toLowerCase())
    },
    onFilterDropdownOpenChange: visible => {
      if (visible) setTimeout(() => searchInput.current?.select(), 100)
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <span>
          {text
            ? text
                .toString()
                .split(new RegExp(`(${searchText})`, 'gi'))
                .map((part: string, index: number) =>
                  searchText &&
                  part.toLowerCase() === searchText.toLowerCase() ? (
                    <span key={index} style={{ backgroundColor: '#ffc069', padding: 0 }}>
                      {part}
                    </span>
                  ) : (
                    <span key={index}>{part}</span>
                  )
                )
            : ''}
        </span>
      ) : (
        text
      ),
  })

  let columns: ColumnsType<Isiswa> = [
    {
      title: 'NISN',
      dataIndex: 'nim',
      key: 'nim',
      width: '13%',
      ...getColumnSearchProps(['nim']),
      sorter: (a, b) => a.nim.localeCompare(b.nim),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Nama',
      dataIndex: 'nama',
      key: 'nama',
      width: '25%',
      ...getColumnSearchProps(['nama']),
      sorter: (a, b) => a.nama.localeCompare(b.nama),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Kelas',
      dataIndex: ['kelas', 'namaKelas'],
      key: 'kelas',
      width: '10%',
      ...getColumnSearchProps(['kelas', 'namaKelas']),
      sorter: (a, b) => a.kelas.namaKelas.localeCompare(b.kelas.namaKelas),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Jurusan',
      dataIndex: ['kelas', 'jurusan', 'namaJurusan'],
      key: 'jurusan',
      width: '10%',
      ...getColumnSearchProps(['kelas', 'jurusan', 'namaJurusan']),
      sorter: (a, b) =>
        a.kelas.jurusan.namaJurusan.localeCompare(b.kelas.jurusan.namaJurusan),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Alamat',
      dataIndex: 'alamat',
      key: 'alamat',
      width: '30%',
      ...getColumnSearchProps(['alamat']),
      sorter: (a, b) => a.alamat.localeCompare(b.alamat),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Jenis Kelamin',
      dataIndex: 'jenisKelaminDisplay',
      key: 'jenisKelaminDisplay',
      width: '15%',
      ...getColumnSearchProps(['jenisKelaminDisplay']),
      sorter: (a, b) =>
        a.jenisKelamin.toString().localeCompare(b.jenisKelamin.toString()),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Agama',
      dataIndex: 'agamaDisplay',
      key: 'agamaDisplay',
      width: '15%',
      ...getColumnSearchProps(['agamaDisplay']),
      sorter: (a, b) => a.agama.toString().localeCompare(b.agama.toString()),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Updated By',
      dataIndex: ['user', 'username'],
      key: 'updatedBy',
      width: '20%',
      ...getColumnSearchProps(['user', 'username']),
      sorter: (a, b) => a.user.username.localeCompare(b.user.username),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: '40%',
      ...getColumnSearchProps(['updatedAt']),
      sorter: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
      sortDirections: ['descend', 'ascend'],
      render: updatedAt => convertDateTime(updatedAt),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle" split>
          <Button
            type="default"
            size="middle"
            onClick={() => showModal('detail', record)}
            className="btnDetail">
            Detail
          </Button>
          <Button
            type="primary"
            size="middle"
            className="btnPrimary"
            onClick={() => showModal('edit', record)}>
            Edit Siswa
          </Button>
          {userRole === 'admin' && (
            <Popconfirm
              title="Konfirmasi Delete"
              description="Anda Yakin Ingin Menghapus Data Ini?"
              onConfirm={() => handleConfirmDelete(record)}
              okText="Yes"
              okButtonProps={{ className: 'bg-blue-500', size: 'small' }}
              cancelText="No">
              <Button danger type="primary" size="middle" className="btnPrimary">
                Delete
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  if (userRole !== 'admin') {
    columns = columns.filter(column => column.key !== 'updatedBy')
    columns = columns.filter(column => column.key !== 'updatedAt')
  }

  return {
    loading,
    columns,
    dataSiswa,
    open,
    setOpen,
    actions,
    dataSiswaInput,
    setDataSiswaInput,
    initialClassId,
    showModal,
    initiateData,
    openDetail,
    setOpenDetail,
    dataSiswaSelected,
    dataHistorySpp,
    setDataHistorySpp,
    dataHistorySeragam,
    setDataHistorySeragam,
    getHistoryPembayaranSppBySiswaId,
  }
}
