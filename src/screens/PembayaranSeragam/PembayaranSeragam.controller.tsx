import { SearchOutlined } from '@ant-design/icons'
import { InputRef, Input, Space, Button } from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import { useEffect, useRef, useState } from 'react'
import { getPembayaranSeragam } from '@/helper/apiHelper/pembayaranSeragam'
import { getHistoryPembayaranSeragam } from '@/helper/apiHelper/historyPembayaranSeragam'
import {
  historyPembayaranSeragamByPembayaranSeragamId,
} from '@/helper/apiHelper/historyPembayaranSeragam'
import { detailHistoryPembayaranSeragamByPembayaranSeragamId } from '@/helper/apiHelper/detailHistoryPembayaranSeragam'
import { IPembayaranSeragam } from '@/interface/ui/state/dataPembayaranSeragamTable'
import { IHistorySeragam } from '@/interface/ui/state/dataHistorySeragamTable'
import { IDetailHistorySeragam } from '@/interface/ui/state/dataDetailHistorySeragamTable'
import { getDataSeragam } from '@/helper/apiHelper/seragam'
import { ISeragam } from '@/interface/ui/state/dataSeragamModal'
import { convertMoney } from '@/helper/util/money'
import { getUserInfoWithNullCheck } from '@/helper/util/userInfo'
import { useUserSession } from '@/hook/useUserSession'
import { convertDateTime } from '@/helper/util/time'

type DataIndex = keyof IPembayaranSeragam

export function usePembayaranSeragamController() {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState<any>('')
  const searchInput = useRef<InputRef>(null)
  const [open, setOpen] = useState(false)
  const [actions, setActions] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  const [dataPembayaranSeragam, setDataPembayaranSeragam] = useState<
    IPembayaranSeragam[]
  >([])
  const [dataPembayaranSeragamInput, setDataPembayaranSeragamInput] =
    useState<IPembayaranSeragam>({} as IPembayaranSeragam)
  const [dataHistorySeragam, setDataHistorySeragam] = useState<
    IHistorySeragam[]
  >([])
  const [
    dataDetailHistoryPembayaranSeragam,
    setDataDetailHistoryPembayaranSeragam,
  ] = useState<IDetailHistorySeragam[]>([])
  const [dataSeragam, setDataSeragam] = useState<ISeragam[]>([])
  const [dataInputFilteredSeragam, setDataInputFilteredSeragam] = useState<
    ISeragam[]
  >([])
  const [dataAllHistorySeragam, setDataAllHistorySeragam] = useState<
    IHistorySeragam[]
  >([])
  const { userId, userRole } = useUserSession()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [hasNextPage, setHasNextPage] = useState(false)

  const showModal = (action: string, data: IPembayaranSeragam) => {
    if (action === 'detail') {
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
      setDataPembayaranSeragamInput(dataInput)
      getHistoryPembayaranSeragamByPembayaranSeragamId(data?.id, action)
    } else {
      setActions(action)
      setOpen(true)
    }
  }

  const getHistoryPembayaranSeragamByPembayaranSeragamId = (
    id: number,
    action: string,
  ) => {
    const fetchData = async () => {
      try {
        const responseHistory =
          await historyPembayaranSeragamByPembayaranSeragamId(id)
        const arrayDataTemp: IHistorySeragam[] = []
        responseHistory.data.getHistoryPembayaranSeragamById?.map(
          (datas: any) => {
            arrayDataTemp.push({
              id: datas?.id,
              pembayaranSeragamId: datas?.pembayaranSeragamId,
              jumlahDiBayar: datas?.jumlahDiBayar,
              tanggalPembayaran: datas?.tanggalPembayaran,
              pembayaranSeragam: datas?.pembayaranSeragam,
              updatedAt: datas?.updatedAt,
              updatedBy: datas?.updatedBy,
              user: datas?.user,
            })
          },
        )
        setDataHistorySeragam(arrayDataTemp)

        const responseDetail =
          await detailHistoryPembayaranSeragamByPembayaranSeragamId(id)
        const arrayDetailTemp: IDetailHistorySeragam[] = []
        responseDetail.data.getDetailHistoryPembayaranSeragamById?.map(
          (datas: any) => {
            arrayDetailTemp.push({
              id: datas?.id,
              pembayaranSeragamId: datas?.pembayaranSeragamId,
              pembayaranSeragam: datas?.pembayaranSeragam,
              seragamId: datas?.seragamId,
              seragam: datas?.seragam,
              updatedAt: datas?.updatedAt,
              updatedBy: datas?.updatedBy,
              user: datas?.user,
            })
          },
        )
        setDataDetailHistoryPembayaranSeragam(arrayDetailTemp)
        const filteredDataSeragam = dataSeragam.filter(
          seragam =>
            !arrayDetailTemp.some(history => history.seragamId === seragam.id),
        )
        setDataInputFilteredSeragam(filteredDataSeragam)

        setActions(action)
        setLoading(false)
        setOpen(true)
      } catch (error: any) {
        console.error(error.message)
        setLoading(false)
        setOpen(false)
      }
    }

    fetchData()
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
      const response1 = await getPembayaranSeragam(params)
      const arrayTemp1: IPembayaranSeragam[] = []
      response1.data.getPembayaranSeragam?.map((datas: any) => {
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
      setDataPembayaranSeragam(arrayTemp1)
      setHasNextPage(!!response1.data.hasNextPage)
      setPagination({ current: page, pageSize })

      const response2 = await getDataSeragam()
      const arrayTemp2: ISeragam[] = []
      response2.data.getSeragam?.map((datas: any) => {
        arrayTemp2.push({
          id: datas?.id,
          nama: datas?.nama,
          harga: datas?.harga,
          updatedAt: datas?.updatedAt,
          updatedBy: datas?.updatedBy,
          user: datas?.user,
        })
      })
      setDataSeragam(arrayTemp2)

      const response3 = await getHistoryPembayaranSeragam()
      const arrayTemp3: IHistorySeragam[] = []
      response3.data.getHistoryPembayaranSeragam?.map((datas: any) => {
        arrayTemp3.push({
          id: datas?.id,
          pembayaranSeragamId: datas?.pembayaranSeragamId,
          jumlahDiBayar: datas?.jumlahDiBayar,
          tanggalPembayaran: datas?.tanggalPembayaran,
          pembayaranSeragam: datas?.pembayaranSeragam,
          updatedAt: datas?.updatedAt,
          updatedBy: datas?.updatedBy,
          user: datas?.user,
        })
      })
      setDataAllHistorySeragam(arrayTemp3)
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

  const getColumnSearchProps = (
    dataIndex: any,
  ): ColumnType<IPembayaranSeragam> => ({
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

  let columns: ColumnsType<IPembayaranSeragam> = [
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
      sorter: (a: any, b: any) => a.tunggakan - b.tunggakan,
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
            onClick={() => showModal('detail', record)}>
            Detail
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
    dataPembayaranSeragam,
    open,
    setOpen,
    actions,
    dataPembayaranSeragamInput,
    setDataPembayaranSeragamInput,
    dataHistorySeragam,
    setDataHistorySeragam,
    dataDetailHistoryPembayaranSeragam,
    setDataDetailHistoryPembayaranSeragam,
    dataSeragam,
    setDataSeragam,
    dataInputFilteredSeragam,
    setDataInputFilteredSeragam,
    showModal,
    initiateData,
    getHistoryPembayaranSeragamByPembayaranSeragamId,
    pagination,
    hasNextPage,
    handleTableChange,
  }
}
