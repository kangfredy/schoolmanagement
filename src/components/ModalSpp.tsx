import { useEffect, useState } from 'react'
import {
  Input,
  Modal,
  Button,
  Select,
  Space,
  Table,
  InputRef,
  Popconfirm,
  Tag,
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

const currentDate = new Date().toISOString()
console.log('currentDate', currentDate)
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
  const [idHistory, setIdHistory] = useState<number | undefined>(undefined)

  // useEffect(() => {}, [])

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

  const columns: ColumnsType<IHistorySpp> = [
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
    },
    {
      title: 'Jatuh Tempo',
      dataIndex: 'jatuhTempo',
      key: 'jatuhTempo',
      width: '23%',
      ...getColumnSearchProps('jatuhTempo'),
      sorter: (a, b) => a.jatuhTempo.localeCompare(b.jatuhTempo),
      sortDirections: ['descend', 'ascend'],
      render: jatuhTempo => moment(jatuhTempo).format('DD-MM-YYYY'),
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
      render: tanggalPembayaran =>
        tanggalPembayaran
          ? moment(tanggalPembayaran).format('DD-MM-YYYY')
          : '-',
    },
  ]

  const handleCancel = () => {
    console.log('Clicked cancel button')
    setIdHistory(undefined)
    setOpen(false)
  }

  const handleHistorySppSelect = (value: number) => {
    console.log('ID HISTORY :', value)
    setIdHistory(value)
  }

  const handleBayar = () => {
    console.log('ID HISTORY BAYAR:', idHistory)

    const currentData = dataHistorySpp.find(obj => obj.id === idHistory)
    if (currentData && currentData.sudahDibayar !== undefined) {
      currentData.sudahDibayar = true
    }

    if (currentData && currentData.tanggalPembayaran !== undefined) {
      currentData.tanggalPembayaran = currentDate
    }

    console.log('BAYAR DATA', currentData)

    let currentPembayaranSppId: number
    if (currentData && currentData.pembayaranSppId !== undefined) {
      currentPembayaranSppId = currentData.pembayaranSppId
    }

    dataHistoryPembayaranSppUpdate(currentData)
      .then((response: any) => {
        // getData()
        getHistoryPembayaranSppByPembayaranSppId(currentPembayaranSppId)
        setConfirmLoading(false)
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
        <div className="w-[50%] flex my-2">
          <div className="w-[50%]">ID</div>
          <Select
            showSearch
            placeholder="Pilih HISTORY ID"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            onChange={handleHistorySppSelect}
            options={dataHistorySppSelect}
            className="ml-2 w-60"
            value={idHistory}
          />
        </div>
        <div className="w-[50%] flex my-2">
          <div className="w-[50%]">Tanggal Pembayaran</div>
          <div className="w-[50%]">{formatedCurrentDate}</div>
        </div>
        <div className="w-[50%] flex my-2">
          <div className="w-[50%]">Jumlah Di Bayar</div>
          <div className="w-[50%]">Rp {SPP_BULANAN_FORMAT}</div>
        </div>
      </div>
      <div className="flex justify-end my-5">
        <Button
          type="primary"
          size="large"
          className="bg-red-500"
          onClick={handleBayar}
          loading={confirmLoading}>
          BAYAR
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
