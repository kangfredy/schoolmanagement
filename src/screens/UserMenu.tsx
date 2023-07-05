import { ModalTambahUser } from "@/components/ModalTambahUser"
import { dataUserDeleteService, getUserService } from "@/helper/apiHelper/user"
import { convertDateTime } from "@/helper/util/time"
import { getUserInfoWithNullCheck } from "@/helper/util/userInfo"
import { IUser, IUserModal } from "@/interface/ui/state/dataUser"
import { SearchOutlined } from "@ant-design/icons"
import { InputRef, message, Input, Space, Button, Popconfirm, Spin, Table } from "antd"
import { ColumnType, ColumnsType } from "antd/es/table"
import { FilterConfirmProps } from "antd/es/table/interface"
import React, { useEffect, useRef, useState } from "react"
import Highlighter from "react-highlight-words"

type DataIndex = keyof IUser


export const UserMenu = () => {
    const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)
  const [open, setOpen] = useState(false)
  const [actions, setActions] = useState('')
  const [dataUser, setDataUser] = useState<IUser[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [dataUserInput, setDataUserInput] = useState<IUserModal>(
    {} as IUserModal,
  )
  const [userId, setUserId] = useState(0)
  const [userRole, setUserRole] = useState('')

  const showModal = (action: string, data: IUser) => {
    let dataInput = {
      id: data?.id,
      username: data?.username,
      role: data?.role,
    }
    setDataUserInput(dataInput)
    setActions(action)
    setOpen(true)
  }

  const initiateData = async () => {
    setLoading(true)
    await getUserService()
      .then(response => {
        setDataUser(response.data.userData)
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
    await dataUserDeleteService({ id: clickedData.id, updatedBy: userId })
      .then(response => {
        message.success('Sukses Delete User')
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

  const getColumnSearchProps = (
    dataIndex: DataIndex,
  ): ColumnType<IUser> => ({
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

  let columns: ColumnsType<IUser> = [
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
      dataIndex: 'username',
      key: 'nama',
      width: '30%',
      ...getColumnSearchProps('username'),
      sorter: (a, b) => a.username.localeCompare(b.username),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'updatedBy',
      width: '20%',
      ...getColumnSearchProps('role'),
      sorter: (a, b) => a.role.localeCompare(b.role),
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
            onClick={() => showModal('edit', record)}>
            Edit User
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
            <h2 className="text-xl font-bold text-black">Data User</h2>
          </div>
          <div className="flex items-center">
            <Button
              type="primary"
              size="middle"
              className="bg-blue-500"
              onClick={() => showModal('tambah', {} as IUser)}>
              Tambah User
            </Button>
            <ModalTambahUser
              getData={initiateData}
              action={actions}
              open={open}
              setOpen={setOpen}
              dataUserInput={dataUserInput}
              setDataUserInput={setDataUserInput}
            />
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={dataUser}
          scroll={{ x: 400 }}
          className="h-[100%]"
        />
      </div>
    </Spin>
  )
    }