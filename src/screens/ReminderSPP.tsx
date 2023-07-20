import { getSiswaBelumBayarService } from '@/helper/apiHelper/historyPembayaranSpp'
import { getUserService, dataUserDeleteService } from '@/helper/apiHelper/user'
import { getUserInfoWithNullCheck } from '@/helper/util/userInfo'
import { IReminderSPP } from '@/interface/ui/state/IReminderSPP'
import { SearchOutlined } from '@ant-design/icons'
import {
  InputRef,
  message,
  Input,
  Space,
  Button,
  Popconfirm,
  Spin,
  Table,
} from 'antd'
import { ColumnType, ColumnsType } from 'antd/es/table'
import { FilterConfirmProps } from 'antd/es/table/interface'
import React, { useEffect, useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'

type DataIndex = keyof IReminderSPP

export const ReminderSPP = () => {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)
  const [open, setOpen] = useState(false)
  const [actions, setActions] = useState('')
  const [dataUser, setDataUser] = useState<IReminderSPP[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [userId, setUserId] = useState(0)
  const [userRole, setUserRole] = useState('')

  const initiateData = async () => {
    setLoading(true)
    await getSiswaBelumBayarService()
      .then(response => {
        setDataUser(response.data.getHistoryPembayaranSpp)
      })
      .then(() => {
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
      })
  }

  const getUserData = async () => {
    const user = await getUserInfoWithNullCheck()
    if (user) {
      setUserId(user.id)
      setUserRole(user.role)
    } else {
      console.log('LOCALSTORAGE IS EMPTY')
    }
  }

  useEffect(() => {
    initiateData()
    getUserData()
  }, [])

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm()
    setSearchText(selectedKeys[selectedKeys.length])
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

  function getNestedValue(obj: any, key: string): any {
    const keys = key.split('.')
    let nestedValue = obj
    for (const nestedKey of keys) {
      nestedValue = nestedValue?.[nestedKey]
      if (nestedValue === undefined) {
        break
      }
    }

    return nestedValue
  }

  const getColumnSearchProps = (dataIndex: any): ColumnType<any> => ({
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
          onChange={e => {
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }}
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => {
              handleSearch(selectedKeys as string[], confirm, dataIndex)
              console.log(selectedKeys)
              console.log(confirm)
              console.log(dataIndex)
            }}
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
    onFilter: (value, record) => {
      var nestedValue = record
      for (let i = 0; i < dataIndex.length; i += 2) {
        const nestedObjectKey = dataIndex[i]
        const nestedPropertyKey = dataIndex[i + 1]

        const nestedObject = getNestedValue(nestedValue, nestedObjectKey)
        nestedValue = nestedObject ? nestedObject[nestedPropertyKey] : undefined
        if (nestedValue == undefined && nestedObject.startsWith(value)) {
          return true
        }
        // return true;
      }

      return false
    },
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

  let columns: ColumnsType<IReminderSPP> = [
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
      dataIndex: ['pembayaranSpp', 'siswa', 'nama'],
      key: 'nama',
      width: '30%',
      ...getColumnSearchProps(['pembayaranSpp', 'siswa', 'nama']),
      sorter: (a, b) =>
        a.pembayaranSpp.siswa.nama.localeCompare(b.pembayaranSpp.siswa.nama),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Jurusan',
      dataIndex: ['pembayaranSpp', 'siswa', 'kelas', 'jurusan', 'namaJurusan'],
      key: 'updatedBy',
      width: '20%',
      ...getColumnSearchProps([
        'pembayaranSpp',
        'siswa',
        'kelas',
        'jurusan',
        'namaJurusan',
      ]),
      sorter: (a, b) =>
        a.pembayaranSpp.siswa.kelas.jurusan.namaJurusan.localeCompare(
          b.pembayaranSpp.siswa.kelas.jurusan.namaJurusan,
        ),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Kelas',
      dataIndex: ['pembayaranSpp', 'siswa', 'kelas', 'namaKelas'],
      key: 'updatedBy',
      width: '20%',
      ...getColumnSearchProps(['pembayaranSpp', 'siswa', 'kelas', 'namaKelas']),
      sorter: (a, b) =>
        a.pembayaranSpp.siswa.kelas.namaKelas.localeCompare(
          b.pembayaranSpp.siswa.kelas.namaKelas,
        ),
      sortDirections: ['descend', 'ascend'],
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
            <h2 className="text-xl font-bold text-black">
              Data Siswa yang belum bayar bulan ini
            </h2>
          </div>
          <div className="flex items-center"></div>
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
