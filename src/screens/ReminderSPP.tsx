import { getSiswaBelumBayarService } from '@/helper/apiHelper/historyPembayaranSpp'
import { getUserService, dataUserDeleteService } from '@/helper/apiHelper/user'
import { getUserInfoWithNullCheck } from '@/helper/util/userInfo'
import { IReminderSPP } from '@/interface/ui/state/IReminderSPP'
import { SearchOutlined } from '@ant-design/icons'
import {
  InputRef,
  message,
  Input,
  Space,
  Button,
  Popconfirm,
  Spin,
  Table,
} from 'antd'
import { ColumnType, ColumnsType } from 'antd/es/table'
import { FilterConfirmProps } from 'antd/es/table/interface'
import React, { useEffect, useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { convertDateTime } from '@/helper/util/time'

type DataIndex = keyof IReminderSPP

export const ReminderSPP = () => {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)
  const [open, setOpen] = useState(false)
  const [actions, setActions] = useState('')
  const [dataUser, setDataUser] = useState<IReminderSPP[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [userId, setUserId] = useState(0)
  const [userRole, setUserRole] = useState('')

  const initiateData = async () => {
    setLoading(true)
    await getSiswaBelumBayarService()
      .then(response => {
        setDataUser(response.data.getHistoryPembayaranSpp)
      })
      .then(() => {
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
      })
  }

  const getUserData = async () => {
    const user = await getUserInfoWithNullCheck()
    if (user) {
      setUserId(user.id)
      setUserRole(user.role)
    } else {
      console.log('LOCALSTORAGE IS EMPTY')
    }
  }

  useEffect(() => {
    initiateData()
    getUserData()
  }, [])

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm()
    setSearchText(selectedKeys[selectedKeys.length])
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

  function getNestedValue(obj: any, key: string): any {
    const keys = key.split('.')
    let nestedValue = obj
    for (const nestedKey of keys) {
      nestedValue = nestedValue?.[nestedKey]
      if (nestedValue === undefined) {
        break
      }
    }

    return nestedValue
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
          onChange={e => {
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }}
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => {
              handleSearch(selectedKeys as string[], confirm, dataIndex)
              console.log(selectedKeys)
              console.log(confirm)
              console.log(dataIndex)
            }}
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
    // onFilter: (value, record) => {
    //   var nestedValue = record
    //   for (let i = 0; i < dataIndex.length; i += 2) {
    //     const nestedObjectKey = dataIndex[i]
    //     const nestedPropertyKey = dataIndex[i + 1]

    //     const nestedObject = getNestedValue(nestedValue, nestedObjectKey)
    //     nestedValue = nestedObject ? nestedObject[nestedPropertyKey] : undefined
    //     if (nestedValue == undefined && nestedObject.startsWith(value)) {
    //       return true
    //     }
    //     // return true;
    //   }

    //   return false
    // },
    onFilter: (value, record) => {
      let data = record
      for (const key of dataIndex) {
        data = (data as any)[key]
        if (data === undefined) {
          return false // If any nested key is undefined, no need to continue
        }
      }
      return data
        .toString()
        .toLowerCase()
        .includes(value.toString().toLowerCase())
    },
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
                searchText && part.toLowerCase() === searchText.toLowerCase() ? (
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
    // Remove the Updated At column from the columns array if the userRole is not 'admin'
    columns = columns.filter(column => column.key !== 'updatedBy')
    columns = columns.filter(column => column.key !== 'updatedAt')
  }

  const handleGeneratePdf = () => {
    try {
      const doc = new jsPDF({
        format: 'a4',
        unit: 'px',
      })

      const tableData = dataUser.map((item, index) => [
        index + 1,
        item.pembayaranSpp.siswa.nama,
        item.pembayaranSpp.siswa.kelas.namaKelas,
        item.pembayaranSpp.siswa.kelas.jurusan.namaJurusan,
      ])

      const docWidth = doc.internal.pageSize.getWidth()
      // const docHeight = doc.internal.pageSize.getHeight()
      const contentWidth = docWidth * 0.96
      // const horizontalMargin = (docWidth - contentWidth) / 2
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

      doc.setFontSize(6)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor('#6C6C6C')
      doc.text(
        'Jalan Kirab Remaja, Kelurahan RD. PT. KAI Lahat\nHP : 0821 7955 4241',
        docWidth / 2,
        currentY,
        { align: 'center' },
      )
      currentY += 16

      const middleDocX = doc.internal.pageSize.getWidth() / 2

      const currentDate = new Date()
      const monthNames = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
      ]
      const month = monthNames[currentDate.getMonth()]
      const year = currentDate.getFullYear()

      const formattedDate = `${month} ${year}`

      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')
      doc.text(
        `DATA SISWA BELUM BAYAR SPP BULAN ${formattedDate.toUpperCase()}`,
        middleDocX,
        currentY,
        {
          align: 'center',
        },
      )
      currentY += 3

      // Add the first image below the texts
      const image1 = new Image()
      const imagePath1 = '/assets/images/PGRILogo.png'

      image1.onload = function () {
        const imgWidth1 = 40
        const imgHeight1 = (image1.height * imgWidth1) / image1.width
        const imgX1 = 3
        const imgY1 = 12

        // Generate the table
        const tableWidth = doc.internal.pageSize.getWidth() * 0.9
        const tableStartY = currentY + 4
        const tableHorizontalMargin =
          (doc.internal.pageSize.getWidth() - tableWidth) / 2

        doc.addImage(
          image1,
          'PNG',
          tableHorizontalMargin, // pengganti imgX1
          imgY1,
          imgWidth1,
          imgHeight1,
        )

        const options = {
          headStyles: { fillColor: '#696969' },
          startY: tableStartY,
          head: [['No', 'Nama', 'Jurusan', 'Kelas']],
          body: tableData,
          tableWidth: tableWidth,
          margin: {
            left: tableHorizontalMargin,
            right: tableHorizontalMargin,
          },
          styles: { cellWidth: undefined, fontSize: 6 },
        }

        // Generate the table with the options
        autoTable(doc, options)

        doc.save(`data_siswa_spp.pdf`)
      }

      image1.src = imagePath1
    } catch (error: any) {
      // Handle the error here
      message.error(error.message)
    }
  }

  return (
    <Spin tip="Loading Data" spinning={loading}>
      <div className="rounded-md bg-white p-2 h-[100%] overflow-scroll">
        <div className="my-4 flex items-center justify-between px-4">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-black">
              Data Siswa yang belum bayar bulan ini
            </h2>
          </div>
          <div className="flex items-center">
            <Button
              type="primary"
              size="middle"
              className="bg-red-500"
              onClick={() => handleGeneratePdf()}>
              CETAK
            </Button>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={dataUser}
          scroll={{ x: 400 }}
          className="h-[100%]"
        />
      </div>
    </Spin>
  )
}
