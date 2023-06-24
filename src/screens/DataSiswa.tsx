import { SearchOutlined } from '@ant-design/icons'
import { InputRef, Modal, Popconfirm, Spin, message } from 'antd'
import { Button, Input, Space, Table } from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import React, { useEffect, useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { ModalTambahSiswa } from '../components/ModalTambahSiswa'
import { getDataSiswa, dataSiswaDelete } from '@/helper/apiHelper/dataSiswa'
import { IDataSiswaModal } from '@/interface/ui/state/dataSiswaModal'
import { Isiswa } from '@/interface/ui/state/dataSiswaTable'
import { checkAgama } from '@/helper/util/agama'
import { ModalDetailSiswa } from '@/components/ModalDetailSiswa'
import { historyPembayaranSppBySiswaId } from '@/helper/apiHelper/historyPembayaranSpp'
import { historyPembayaranSeragamBySiswaId } from '@/helper/apiHelper/historyPembayaranSeragam'
import { IHistorySpp } from '@/interface/ui/state/dataHistorySppTable'
import { IHistorySeragam } from '@/interface/ui/state/dataHistorySeragamTable'
import { getUserInfoWithNullCheck } from '@/helper/util/userInfo'
import { convertDateTime } from '@/helper/util/time'

type DataIndex = keyof Isiswa

export const DataSiswa = () => {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)
  const [open, setOpen] = useState(false)
  const [actions, setActions] = useState('')
  const [dataSiswa, setDataSiswa] = useState<Isiswa[]>([])
  const [dataSiswaSelected, setDataSiswaSelected] = useState<Isiswa>(
    {} as Isiswa,
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [dataSiswaInput, setDataSiswaInput] = useState<IDataSiswaModal>(
    {} as IDataSiswaModal,
  )
  const [initialClassId, setInitialClassId] = useState<number | undefined>(
    undefined,
  )

  const [confirmLoading, setConfirmLoading] = useState(false)
  const [openDetail, setOpenDetail] = useState(false)
  const [dataHistorySpp, setDataHistorySpp] = useState<IHistorySpp[]>([])
  const [dataHistorySeragam, setDataHistorySeragam] = useState<
    IHistorySeragam[]
  >([])
  const [userId, setUserId] = useState(0)
  const [userRole, setUserRole] = useState('')

  const getHistoryPembayaranSppBySiswaId = (siswaId: number) => {
    // console.log('getHistoryPembayaranSppBySiswaId SISWA ID', siswaId)

    historyPembayaranSppBySiswaId(siswaId)
      .then(response => {
        // console.log('getHistoryPembayaranSppBySiswaId RESPONSE ', response)

        const arrayHistorySppTemp: IHistorySpp[] = []

        response.data.getHistoryPembayaranSppBySiswaId?.map((datas: any) => {
          const objectHistorySpp: IHistorySpp = {
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
          arrayHistorySppTemp.push(objectHistorySpp)
        })

        //Assign the mapped array to the state
        setDataHistorySpp(arrayHistorySppTemp)
      })
      .then(() => {
        historyPembayaranSeragamBySiswaId(siswaId)
          .then(response => {
            // console.log('historyPembayaranSeragamBySiswaId RESPONSE ', response)

            const arrayHistorySeragamTemp: IHistorySeragam[] = []

            response.data.getHistoryPembayaranSeragamBySiswaId?.map(
              (datas: any) => {
                const objectHistorySeragam: IHistorySeragam = {
                  id: datas?.id,
                  pembayaranSeragamId: datas?.pembayaranSeragamId,
                  seragamId: datas?.seragamId,
                  sudahDibayar: datas?.sudahDibayar,
                  tanggalPembayaran: datas?.tanggalPembayaran,
                  pembayaranSeragam: datas?.pembayaranSeragam,
                  seragam: datas?.seragam,
                  updatedAt: datas?.updatedAt,
                  updatedBy: datas?.updatedBy,
                  user: datas?.user,
                }
                arrayHistorySeragamTemp.push(objectHistorySeragam)
              },
            )

            //Assign the mapped array to the state
            setDataHistorySeragam(arrayHistorySeragamTemp)
          })
          .then(response => {})
          .catch(error => {
            console.error(error.message)
            // setLoading(false)
          })
      })
      .catch(error => {
        console.error(error.message)
        // setLoading(false)
      })
  }

  const showModal = (action: string, data: Isiswa) => {
    if (action == 'detail') {
      getHistoryPembayaranSppBySiswaId(data.id)
      setDataSiswaSelected(data)
      setOpenDetail(true)
    } else {
      let dataInput = {
        id: data?.id,
        nama: data?.nama,
        nim: data?.nim,
        tanggalMasuk: data?.tanggalMasuk,
        tanggalLahir: data?.tanggalLahir,
        alamat: data?.alamat,
        kelasId: data?.kelas?.id,
        jenisKelamin: data?.jenisKelamin,
        agama: data?.agama,
        updatedAt: data?.updatedAt,
        updatedBy: data?.updatedBy,
        user: data?.user,
      }
      setDataSiswaInput(dataInput)
      setInitialClassId(data?.kelas?.id)
      setActions(action)
      setOpen(true)
    }
    // console.log(data)
  }

  const initiateData = async () => {
    setLoading(true)
    await getDataSiswa()
      .then(response => {
        const arrayTemp: Isiswa[] = [] // Define and initialize arrayTemp
        response.data.dataSiswaData?.map((datas: any) => {
          const object1: Isiswa = {
            id: datas?.id,
            nama: datas?.nama,
            nim: datas?.nim,
            tanggalMasuk: datas?.tanggalMasuk,
            tanggalLahir: datas?.tanggalLahir,
            alamat: datas?.alamat,
            kelas: datas?.kelas,
            jenisKelamin: datas?.jenisKelamin,
            jenisKelaminDisplay:
              datas?.jenisKelamin === 1 ? 'laki-laki' : 'perempuan',
            agama: datas?.agama,
            agamaDisplay: checkAgama(datas?.agama),
            updatedAt: datas?.updatedAt,
            updatedBy: datas?.updatedBy,
            user: datas?.user,
          }
          arrayTemp.push(object1)
        })

        //Assign the mapped array to the state
        setDataSiswa(arrayTemp)
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
  const handleConfirmDelete = async (clickedData: any) => {
    setLoading(true)
    await dataSiswaDelete({ id: clickedData.id, updatedBy: userId })
      .then(response => {
        message.success('Sukses Delete Siswa')
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

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Isiswa> => ({
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

  let columns: ColumnsType<Isiswa> = [
    // {
    //   title: 'No',
    //   dataIndex: 'index',
    //   key: 'index',
    //   width: '13%',
    //   render: (text, record, index) => index + 1,
    //   sorter: (a, b) => a.id - b.id,
    //   sortDirections: ['descend', 'ascend'],
    // },
    {
      title: 'Nim',
      dataIndex: 'nim',
      key: 'nim',
      width: '13%',
      ...getColumnSearchProps('nim'),
      sorter: (a, b) => a.nim.localeCompare(b.nim),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Nama',
      dataIndex: 'nama',
      key: 'nama',
      width: '25%',
      ...getColumnSearchProps('nama'),
      sorter: (a, b) => a.nama.localeCompare(b.nama),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Kelas',
      dataIndex: ['kelas', 'namaKelas'],
      key: 'kelas',
      width: '10%',
      ...getColumnSearchProps('kelas'),
      sorter: (a, b) => a.kelas.namaKelas.localeCompare(b.kelas.namaKelas),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Jurusan',
      dataIndex: ['kelas', 'jurusan', 'namaJurusan'],
      key: 'jurusan',
      width: '10%',
      ...getColumnSearchProps('kelas'),
      sorter: (a, b) =>
        a.kelas.jurusan.namaJurusan.localeCompare(b.kelas.jurusan.namaJurusan),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Alamat',
      dataIndex: 'alamat',
      key: 'alamat',
      width: '30%',
      ...getColumnSearchProps('alamat'),
      sorter: (a, b) => a.alamat.localeCompare(b.alamat),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Jenis Kelamin',
      dataIndex: 'jenisKelaminDisplay',
      key: 'jenisKelaminDisplay',
      width: '15%',
      ...getColumnSearchProps('jenisKelaminDisplay'),
      sorter: (a, b) =>
        a.jenisKelamin.toString().localeCompare(b.jenisKelamin.toString()),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Agama',
      dataIndex: 'agamaDisplay',
      key: 'agamaDisplay',
      width: '15%',
      ...getColumnSearchProps('agamaDisplay'),
      sorter: (a, b) => a.agama.toString().localeCompare(b.agama.toString()),
      sortDirections: ['descend', 'ascend'],
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
            type="default"
            size="middle"
            onClick={() => showModal('detail', record)}
            className="bg-[#A8C698] hover:bg-[#325D55] text-white focus:text-white active:text-white">
            Detail
          </Button>
          <Button
            type="primary"
            size="middle"
            className="bg-blue-500"
            onClick={() => showModal('edit', record)}>
            Edit Siswa
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
      <ModalDetailSiswa
        open={openDetail}
        setOpen={setOpenDetail}
        DataSiswa={dataSiswaSelected}
        setDataHistorySpp={setDataHistorySpp}
        dataHistorySpp={dataHistorySpp}
        setDataHistorySeragam={setDataHistorySeragam}
        dataHistorySeragam={dataHistorySeragam}
        getHistoryPembayaranSppBySiswaId={getHistoryPembayaranSppBySiswaId}
      />
      <div className="rounded-md bg-white p-2 h-[100%] overflow-scroll">
        <div className="my-4 flex items-center justify-between px-4">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-black">Data Siswa</h2>
          </div>
          <div className="flex items-center">
            <Button
              type="primary"
              size="middle"
              className="bg-blue-500"
              onClick={() => showModal('tambah', {} as Isiswa)}>
              Tambah Data Siswa
            </Button>
            <ModalTambahSiswa
              getData={initiateData}
              action={actions}
              open={open}
              setOpen={setOpen}
              dataSiswaInput={dataSiswaInput}
              setDataSiswaInput={setDataSiswaInput}
              initialClassId={initialClassId}
            />
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={dataSiswa}
          scroll={{ x: 400 }}
          className="h-[100%]"
        />
      </div>
    </Spin>
  )
}
