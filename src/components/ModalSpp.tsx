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
import {
  convertDate,
  convertToMonthYear,
  convertDateTime,
} from '@/helper/util/time'
import { convertMoney } from '@/helper/util/money'
import { getUserInfoWithNullCheck } from '@/helper/util/userInfo'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

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
  showModal,
  getHistoryPembayaranSppByPembayaranSppId,
}: ModalTambahSppProps) {
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [searchedColumn, setSearchedColumn] = useState('')
  const [searchText, setSearchText] = useState('')
  const searchInput = useRef<InputRef>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [userId, setUserId] = useState(0)
  const [userName, setUserName] = useState('')
  const [userRole, setUserRole] = useState('')
  const [openPrint, setOpenPrint] = useState(false)

  const handleGeneratePdf = () => {
    const doc = new jsPDF({
      format: 'a6',
      unit: 'px',
    })

    const chunkSize = 12
    const totalChunks = Math.ceil(dataHistorySpp.length / chunkSize)

    let filteredList
    if (totalChunks === 1) {
      filteredList = dataHistorySpp.slice(0)
    } else {
      const startIndex = (totalChunks - 1) * chunkSize
      filteredList = dataHistorySpp.slice(startIndex)
    }

    const dataForPrint = filteredList.filter(item => item.sudahDibayar === true)

    const tableData = dataForPrint.map((item, index) => [
      index + 1,
      convertMoney(item.jumlah),
      convertToMonthYear(item.jatuhTempo),
      convertDate(item.tanggalPembayaran),
      item.user.username,
    ])

    const currentDate = new Date()
    const printedDateTime = convertDateTime(currentDate.toString())
    const qrData = `Printed By ${userName}, \nPrinted Date: ${printedDateTime}, \nNama: ${dataSppInput.siswa.nama}, \nNIM: ${dataSppInput.siswa.nim}, \nKelas: ${dataSppInput.siswa.kelas.namaKelas}, \nJurusan: ${dataSppInput.siswa.kelas.jurusan.namaJurusan}, \nAsal Sekolah: ${dataSppInput.siswa.asalSekolah}`

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

    doc.setFontSize(5)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Nama Siswa: ${dataSppInput.siswa.nama}`,
      docHorizontalMargin,
      currentY,
      {
        align: 'left',
      },
    )
    currentY += 5

    doc.setFontSize(5)
    doc.setFont('helvetica', 'normal')
    doc.text(`NISN: ${dataSppInput.siswa.nim}`, docHorizontalMargin, currentY, {
      align: 'left',
    })
    currentY += 5

    doc.setFontSize(5)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Asal Sekolah: ${dataSppInput.siswa.asalSekolah}`,
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
      `Jurusan: ${dataSppInput.siswa.kelas.jurusan.namaJurusan}`,
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
      `Kelas: ${dataSppInput.siswa.kelas.namaKelas}`,
      middleDocX,
      currentY,
      {
        align: 'left',
      },
    )

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('SPP', docWidth - docHorizontalMargin, currentY, {
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
          head: [['No', 'Jumlah', 'Pembayaran', 'Tgl Bayar', 'Penginput']],
          body: tableData,
          tableWidth: tableWidth,
          margin: { left: tableHorizontalMargin, right: tableHorizontalMargin },
          styles: { cellWidth: undefined, fontSize: 4 },
        }

        // Generate the table with the options
        autoTable(doc, options)

        doc.save(`${dataSppInput.siswa.nim}_${dataSppInput.siswa.nama}.pdf`)
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
      // console.log('USER ID on ModalSpp', user.id)
      // console.log('USER ROLE on ModalSpp', user.role)
    } else {
      console.log('LOCALSTORAGE IS EMPTY')
    }
  }

  useEffect(() => {
    getUserData()
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
    // const user = await getUserInfoWithNullCheck()
    // const updatedBy = user ? user.id : 0

    //Untuk dilepar ke api
    const currentDate = new Date().toISOString()
    if (currentData && currentData.sudahDibayar !== undefined) {
      currentData.sudahDibayar = true
    }

    if (currentData && currentData.tanggalPembayaran !== undefined) {
      currentData.tanggalPembayaran = currentDate
    }

    // Add the updatedBy property to currentData
    currentData.updatedBy = userId

    // console.log('BAYAR DATA', currentData)

    let currentPembayaranSppId: number
    if (currentData && currentData.pembayaranSppId !== undefined) {
      currentPembayaranSppId = currentData.pembayaranSppId
      // console.log('currentPembayaranSppId', currentPembayaranSppId)
    }

    dataHistoryPembayaranSppUpdate(
      currentData,
      dataSppInput.siswaId,
      dataSppInput.tunggakan,
      dataSppInput.totalBayar,
    )
      .then((response: any) => {
        // getData()
        // console.log(
        //   'dataHistoryPembayaranSppUpdate',
        //   response.data.updatePembayaranSpp,
        // )

        let dataInput = {
          id: response.data.updatePembayaranSpp.id,
          siswaId: response.data.updatePembayaranSpp.siswaId,
          tunggakan: response.data.updatePembayaranSpp.tunggakan,
          totalBayar: response.data.updatePembayaranSpp.totalBayar,
          siswa: dataSppInput.siswa,
          kelas: dataSppInput.siswa.kelas,
          jurusan: dataSppInput.siswa?.kelas.jurusan,
          updatedAt: response.data.updatePembayaranSpp.updatedAt,
          updatedBy: response.data.updatePembayaranSpp.updatedBy,
          user: dataSppInput.user,
        }

        // console.log('dataInput', dataInput)

        showModal(dataInput)
        // getHistoryPembayaranSppByPembayaranSppId(currentPembayaranSppId)
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
              title={`Konfirmasi Pembayaran`}
              description={`Anda Yakin ingin Konfirmasi Pembayaran?`}
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
    // setOpenPrint(true)
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
              <div className="w-[50%]">NISN</div>
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
          onClick={handleGeneratePdf}
          loading={confirmLoading}>
          Cetak
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
