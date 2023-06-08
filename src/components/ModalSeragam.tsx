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
  Spin,
} from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import { SearchOutlined, UserOutlined, IdcardOutlined } from '@ant-design/icons'
import { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react'
import Highlighter from 'react-highlight-words'
import { convertDate } from '@/helper/util/time'
import { RiShirtLine } from 'react-icons/ri'
import { IoIosResize } from 'react-icons/io'
import { dataHistoryPembayaranSeragamUpdate } from '@/helper/apiHelper/historyPembayaranSeragam'
import { ModalTambahSeragamProps } from '@/interface/ui/props/ModalTambahSeragam'
import { IDataHistorySeragamModal } from '@/interface/ui/state/dataHistorySeragamModal'
import { IHistorySeragam } from '@/interface/ui/state/dataHistorySeragamTable'
import {
  ISeragam,
  IDataSeragamnModal,
} from '@/interface/ui/state/dataSeragamModal'
import {
  tambahSeragam,
  dataSeragamUpdate,
  dataSeragamDelete,
} from '@/helper/apiHelper/seragam'
import moment from 'moment'

type DataIndexHistory = keyof IHistorySeragam
type DataIndexSeragam = keyof ISeragam

export function ModalSeragam({
  action,
  open,
  setOpen,
  getData,
  setDataPembayaranSeragamInput,
  dataPembayaranSeragamInput,
  setDataHistorySeragam,
  dataHistorySeragam,
  setDataSeragam,
  dataSeragam,
  getHistoryPembayaranSeragamByPembayaranSeragamId,
}: ModalTambahSeragamProps) {
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [searchedColumn, setSearchedColumn] = useState('')
  const [searchText, setSearchText] = useState('')
  const searchInput = useRef<InputRef>(null)
  const [harga, setHarga] = useState<number>(0)
  const [namaSeragam, setNamaSeragam] = useState('')
  const [loading, setLoading] = useState<boolean>(false)

  // const [DataPembayaran, setDataPembayaran] = useState<IDetailSeragam>(
  //   {} as IDetailSeragam,
  // )

  // const handleChange = (e: { target: { name: string; value: any } }) =>
  //   setDataPembayaran(prevState => ({
  //     ...prevState,
  //     [e.target.name]: e.target.value,
  //   }))

  const handleReset = (
    clearFilters: () => void,
    confirm: (param?: FilterConfirmProps) => void,
  ) => {
    clearFilters()
    setSearchText('')
    confirm()
  }

  const handleSearchHistory = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndexHistory,
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const getHistorySeragamColumnSearchProps = (
    dataIndex: DataIndexHistory,
  ): ColumnType<IHistorySeragam> => ({
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
            handleSearchHistory(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearchHistory(selectedKeys as string[], confirm, dataIndex)
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

  /////////////

  const handleSearchSeragam = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndexSeragam,
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const getSeragamColumnSearchProps = (
    dataIndex: DataIndexSeragam,
  ): ColumnType<ISeragam> => ({
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
            handleSearchSeragam(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearchSeragam(selectedKeys as string[], confirm, dataIndex)
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
  // const handleKelas = (value: number) => {
  //   setDataPembayaran(prevState => ({ ...prevState, kelasId: value }))
  // }
  // const onSearchKelas = (value: string) => {
  //   console.log('search:', value)
  // }

  const handleSeragamConfirmDelete = async (clickedData: any) => {
    setLoading(true)
    await dataSeragamDelete({ id: clickedData.id })
      .then(response => {
        message.success('Click on Yes')
        getData()
      })
      .then(() => {
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        message.error(error.message)
      })
  }

  const handleSeragamCancelDelete = (e: any) => {
    console.log(e)
    // message.error('Click on No')
  }

  const columnsSeragam: ColumnsType<ISeragam> = [
    {
      title: 'Nomor',
      dataIndex: 'id',
      key: 'id',
      width: '13%',
      ...getSeragamColumnSearchProps('id'),
      sorter: (a, b) => a.id - b.id,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Seragam',
      dataIndex: 'nama',
      key: 'nama',
      width: '20%',
      ...getSeragamColumnSearchProps('nama'),
      sorter: (a, b) => a.nama.localeCompare(b.nama),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Harga',
      dataIndex: 'harga',
      key: 'harga',
      width: '23%',
      ...getSeragamColumnSearchProps('harga'),
      sorter: (a, b) => a.harga - b.harga,
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
            onConfirm={e => handleSeragamConfirmDelete(record)}
            onCancel={handleSeragamCancelDelete}
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

  const columnsHistorySeragam: ColumnsType<IHistorySeragam> = [
    {
      title: 'Nomor',
      dataIndex: 'id',
      key: 'id',
      width: '13%',
      ...getHistorySeragamColumnSearchProps('id'),
      sorter: (a, b) => a.id - b.id,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Seragam',
      dataIndex: ['seragam', 'nama'],
      key: 'seragam',
      width: '20%',
      ...getHistorySeragamColumnSearchProps('seragam'),
      sorter: (a, b) => a.seragam.nama.localeCompare(b.seragam.nama),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Jumlah Dibayar',
      dataIndex: 'jumlahDiBayar',
      key: 'jumlahDiBayar',
      width: '23%',
      ...getHistorySeragamColumnSearchProps('jumlahDiBayar'),
      sorter: (a, b) => a.jumlahDiBayar - b.jumlahDiBayar,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Tanggal Pembayaran',
      dataIndex: 'tanggalPembayaran',
      key: 'tanggalPembayaran',
      width: '20%',
      ...getHistorySeragamColumnSearchProps('tanggalPembayaran'),
      sorter: (a, b) => a.tanggalPembayaran.localeCompare(b.tanggalPembayaran),
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
          {/* <Select
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
          /> */}
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
            {/* <Input
              placeholder="Rp. 250.000"
              name="seragam"
              prefix={<RiShirtLine />}
              onChange={e => handleChange(e)}
              className="w-60"
              required
            /> */}
          </div>
        </div>
      </div>
      <div className="flex justify-end my-5 w-[97%]">
        <Button type="primary" size="large" className="bg-blue-500">
          BAYAR
        </Button>
      </div>
      <Table
        columns={columnsHistorySeragam}
        dataSource={dataHistorySeragam}
        scroll={{ x: 400 }}
        className="h-[100%]"
      />
    </>
  )

  const handleSeragamInput = (e: any) => {
    // console.log('VALUE E', e.target.value)
    setNamaSeragam(e.target.value)
  }

  const handleHargaInput = (e: any) => {
    // console.log('VALUE E', e.target.value)
    setHarga(e.target.value)
  }

  const handleTambahSeragam = () => {
    const newSeragam: IDataSeragamnModal = {
      nama: namaSeragam,
      harga: Number(harga),
    }
    console.log('DATA KE API', newSeragam)

    tambahSeragam(newSeragam)
      .then((response: any) => {
        getData()
      })
      .catch((error: any) => {
        message.error(error.message)
        setOpen(false)
      })
  }

  const headerTambahSeragam = (
    <>
      <div className="my-4 flex flex-col">
        <div className="w-[35%] my-2">Nama Seragam dan Ukuran:</div>
        <Input
          placeholder="Seragam RPL (L)"
          name="seragam"
          prefix={<RiShirtLine />}
          onChange={e => handleSeragamInput(e)}
          className="w-60 my-1"
          required
        />
        <Input
          placeholder="Harga"
          name="harga"
          prefix={<RiShirtLine />}
          onChange={e => handleHargaInput(e)}
          className="w-60 mt-2 mb-3"
          required
        />
        <Button
          type="primary"
          size="middle"
          className="bg-blue-500 w-60 mb-4"
          onClick={handleTambahSeragam}>
          Tambah
        </Button>

        <Spin tip="Loading Data" spinning={loading}>
          <Table
            columns={columnsSeragam}
            dataSource={dataSeragam}
            scroll={{ x: 400 }}
            className="h-[100%]"
          />
        </Spin>
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
