import { useEffect, useState } from 'react'
import {
  Input,
  Modal,
  Button,
  Spin,
  Space,
  Table,
  InputRef,
  Popconfirm,
  Tag,
  message,
} from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import { SearchOutlined, UserOutlined, IdcardOutlined } from '@ant-design/icons'
import { Dispatch, SetStateAction, useRef } from 'react'
import Highlighter from 'react-highlight-words'
import {
  historyPembayaranSppByPembayaranSppId,
  dataHistoryPembayaranSppUpdate,
} from '@/helper/apiHelper/historyPembayaranSpp'
import { ISelect } from '@/interface/ui/component/dropdown'
import { IDataSppModal } from '@/interface/ui/state/dataSppModal'
import { ModalTambahSppProps } from '@/interface/ui/props/ModalTambahSpp'
import { IDataHistorySppModal } from '@/interface/ui/state/dataHistorySppModal'
import { IHistorySpp } from '@/interface/ui/state/dataHistorySppTable'
import moment from 'moment'
import { convertDate } from '@/helper/util/time'
import { convertMoney } from '@/helper/util/money'
import { getUserInfoWithNullCheck } from '@/helper/util/userInfo'
import { convertDateTime } from '@/helper/util/time'

const currentDate = new Date().toISOString()
// console.log('currentDate', currentDate)
const formatedCurrentDate = moment(currentDate).format('DD MMMM YYYY')

const SPP_BULANAN: number = 200000
const SPP_BULANAN_FORMAT: string = SPP_BULANAN.toLocaleString('en-US')

type DataIndex = keyof IHistorySpp

export function ModalSpp({
  action,
  open,
  setOpen,
  getData,
  setDataSppInput,
  dataSppInput,
  setDataHistorySpp,
  dataHistorySpp,
  dataHistorySppSelect,
  setDataHistorySppSelect,
  getHistoryPembayaranSppByPembayaranSppId,
}: ModalTambahSppProps) {
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [searchedColumn, setSearchedColumn] = useState('')
  const [searchText, setSearchText] = useState('')
  const searchInput = useRef<InputRef>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [userId, setUserId] = useState(0)
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    const user = getUserInfoWithNullCheck()
    if (user) {
      setUserId(user.id)
      setUserRole(user.role)
      // console.log('USER ID on ModalSpp', user.id)
      // console.log('USER ROLE on ModalSpp', user.role)
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

  const getColumnSearchProps = (
    dataIndex: DataIndex,
  ): ColumnType<IHistorySpp> => ({
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

  const handleConfirmBayarHistorySpp = (currentData: IHistorySpp) => {
    // console.log('DATA TO CONFIRM', currentData)
    const user = getUserInfoWithNullCheck()
    const updatedBy = user ? user.id : 0

    //Untuk dilepar ke api
    const currentDate = new Date().toISOString()
    if (currentData && currentData.sudahDibayar !== undefined) {
      currentData.sudahDibayar = true
    }

    if (currentData && currentData.tanggalPembayaran !== undefined) {
      currentData.tanggalPembayaran = currentDate
    }

    // Add the updatedBy property to currentData
    currentData.updatedBy = updatedBy

    // console.log('BAYAR DATA', currentData)

    let currentPembayaranSppId: number
    if (currentData && currentData.pembayaranSppId !== undefined) {
      currentPembayaranSppId = currentData.pembayaranSppId
      // console.log('currentPembayaranSppId', currentPembayaranSppId)
    }

    dataHistoryPembayaranSppUpdate(currentData)
      .then((response: any) => {
        // getData()
        getHistoryPembayaranSppByPembayaranSppId(currentPembayaranSppId)
        getData()
        setConfirmLoading(false)
        message.success('Pembayaran Sukses')
      })
      .then(response => {
        // setOpen(false)
        setOpen(true)
      })
      .catch((error: any) => {
        // setOpen(false)
        setOpen(true)
      })
  }

  const handleCancelBayarHistorySpp = () => {}

  let columns: ColumnsType<IHistorySpp> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      width: '13%',
      ...getColumnSearchProps('id'),
      sorter: (a, b) => a.id - b.id,
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
      render: jumlah => convertMoney(jumlah),
    },
    {
      title: 'Jatuh Tempo',
      dataIndex: 'jatuhTempo',
      key: 'jatuhTempo',
      width: '23%',
      ...getColumnSearchProps('jatuhTempo'),
      sorter: (a, b) => a.jatuhTempo.localeCompare(b.jatuhTempo),
      sortDirections: ['descend', 'ascend'],
      render: jatuhTempo => convertDate(jatuhTempo),
    },
    {
      title: 'Sudah Dibayar',
      dataIndex: 'sudahDibayar',
      key: 'sudahDibayar',
      width: '20%',
      ...getColumnSearchProps('sudahDibayar'),
      sorter: (a, b) => (a.sudahDibayar ? 1 : -1) - (b.sudahDibayar ? 1 : -1),
      sortDirections: ['descend', 'ascend'],
      render: sudahDibayar =>
        sudahDibayar ? (
          <Tag color="#87d068">Sudah</Tag>
        ) : (
          <Tag color="#f50">Belum</Tag>
        ),
    },
    {
      title: 'Tanggal Pembayaran',
      dataIndex: 'tanggalPembayaran',
      key: 'tanggalPembayaran',
      width: '20%',
      ...getColumnSearchProps('tanggalPembayaran'),
      sorter: (a, b) => a.tanggalPembayaran.localeCompare(b.tanggalPembayaran),
      sortDirections: ['descend', 'ascend'],
      render: tanggalPembayaran => convertDate(tanggalPembayaran),
    },
    {
      title: 'Updated By',
      dataIndex: ['user', 'username'],
      key: 'updatedBy',
      width: '20%',
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
      render: (_: any, record: any) => (
        <Space size="small" split>
          {!record.sudahDibayar && (
            <Popconfirm
              title={`Pembayaran No ${record.id} ?`}
              description={`Anda Yakin ingin Konfirmasi Pembayaran No ${record.id} ?`}
              onConfirm={e => handleConfirmBayarHistorySpp(record)}
              onCancel={handleCancelBayarHistorySpp}
              okText="Yes"
              okButtonProps={{ className: 'bg-blue-500', size: 'small' }}
              cancelText="No">
              <Button type="primary" size="middle" className="bg-blue-500">
                BAYAR
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

  const handleCancel = () => {
    // console.log('Clicked cancel button')
    setOpen(false)
  }

  const handlePrint = () => {
    console.log('PRINT CLICKED')
  }

  return (
    <Modal
      title="PEMBAYARAN SPP"
      open={open}
      okButtonProps={{ className: 'bg-blue-500' }}
      confirmLoading={confirmLoading}
      width="80%"
      footer={null}
      onCancel={handleCancel}>
      <div className="flex flex-col">
        {dataSppInput ? (
          <>
            <div className="w-[50%] flex my-2">
              <div className="w-[50%]">NIS</div>
              <div className="w-[50%]">{dataSppInput?.siswa?.nim}</div>
            </div>
            <div className="w-[50%] flex my-2">
              <div className="w-[50%]">Nama</div>
              <div className="w-[50%]">{dataSppInput?.siswa?.nama}</div>
            </div>
            <div className="w-[50%] flex my-2">
              <div className="w-[50%]">Kelas</div>
              <div className="w-[50%]">
                {dataSppInput?.siswa?.kelas?.namaKelas}
              </div>
            </div>
            <div className="w-[50%] flex my-2">
              <div className="w-[50%]">Jurusan</div>
              <div className="w-[50%]">
                {dataSppInput?.siswa?.kelas?.jurusan?.namaJurusan}
              </div>
            </div>
          </>
        ) : (
          <Spin size="large" />
        )}
      </div>
      <div className="flex justify-end my-5">
        <Button
          type="primary"
          size="large"
          className="bg-red-500"
          onClick={handlePrint}
          loading={confirmLoading}>
          PRINT
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={dataHistorySpp}
        scroll={{ x: 400 }}
        className="h-[100%]"
      />
    </Modal>
  )
}
