import { Spin, Table, Button } from 'antd'
import { ModalTambahKelas } from '@/components/ModalTambahKelas'
import { useDataKelasController } from './DataKelas.controller'
import { Ikelas } from '@/interface/ui/state/dataKelasTable'

export function DataKelasPage() {
  const {
    loading,
    columns,
    dataKelas,
    open,
    setOpen,
    actions,
    dataKelasInput,
    setDataKelasInput,
    showModal,
    initiateData,
  } = useDataKelasController()

  return (
    <Spin tip="Loading Data" spinning={loading}>
      <div className="screenContainer">
        <div className="headerRow">
          <div className="headerLeft">
            <h2 className="screenTitle">Data Kelas</h2>
          </div>
          <div className="headerLeft">
            <Button
              type="primary"
              size="middle"
              className="btnPrimary"
              onClick={() => showModal('tambah', {} as Ikelas)}>
              Tambah Kelas
            </Button>
            <ModalTambahKelas
              getData={initiateData}
              action={actions}
              open={open}
              setOpen={setOpen}
              dataKelasInput={dataKelasInput}
              setDataKelasInput={setDataKelasInput}
            />
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={dataKelas}
          scroll={{ x: 400 }}
          className="tableFullHeight"
        />
      </div>
    </Spin>
  )
}
