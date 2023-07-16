import { SearchOutlined } from '@ant-design/icons'
import { InputRef, Modal, Popconfirm, Spin, message } from 'antd'
import { Button, Input, Space, Table } from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import React, { useEffect, useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { ModalTambahKelas } from '../components/ModalTambahKelas'
import { dataKelasDelete, getDataKelas } from '@/helper/apiHelper/kelas'
import { IDataKelasModal } from '@/interface/ui/state/dataKelasModal'
import { Ikelas } from '@/interface/ui/state/dataKelasTable'
import { getUserInfoWithNullCheck } from '@/helper/util/userInfo'
import { convertDateTime } from '@/helper/util/time'

type DataIndex = keyof Ikelas

export const DataKelas = () => {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)
  const [open, setOpen] = useState(false)
  const [actions, setActions] = useState('')
  const [dataKelas, setDataKelas] = useState<Ikelas[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [dataKelasInput, setDataKelasInput] = useState<IDataKelasModal>(
    {} as IDataKelasModal,
  )
  const [userId, setUserId] = useState(0)
  const [userRole, setUserRole] = useState('')

  const showModal = (action: string, data: Ikelas) => {
    let dataInput = {
      id: data?.id,
      namaKelas: data?.namaKelas,
      jurusanId: data?.jurusan?.id,
      updatedBy: data?.updatedBy,
    }
    setDataKelasInput(dataInput)
    setActions(action)
    setOpen(true)
  }

  const initiateData = async () => {
    setLoading(true)
    await getDataKelas()
      .then(response => {
        setDataKelas(response.data.getKelas)
      })
      .then(() => {
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
      })
  }

  useEffect(() => {
    initiateData()
    const user = getUserInfoWithNullCheck()
    if (user) {
      setUserId(user.id)
      setUserRole(user.role)
      // console.log('USER ID', user.id)
      // console.log('USER ROLE', user.role)
    } else {
      console.log('LOCALSTORAGE IS EMPTY')
    }
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
  const handleConfirmDelete = async (clickedData: any) => {
    setLoading(true)
    await dataKelasDelete({ id: clickedData.id, updatedBy: userId })
      .then(response => {
        message.success('Sukses Delete Kelas')
        initiateData()
      })
      .then(() => {
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        message.error(error.message)
      })
  }

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Ikelas> => ({
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

  let columns: ColumnsType<Ikelas> = [
    {
      title: 'No',
      dataIndex: 'index',
      key: 'index',
      width: '13%',
      render: (text, record, index) => index + 1,
      sorter: (a, b) => a.id - b.id,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Nama',
      dataIndex: 'namaKelas',
      key: 'nama',
      width: '50%',
      ...getColumnSearchProps('namaKelas'),
      sorter: (a, b) => a.namaKelas.localeCompare(b.namaKelas),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'jurusan',
      dataIndex: ['jurusan', 'namaJurusan'],
      key: 'jurusan',
      width: '40%',
      ...getColumnSearchProps('jurusan'),
      sorter: (a, b) =>
        a.jurusan.namaJurusan.localeCompare(b.jurusan.namaJurusan),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Updated By',
      dataIndex: ['user', 'username'],
      key: 'updatedBy',
      width: '10%',
      ...getColumnSearchProps('user'),
      sorter: (a, b) => a.user.username.localeCompare(b.user.username),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: '40%',
      ...getColumnSearchProps('updatedAt'),
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
            type="primary"
            size="middle"
            className="bg-blue-500"
            onClick={() => showModal('edit', record)}>
            Edit Kelas
          </Button>
          {userRole === 'admin' && (
            <Popconfirm
              title="Konfirmasi Delete"
              description="Anda Yakin Ingin Menghapus Data Ini?"
              onConfirm={e => handleConfirmDelete(record)}
              okText="Yes"
              okButtonProps={{ className: 'bg-blue-500', size: 'small' }}
              cancelText="No">
              <Button
                danger
                type="primary"
                size="middle"
                className="bg-blue-500">
                Delete
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  if (userRole !== 'admin') {
    // Remove the Updated At column from the columns array if the userRole is not 'admin'
    columns = columns.filter(column => column.key !== 'updatedBy')
    columns = columns.filter(column => column.key !== 'updatedAt')
  }

  return (
    <Spin tip="Loading Data" spinning={loading}>
      <div className="rounded-md bg-white p-2 h-[100%] overflow-scroll">
        <div className="my-4 flex items-center justify-between px-4">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-black">Data Kelas</h2>
          </div>
          <div className="flex items-center">
            <Button
              type="primary"
              size="middle"
              className="bg-blue-500"
              onClick={() => showModal('tambah', {} as Ikelas)}>
              Tambah Kelas
            </Button>
            <ModalTambahKelas
              getData={initiateData}
              action={actions}
              open={open}
              setOpen={setOpen}
              dataKelasInput={dataKelasInput}
              setDataKelasInput={setDataKelasInput}
            />
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={dataKelas}
          scroll={{ x: 400 }}
          className="h-[100%]"
        />
      </div>
    </Spin>
  )
}
