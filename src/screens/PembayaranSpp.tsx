import { SearchOutlined } from '@ant-design/icons'
import { InputRef, Modal, Popconfirm, message } from 'antd'
import { Button, Input, Space, Table } from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import React, { useEffect, useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { ModalSpp } from '../components/ModalSpp'
// import { getPembayaranSpp } from "@/helper/apiHelper/getPembayaranSpp";

interface DataType {
  siswaId: number
  nama: string
  tunggakan: number
  totalbayar: number
}
type DataIndex = keyof DataType

const data: DataType[] = [
  {
    siswaId: 1,
    nama: 'Dani Vicky Mahendra',
    tunggakan: 50000,
    totalbayar: 450000,
  },
  {
    siswaId: 2,
    nama: 'Eka Rizky Pratama',
    tunggakan: 75000,
    totalbayar: 525000,
  },
  {
    siswaId: 3,
    nama: 'Fani Nurul Aini',
    tunggakan: 100000,
    totalbayar: 600000,
  },
  {
    siswaId: 4,
    nama: 'Gina Lestari Putri',
    tunggakan: 125000,
    totalbayar: 675000,
  },
  {
    siswaId: 5,
    nama: 'Hadi Prasetyo',
    tunggakan: 150000,
    totalbayar: 750000,
  },
  {
    siswaId: 6,
    nama: 'Indra Setiawan',
    tunggakan: 175000,
    totalbayar: 825000,
  },
  {
    siswaId: 7,
    nama: 'Jeni Sari',
    tunggakan: 200000,
    totalbayar: 900000,
  },
  {
    siswaId: 8,
    nama: 'Kiki Rahmawati',
    tunggakan: 225000,
    totalbayar: 975000,
  },
  {
    siswaId: 9,
    nama: 'Lina Wati',
    tunggakan: 250000,
    totalbayar: 1050000,
  },
]

export const PembayaranSpp = () => {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)
  const [open, setOpen] = useState(false)
  const [actions, setActions] = useState('')

  const showModal = (action: string) => {
    setActions(action)
    setOpen(true)
  }

  // useEffect(() => {
  //     getPembayaranSpp()
  //         .then((response) => {
  //             console.log(response.data.PembayaranSppData);
  //             setPembayaranSpp(response.data.PembayaranSppData);
  //         })
  //         .catch((error) => console.log(error));
  // }, []);

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

  const handleCancelDelete = (e: any) => {
    console.log(e)
    message.error('Click on No')
  }

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
      title: 'Nama',
      dataIndex: 'nama',
      key: 'nama',
      width: '40%',
      ...getColumnSearchProps('nama'),
      sorter: (a, b) => a.nama.localeCompare(b.nama),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Tunggakan',
      dataIndex: 'tunggakan',
      key: 'tunggakan',
      width: '20%',
      ...getColumnSearchProps('tunggakan'),
      sorter: (a, b) => a.tunggakan - b.tunggakan,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Total Pembayaran',
      dataIndex: 'totalbayar',
      key: 'totalbayar',
      width: '20%',
      ...getColumnSearchProps('totalbayar'),
      sorter: (a, b) => a.totalbayar - b.totalbayar,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle" split>
          <Button
            type="primary"
            size="middle"
            className="bg-blue-500"
            onClick={() => showModal('edit')}>
            Edit Pembayaran
          </Button>
          <Button
            type="primary"
            size="middle"
            className="bg-blue-500"
            onClick={() => showModal('detail')}>
            Detail Pembayaran
          </Button>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
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

  return (
    <div className="rounded-md bg-white p-2 h-[100%] overflow-scroll">
      <div className="my-4 flex items-center justify-between px-4">
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-black">Pembayaran SPP</h2>
        </div>
        <div className="flex items-center">
          <Button
            type="primary"
            size="middle"
            className="bg-blue-500"
            onClick={() => showModal('tambah')}>
            Tambah Pembayaran
          </Button>
          <ModalSpp action={actions} open={open} setOpen={setOpen} />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ x: 400 }}
        className="h-[100%]"
      />
    </div>
  )
}
