import { IModalDetailSiswaProps } from '@/interface/ui/props/ModalDetailSiswa'
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
import { FormInput } from './FormInput'
import {
  MdAccountCircle,
  MdCardMembership,
  MdHomeWork,
  MdIcecream,
} from 'react-icons/md'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import { IoIosCard } from 'react-icons/io'
import { SiGoogleclassroom, SiGooglehome } from 'react-icons/si'
import { IdataSppHistory } from '@/interface/ui/state/dataSPPHistory'
import { SetStateAction, useEffect, useState, useRef } from 'react'
import { IHistorySpp } from '@/interface/ui/state/dataHistorySppTable'
import { IHistorySeragam } from '@/interface/ui/state/dataHistorySeragamTable'
import { SearchOutlined, UserOutlined, IdcardOutlined } from '@ant-design/icons'
import { convertDate } from '@/helper/util/time'
import { convertMoney } from '@/helper/util/money'

//////////// BORDER /////////

import { historyPembayaranSppByPembayaranSppId } from '@/helper/apiHelper/historyPembayaranSpp'

type DataIndexHistorySpp = keyof IHistorySpp
type DataIndexHistorySeragam = keyof IHistorySeragam

export function ModalDetailSiswa({
  open,
  setOpen,
  DataSiswa,
  setDataHistorySpp,
  dataHistorySpp,
  setDataHistorySeragam,
  dataHistorySeragam,
  getHistoryPembayaranSppBySiswaId,
}: IModalDetailSiswaProps) {
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [searchedColumn, setSearchedColumn] = useState('')
  const [searchText, setSearchText] = useState('')
  const searchInput = useRef<InputRef>(null)

  const handleSearchHistorySpp = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndexHistorySpp,
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleSearchHistorySeragam = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndexHistorySeragam,
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

  const getColumnHistorySppSearchProps = (
    dataIndex: DataIndexHistorySpp,
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
            handleSearchHistorySpp(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearchHistorySpp(
                selectedKeys as string[],
                confirm,
                dataIndex,
              )
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
        <span>
          {text
            ? text
                .toString()
                .split(new RegExp(`(${searchText})`, 'gi'))
                .map((part: string, index: number) =>
                  part.toLowerCase() === searchText.toLowerCase() && searchText ? (
                    <span key={index} style={{ backgroundColor: '#ffc069', padding: 0 }}>
                      {part}
                    </span>
                  ) : (
                    <span key={index}>{part}</span>
                  )
                )
            : ''}
        </span>
      ) : (
        text
      ),
  })

  const getColumnHistorySeragamSearchProps = (
    dataIndex: DataIndexHistorySeragam,
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
            handleSearchHistorySeragam(
              selectedKeys as string[],
              confirm,
              dataIndex,
            )
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearchHistorySeragam(
                selectedKeys as string[],
                confirm,
                dataIndex,
              )
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
      searchedColumn === dataIndex ? ((
        <span>
          {text ? text.toString().split(new RegExp(`(${searchText})`, 'gi')).map((part: string, index: number) => 
            part.toLowerCase() === searchText.toLowerCase() ? (
              <span key={index} style={{ backgroundColor: '#ffc069', padding: 0 }}>
                {part}
              </span>
            ) : part
          ) : ''}
        </span>
      )) : (
        text
      ),
  })

  const columnsHistorySpp: ColumnsType<IHistorySpp> = [
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
      title: 'Jumlah',
      dataIndex: 'jumlah',
      key: 'jumlah',
      width: '20%',
      ...getColumnHistorySppSearchProps('jumlah'),
      sorter: (a, b) => a.jumlah - b.jumlah,
      sortDirections: ['descend', 'ascend'],
      render: jumlah => convertMoney(jumlah),
    },
    {
      title: 'Jatuh Tempo',
      dataIndex: 'jatuhTempo',
      key: 'jatuhTempo',
      width: '23%',
      ...getColumnHistorySppSearchProps('jatuhTempo'),
      sorter: (a, b) => a.jatuhTempo.localeCompare(b.jatuhTempo),
      sortDirections: ['descend', 'ascend'],
      render: jatuhTempo => convertDate(jatuhTempo),
    },
    {
      title: 'Sudah Dibayar',
      dataIndex: 'sudahDibayar',
      key: 'sudahDibayar',
      width: '20%',
      ...getColumnHistorySppSearchProps('sudahDibayar'),
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
      ...getColumnHistorySppSearchProps('tanggalPembayaran'),
      sorter: (a, b) => a.tanggalPembayaran.localeCompare(b.tanggalPembayaran),
      sortDirections: ['descend', 'ascend'],
      render: tanggalPembayaran => convertDate(tanggalPembayaran),
    },
  ]

  const columnsHistorySeragam: ColumnsType<IHistorySeragam> = [
    {
      title: 'No',
      dataIndex: 'index',
      key: 'index',
      width: '13%',
      render: (text, record, index) => index + 1,
      sorter: (a, b) => a.id - b.id,
      sortDirections: ['descend', 'ascend'],
    },
    // {
    //   title: 'Seragam',
    //   dataIndex: ['seragam', 'nama'],
    //   key: 'seragam',
    //   width: '20%',
    //   ...getColumnHistorySeragamSearchProps('seragam'),
    //   sorter: (a, b) => a.seragam.nama.localeCompare(b.seragam.nama),
    //   sortDirections: ['descend', 'ascend'],
    // },
    {
      title: 'Jumlah Dibayar',
      dataIndex: 'jumlahDiBayar',
      key: 'jumlahDiBayar',
      width: '23%',
      ...getColumnHistorySeragamSearchProps('jumlahDiBayar'),
      sorter: (a, b) => a.jumlahDiBayar - b.jumlahDiBayar,
      sortDirections: ['descend', 'ascend'],
      render: jumlahDiBayar => convertMoney(jumlahDiBayar),
    },
    {
      title: 'Tanggal Pembayaran',
      dataIndex: 'tanggalPembayaran',
      key: 'tanggalPembayaran',
      width: '20%',
      ...getColumnHistorySeragamSearchProps('tanggalPembayaran'),
      sorter: (a, b) => a.tanggalPembayaran.localeCompare(b.tanggalPembayaran),
      sortDirections: ['descend', 'ascend'],
      render: tanggalPembayaran => convertDate(tanggalPembayaran),
    },
    // {
    //   title: 'Sudah Dibayar',
    //   dataIndex: 'sudahDibayar',
    //   key: 'sudahDibayar',
    //   width: '30%',
    //   render: (_, record) => (
    //     <>
    //       {record.sudahDibayar ? (
    //         <Tag color="#87d068">Terbayar</Tag>
    //       ) : (
    //         <Tag color="#f50">Belum Dibayar</Tag>
    //       )}
    //     </>
    //   ),
    // },
  ]

  return (
    <>
      <Modal
        open={open}
        width={'75%'}
        footer={null}
        onCancel={() => setOpen(false)}>
        <div className="flex flex-col items-start w-[100%] my-5">
          <div className="w-[100%]">
            <div className="w-[50%] h-[15%] flex-col flex gap-3 my-5">
              <FormInput
                label="Nama"
                placeholder={DataSiswa.nama}
                values={DataSiswa.nama}
                onChange={e => console.log(e)}
                isDisabled
                icons={<MdAccountCircle />}
              />
              <FormInput
                label="NISN"
                placeholder="NISN"
                icons={<IoIosCard />}
                isDisabled
                values={DataSiswa.nim}
                onChange={e => console.log(e)}
              />
              <FormInput
                label="Jurusan"
                placeholder="Jurusan"
                isDisabled
                icons={<MdHomeWork />}
                values={DataSiswa?.kelas?.jurusan?.namaJurusan}
                onChange={e => console.log(e)}
              />
              <FormInput
                label="Kelas"
                placeholder="Kelas"
                isDisabled
                icons={<SiGoogleclassroom />}
                values={DataSiswa?.kelas?.namaKelas}
                onChange={e => console.log(e)}
              />
              <FormInput
                label="Alamat"
                placeholder="Alamat"
                isDisabled
                isArea
                values={DataSiswa?.alamat}
                onChange={e => console.log(e)}
              />
              <FormInput
                label="Asal Sekolah"
                placeholder="Asal Sekolah"
                isDisabled
                isArea
                values={DataSiswa?.asalSekolah}
                onChange={e => console.log(e)}
              />
            </div>
            <div className="text-xl my-5">History Pembayaran SPP</div>
            <Table
              columns={columnsHistorySpp}
              dataSource={dataHistorySpp}
              scroll={{ x: 400 }}
              className="overflow-y-auto h-32"
            />
            <div className="text-xl my-5">History Pembayaran Seragam</div>
            <Table
              columns={columnsHistorySeragam}
              dataSource={dataHistorySeragam}
              scroll={{ x: 400 }}
              className="overflow-y-auto h-32"
            />
          </div>
        </div>
      </Modal>
    </>
  )
}
