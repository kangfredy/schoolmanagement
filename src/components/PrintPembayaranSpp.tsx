/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { Modal, Spin, Table, InputRef, Tag } from 'antd'
import Image from 'next/image'
import type { ColumnsType } from 'antd/es/table'
import { useRef } from 'react'
import { ModalPrintPembayaranSppProps } from '@/interface/ui/props/ModalPrintPembayaranSpp'
import { IHistorySpp } from '@/interface/ui/state/dataHistorySppTable'
import { convertDate } from '@/helper/util/time'
import { convertMoney } from '@/helper/util/money'
import { getUserInfoWithNullCheck } from '@/helper/util/userInfo'

export function PrintPembayaranSpp({
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
}: ModalPrintPembayaranSppProps) {
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [searchedColumn, setSearchedColumn] = useState('')
  const [searchText, setSearchText] = useState('')
  const searchInput = useRef<InputRef>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [userId, setUserId] = useState(0)
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    console.log('FROM PRINT MODAL', dataHistorySpp)
    const user = getUserInfoWithNullCheck()
    if (user) {
      setUserId(user.id)
      setUserRole(user.role)
      // console.log('USER ID on ModalSpp', user.id)
      // console.log('USER ROLE on ModalSpp', user.role)
    } else {
      console.log('LOCALSTORAGE IS EMPTY')
    }
  }, [])

  let columns: ColumnsType<IHistorySpp> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      width: '13%',
    },
    {
      title: 'Jumlah',
      dataIndex: 'jumlah',
      key: 'jumlah',
      width: '20%',
      render: jumlah => convertMoney(jumlah),
    },
    {
      title: 'Jatuh Tempo',
      dataIndex: 'jatuhTempo',
      key: 'jatuhTempo',
      width: '23%',
      render: jatuhTempo => convertDate(jatuhTempo),
    },
    {
      title: 'Sudah Dibayar',
      dataIndex: 'sudahDibayar',
      key: 'sudahDibayar',
      width: '20%',
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
      render: tanggalPembayaran => convertDate(tanggalPembayaran),
    },
  ]

  const handleCancel = () => {
    // console.log('Clicked cancel button')
    setOpen(false)
  }

  return (
    <Modal
      title="PRINT PEMBAYARAN SPP"
      open={open}
      okButtonProps={{ className: 'bg-blue-500' }}
      confirmLoading={confirmLoading}
      width="80%"
      footer={null}
      onCancel={handleCancel}>
      <div className="flex flex-col">
        {dataSppInput ? (
          <>
            <div>
              <Image
                src="/assets/images/PGRILogo.png"
                alt={''}
                width={150}
                height={150}
                className="my-4"
              />
            </div>
            <div className="w-[50%] flex my-2">
              <div className="w-[50%]">NIS</div>
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
      <Table
        columns={columns}
        dataSource={dataHistorySpp.filter(item => item.sudahDibayar === true)}
        pagination={false}
        // scroll={{ x: 400 }}
        className="h-[100%] mt-4"
      />
    </Modal>
  )
}
