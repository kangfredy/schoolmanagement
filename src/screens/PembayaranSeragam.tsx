import { SearchOutlined } from '@ant-design/icons'
import { InputRef, Modal, Popconfirm, message } from 'antd'
import { Button, Input, Space, Table } from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import React, { useEffect, useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { ModalSeragam } from '../components/ModalSeragam'
import { getPembayaranSeragam } from '@/helper/apiHelper/pembayaranSeragam'
import { getHistoryPembayaranSeragam } from '@/helper/apiHelper/historyPembayaranSeragam'
import { IDataPembayaranSeragamModal } from '@/interface/ui/state/dataPembayaranSeragamModal'
import { IPembayaranSeragam } from '@/interface/ui/state/dataPembayaranSeragamTable'
import {
  historyPembayaranSeragamByPembayaranSeragamId,
  dataHistoryPembayaranSeragamUpdate,
} from '@/helper/apiHelper/historyPembayaranSeragam'
import { IHistorySeragam } from '@/interface/ui/state/dataHistorySeragamTable'
import { getDataSeragam } from '@/helper/apiHelper/seragam'
import { ISeragam } from '@/interface/ui/state/dataSeragamModal'
import { convertMoney } from '@/helper/util/money'

type DataIndex = keyof IPembayaranSeragam

export const PembayaranSeragam = () => {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
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
  const [dataSeragam, setDataSeragam] = useState<ISeragam[]>([])
  const [dataAllHistorySeragam, setDataAllHistorySeragam] = useState<
    IHistorySeragam[]
  >([])

  const showModal = (action: string, data: IPembayaranSeragam) => {
    console.log('TYPE OF DATA', typeof data)
    if (action === 'detail') {
      let dataInput = {
        id: data?.id,
        siswaId: data?.siswaId,
        tunggakan: data?.tunggakan,
        totalBayar: data?.totalBayar,
        siswa: data?.siswa,
        kelas: data?.siswa.kelas,
        jurusan: data?.siswa?.kelas.jurusan,
      }

      setDataPembayaranSeragamInput(dataInput)
      console.log('dataInput', dataInput)
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
    historyPembayaranSeragamByPembayaranSeragamId(id)
      .then(response => {
        console.log('historyPembayaranSppByPembayaranSppId ', response)
        const arrayDataTemp: IHistorySeragam[] = []

        response.data.getHistoryPembayaranSeragamById?.map((datas: any) => {
          const object1: IHistorySeragam = {
            id: datas?.id,
            pembayaranSeragamId: datas?.pembayaranSeragamId,
            sudahDibayar: datas?.sudahDibayar,
            tanggalPembayaran: datas?.tanggalPembayaran,
            seragamId: datas?.seragamId,
            pembayaranSeragam: datas?.pembayaranSeragam,
            seragam: datas?.seragam,
          }
          arrayDataTemp.push(object1)
        })

        //Assign the mapped array to the state
        setDataHistorySeragam(arrayDataTemp)
      })
      .then(response => {
        setLoading(false)
        setActions(action)
      })
      .finally(() => {
        setOpen(true)
      })
      .catch(error => {
        console.error(error.message)
        setLoading(false)
        setOpen(false)
      })
  }

  const initiateData = async () => {
    setLoading(true)
    try {
      const response1 = await getPembayaranSeragam()
      const arrayTemp1: IPembayaranSeragam[] = []
      response1.data.getPembayaranSeragam?.map((datas: any) => {
        const object1: IPembayaranSeragam = {
          id: datas?.id,
          siswaId: datas?.siswaId,
          tunggakan: datas?.tunggakan,
          totalBayar: datas?.totalBayar,
          siswa: datas?.siswa,
        }
        arrayTemp1.push(object1)
      })
      setDataPembayaranSeragam(arrayTemp1)

      const response2 = await getDataSeragam()
      const arrayTemp2: ISeragam[] = []
      response2.data.getSeragam?.map((datas: any) => {
        const object2: ISeragam = {
          id: datas?.id,
          nama: datas?.nama,
          harga: datas?.harga,
        }
        arrayTemp2.push(object2)
      })
      setDataSeragam(arrayTemp2)
      // console.log('setDataAllHistorySpp', arrayTemp2)

      const response3 = await getHistoryPembayaranSeragam()
      const arrayTemp3: IHistorySeragam[] = []
      response3.data.getHistoryPembayaranSeragam?.map((datas: any) => {
        const object3: IHistorySeragam = {
          id: datas?.id,
          pembayaranSeragamId: datas?.pembayaranSeragamId,
          sudahDibayar: datas?.sudahDibayar,
          tanggalPembayaran: datas?.tanggalPembayaran,
          seragamId: datas?.seragamId,
          pembayaranSeragam: datas?.pembayaranSeragam,
          seragam: datas?.seragam,
        }
        arrayTemp3.push(object3)
      })
      setDataAllHistorySeragam(arrayTemp3)
      console.log('setDataAllHistorySeragam', arrayTemp3)

      setLoading(false)
    } catch (error) {
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

  //handle Popconfrim
  const handleConfirmDelete = (e: any) => {
    console.log(e)
    message.success('Click on Yes')
  }

  const getColumnSearchProps = (
    dataIndex: DataIndex,
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
          placeholder={`Search ${dataIndex}`}
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
          <Button
            type="link"
            size="small"
            onClick={() => {
              close()
            }}>
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  })

  const columns: ColumnsType<IPembayaranSeragam> = [
    {
      title: 'NIM',
      dataIndex: ['siswa', 'nim'],
      key: 'nim',
      width: '13%',
      ...getColumnSearchProps('siswa'),
      sorter: (a, b) => a.siswa.nim.localeCompare(b.siswa.nim),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Nama',
      dataIndex: ['siswa', 'nama'],
      key: 'nama',
      width: '40%',
      ...getColumnSearchProps('siswa'),
      sorter: (a, b) => a.siswa.nama.localeCompare(b.siswa.nama),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Kelas',
      dataIndex: ['siswa', 'kelas', 'namaKelas'],
      key: 'kelas',
      width: '20%',
      ...getColumnSearchProps('siswa'),
      sorter: (a, b) =>
        a.siswa.kelas.namaKelas.localeCompare(b.siswa.kelas.namaKelas),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Jurusan',
      dataIndex: ['siswa', 'kelas', 'jurusan', 'namaJurusan'],
      key: 'jurusan',
      width: '20%',
      ...getColumnSearchProps('siswa'),
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
      ...getColumnSearchProps('tunggakan'),
      sorter: (a: any, b: any) => a.tunggakan - b.tunggakan,
      sortDirections: ['descend', 'ascend'],
      render: (tunggakan: any, record: any) => {
        const filteredData = dataAllHistorySeragam.filter(
          (item: any) => item.pembayaranSeragamId === record.id,
        )
        const totalHarga = filteredData.reduce((total: number, item: any) => {
          return total + item.seragam.harga
        }, 0)
        return convertMoney(totalHarga)
      },
    },
    {
      title: 'Total Pembayaran',
      dataIndex: 'totalBayar',
      key: 'totalBayar',
      width: '20%',
      ...getColumnSearchProps('totalBayar'),
      sorter: (a: any, b: any) => a.totalBayar - b.totalBayar,
      sortDirections: ['descend', 'ascend'],
      render: (totalBayar: any, record: any) => {
        const filteredData = dataAllHistorySeragam.filter(
          (item: any) => item.pembayaranSeragamId === record.id,
        )
        const totalPembayaran = filteredData.reduce(
          (total: number, item: any) => {
            if (item.sudahDibayar) {
              return total + item.seragam.harga
            }
            return total
          },
          0,
        )
        return convertMoney(totalPembayaran)
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="small" split>
          <Button
            type="primary"
            size="middle"
            className="bg-blue-500"
            onClick={() => showModal('detail', record)}>
            Detail
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="rounded-md bg-white p-2 h-[100%] overflow-scroll">
      <div className="my-4 flex items-center justify-between px-4">
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-black">Pembayaran Seragam</h2>
        </div>
        <div className="flex items-center">
          <Button
            type="primary"
            size="middle"
            className="bg-blue-500"
            onClick={() => showModal('tambah', {} as IPembayaranSeragam)}>
            Tambah Seragam
          </Button>
          <ModalSeragam
            getData={initiateData}
            action={actions}
            open={open}
            setOpen={setOpen}
            dataPembayaranSeragamInput={dataPembayaranSeragamInput}
            setDataPembayaranSeragamInput={setDataPembayaranSeragamInput}
            dataHistorySeragam={dataHistorySeragam}
            setDataHistorySeragam={setDataHistorySeragam}
            dataSeragam={dataSeragam}
            setDataSeragam={setDataSeragam}
            getHistoryPembayaranSeragamByPembayaranSeragamId={
              getHistoryPembayaranSeragamByPembayaranSeragamId
            }
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={dataPembayaranSeragam}
        scroll={{ x: 400 }}
        className="h-[100%]"
      />
    </div>
  )
}
