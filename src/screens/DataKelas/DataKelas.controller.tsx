import { SearchOutlined } from '@ant-design/icons'
import { InputRef, Popconfirm, message } from 'antd'
import { Button, Input, Space } from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import { useEffect, useRef, useState } from 'react'
import { dataKelasDelete, getDataKelas } from '@/helper/apiHelper/kelas'
import { IDataKelasModal } from '@/interface/ui/state/dataKelasModal'
import { Ikelas } from '@/interface/ui/state/dataKelasTable'
import { getUserInfoWithNullCheck } from '@/helper/util/userInfo'
import { useUserSession } from '@/hook/useUserSession'
import { convertDateTime } from '@/helper/util/time'

type DataIndex = keyof Ikelas

export function useDataKelasController() {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState<any>('')
  const searchInput = useRef<InputRef>(null)
  const [open, setOpen] = useState(false)
  const [actions, setActions] = useState('')
  const [dataKelas, setDataKelas] = useState<Ikelas[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [dataKelasInput, setDataKelasInput] = useState<IDataKelasModal>(
    {} as IDataKelasModal,
  )
  const { userId, userRole } = useUserSession()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })

  const showModal = (action: string, data: Ikelas) => {
    const dataInput = {
      id: data?.id,
      namaKelas: data?.namaKelas,
      jurusanId: data?.jurusan?.id,
      updatedBy: data?.updatedBy,
    }
    setDataKelasInput(dataInput)
    setActions(action)
    setOpen(true)
  }

  const initiateData = async (page = pagination.current, pageSize = pagination.pageSize, searchCol = searchedColumn, searchTxt = searchText) => {
    try {
      setLoading(true)
      const params = {
        page,
        pageSize,
        searchColumn: Array.isArray(searchCol) ? searchCol.join(',') : searchCol,
        searchText: searchTxt,
      }
      const response = await getDataKelas(params)
      setDataKelas(response.data.getKelas)
      const hasNextPage = response.data.hasNextPage
      const simulatedTotal = hasNextPage ? page * pageSize + 1 : (page - 1) * pageSize + arrayTemp.length
      setPagination(prev => ({ ...prev, total: simulatedTotal, current: page, pageSize }))
    } catch {
      // ignore
    } finally {
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

  const handleConfirmDelete = async (clickedData: any) => {
    try {
      setLoading(true)
      await dataKelasDelete({ id: clickedData.id, updatedBy: userId })
      message.success('Sukses Delete Kelas')
      await initiateData()
    } catch (error: any) {
      message.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getColumnSearchProps = (dataIndex: any): ColumnType<Ikelas> => ({
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

  let columns: ColumnsType<Ikelas> = [
    {
      title: 'No',
      dataIndex: 'index',
      key: 'index',
      width: '13%',
      render: (text, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
      sorter: (a, b) => a.id - b.id,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Nama',
      dataIndex: 'namaKelas',
      key: 'nama',
      width: '50%',
      ...getColumnSearchProps(['namaKelas']),
      sorter: (a, b) => a.namaKelas.localeCompare(b.namaKelas),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Jurusan',
      dataIndex: ['jurusan', 'namaJurusan'],
      key: 'jurusan',
      width: '40%',
      ...getColumnSearchProps(['jurusan', 'namaJurusan']),
      sorter: (a, b) =>
        a.jurusan.namaJurusan.localeCompare(b.jurusan.namaJurusan),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Updated By',
      dataIndex: ['user', 'username'],
      key: 'updatedBy',
      width: '10%',
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
            type="primary"
            size="middle"
            className="btnPrimary"
            onClick={() => showModal('edit', record)}>
            Edit Kelas
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
    dataKelas,
    open,
    setOpen,
    actions,
    dataKelasInput,
    setDataKelasInput,
    showModal,
    initiateData,
    pagination,
    handleTableChange,
  }
}
