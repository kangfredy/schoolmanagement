import { IModalDetailSiswaProps } from '@/interface/ui/props/ModalDetailSiswa'
import { Modal, Table } from 'antd'
import { FormInput } from './FormInput'
import {
  MdAccountCircle,
  MdCardMembership,
  MdHomeWork,
  MdIcecream,
} from 'react-icons/md'
import { IoIosCard } from 'react-icons/io'
import { SiGoogleclassroom, SiGooglehome } from 'react-icons/si'
import { IdataSppHistory } from '@/interface/ui/state/dataSPPHistory'
import { SetStateAction, useEffect, useState } from 'react'
import { historyPembayaranSppByPembayaranSppId } from '@/helper/apiHelper/historyPembayaranSpp'
import { TableSPPHistory } from './TableSppHistory'
import { TableSeragamHistory } from './TableSeragamHistory'

export const ModalDetailSiswa = (props: IModalDetailSiswaProps) => {
  const [historySPP, setHistorySPP] = useState<IdataSppHistory[]>(
    [] as IdataSppHistory[],
  )

  const getHistoryPembayaranSPp = () => {
    historyPembayaranSppByPembayaranSppId(1)
      .then(response => setHistorySPP(response.getHistoryPembayaranSppById))
      .catch(e => console.log(e))
  }

  useEffect(() => {
    getHistoryPembayaranSPp()
  }, [])
  return (
    <>
      <Modal
        open={props.isOpen}
        width={'75%'}
        footer={null}
        onCancel={() => props.setIsOpen(false)}>
        <div className="flex flex-col items-start w-[100%] my-5">
          <div className="w-[100%]">
            <div className="w-[50%] h-[15%] flex-col flex gap-3 my-5">
              <FormInput
                label="Nama"
                placeholder={props.DataSiswa.nama}
                values={props.DataSiswa.nama}
                onChange={e => console.log(e)}
                isDisabled
                icons={<MdAccountCircle />}
              />
              <FormInput
                label="NIM"
                placeholder="NIM"
                icons={<IoIosCard />}
                isDisabled
                values={props.DataSiswa.nim}
                onChange={e => console.log(e)}
              />
              <FormInput
                label="Jurusan"
                placeholder="Jurusan"
                isDisabled
                icons={<MdHomeWork />}
                values={props.DataSiswa?.kelas?.jurusan?.namaJurusan}
                onChange={e => console.log(e)}
              />
              <FormInput
                label="Kelas"
                placeholder="Kelas"
                isDisabled
                icons={<SiGoogleclassroom />}
                values={props.DataSiswa?.kelas?.namaKelas}
                onChange={e => console.log(e)}
              />
              <FormInput
                label="Alamat"
                placeholder="Alamat"
                isDisabled
                isArea
                values={props.DataSiswa?.alamat}
                onChange={e => console.log(e)}
              />
            </div>
            <div className="text-xl my-5">History Pembayaran SPP</div>
            <TableSPPHistory Data={historySPP} />
            <div className="text-xl my-5">History Pembayaran Seragam</div>
            <TableSeragamHistory Data={historySPP} />
          </div>
        </div>
      </Modal>
    </>
  )
}
