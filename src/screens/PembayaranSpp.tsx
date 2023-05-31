import { SearchOutlined } from '@ant-design/icons'
import { InputRef, Modal, Popconfirm, Spin, message } from 'antd'
import { Button, Input, Space, Table } from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import React, { useEffect, useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { ModalSpp } from '../components/ModalSpp'
import { getPembayaranSpp } from '@/helper/apiHelper/pembayaranSpp'
import { IDataSpp } from '@/interface/ui/state/dataSppTable'
import { IDataSppModal } from '@/interface/ui/state/dataSppModal'

type DataIndex = keyof IDataSpp

export const PembayaranSpp = () => {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)
  const [open, setOpen] = useState(false)
  const [actions, setActions] = useState('')
  const [DataSpp, setDatanSpp] = useState<IDataSpp[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [dataSppInput, setDatSppInput] = useState<IDataSppModal>(
    {} as IDataSppModal,
  )

  const showModal = (action: string, data: IDataSpp) => {
    let dataInput = {
      id: data?.id,
      siswaId: data?.siswaId,
      nama: data?.nama,
      tunggakan: data?.tunggakan,
      totalbayar: data?.totalbayar,
    }
    setDatSppInput(dataInput)
    setActions(action)
    setOpen(true)
  }

  const initiateData = async () => {
    setLoading(true)
    await getPembayaranSpp()
      .then(response => {
        const arrayTemp: IDataSpp[] = [] // Define and initialize arrayTemp
        response.data.getPembayaranSpp?.map((datas: any) => {
          const object1: IDataSpp = {
            id: datas?.id,
            siswaId: datas?.siswaId,
            nama: datas?.nama,
            tunggakan: datas?.tunggakan,
            totalbayar: datas?.totalbayar,
          }
          arrayTemp.push(object1)
        })
        console.log(arrayTemp)
        //Assign the mapped array to the state
        setDatanSpp(arrayTemp)
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
  ): ColumnType<IDataSpp> => ({
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

  const columns: ColumnsType<IDataSpp> = [
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
    <Spin tip="Loading Data" spinning={loading}>
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
          // dataSource={PembayaranSpp}
          scroll={{ x: 400 }}
          className="h-[100%]"
        />
      </div>
    </Spin>
  )
}
