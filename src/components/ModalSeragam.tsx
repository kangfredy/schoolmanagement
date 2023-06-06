import {
  Input,
  Modal,
  Button,
  Select,
  Space,
  Table,
  InputRef,
  Popconfirm,
  Switch,
  Tag,
  message,
} from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import { SearchOutlined, UserOutlined, IdcardOutlined } from '@ant-design/icons'
import { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react'
import Highlighter from 'react-highlight-words'
import { convertDate } from '@/helper/util/time'
import { RiShirtLine } from 'react-icons/ri'
import { IoIosResize } from 'react-icons/io'

interface ISelectSeragam {
  id: number
  nama: string
  label: string
}

const seragam: ISelectSeragam[] = [
  {
    id: 1,
    nama: 'Seragam Khas S',
    label: 'Seragam Khas S',
  },
  {
    id: 2,
    nama: 'Seragam Olahraga L',
    label: 'Seragam Olahraga L',
  },
  {
    id: 3,
    nama: 'Seragam Kantor M',
    label: 'Seragam Kantor M',
  },
  {
    id: 4,
    nama: 'Seragam Sekolah XL',
    label: 'Seragam Sekolah XL',
  },
  {
    id: 5,
    nama: 'Seragam Pesta XXXL',
    label: 'Seragam Pesta XXXL',
  },
  {
    id: 6,
    nama: 'Seragam Pramuka L',
    label: 'Seragam Pramuka L',
  },
  {
    id: 7,
    nama: 'Seragam Dinas S',
    label: 'Seragam Dinas S',
  },
  {
    id: 8,
    nama: 'Seragam Militer S',
    label: 'Seragam Militer S',
  },
  {
    id: 9,
    nama: 'Seragam Dokter S',
    label: 'Seragam Dokter S',
  },
  {
    id: 10,
    nama: 'Seragam Chef S',
    label: 'Seragam Chef S',
  },
  {
    id: 11,
    nama: 'Seragam Chef L',
    label: 'Seragam Chef L',
  },
  {
    id: 12,
    nama: 'Seragam Chef M',
    label: 'Seragam Chef M',
  },
]
interface ISeragam {
  nomor: number
  seragam: string
  harga: number
}

type DataSeragam = keyof ISeragam

const dataSeragam: ISeragam[] = [
  {
    nomor: 1,
    seragam: 'Seragam Khas',
    harga: 250000,
  },
  { nomor: 2, seragam: 'Seragam Olahraga', harga: 150000 },
  { nomor: 3, seragam: 'Seragam Pramuka', harga: 200000 },
  { nomor: 4, seragam: 'Seragam Batik', harga: 300000 },
  { nomor: 5, seragam: 'Seragam Paskibra', harga: 350000 },
  { nomor: 6, seragam: 'Seragam Seni', harga: 250000 },
  { nomor: 7, seragam: 'Seragam OSIS', harga: 200000 },
  { nomor: 8, seragam: 'Seragam PMR', harga: 250000 },
  { nomor: 9, seragam: 'Seragam Rohis', harga: 150000 },
  { nomor: 10, seragam: 'Seragam Pecinta Alam', harga: 300000 },
  { nomor: 11, seragam: 'Seragam KIR', harga: 200000 },
]
interface IDetailSeragam {
  nomor: number
  seragam: string
  harga: number
  jumlahYangDibayar: number
  tanggalDibayar: string
  sudahDibayar: boolean
}

type DataIndex = keyof IDetailSeragam

const data: IDetailSeragam[] = [
  {
    nomor: 1,
    seragam: 'Seragam Khas',
    jumlahYangDibayar: 250000,
    tanggalDibayar: '2023-06-15',
    sudahDibayar: true,
    harga: 80000
  },
  {
    nomor: 2,
    seragam: 'Seragam Olahraga',
    jumlahYangDibayar: 150000,
    tanggalDibayar: '2023-06-16',
    sudahDibayar: false,
    harga: 80000
  },
  {
    nomor: 3,
    seragam: 'Seragam Pramuka',
    jumlahYangDibayar: 200000,
    tanggalDibayar: '2023-06-17',
    sudahDibayar: true,
    harga: 80000
  },
  {
    nomor: 4,
    seragam: 'Seragam Khas',
    jumlahYangDibayar: 250000,
    tanggalDibayar: '2023-06-18',
    sudahDibayar: false,
    harga: 80000
  },
  {
    nomor: 5,
    seragam: 'Seragam Olahraga',
    jumlahYangDibayar: 150000,
    tanggalDibayar: '2023-06-19',
    sudahDibayar: true,
    harga: 80000
  },
  {
    nomor: 6,
    seragam: 'Seragam Pramuka',
    jumlahYangDibayar: 200000,
    tanggalDibayar: '2023-06-20',
    sudahDibayar: false,
    harga: 80000
  },
  {
    nomor: 7,
    seragam: 'Seragam Khas',
    jumlahYangDibayar: 250000,
    tanggalDibayar: '2023-06-21',
    sudahDibayar: true,
    harga: 80000
  },
  {
    nomor: 8,
    seragam: 'Seragam Olahraga',
    jumlahYangDibayar: 150000,
    tanggalDibayar: '2023-06-22',
    sudahDibayar: false,
    harga: 80000
  },
  {
    nomor: 9,
    seragam: 'Seragam Pramuka',
    jumlahYangDibayar: 200000,
    tanggalDibayar: '2023-06-23',
    sudahDibayar: true,
    harga: 80000
  },
  {
    nomor: 10,
    seragam: 'Seragam Khas',
    jumlahYangDibayar: 250000,
    tanggalDibayar: '2023-06-24',
    sudahDibayar: false,
    harga: 80000
  },
]

interface ModalSeragamProps {
  open: boolean
  action: string
  setOpen: Dispatch<SetStateAction<boolean>>
}

export function ModalSeragam({ action, open, setOpen }: ModalSeragamProps) {
  const [DataPembayaran, setDataPembayaran] = useState<IDetailSeragam>(
    {} as IDetailSeragam,
  )
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
  ): ColumnType<IDetailSeragam> => ({
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

  const handleConfirmDelete = (e: any) => {
    console.log(e)
    message.success('Click on Yes')
  }

  const handleCancelDelete = (e: any) => {
    console.log(e)
    message.error('Click on No')
  }

  const columnsSeragam: any = [
    {
      title: 'Nomor',
      dataIndex: 'nomor',
      key: 'nomor',
      width: '13%',
      ...getColumnSearchProps('nomor'),
      sorter: (a: { nomor: number }, b: { nomor: number }) => a.nomor - b.nomor,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Seragam',
      dataIndex: 'seragam',
      key: 'seragam',
      width: '20%',
      ...getColumnSearchProps('seragam'),
      sorter: (a: { seragam: string }, b: { seragam: any }) => a.seragam.localeCompare(b.seragam),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Harga',
      dataIndex: 'harga',
      key: 'harga',
      width: '23%',
      ...getColumnSearchProps('harga'),
      sorter: (a: { harga: number }, b: { harga: number }) => a.harga - b.harga,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small" split>
          <Popconfirm
            title="Hapus Data?"
            description="Apakah benar ingin menghapus data ini?"
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            okText="Yes"
            okButtonProps={{ className: 'bg-blue-500', size: 'small' }}
            cancelText="No">
            <Button danger type="primary" size="middle" className="bg-blue-500">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const columns: ColumnsType<IDetailSeragam> = [
    {
      title: 'Nomor',
      dataIndex: 'nomor',
      key: 'nomor',
      width: '13%',
      ...getColumnSearchProps('nomor'),
      sorter: (a, b) => a.nomor - b.nomor,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Seragam',
      dataIndex: 'seragam',
      key: 'seragam',
      width: '20%',
      ...getColumnSearchProps('seragam'),
      sorter: (a, b) => a.seragam.localeCompare(b.seragam),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Jumlah Yang Dibayar',
      dataIndex: 'jumlahYangDibayar',
      key: 'jumlahYangDibayar',
      width: '23%',
      ...getColumnSearchProps('jumlahYangDibayar'),
      sorter: (a, b) => a.jumlahYangDibayar - b.jumlahYangDibayar,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Tanggal Dibayar',
      dataIndex: 'tanggalDibayar',
      key: 'tanggalDibayar',
      width: '20%',
      ...getColumnSearchProps('tanggalDibayar'),
      sorter: (a, b) => a.tanggalDibayar.localeCompare(b.tanggalDibayar),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Sudah Dibayar',
      dataIndex: 'sudahDibayar',
      key: 'sudahDibayar',
      width: '30%',
      render: (_, record) => (
        <>
          {record.sudahDibayar ? (
            <Tag color="#87d068">Terbayar</Tag>
          ) : (
            <Tag color="#f50">Belum Dibayar</Tag>
          )}
        </>
      ),
    },
  ]

  const headerDetailSeragam = (
    <>
      <div className="flex flex-col">
        <div className="w-[50%] flex my-2">
          <div className="w-[50%]">ID</div>
          <div className="w-[50%]">112</div>
        </div>
        <div className="w-[50%] flex my-2">
          <div className="w-[50%]">Seragam</div>
          <Select
            className="w-60"
            showSearch
            placeholder="Pilih seragam"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '')
                .toLowerCase()
                .localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={seragam}
          />
        </div>
        <div className="w-[50%] flex my-2">
          <div className="w-[50%]">Tanggal Pembayaran</div>
          <div className="w-[50%]">
            {new Intl.DateTimeFormat('en-US').format(Date.now())}
          </div>
        </div>
        <div className="w-[50%] flex my-2">
          <div className="w-[50%]">Total Pembayaran</div>
          <div className="w-[50%]">
            <Input
              placeholder="Rp. 250.000"
              name="seragam"
              prefix={<RiShirtLine />}
              onChange={e => handleChange(e)}
              className="w-60"
              required
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end my-5 w-[97%]">
        <Button type="primary" size="large" className="bg-blue-500">
          BAYAR
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ x: 400 }}
        className="h-[100%]"
      />
    </>
  )
  const headerTambahSeragam = (
    <>
      <div className="my-4 flex flex-col">
        <div className="w-[35%] my-2">Nama Seragam dan Ukuran:</div>
        <Input
          placeholder="Seragam RPL (L)"
          name="seragam"
          prefix={<RiShirtLine />}
          onChange={e => handleChange(e)}
          className="w-60"
          required
        />
        <Button type="primary" size="middle" className="bg-blue-500">
          Tambah
        </Button>

        <Table
          columns={columnsSeragam}
          dataSource={dataSeragam}
          scroll={{ x: 400 }}
          className="h-[100%]"
        />
      </div>
    </>
  )

  return (
    <Modal
      title={
        action === 'detail' ? 'Detail Pembayaran Seragam' : 'Tambah Seragam'
      }
      open={open}
      onOk={handleOk}
      okButtonProps={{ className: 'bg-blue-500' }}
      confirmLoading={confirmLoading}
      width={action === 'detail' ? '80%' : '60%'}
      footer={action === 'detail' ? null : undefined}
      onCancel={handleCancel}>
      {action === 'detail' ? headerDetailSeragam : headerTambahSeragam}
    </Modal>
  )
}
