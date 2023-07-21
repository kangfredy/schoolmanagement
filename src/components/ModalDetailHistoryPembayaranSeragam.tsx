/* eslint-disable react-hooks/exhaustive-deps */
import { SearchOutlined } from '@ant-design/icons'
import {
  Input,
  Modal,
  Spin,
  message,
  Button,
  Table,
  InputRef,
  Popconfirm,
} from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import Highlighter from 'react-highlight-words'
import { useEffect, useState, useRef } from 'react'
import { Select, Space } from 'antd'
import { SiGoogleclassroom } from 'react-icons/si'
import { IDataSeragamnModal } from '@/interface/ui/state/dataSeragamModal'
import { ModalDetailHistoryPembayaranSeragamProps } from '@/interface/ui/props/ModalDetailHistoryPembayaranSeragam'
import { tambahHistoryPembayaranSeragam } from '@/helper/apiHelper/historyPembayaranSeragam'
import { dataDetailHistoryPembayaranSeragamDelete } from '@/helper/apiHelper/detailHistoryPembayaranSeragam'
import { RiShirtLine } from 'react-icons/ri'
import { IDetailHistorySeragam } from '@/interface/ui/state/dataDetailHistorySeragamTable'
import { IDataHistorySeragamModal } from '@/interface/ui/state/dataHistorySeragamModal'
import { getUserInfoWithNullCheck } from '@/helper/util/userInfo'
import { convertDateTime } from '@/helper/util/time'
import { convertMoney } from '@/helper/util/money'
import { ModalTambahDetailHistorySeragam } from '../components/ModalTambahDetailHistorySeragam'

type DataIndex = keyof IDetailHistorySeragam

export function ModalDetailHistoryPembayaranSeragam({
  open,
  action,
  setOpen,
  getData,
  setDataSeragam,
  dataSeragam,
  setDataDetailHistoryPembayaranSeragam,
  dataDetailHistoryPembayaranSeragam,
  setDataInputFilteredSeragam,
  dataInputFilteredSeragam,
  setDataPembayaranSeragamInput,
  dataPembayaranSeragamInput,
  showModal,
  getHistoryPembayaranSeragamByPembayaranSeragamId,
}: ModalDetailHistoryPembayaranSeragamProps) {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [userId, setUserId] = useState(0)
  const [userRole, setUserRole] = useState('')
  const [jumlahDibayar, setJumlahDibayar] = useState(0)
  const [openDetailHistoryTambah, setOpenDetailHistoryTambah] = useState(false)

  const getUserData = async () => {
    const user = await getUserInfoWithNullCheck()
    if (user) {
      setUserId(user.id)
      setUserRole(user.role)
      // console.log('USER ID ModalTambahHistorySeragam', user.id)
      // console.log('USER ROLE ModalTambahHistorySeragam', user.role)
    } else {
      console.log('LOCALSTORAGE IS EMPTY')
    }
  }

  useEffect(() => {
    // console.log(
    //   'FROM ModalDetailHistoryPembayaranSeragam',
    //   dataDetailHistoryPembayaranSeragam,
    // )
    getUserData()
  }, [])

  const handleCancel = () => {
    setOpen(false)
    // console.log('CANCEL CLICKED')
  }

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
  ): ColumnType<IDetailHistorySeragam> => ({
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

  let columns: ColumnsType<IDetailHistorySeragam> = [
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
      title: 'Nama Seragam',
      dataIndex: ['seragam', 'nama'],
      key: 'seragam',
      width: '20%',
      ...getColumnSearchProps('seragam'),
      sorter: (a, b) => a.seragam.nama.localeCompare(b.seragam.nama),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Harga',
      dataIndex: ['seragam', 'harga'],
      key: 'harga',
      width: '23%',
      ...getColumnSearchProps('seragam'),
      sorter: (a, b) => a.seragam.harga - b.seragam.harga,
      sortDirections: ['descend', 'ascend'],
      render: harga => convertMoney(harga),
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
      render: (_, record) => (
        <Space size="middle" split>
          <Popconfirm
            title="Konfirmasi Delete"
            description="Anda Yakin Ingin Menghapus Data Ini?"
            onConfirm={e => handleConfirmDelete(record)}
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

  if (userRole !== 'admin') {
    // Remove the Updated At column from the columns array if the userRole is not 'admin'
    columns = columns.filter(column => column.key !== 'updatedBy')
    columns = columns.filter(column => column.key !== 'updatedAt')
  }

  //handle Popconfrim
  const handleConfirmDelete = async (clickedData: any) => {
    // console.log('CONFIRM DELETE CLICKED', clickedData.id)
    setConfirmLoading(true)
    await dataDetailHistoryPembayaranSeragamDelete({
      id: clickedData.id,
      updatedBy: userId,
    })
      .then(response => {
        // console.log('dataDetailHistoryPembayaranSeragamDelete', response)
        message.success('Sukses Delete Data')
        let dataInput = {
          id: response.data.getPembayaranSeragam.id,
          siswaId: response.data.getPembayaranSeragam.siswaId,
          tunggakan: response.data.getPembayaranSeragam.tunggakan,
          totalBayar: response.data.getPembayaranSeragam.totalBayar,
          siswa: dataPembayaranSeragamInput.siswa,
          kelas: dataPembayaranSeragamInput.siswa.kelas,
          jurusan: dataPembayaranSeragamInput.siswa?.kelas.jurusan,
          updatedAt: response.data.getPembayaranSeragam.updatedAt,
          updatedBy: response.data.getPembayaranSeragam.updatedBy,
          user: dataPembayaranSeragamInput.user,
        }
        // console.log(
        //   'dataInput dataDetailHistoryPembayaranSeragamDelete',
        //   dataInput,
        // )
        showModal(action, dataInput)
        getData()
      })
      .then(() => {
        setConfirmLoading(false)
      })
      .catch(error => {
        setConfirmLoading(false)
        message.error(error.message)
      })
  }

  const handleTambahDetailHistoryPembayaranSeragam = () => {
    // console.log('CLICKED handleTambahDetailHistoryPembayaranSeragam')
    setOpenDetailHistoryTambah(true)
  }

  return (
    <Modal
      title="DETAIL SERAGAM SISWA"
      open={open}
      // onOk={handleOk}
      footer={null}
      width={'60%'}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}>
      <>
        <div className="flex flex-col">
          {dataPembayaranSeragamInput ? (
            <>
              <div className="w-[50%] flex my-2">
                <div className="w-[50%]">NISN</div>
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
                  {
                    dataPembayaranSeragamInput?.siswa?.kelas?.jurusan
                      ?.namaJurusan
                  }
                </div>
              </div>
            </>
          ) : (
            <div className="flex justify-center">
              <Spin size="large" />
            </div>
          )}
        </div>
        <div className="flex justify-end my-5 w-[97%]">
          <Button
            type="primary"
            size="large"
            className="bg-blue-500 ml-2"
            onClick={() => handleTambahDetailHistoryPembayaranSeragam()}>
            TAMBAH SERAGAM
          </Button>
        </div>
        {dataDetailHistoryPembayaranSeragam === null ? (
          <div className="flex justify-center">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={dataDetailHistoryPembayaranSeragam}
            scroll={{ x: 400 }}
            className="h-[100%]"
          />
        )}
      </>
      <ModalTambahDetailHistorySeragam
        getData={getData}
        action={action}
        open={openDetailHistoryTambah}
        setOpen={setOpenDetailHistoryTambah}
        dataSeragam={dataSeragam}
        setDataSeragam={setDataSeragam}
        dataInputFilteredSeragam={dataInputFilteredSeragam}
        setDataInputFilteredSeragam={setDataInputFilteredSeragam}
        setDataPembayaranSeragamInput={setDataPembayaranSeragamInput}
        dataPembayaranSeragamInput={dataPembayaranSeragamInput}
        showModal={showModal}
        getHistoryPembayaranSeragamByPembayaranSeragamId={
          getHistoryPembayaranSeragamByPembayaranSeragamId
        }
      />
    </Modal>
  )
}
