import { SearchOutlined } from '@ant-design/icons'
import { InputRef, message, Input, Space, Button } from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import { useEffect, useRef, useState } from 'react'
import {
  getPembayaranSpp,
  dataPembayaranSppReCalculate,
} from '@/helper/apiHelper/pembayaranSpp'
import { getHistoryPembayaranSpp } from '@/helper/apiHelper/historyPembayaranSpp'
import { historyPembayaranSppByPembayaranSppId } from '@/helper/apiHelper/historyPembayaranSpp'
import { ISpp } from '@/interface/ui/state/dataSppTable'
import { IHistorySpp } from '@/interface/ui/state/dataHistorySppTable'
import { ISelect } from '@/interface/ui/component/dropdown'
import { convertMoney } from '@/helper/util/money'
import { getUserInfoWithNullCheck } from '@/helper/util/userInfo'
import { useUserSession } from '@/hook/useUserSession'
import { convertDateTime } from '@/helper/util/time'
import { FaMoneyCheckAlt, FaCalculator } from 'react-icons/fa'

type DataIndex = keyof ISpp

export function usePembayaranSppController() {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState<any>('')
  const searchInput = useRef<InputRef>(null)
  const [open, setOpen] = useState(false)
  const [actions, setActions] = useState('')
  const [dataSpp, setDataSpp] = useState<ISpp[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [dataSppInput, setDataSppInput] = useState<ISpp>({} as ISpp)
  const [dataHistorySpp, setDataHistorySpp] = useState<IHistorySpp[]>([])
  const [dataHistorySppSelect, setDataHistorySppSelect] = useState<ISelect[]>(
    [] as ISelect[],
  )
  const [dataAllHistorySpp, setDataAllHistorySpp] = useState<IHistorySpp[]>([])
  const { userId, userRole } = useUserSession()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [hasNextPage, setHasNextPage] = useState(false)

  const reCalculate = async (data: ISpp) => {
    try {
      await dataPembayaranSppReCalculate({
        pembayaranSppId: data.id,
        updatedBy: userId,
      })
      await initiateData()
    } catch (error: any) {
      message.error(error.message)
    }
  }

  const showModal = (data: ISpp) => {
    const dataInput = {
      id: data?.id,
      siswaId: data?.siswaId,
      tunggakan: data?.tunggakan,
      totalBayar: data?.totalBayar,
      siswa: data?.siswa,
      kelas: data?.siswa.kelas,
      jurusan: data?.siswa?.kelas.jurusan,
      updatedAt: data?.updatedAt,
      updatedBy: data?.updatedBy,
      user: data?.user,
    }
    setDataSppInput(dataInput)
    getHistoryPembayaranSppByPembayaranSppId(data?.id)
  }

  const getHistoryPembayaranSppByPembayaranSppId = async (id: number) => {
    try {
      const response = await historyPembayaranSppByPembayaranSppId(id)
      const arrayDataTemp: IHistorySpp[] = []
      const arraySelectTemp: any[] = []
      response.data.getHistoryPembayaranSppById?.map((datas: any) => {
        arrayDataTemp.push({
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
        })
        arraySelectTemp.push({ value: datas.id, label: datas.id })
      })
      setDataHistorySpp(arrayDataTemp)
      setDataHistorySppSelect(arraySelectTemp)
      setOpen(true)
    } catch (error: any) {
      console.error(error.message)
      setLoading(false)
    }
  }

  const initiateData = async (page = pagination.current, pageSize = pagination.pageSize, searchCol = searchedColumn, searchTxt = searchText) => {
    setLoading(true)
    try {
      const params = {
        page,
        pageSize,
        searchColumn: Array.isArray(searchCol) ? searchCol.join(',') : searchCol,
        searchText: searchTxt,
      }
      const response1 = await getPembayaranSpp(params)
      const arrayTemp1: ISpp[] = []
      response1.data.getPembayaranSpp?.map((datas: any) => {
        arrayTemp1.push({
          id: datas?.id,
          siswaId: datas?.siswaId,
          tunggakan: datas?.tunggakan,
          totalBayar: datas?.totalBayar,
          siswa: datas?.siswa,
          updatedAt: datas?.updatedAt,
          updatedBy: datas?.updatedBy,
          user: datas?.user,
        })
      })
      setDataSpp(arrayTemp1)
      setHasNextPage(!!response1.data.hasNextPage)
      setPagination({ current: page, pageSize })

      const response2 = await getHistoryPembayaranSpp()
      const arrayTemp2: IHistorySpp[] = []
      response2.data.getHistoryPembayaranSpp?.map((datas: any) => {
        arrayTemp2.push({
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
        })
      })
      setDataAllHistorySpp(arrayTemp2)
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }

  useEffect(() => {
    initiateData(1, pagination.pageSize, searchedColumn, searchText)
  }, [])

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm()
    const text = selectedKeys[0] || ''
    setSearchText(text)
    setSearchedColumn(dataIndex)
    initiateData(1, pagination.pageSize, dataIndex, text)
  }

  const handleReset = (
    clearFilters: () => void,
    confirm: (param?: FilterConfirmProps) => void,
  ) => {
    clearFilters()
    setSearchText('')
    setSearchedColumn('')
    confirm()
    initiateData(1, pagination.pageSize, '', '')
  }

  const handleTableChange = (newPagination: any) => {
    let newPage = newPagination.current;
    if (newPagination.pageSize !== pagination.pageSize) {
      newPage = 1;
    }
    initiateData(newPage, newPagination.pageSize, searchedColumn, searchText);
  }

  const getColumnSearchProps = (dataIndex: any): ColumnType<ISpp> => ({
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

  let columns: ColumnsType<ISpp> = [
    {
      title: 'NISN',
      dataIndex: ['siswa', 'nim'],
      key: 'nim',
      width: '13%',
      ...getColumnSearchProps(['siswa', 'nim']),
      sorter: (a, b) => a.siswa.nim.localeCompare(b.siswa.nim),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Nama',
      dataIndex: ['siswa', 'nama'],
      key: 'nama',
      width: '40%',
      ...getColumnSearchProps(['siswa', 'nama']),
      sorter: (a, b) => a.siswa.nama.localeCompare(b.siswa.nama),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Kelas',
      dataIndex: ['siswa', 'kelas', 'namaKelas'],
      key: 'kelas',
      width: '20%',
      ...getColumnSearchProps(['siswa', 'kelas', 'namaKelas']),
      sorter: (a, b) =>
        a.siswa.kelas.namaKelas.localeCompare(b.siswa.kelas.namaKelas),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Jurusan',
      dataIndex: ['siswa', 'kelas', 'jurusan', 'namaJurusan'],
      key: 'jurusan',
      width: '20%',
      ...getColumnSearchProps(['siswa', 'kelas', 'jurusan', 'namaJurusan']),
      sorter: (a, b) =>
        a.siswa.kelas.jurusan.namaJurusan.localeCompare(
          b.siswa.kelas.jurusan.namaJurusan,
        ),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Tunggakan',
      dataIndex: 'tunggakan',
      key: 'tunggakan',
      width: '20%',
      ...getColumnSearchProps(['tunggakan']),
      sorter: (a, b) => a.tunggakan - b.tunggakan,
      sortDirections: ['descend', 'ascend'],
      render: tunggakan => convertMoney(tunggakan),
    },
    {
      title: 'Total Pembayaran',
      dataIndex: 'totalBayar',
      key: 'totalBayar',
      width: '20%',
      ...getColumnSearchProps(['totalBayar']),
      sorter: (a: any, b: any) => a.totalBayar - b.totalBayar,
      sortDirections: ['descend', 'ascend'],
      render: totalBayar => convertMoney(totalBayar),
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
        <Space size="small" split>
          <Button
            type="primary"
            size="middle"
            className="btnPrimary"
            icon={<FaMoneyCheckAlt />}
            onClick={() => showModal(record)}>
            Pembayaran
          </Button>
          <Button
            type="primary"
            size="middle"
            className="btnRecalculate"
            icon={<FaCalculator />}
            onClick={() => reCalculate(record)}>
            Kalkulasi Ulang
          </Button>
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
    dataSpp,
    open,
    setOpen,
    actions,
    dataSppInput,
    setDataSppInput,
    dataHistorySpp,
    setDataHistorySpp,
    dataHistorySppSelect,
    setDataHistorySppSelect,
    showModal,
    initiateData,
    getHistoryPembayaranSppByPembayaranSppId,
    pagination,
    hasNextPage,
    handleTableChange,
  }
}
