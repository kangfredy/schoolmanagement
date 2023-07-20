/* eslint-disable react-hooks/exhaustive-deps */
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
import { ModalDetailHistoryPembayaranSeragam } from '../components/ModalDetailHistoryPembayaranSeragam'
import { ISelect } from '@/interface/ui/component/dropdown'
import { getUserInfoWithNullCheck } from '@/helper/util/userInfo'
import { convertDateTime } from '@/helper/util/time'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { addDecimalPoints } from '@/helper/util/number'

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
  setDataDetailHistoryPembayaranSeragam,
  dataDetailHistoryPembayaranSeragam,
  setDataSeragam,
  dataSeragam,
  setDataInputFilteredSeragam,
  dataInputFilteredSeragam,
  showModal,
  getHistoryPembayaranSeragamByPembayaranSeragamId,
}: ModalTambahSeragamProps) {
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [searchedColumn, setSearchedColumn] = useState('')
  const [searchText, setSearchText] = useState('')
  const searchInput = useRef<InputRef>(null)
  const [harga, setHarga] = useState<number>(0)
  const [hargaParsed, setHargaParsed] = useState('')
  const [namaSeragam, setNamaSeragam] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  const [dataSeragamInput, setDataSeragamInput] = useState<IDataSeragamnModal>(
    {} as IDataSeragamnModal,
  )
  const [openTambah, setOpenTambah] = useState(false)
  const [openHistoryTambah, setOpenHistoryTambah] = useState(false)
  const [
    openDetailPembayaranHistorySeragam,
    setOpenDetailPembayaranHistorySeragam,
  ] = useState(false)
  const [userId, setUserId] = useState(0)
  const [userRole, setUserRole] = useState('')
  const [userName, setUserName] = useState('')
  const [namaSeragamError, setNamaSeragamError] = useState('')

  const handleGeneratePdf = () => {
    const doc = new jsPDF({
      format: 'a6',
      unit: 'px',
    })
    const chunkSize = 12
    const totalChunks = Math.ceil(dataHistorySeragam.length / chunkSize)
    let filteredList
    if (totalChunks === 1) {
      filteredList = dataHistorySeragam.slice(0)
    } else {
      const startIndex = (totalChunks - 1) * chunkSize
      filteredList = dataHistorySeragam.slice(startIndex)
    }
    const tableData = filteredList.map((item, index) => [
      index + 1,
      convertMoney(item.jumlahDiBayar),
      convertDate(item.tanggalPembayaran),
      item.user.username,
    ])
    const currentDate = new Date()
    const printedDateTime = convertDateTime(currentDate.toString())
    const qrData = `PEMBAYARAN SERAGAM \nPrinted By ${userName}, \nPrinted Date: ${printedDateTime}, \nNama: ${dataPembayaranSeragamInput.siswa.nama}, \nNIM: ${dataPembayaranSeragamInput.siswa.nim}, \nKelas: ${dataPembayaranSeragamInput.siswa.kelas.namaKelas}, \nJurusan: ${dataPembayaranSeragamInput.siswa.kelas.jurusan.namaJurusan}, \nAsal Sekolah: ${dataPembayaranSeragamInput.siswa.asalSekolah}`
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
      qrData,
    )}`
    const docWidth = doc.internal.pageSize.getWidth()
    const docHeight = doc.internal.pageSize.getHeight()
    const contentWidth = docWidth * 0.96
    const horizontalMargin = (docWidth - contentWidth) / 2
    const topDocMargin = 6
    const lineSpacing = 10
    let currentY = topDocMargin
    doc.setFontSize(4)
    doc.setFont('helvetica')
    doc.setTextColor('#6C6C6C')
    doc.text(
      'YAYASAN PEMBINA LEMBAGA PENDIDIKAN PROVINSI',
      docWidth / 2,
      currentY,
      {
        align: 'center',
      },
    )
    currentY += 7
    doc.setFontSize(5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor('#6C6C6C')
    doc.text(
      'PERSATUAN GURU REPUBLIK INDONESIA (YPLP PROVINSI PGRI) SUMATERA SELATAN',
      docWidth / 2,
      currentY,
      { align: 'center' },
    )
    currentY += 10
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor('#6C6C6C')
    doc.text('SMK PGRI 2 LAHAT', docWidth / 2, currentY, { align: 'center' })
    currentY += lineSpacing
    doc.setFontSize(4)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor('#6C6C6C')
    doc.text(
      'Jalan Kirab Remaja, Kelurahan RD. PT. KAI Lahat HP : 0821 7955 4241',
      docWidth / 2,
      currentY,
      { align: 'center' },
    )
    currentY += 10
    const docHorizontalMargin =
      (doc.internal.pageSize.getWidth() -
        doc.internal.pageSize.getWidth() * 0.9) /
      2
    const middleDocX = doc.internal.pageSize.getWidth() / 2
    // Handle Long Name
    const namaSiswa = dataPembayaranSeragamInput.siswa.nama
    let shortenedNama = namaSiswa
    if (namaSiswa.length > 25) {
      const nameStringList = namaSiswa.split(' ')
      const spaceCount = nameStringList.length - 1
      // console.log(spaceCount)
      const subString = namaSiswa.substring(0, 25)
      const spaceIndex = subString.lastIndexOf(' ')
      // console.log(spaceIndex)
      const subStringSpaceCount = subString.split(' ').length - 1
      // console.log(subStringSpaceCount)
      let frontName = ''
      let backName = ''
      for (let i = 0; i <= subStringSpaceCount; i++) {
        frontName += nameStringList[i]
        if (i < subStringSpaceCount) {
          frontName += ' '
        }
      }
      for (let i = subStringSpaceCount + 1; i < nameStringList.length; i++) {
        const firstChar = nameStringList[i].charAt(0).toUpperCase()
        backName += firstChar + '.'
        if (i < nameStringList.length - 1) {
          backName += ' '
        }
      }
      shortenedNama = frontName + ' ' + backName
      shortenedNama = shortenedNama.replace(/\s{2,}/g, ' ')
      shortenedNama = shortenedNama.trim()
      // console.log('frontName', frontName)
      // console.log('backName', backName)
      // console.log('shortenedNama ', shortenedNama)
    }
    doc.setFontSize(5)
    doc.setFont('helvetica', 'normal')
    doc.text(`Nama Siswa: ${shortenedNama}`, docHorizontalMargin, currentY, {
      align: 'left',
    })
    currentY += 5
    doc.setFontSize(5)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `NISN: ${dataPembayaranSeragamInput.siswa.nim}`,
      docHorizontalMargin,
      currentY,
      {
        align: 'left',
      },
    )
    currentY += 5
    doc.setFontSize(5)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Asal Sekolah: ${dataPembayaranSeragamInput.siswa.asalSekolah}`,
      docHorizontalMargin,
      currentY,
      {
        align: 'left',
      },
    )
    currentY -= 10
    doc.setFontSize(5)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Jurusan: ${dataPembayaranSeragamInput.siswa.kelas.jurusan.namaJurusan}`,
      middleDocX,
      currentY,
      {
        align: 'left',
      },
    )
    currentY += 5
    doc.setFontSize(5)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Kelas: ${dataPembayaranSeragamInput.siswa.kelas.namaKelas}`,
      middleDocX,
      currentY,
      {
        align: 'left',
      },
    )

    const totalBiaya = convertMoney(
      dataPembayaranSeragamInput.totalBayar +
        dataPembayaranSeragamInput.tunggakan,
    )

    currentY += 5
    doc.setFontSize(5)
    doc.setFont('helvetica', 'normal')
    doc.text(`Total: ${totalBiaya}`, middleDocX, currentY, {
      align: 'left',
    })

    currentY -= 5

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Seragam', docWidth - docHorizontalMargin, currentY, {
      align: 'right',
    })
    currentY += 6
    // Add the first image below the texts
    const image1 = new Image()
    const imagePath1 = '/assets/images/PGRILogo.png'
    image1.onload = function () {
      const imgWidth1 = 40
      const imgHeight1 = (image1.height * imgWidth1) / image1.width
      const imgX1 = 3
      const imgY1 = 12
      doc.addImage(image1, 'PNG', imgX1, imgY1, imgWidth1, imgHeight1)
      // Add the second image to the bottom right corner
      const image2 = new Image()
      const imagePath2 = qrCodeUrl
      image2.onload = function () {
        const imgWidth2 = 20
        const imgHeight2 = (image2.height * imgWidth2) / image2.width
        const imgX2 = docWidth - horizontalMargin - imgWidth2 - 5
        const imgY2 = docHeight - imgHeight2 - 10
        doc.addImage(image2, 'PNG', imgX2, imgY2, imgWidth2, imgHeight2)
        doc.setFontSize(5)
        doc.setFont('helvetica', 'normal')
        doc.text(
          `Disahkan`,
          docWidth - horizontalMargin - imgWidth2 - 20,
          docHeight - imgHeight2,
          {
            align: 'center',
          },
        )
        // Generate the table
        const tableWidth = doc.internal.pageSize.getWidth() * 0.9
        const tableStartY = currentY + 4
        const tableHorizontalMargin =
          (doc.internal.pageSize.getWidth() - tableWidth) / 2
        const options = {
          headStyles: { fillColor: '#696969' },
          startY: tableStartY,
          head: [['No', 'Jumlah', 'Tanggal Pembayaran', 'Penginput']],
          body: tableData,
          tableWidth: tableWidth,
          margin: { left: tableHorizontalMargin, right: tableHorizontalMargin },
          styles: { cellWidth: undefined, fontSize: 4 },
        }
        // Generate the table with the options
        autoTable(doc, options)
        doc.save(
          `${dataPembayaranSeragamInput.siswa.nim}_${dataPembayaranSeragamInput.siswa.nama}.pdf`,
        )
      }
      image2.src = imagePath2
    }
    image1.src = imagePath1
  }

  const getUserData = async () => {
    const user = await getUserInfoWithNullCheck()
    if (user) {
      setUserId(user.id)
      setUserRole(user.role)
      setUserName(user.username)
      // console.log('USER ID dari ModelSeragam', user.id)
      // console.log('USER ROLE dari ModelSeragam', user.role)
    } else {
      console.log('LOCALSTORAGE IS EMPTY')
    }
  }

  useEffect(() => {
    getUserData()
    // console.log('FROM MODAL SERAGAM', dataDetailHistoryPembayaranSeragam)
  }, [])

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
    setNamaSeragamError('')
    setOpen(false)
    setHargaParsed('')
  }

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

  const showModalTambahSeragamBaru = (data: ISeragam) => {
    let dataInput = {
      id: data?.id,
      nama: data?.nama,
      updatedBy: data?.updatedBy,
    }
    setDataSeragamInput(dataInput)
    setOpenTambah(true)
  }

  const showModalDetailHistoryPembayaranSeragam = () => {
    // console.log('TOMBOL DETAIL CLICEKD')
    setOpenDetailPembayaranHistorySeragam(true)
  }

  const showModalTambahHistoryPembayaranSeragam = () => {
    setOpenHistoryTambah(true)
  }

  let columnsSeragam: ColumnsType<ISeragam> = [
    // {
    //   title: 'Nomor',
    //   dataIndex: 'id',
    //   key: 'id',
    //   width: '13%',
    //   ...getSeragamColumnSearchProps('id'),
    //   sorter: (a, b) => a.id - b.id,
    //   sortDirections: ['descend', 'ascend'],
    // },
    {
      title: 'Seragam',
      dataIndex: 'nama',
      key: 'nama',
      width: '20%',
      ...getSeragamColumnSearchProps('nama'),
      sorter: (a, b) => a.nama.localeCompare(b.nama),
      sortDirections: ['descend', 'ascend'],
    },
    // {
    //   title: 'Harga',
    //   dataIndex: 'harga',
    //   key: 'harga',
    //   width: '23%',
    //   ...getSeragamColumnSearchProps('harga'),
    //   sorter: (a, b) => a.harga - b.harga,
    //   sortDirections: ['descend', 'ascend'],
    //   render: harga => convertMoney(harga),
    // },
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

  // const handleConfirmBayarHistorySeragam = (currentData: IHistorySeragam) => {
  //   // console.log('DATA TO CONFIRM', currentData)
  //   // const user = await getUserInfoWithNullCheck()
  //   // const updatedBy = user ? user.id : 0

  //   //Untuk dilepar ke api
  //   const currentDate = new Date().toISOString()
  //   if (currentData && currentData.sudahDibayar !== undefined) {
  //     currentData.sudahDibayar = true
  //   }

  //   if (currentData && currentData.tanggalPembayaran !== undefined) {
  //     currentData.tanggalPembayaran = currentDate
  //   }

  //   // Add the updatedBy property to currentData
  //   currentData.updatedBy = userId

  //   // console.log('BAYAR DATA', currentData)

  //   let currentPembayaranSeragamId: number
  //   if (currentData && currentData.pembayaranSeragamId !== undefined) {
  //     currentPembayaranSeragamId = currentData.pembayaranSeragamId
  //     // console.log('currentPembayaranSeragamId', currentPembayaranSeragamId)
  //   }

  //   dataHistoryPembayaranSeragamUpdate(
  //     currentData,
  //     dataPembayaranSeragamInput.siswaId,
  //     dataPembayaranSeragamInput.tunggakan,
  //     dataPembayaranSeragamInput.totalBayar,
  //   )
  //     .then((response: any) => {
  //       let dataInput = {
  //         id: response.data.updatePembayaranSeragam.id,
  //         siswaId: response.data.updatePembayaranSeragam.siswaId,
  //         tunggakan: response.data.updatePembayaranSeragam.tunggakan,
  //         totalBayar: response.data.updatePembayaranSeragam.totalBayar,
  //         siswa: dataPembayaranSeragamInput.siswa,
  //         kelas: dataPembayaranSeragamInput.siswa.kelas,
  //         jurusan: dataPembayaranSeragamInput.siswa?.kelas.jurusan,
  //         updatedAt: response.data.updatePembayaranSeragam.updatedAt,
  //         updatedBy: response.data.updatePembayaranSeragam.updatedBy,
  //         user: dataPembayaranSeragamInput.user,
  //       }
  //       showModal(action, dataInput)
  //       getData()
  //       // getHistoryPembayaranSeragamByPembayaranSeragamId(
  //       //   currentPembayaranSeragamId,
  //       //   action,
  //       // )
  //       setConfirmLoading(false)
  //     })
  //     .then(response => {
  //       // setOpen(false)
  //       setOpen(true)
  //     })
  //     .catch((error: any) => {
  //       // setOpen(false)
  //       setOpen(true)
  //     })
  // }

  const handleCancelBayarHistorySeragam = () => {}

  let columnsHistorySeragam: ColumnsType<IHistorySeragam> = [
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
      title: 'Jumlah Dibayar',
      dataIndex: 'jumlahDiBayar',
      key: 'jumlahDiBayar',
      width: '23%',
      ...getHistorySeragamColumnSearchProps('jumlahDiBayar'),
      sorter: (a, b) => a.jumlahDiBayar - b.jumlahDiBayar,
      sortDirections: ['descend', 'ascend'],
      render: jumlahDiBayar => convertMoney(jumlahDiBayar),
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
    // {
    //   title: 'Action',
    //   key: 'action',
    //   render: (_: any, record: any) => (
    //     <Space size="small" split>
    //       {!record.sudahDibayar && (
    //         <Popconfirm
    //           title={`Pembayaran No ${record.id} ?`}
    //           description={`Anda Yakin ingin Konfirmasi Pembayaran No ${record.id} ?`}
    //           onConfirm={e => handleConfirmBayarHistorySeragam(record)}
    //           onCancel={handleCancelBayarHistorySeragam}
    //           okText="Yes"
    //           okButtonProps={{ className: 'bg-blue-500', size: 'small' }}
    //           cancelText="No">
    //           <Button type="primary" size="middle" className="bg-blue-500">
    //             BAYAR
    //           </Button>
    //         </Popconfirm>
    //       )}
    //     </Space>
    //   ),
    // },
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
                {dataPembayaranSeragamInput?.siswa?.kelas?.jurusan?.namaJurusan}
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
          className="bg-green-500"
          onClick={() => showModalDetailHistoryPembayaranSeragam()}>
          DETAIL
        </Button>
        <Button
          type="primary"
          size="large"
          className="bg-blue-500 ml-2"
          onClick={() => showModalTambahHistoryPembayaranSeragam()}>
          TAMBAH PEMBAYARAN
        </Button>
        <Button
          type="primary"
          size="large"
          className="bg-red-500 ml-2"
          onClick={handleGeneratePdf}>
          CETAK
        </Button>
      </div>
      {dataHistorySeragam === null ? (
        <div className="flex justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columnsHistorySeragam}
          dataSource={dataHistorySeragam}
          scroll={{ x: 400 }}
          className="h-[100%]"
        />
      )}
      <ModalTambahHistorySeragam
        getData={getData}
        action={action}
        open={openHistoryTambah}
        setOpen={setOpenHistoryTambah}
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
      <ModalDetailHistoryPembayaranSeragam
        getData={getData}
        action={action}
        open={openDetailPembayaranHistorySeragam}
        setOpen={setOpenDetailPembayaranHistorySeragam}
        dataSeragam={dataSeragam}
        setDataSeragam={setDataSeragam}
        setDataDetailHistoryPembayaranSeragam={
          setDataDetailHistoryPembayaranSeragam
        }
        dataDetailHistoryPembayaranSeragam={dataDetailHistoryPembayaranSeragam}
        dataInputFilteredSeragam={dataInputFilteredSeragam}
        setDataInputFilteredSeragam={setDataInputFilteredSeragam}
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
    setNamaSeragamError(e.target.value.trim() === '' ? 'Required' : '')
  }

  const handleTambahSeragam = () => {
    if (namaSeragam === '' || namaSeragam === undefined) {
      setNamaSeragamError(
        namaSeragam === '' || namaSeragam === undefined ? 'Required' : '',
      )
      return
    }

    const newSeragam: IDataSeragamnModal = {
      nama: namaSeragam,
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
        <div className="flex items-center">
          <Input
            placeholder="Seragam RPL (L)"
            name="seragam"
            prefix={<RiShirtLine />}
            onChange={e => handleSeragamInput(e)}
            className="w-60 my-1"
            value={namaSeragam}
            status={namaSeragamError ? 'error' : undefined}
            required
          />
          {namaSeragamError && (
            <p style={{ color: 'red', marginLeft: '8px' }}>
              {namaSeragamError}
            </p>
          )}
        </div>
        {/* <div className="flex items-center">
          <Input
            placeholder="Harga"
            name="harga"
            prefix={<RiShirtLine />}
            onChange={e => handleHargaInput(e)}
            className="w-60 mt-2 mb-3"
            value={hargaParsed ? hargaParsed : ''}
            status={hargaSeragamError ? 'error' : undefined}
            required
          />
          {hargaSeragamError && (
            <p style={{ color: 'red', marginLeft: '8px' }}>
              {hargaSeragamError}
            </p>
          )}
        </div> */}
        <Button
          type="primary"
          size="middle"
          className="bg-blue-500 w-60 mb-4 mt-2"
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
