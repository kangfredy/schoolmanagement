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
import { convertMoney } from '@/helper/util/money'
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
import { ModalTambahSeragamBaru } from '../components/ModalTambahSeragamBaru'
import { ModalTambahHistorySeragam } from '../components/ModalTambahHistorySeragam'
import { ISelect } from '@/interface/ui/component/dropdown'
import { getUserInfoWithNullCheck } from '@/helper/util/userInfo'
import { convertDateTime } from '@/helper/util/time'

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
  showModal,
  getHistoryPembayaranSeragamByPembayaranSeragamId,
}: ModalTambahSeragamProps) {
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [searchedColumn, setSearchedColumn] = useState('')
  const [searchText, setSearchText] = useState('')
  const searchInput = useRef<InputRef>(null)
  const [harga, setHarga] = useState<number>(0)
  const [namaSeragam, setNamaSeragam] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  const [dataSeragamInput, setDataSeragamInput] = useState<IDataSeragamnModal>(
    {} as IDataSeragamnModal,
  )
  const [openTambah, setOpenTambah] = useState(false)
  const [openHistoryTambah, setOpenHistoryTambah] = useState(false)
  const [userId, setUserId] = useState(0)
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    const user = getUserInfoWithNullCheck()
    if (user) {
      setUserId(user.id)
      setUserRole(user.role)
      // console.log('USER ID dari ModelSeragam', user.id)
      // console.log('USER ROLE dari ModelSeragam', user.role)
    } else {
      console.log('LOCALSTORAGE IS EMPTY')
    }
  }, [])

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
    // console.log('Clicked cancel button')
    setHarga(0)
    setNamaSeragam('')
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
    await dataSeragamDelete({ id: clickedData.id, updatedBy: userId })
      .then(response => {
        message.success('Seragam Berhasil Terhapus')
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
    // console.log(e)
    // message.error('Click on No')
  }

  const showModalTambahSeragamBaru = (data: ISeragam) => {
    let dataInput = {
      id: data?.id,
      nama: data?.nama,
      harga: data?.harga,
      updatedBy: data?.updatedBy,
    }
    setDataSeragamInput(dataInput)
    setOpenTambah(true)
  }

  const showModalTambahHistoryPembayaranSeragam = () => {
    setOpenHistoryTambah(true)
  }

  let columnsSeragam: ColumnsType<ISeragam> = [
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
      render: harga => convertMoney(harga),
    },
    {
      title: 'Updated By',
      dataIndex: ['user', 'username'],
      key: 'updatedBy',
      width: '20%',
      ...getSeragamColumnSearchProps('user'),
      sorter: (a, b) => a.user.username.localeCompare(b.user.username),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: '40%',
      ...getSeragamColumnSearchProps('updatedAt'),
      sorter: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
      sortDirections: ['descend', 'ascend'],
      render: updatedAt => convertDateTime(updatedAt),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small" split>
          <Button
            type="primary"
            size="middle"
            className="bg-blue-500"
            onClick={() => showModalTambahSeragamBaru(record)}>
            Edit
          </Button>
          {userRole === 'admin' && (
            <Popconfirm
              title="Hapus Data?"
              description="Apakah benar ingin menghapus data ini?"
              onConfirm={e => handleSeragamConfirmDelete(record)}
              onCancel={handleSeragamCancelDelete}
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

  const handleConfirmBayarHistorySeragam = (currentData: IHistorySeragam) => {
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

    let currentPembayaranSeragamId: number
    if (currentData && currentData.pembayaranSeragamId !== undefined) {
      currentPembayaranSeragamId = currentData.pembayaranSeragamId
      // console.log('currentPembayaranSeragamId', currentPembayaranSeragamId)
    }

    dataHistoryPembayaranSeragamUpdate(
      currentData,
      dataPembayaranSeragamInput.siswaId,
      dataPembayaranSeragamInput.tunggakan,
      dataPembayaranSeragamInput.totalBayar,
    )
      .then((response: any) => {
        let dataInput = {
          id: response.data.updatePembayaranSeragam.id,
          siswaId: response.data.updatePembayaranSeragam.siswaId,
          tunggakan: response.data.updatePembayaranSeragam.tunggakan,
          totalBayar: response.data.updatePembayaranSeragam.totalBayar,
          siswa: dataPembayaranSeragamInput.siswa,
          kelas: dataPembayaranSeragamInput.siswa.kelas,
          jurusan: dataPembayaranSeragamInput.siswa?.kelas.jurusan,
          updatedAt: response.data.updatePembayaranSeragam.updatedAt,
          updatedBy: response.data.updatePembayaranSeragam.updatedBy,
          user: dataPembayaranSeragamInput.user,
        }
        showModal(action, dataInput)
        getData()
        // getHistoryPembayaranSeragamByPembayaranSeragamId(
        //   currentPembayaranSeragamId,
        //   action,
        // )
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

  const handleCancelBayarHistorySeragam = () => {}

  let columnsHistorySeragam: ColumnsType<IHistorySeragam> = [
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
      dataIndex: ['seragam', 'harga'],
      key: 'seragam',
      width: '23%',
      ...getHistorySeragamColumnSearchProps('seragam'),
      sorter: (a, b) => a.seragam.harga - b.seragam.harga,
      sortDirections: ['descend', 'ascend'],
      render: harga => convertMoney(harga),
    },
    {
      title: 'Tanggal Pembayaran',
      dataIndex: 'tanggalPembayaran',
      key: 'tanggalPembayaran',
      width: '20%',
      ...getHistorySeragamColumnSearchProps('tanggalPembayaran'),
      sorter: (a, b) => a.tanggalPembayaran.localeCompare(b.tanggalPembayaran),
      sortDirections: ['descend', 'ascend'],
      render: tanggalPembayaran => convertDate(tanggalPembayaran),
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
    {
      title: 'Updated By',
      dataIndex: ['user', 'username'],
      key: 'updatedBy',
      width: '20%',
      ...getHistorySeragamColumnSearchProps('user'),
      sorter: (a, b) => a.user.username.localeCompare(b.user.username),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: '40%',
      ...getHistorySeragamColumnSearchProps('updatedAt'),
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
              onConfirm={e => handleConfirmBayarHistorySeragam(record)}
              onCancel={handleCancelBayarHistorySeragam}
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
    columnsSeragam = columnsSeragam.filter(column => column.key !== 'updatedBy')
    columnsSeragam = columnsSeragam.filter(column => column.key !== 'updatedAt')
    columnsHistorySeragam = columnsHistorySeragam.filter(
      column => column.key !== 'updatedBy',
    )
    columnsHistorySeragam = columnsHistorySeragam.filter(
      column => column.key !== 'updatedAt',
    )
  }

  const headerDetailSeragam = (
    <>
      <div className="flex flex-col">
        {dataPembayaranSeragamInput ? (
          <>
            <div className="w-[50%] flex my-2">
              <div className="w-[50%]">NIS</div>
              <div className="w-[50%]">
                {dataPembayaranSeragamInput?.siswa?.nim}
              </div>
            </div>
            <div className="w-[50%] flex my-2">
              <div className="w-[50%]">Nama</div>
              <div className="w-[50%]">
                {dataPembayaranSeragamInput?.siswa?.nama}
              </div>
            </div>
            <div className="w-[50%] flex my-2">
              <div className="w-[50%]">Kelas</div>
              <div className="w-[50%]">
                {dataPembayaranSeragamInput?.siswa?.kelas?.namaKelas}
              </div>
            </div>
            <div className="w-[50%] flex my-2">
              <div className="w-[50%]">Jurusan</div>
              <div className="w-[50%]">
                {dataPembayaranSeragamInput?.siswa?.kelas?.jurusan?.namaJurusan}
              </div>
            </div>
          </>
        ) : (
          <Spin size="large" />
        )}
      </div>
      <div className="flex justify-end my-5 w-[97%]">
        <Button
          type="primary"
          size="large"
          className="bg-blue-500"
          onClick={() => showModalTambahHistoryPembayaranSeragam()}>
          TAMBAH
        </Button>
        <Button type="primary" size="large" className="bg-blue-500 ml-2">
          PRINT
        </Button>
      </div>
      <Table
        columns={columnsHistorySeragam}
        dataSource={dataHistorySeragam}
        scroll={{ x: 400 }}
        className="h-[100%]"
      />
      <ModalTambahHistorySeragam
        getData={getData}
        action={action}
        open={openHistoryTambah}
        setOpen={setOpenHistoryTambah}
        dataSeragam={dataSeragam}
        setDataSeragam={setDataSeragam}
        setDataPembayaranSeragamInput={setDataPembayaranSeragamInput}
        dataPembayaranSeragamInput={dataPembayaranSeragamInput}
        showModal={showModal}
        getHistoryPembayaranSeragamByPembayaranSeragamId={
          getHistoryPembayaranSeragamByPembayaranSeragamId
        }
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
      updatedBy: userId,
    }
    // console.log('DATA KE API', newSeragam)

    tambahSeragam(newSeragam)
      .then((response: any) => {
        getData()
        setHarga(0)
        setNamaSeragam('')
        message.success('Sukses Tambah Seragam')
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
          value={namaSeragam}
          required
        />
        <Input
          placeholder="Harga"
          name="harga"
          prefix={<RiShirtLine />}
          onChange={e => handleHargaInput(e)}
          className="w-60 mt-2 mb-3"
          value={harga !== 0 ? harga : ''}
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
          <ModalTambahSeragamBaru
            getData={getData}
            open={openTambah}
            setOpen={setOpenTambah}
            dataSeragamInput={dataSeragamInput}
            setDataSeragamInput={setDataSeragamInput}
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
