import {
  Input,
  Modal,
  Button,
  Select,
  Space,
  Table,
  InputRef,
  Popconfirm,
} from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import { SearchOutlined, UserOutlined, IdcardOutlined } from '@ant-design/icons'
import { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react'
import Highlighter from 'react-highlight-words'
interface DataType {
  siswaId: number
  jumlah: number
  jatuhTempo: string
  sudahDibayar: number
  totalBayar: number
}

type DataIndex = keyof DataType

const data: DataType[] = [
  {
    siswaId: 1,
    jumlah: 500000,
    jatuhTempo: '2023-06-15',
    sudahDibayar: 250000,
    totalBayar: 500000,
  },
  {
    siswaId: 2,
    jumlah: 750000,
    jatuhTempo: '2023-06-20',
    sudahDibayar: 500000,
    totalBayar: 750000,
  },
  // Additional 8 rows of mock data
  {
    siswaId: 3,
    jumlah: 300000,
    jatuhTempo: '2023-06-25',
    sudahDibayar: 150000,
    totalBayar: 300000,
  },
  {
    siswaId: 4,
    jumlah: 450000,
    jatuhTempo: '2023-06-30',
    sudahDibayar: 225000,
    totalBayar: 450000,
  },
  {
    siswaId: 5,
    jumlah: 600000,
    jatuhTempo: '2023-07-05',
    sudahDibayar: 300000,
    totalBayar: 600000,
  },
  {
    siswaId: 6,
    jumlah: 700000,
    jatuhTempo: '2023-07-10',
    sudahDibayar: 350000,
    totalBayar: 700000,
  },
  {
    siswaId: 7,
    jumlah: 550000,
    jatuhTempo: '2023-07-15',
    sudahDibayar: 275000,
    totalBayar: 550000,
  },
  {
    siswaId: 8,
    jumlah: 400000,
    jatuhTempo: '2023-07-20',
    sudahDibayar: 200000,
    totalBayar: 400000,
  },
  {
    siswaId: 9,
    jumlah: 650000,
    jatuhTempo: '2023-07-25',
    sudahDibayar: 325000,
    totalBayar: 650000,
  },
  {
    siswaId: 10,
    jumlah: 800000,
    jatuhTempo: '2023-07-30',
    sudahDibayar: 400000,
    totalBayar: 800000,
  },
]

interface ModalSppProps {
  open: boolean
  action: string
  setOpen: Dispatch<SetStateAction<boolean>>
}

export function ModalSpp({ action, open, setOpen }: ModalSppProps) {
  const [DataPembayaran, setDataPembayaran] = useState<DataType>({} as DataType)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

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

  const handleChange = (e: { target: { name: string; value: any } }) =>
    setDataPembayaran(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))

  const getColumnSearchProps = (
    dataIndex: DataIndex,
  ): ColumnType<DataType> => ({
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

  const handleOk = () => {
    setConfirmLoading(true)
    setTimeout(() => {
      setOpen(false)
      setConfirmLoading(false)
    }, 2000)
  }

  const handleCancel = () => {
    console.log('Clicked cancel button')
    setOpen(false)
  }
  const handleKelas = (value: number) => {
    setDataPembayaran(prevState => ({ ...prevState, kelasId: value }))
  }
  const onSearchKelas = (value: string) => {
    console.log('search:', value)
  }

  ////////////////////////////////////////////////////////////////////////

  const columns: ColumnsType<DataType> = [
    {
      title: 'Id Siswa',
      dataIndex: 'siswaId',
      key: 'siswaId',
      width: '13%',
      ...getColumnSearchProps('siswaId'),
      sorter: (a, b) => a.siswaId - b.siswaId,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Jumlah',
      dataIndex: 'jumlah',
      key: 'jumlah',
      width: '20%',
      ...getColumnSearchProps('jumlah'),
      sorter: (a, b) => a.jumlah - b.jumlah,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Jatuh Tempo',
      dataIndex: 'jatuhTempo',
      key: 'jatuhTempo',
      width: '23%',
      ...getColumnSearchProps('jatuhTempo'),
      sorter: (a, b) => a.jatuhTempo.localeCompare(b.jatuhTempo),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Sudah Dibayar',
      dataIndex: 'sudahDibayar',
      key: 'sudahDibayar',
      width: '20%',
      ...getColumnSearchProps('sudahDibayar'),
      sorter: (a, b) => a.sudahDibayar - b.sudahDibayar,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Total Pembayaran',
      dataIndex: 'totalBayar',
      key: 'totalBayar',
      width: '30%',
      ...getColumnSearchProps('totalBayar'),
      sorter: (a, b) => a.totalBayar - b.totalBayar,
      sortDirections: ['descend', 'ascend'],
    },
  ]

  return (
    <Modal
      title="PEMBAYARAN SPP"
      open={open}
      onOk={handleOk}
      okButtonProps={{ className: 'bg-blue-500' }}
      confirmLoading={confirmLoading}
      width="80%"
      footer={null}
      onCancel={handleCancel}>
      <div className="flex flex-col">
        <div className="w-[50%] flex my-2">
          <div className="w-[50%]">ID</div>
          <div className="w-[50%]">ALSDMKASSD</div>
        </div>
        <div className="w-[50%] flex my-2">
          <div className="w-[50%]">Tanggal Pembayaran</div>
          <div className="w-[50%]">12 Juni 2020</div>
        </div>
        <div className="w-[50%] flex my-2">
          <div className="w-[50%]">Jumlah Di Bayar</div>
          <div className="w-[50%]">Rp 100,000</div>
        </div>
      </div>
      <div className="flex justify-end my-5">
        <Button type="primary" size="large" className="bg-red-500">
          BAYAR
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ x: 400 }}
        className="h-[100%]"
      />
    </Modal>
  )
}
