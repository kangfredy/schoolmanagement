import { SearchOutlined } from '@ant-design/icons'
import { InputRef, Modal, Popconfirm, message, Spin } from 'antd'
import { Button, Input, Space, Table } from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import React, { useEffect, useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { ModalSpp } from '../components/ModalSpp'
import { getPembayaranSpp } from '@/helper/apiHelper/pembayaranSpp'
import { getHistoryPembayaranSpp } from '@/helper/apiHelper/historyPembayaranSpp'
import { IDataSppModal } from '@/interface/ui/state/dataSppModal'
import { ISpp } from '@/interface/ui/state/dataSppTable'
import {
  historyPembayaranSppByPembayaranSppId,
  dataHistoryPembayaranSppUpdate,
} from '@/helper/apiHelper/historyPembayaranSpp'
import { IHistorySpp } from '@/interface/ui/state/dataHistorySppTable'
import { ISelect } from '@/interface/ui/component/dropdown'
import { convertMoney } from '@/helper/util/money'
import { getUserInfoWithNullCheck } from '@/helper/util/userInfo'
import { convertDateTime } from '@/helper/util/time'

type DataIndex = keyof ISpp

export const PembayaranSpp = () => {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)
  const [open, setOpen] = useState(false)
  const [actions, setActions] = useState('')
  const [dataSpp, setDataSpp] = useState<ISpp[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [dataSppInput, setDataSppInput] = useState<ISpp>({} as ISpp)
  const [dataHistorySpp, setDataHistorySpp] = useState<IHistorySpp[]>([])
  const [dataHistorySppSelect, setDataHistorySppSelect] = useState<ISelect[]>(
    [] as ISelect[],
  )
  const [dataAllHistorySpp, setDataAllHistorySpp] = useState<IHistorySpp[]>([])
  const [userId, setUserId] = useState(0)
  const [userRole, setUserRole] = useState('')

  // const getHistorySppById = (id: number) => {
  //   historyPembayaranSppByPembayaranSppId(1)
  //     .then(response => {
  //       console.log(
  //         'ID',
  //         response.data.getHistoryPembayaranSppById[0].pembayaranSppId,
  //       )
  //       console.log('historyPembayaranSppByPembayaranSppId ', response)
  //       const arrayDataTemp: IHistorySpp[] = []
  //       const arraySelectTemp: any[] = []

  //       response.data.getHistoryPembayaranSppById?.map((datas: any) => {
  //         const object1: IHistorySpp = {
  //           id: datas?.id,
  //           pembayaranSppId: datas?.pembayaranSppId,
  //           jatuhTempo: datas?.jatuhTempo,
  //           jumlah: datas?.jumlah,
  //           sudahDibayar: datas?.sudahDibayar,
  //           tanggalPembayaran: datas?.tanggalPembayaran,
  //           pembayaranSpp: datas?.pembayaranSpp,
  //         }
  //         arrayDataTemp.push(object1)

  //         const object2: any = {
  //           value: datas.id,
  //           label: datas.id,
  //         }
  //         arraySelectTemp.push(object2)
  //       })

  //       //Assign the mapped array to the state
  //       setDataHistorySpp(arrayDataTemp)
  //       setDataHistorySppSelect(arraySelectTemp)
  //     })
  //     .then(response => {
  //       setLoading(false)
  //     })
  //     .catch(error => {
  //       console.error(error.message)
  //       setLoading(false)
  //     })
  // }

  // const showModal = (action: string, data: ISpp) => {
  //   let dataInput = {
  //     id: data?.id,
  //     siswaId: data?.siswaId,
  //     tunggakan: data?.tunggakan,
  //     totalBayar: data?.totalBayar,
  //     siswa: data?.siswa,
  //     kelas: data?.siswa.kelas,
  //     jurusan: data?.siswa?.kelas.jurusan,
  //   }
  //   setDataSppInput(dataInput)
  //   setActions(action)
  //   setOpen(true)
  // }

  const showModal = (data: ISpp) => {
    let dataInput = {
      id: data?.id,
      siswaId: data?.siswaId,
      tunggakan: data?.tunggakan,
      totalBayar: data?.totalBayar,
      siswa: data?.siswa,
      kelas: data?.siswa.kelas,
      jurusan: data?.siswa?.kelas.jurusan,
      updatedAt: data?.updatedAt,
      updatedBy: data?.updatedBy,
      user: data?.user,
    }

    // console.log('CURRENT tunggakan', convertMoney(data?.tunggakan))
    // console.log('CURRENT totalBayar', convertMoney(data?.totalBayar))

    setDataSppInput(dataInput)

    getHistoryPembayaranSppByPembayaranSppId(data?.id)
  }

  const getHistoryPembayaranSppByPembayaranSppId = (id: number) => {
    historyPembayaranSppByPembayaranSppId(id)
      .then(response => {
        // console.log(
        //   'ID',
        //   response.data.getHistoryPembayaranSppById[0].pembayaranSppId,
        // )
        // console.log('historyPembayaranSppByPembayaranSppId ', response)
        const arrayDataTemp: IHistorySpp[] = []
        const arraySelectTemp: any[] = []

        response.data.getHistoryPembayaranSppById?.map((datas: any) => {
          const object1: IHistorySpp = {
            id: datas?.id,
            pembayaranSppId: datas?.pembayaranSppId,
            jatuhTempo: datas?.jatuhTempo,
            jumlah: datas?.jumlah,
            sudahDibayar: datas?.sudahDibayar,
            tanggalPembayaran: datas?.tanggalPembayaran,
            pembayaranSpp: datas?.pembayaranSpp,
            updatedAt: datas?.updatedAt,
            updatedBy: datas?.updatedBy,
            user: datas?.user,
          }
          arrayDataTemp.push(object1)

          const object2: any = {
            value: datas.id,
            label: datas.id,
          }
          arraySelectTemp.push(object2)
        })

        //Assign the mapped array to the state
        setDataHistorySpp(arrayDataTemp)
        // console.log('DATA HISTORY SPP', arrayDataTemp)
        setDataHistorySppSelect(arraySelectTemp)

        setOpen(true)
      })
      .then(response => {
        setLoading(false)
      })
      .catch(error => {
        console.error(error.message)
        setLoading(false)
      })
  }

  const initiateData = async () => {
    setLoading(true)
    try {
      const response1 = await getPembayaranSpp()
      const arrayTemp1: ISpp[] = []
      response1.data.getPembayaranSpp?.map((datas: any) => {
        const object1: ISpp = {
          id: datas?.id,
          siswaId: datas?.siswaId,
          tunggakan: datas?.tunggakan,
          totalBayar: datas?.totalBayar,
          siswa: datas?.siswa,
          updatedAt: datas?.updatedAt,
          updatedBy: datas?.updatedBy,
          user: datas?.user,
        }
        arrayTemp1.push(object1)
      })
      setDataSpp(arrayTemp1)

      const response2 = await getHistoryPembayaranSpp()
      const arrayTemp2: IHistorySpp[] = []
      response2.data.getHistoryPembayaranSpp?.map((datas: any) => {
        const object2: IHistorySpp = {
          id: datas?.id,
          pembayaranSppId: datas?.pembayaranSppId,
          jatuhTempo: datas?.jatuhTempo,
          jumlah: datas?.jumlah,
          sudahDibayar: datas?.sudahDibayar,
          tanggalPembayaran: datas?.tanggalPembayaran,
          pembayaranSpp: datas?.pembayaranSpp,
          updatedAt: datas?.updatedAt,
          updatedBy: datas?.updatedBy,
          user: datas?.user,
        }
        arrayTemp2.push(object2)
      })
      setDataAllHistorySpp(arrayTemp2)
      // console.log('setDataAllHistorySpp', arrayTemp2)

      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    initiateData()
    const user = getUserInfoWithNullCheck()
    if (user) {
      setUserId(user.id)
      setUserRole(user.role)
      // console.log('USER ID', user.id)
      // console.log('USER ROLE', user.role)
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
  const handleConfirmDelete = (e: any) => {
    // console.log(e)
    message.success('Click on Yes')
  }

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<ISpp> => ({
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

  let columns: ColumnsType<ISpp> = [
    {
      title: 'NIM',
      dataIndex: ['siswa', 'nim'],
      key: 'nim',
      width: '13%',
      ...getColumnSearchProps('siswa'),
      sorter: (a, b) => a.siswa.nim.localeCompare(b.siswa.nim),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Nama',
      dataIndex: ['siswa', 'nama'],
      key: 'nama',
      width: '40%',
      ...getColumnSearchProps('siswa'),
      sorter: (a, b) => a.siswa.nama.localeCompare(b.siswa.nama),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Kelas',
      dataIndex: ['siswa', 'kelas', 'namaKelas'],
      key: 'kelas',
      width: '20%',
      ...getColumnSearchProps('siswa'),
      sorter: (a, b) =>
        a.siswa.kelas.namaKelas.localeCompare(b.siswa.kelas.namaKelas),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Jurusan',
      dataIndex: ['siswa', 'kelas', 'jurusan', 'namaJurusan'],
      key: 'jurusan',
      width: '20%',
      ...getColumnSearchProps('siswa'),
      sorter: (a, b) =>
        a.siswa.kelas.jurusan.namaJurusan.localeCompare(
          b.siswa.kelas.jurusan.namaJurusan,
        ),
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
      render: tunggakan => convertMoney(tunggakan),
    },
    {
      title: 'Total Pembayaran',
      dataIndex: 'totalBayar',
      key: 'totalBayar',
      width: '20%',
      ...getColumnSearchProps('totalBayar'),
      sorter: (a: any, b: any) => a.totalBayar - b.totalBayar,
      sortDirections: ['descend', 'ascend'],
      render: totalBayar => convertMoney(totalBayar),
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
          <Button
            type="primary"
            size="middle"
            className="bg-blue-500"
            onClick={() => showModal(record)}>
            Pembayaran
          </Button>
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
    <>
      <ModalSpp
        getData={initiateData}
        action={actions}
        open={open}
        setOpen={setOpen}
        dataSppInput={dataSppInput}
        setDataSppInput={setDataSppInput}
        dataHistorySpp={dataHistorySpp}
        setDataHistorySpp={setDataHistorySpp}
        dataHistorySppSelect={dataHistorySppSelect}
        setDataHistorySppSelect={setDataHistorySppSelect}
        showModal={showModal}
        getHistoryPembayaranSppByPembayaranSppId={
          getHistoryPembayaranSppByPembayaranSppId
        }
      />

      <Spin tip="Loading Data" spinning={loading}>
        <div className="rounded-md bg-white p-2 h-[100%] overflow-scroll">
          <div className="my-4 flex items-center justify-between px-4">
            <div className="flex items-center">
              <h2 className="text-xl font-bold text-black">Pembayaran SPP</h2>
            </div>
            <div className="flex items-center">
              {/* <Button
            type="primary"
            size="middle"
            className="bg-blue-500"
            onClick={() => showModal('tambah')}>
            Tambah Pembayaran
          </Button> */}
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={dataSpp}
            scroll={{ x: 400 }}
            className="h-[100%]"
          />
        </div>
      </Spin>
    </>
  )
}
