import { getSiswaBelumBayarService } from '@/helper/apiHelper/historyPembayaranSpp'
import { getUserInfoWithNullCheck } from '@/helper/util/userInfo'
import { useUserSession } from '@/hook/useUserSession'
import { IReminderSPP } from '@/interface/ui/state/IReminderSPP'
import { SearchOutlined } from '@ant-design/icons'
import { InputRef, message, Input, Space, Button } from 'antd'
import { ColumnType, ColumnsType } from 'antd/es/table'
import { FilterConfirmProps } from 'antd/es/table/interface'
import { useEffect, useRef, useState } from 'react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

type DataIndex = keyof IReminderSPP

export function useReminderSPPController() {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState<any>('')
  const searchInput = useRef<InputRef>(null)
  const [dataUser, setDataUser] = useState<IReminderSPP[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { userId, userRole } = useUserSession()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [hasNextPage, setHasNextPage] = useState(false)

  const initiateData = async (page = pagination.current, pageSize = pagination.pageSize, searchCol = searchedColumn, searchTxt = searchText) => {
    try {
      setLoading(true)
      const params = {
        page,
        pageSize,
        searchColumn: Array.isArray(searchCol) ? searchCol.join(',') : searchCol,
        searchText: searchTxt,
      }
      const response = await getSiswaBelumBayarService(params)
      setDataUser(response.data.getHistoryPembayaranSpp)
      setHasNextPage(!!response.data.hasNextPage)
      setPagination({ current: page, pageSize })
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    initiateData(1, pagination.pageSize, searchedColumn, searchText)
  }, [])

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm()
    const text = selectedKeys[0] || ''
    setSearchText(text)
    setSearchedColumn(dataIndex)
    initiateData(1, pagination.pageSize, dataIndex, text)
  }

  const handleReset = (
    clearFilters: () => void,
    confirm: (param?: FilterConfirmProps) => void,
  ) => {
    clearFilters()
    setSearchText('')
    setSearchedColumn('')
    confirm()
    initiateData(1, pagination.pageSize, '', '')
  }

  const handleTableChange = (newPagination: any) => {
    let newPage = newPagination.current;
    if (newPagination.pageSize !== pagination.pageSize) {
      newPage = 1;
    }
    initiateData(newPage, newPagination.pageSize, searchedColumn, searchText);
  }

  const getColumnSearchProps = (dataIndex: any): ColumnType<any> => ({
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
          placeholder={`Input Search`}
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
          <Button type="link" size="small" onClick={() => close()}>
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilterDropdownOpenChange: visible => {
      if (visible) setTimeout(() => searchInput.current?.select(), 100)
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <span>
          {text
            ? text
                .toString()
                .split(new RegExp(`(${searchText})`, 'gi'))
                .map((part: string, index: number) =>
                  searchText &&
                  part.toLowerCase() === searchText.toLowerCase() ? (
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

  let columns: ColumnsType<IReminderSPP> = [
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
      title: 'Nama',
      dataIndex: ['pembayaranSpp', 'siswa', 'nama'],
      key: 'nama',
      width: '30%',
      ...getColumnSearchProps(['pembayaranSpp', 'siswa', 'nama']),
      sorter: (a, b) =>
        a.pembayaranSpp.siswa.nama.localeCompare(b.pembayaranSpp.siswa.nama),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Jurusan',
      dataIndex: ['pembayaranSpp', 'siswa', 'kelas', 'jurusan', 'namaJurusan'],
      key: 'jurusan',
      width: '20%',
      ...getColumnSearchProps([
        'pembayaranSpp',
        'siswa',
        'kelas',
        'jurusan',
        'namaJurusan',
      ]),
      sorter: (a, b) =>
        a.pembayaranSpp.siswa.kelas.jurusan.namaJurusan.localeCompare(
          b.pembayaranSpp.siswa.kelas.jurusan.namaJurusan,
        ),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Kelas',
      dataIndex: ['pembayaranSpp', 'siswa', 'kelas', 'namaKelas'],
      key: 'kelas',
      width: '20%',
      ...getColumnSearchProps(['pembayaranSpp', 'siswa', 'kelas', 'namaKelas']),
      sorter: (a, b) =>
        a.pembayaranSpp.siswa.kelas.namaKelas.localeCompare(
          b.pembayaranSpp.siswa.kelas.namaKelas,
        ),
      sortDirections: ['descend', 'ascend'],
    },
  ]

  if (userRole !== 'admin') {
    columns = columns.filter(column => column.key !== 'updatedBy')
    columns = columns.filter(column => column.key !== 'updatedAt')
  }

  const handleGeneratePdf = () => {
    try {
      const doc = new jsPDF({ format: 'a4', unit: 'px' })
      const tableData = dataUser.map((item, index) => [
        index + 1,
        item.pembayaranSpp.siswa.nama,
        item.pembayaranSpp.siswa.kelas.namaKelas,
        item.pembayaranSpp.siswa.kelas.jurusan.namaJurusan,
      ])
      const docWidth = doc.internal.pageSize.getWidth()
      const contentWidth = docWidth * 0.96
      const topDocMargin = 6
      const lineSpacing = 10
      let currentY = topDocMargin

      doc.setFontSize(5)
      doc.setFont('helvetica')
      doc.setTextColor('#6C6C6C')
      doc.text(
        'YAYASAN PEMBINA LEMBAGA PENDIDIKAN PROVINSI',
        docWidth / 2,
        currentY,
        { align: 'center' },
      )
      currentY += 7
      doc.setFontSize(5)
      doc.setFont('helvetica', 'bold')
      doc.text(
        'PERSATUAN GURU REPUBLIK INDONESIA (YPLP PROVINSI PGRI) SUMATERA SELATAN',
        docWidth / 2,
        currentY,
        { align: 'center' },
      )
      currentY += 10
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.text('SMK PGRI 2 LAHAT', docWidth / 2, currentY, { align: 'center' })
      currentY += lineSpacing
      doc.setFontSize(6)
      doc.setFont('helvetica', 'normal')
      doc.text(
        'Jalan Kirab Remaja, Kelurahan RD. PT. KAI Lahat\nHP : 0821 7955 4241',
        docWidth / 2,
        currentY,
        { align: 'center' },
      )
      currentY += 16

      const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
      ]
      const currentDate = new Date()
      const formattedDate = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`

      doc.setFontSize(7)
      doc.text(
        `DATA SISWA BELUM BAYAR SPP BULAN ${formattedDate.toUpperCase()}`,
        docWidth / 2,
        currentY,
        { align: 'center' },
      )
      currentY += 3

      const image1 = new Image()
      const imagePath1 = '/assets/images/PGRILogo.png'
      image1.onload = function () {
        const imgWidth1 = 40
        const imgHeight1 = (image1.height * imgWidth1) / image1.width
        const tableWidth = doc.internal.pageSize.getWidth() * 0.9
        const tableStartY = currentY + 4
        const tableHorizontalMargin =
          (doc.internal.pageSize.getWidth() - tableWidth) / 2

        doc.addImage(
          image1,
          'PNG',
          tableHorizontalMargin,
          12,
          imgWidth1,
          imgHeight1,
        )

        const options = {
          headStyles: { fillColor: '#696969' },
          startY: tableStartY,
          head: [['No', 'Nama', 'Jurusan', 'Kelas']],
          body: tableData,
          tableWidth,
          margin: { left: tableHorizontalMargin, right: tableHorizontalMargin },
          styles: { cellWidth: undefined, fontSize: 6 },
        }
        autoTable(doc, options)
        doc.save(`data_siswa_spp.pdf`)
      }
      image1.src = imagePath1
    } catch (error: any) {
      message.error(error.message)
    }
  }

  return {
    loading,
    columns,
    dataUser,
    handleGeneratePdf,
    pagination,
    hasNextPage,
    handleTableChange,
  }
}
