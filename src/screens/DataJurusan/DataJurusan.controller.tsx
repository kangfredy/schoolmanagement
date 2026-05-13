/* eslint-disable react-hooks/exhaustive-deps */
import { SearchOutlined } from '@ant-design/icons'
import { InputRef, Popconfirm, message } from 'antd'
import { Button, Input, Space } from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import { useEffect, useRef, useState } from 'react'
import { dataJurusanDelete, getJurusan } from '@/helper/apiHelper/jurusan'
import { IDataJurusanModal } from '@/interface/ui/state/dataJurusanModal'
import { IJurusan } from '@/interface/ui/state/dataJurusanModal'
import { getUserInfoWithNullCheck } from '@/helper/util/userInfo'
import { useUserSession } from '@/hook/useUserSession'
import { convertDateTime } from '@/helper/util/time'
import { FaRegEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

type DataIndex = keyof IJurusan

export function useDataJurusanController() {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState<any>('')
  const searchInput = useRef<InputRef>(null)
  const [open, setOpen] = useState(false)
  const [actions, setActions] = useState('')
  const [dataJurusan, setDataJurusan] = useState<IJurusan[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [dataJurusanInput, setDataJurusanInput] = useState<IDataJurusanModal>(
    {} as IDataJurusanModal,
  )
  const { userId, userRole } = useUserSession()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [hasNextPage, setHasNextPage] = useState(false)

  const showModal = (action: string, data: IJurusan) => {
    const dataInput = {
      id: data?.id,
      namaJurusan: data?.namaJurusan,
      updatedBy: data?.updatedBy,
    }
    setDataJurusanInput(dataInput)
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
      const response = await getJurusan(params)
      setDataJurusan(response.data.getJurusan)
      setHasNextPage(!!response.data.hasNextPage)
      setPagination({ current: page, pageSize })
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
      await dataJurusanDelete({ id: clickedData.id, updatedBy: userId })
      message.success('Sukses Delete Jurusan')
      await initiateData()
    } catch (error: any) {
      message.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getColumnSearchProps = (dataIndex: any): ColumnType<IJurusan> => ({
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

  let columns: ColumnsType<IJurusan> = [
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
      dataIndex: 'namaJurusan',
      key: 'nama',
      width: '30%',
      ...getColumnSearchProps(['namaJurusan']),
      sorter: (a, b) => a.namaJurusan.localeCompare(b.namaJurusan),
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
            type="primary"
            size="middle"
            className="btnPrimary"
            icon={<FaRegEdit />}
            onClick={() => showModal('edit', record)}>
            Edit Jurusan
          </Button>
          {userRole === 'admin' && (
            <Popconfirm
              title="Konfirmasi Delete"
              description="Anda Yakin Ingin Menghapus Data Ini?"
              onConfirm={() => handleConfirmDelete(record)}
              okText="Yes"
              okButtonProps={{ className: 'bg-blue-500', size: 'small' }}
              cancelText="No">
              <Button danger type="primary" size="middle" className="btnPrimary" icon={<MdDelete />}>
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
    dataJurusan,
    open,
    setOpen,
    actions,
    dataJurusanInput,
    setDataJurusanInput,
    showModal,
    initiateData,
    pagination,
    hasNextPage,
    handleTableChange,
  }
}
