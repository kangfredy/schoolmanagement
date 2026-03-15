import { Spin, Table } from 'antd'
import { Button } from 'antd'
import { ModalDetailSiswa } from '@/components/ModalDetailSiswa'
import { ModalTambahSiswa } from '@/components/ModalTambahSiswa'
import { useDataSiswaController } from './DataSiswa.controller'
import { Isiswa } from '@/interface/ui/state/dataSiswaTable'

export function DataSiswaPage() {
  const {
    loading,
    columns,
    dataSiswa,
    open,
    setOpen,
    actions,
    dataSiswaInput,
    setDataSiswaInput,
    initialClassId,
    showModal,
    initiateData,
    openDetail,
    setOpenDetail,
    dataSiswaSelected,
    dataHistorySpp,
    setDataHistorySpp,
    dataHistorySeragam,
    setDataHistorySeragam,
    getHistoryPembayaranSppBySiswaId,
  } = useDataSiswaController()

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
      <div className="screenContainer">
        <div className="headerRow">
          <div className="headerLeft">
            <h2 className="screenTitle">Data Siswa</h2>
          </div>
          <div className="headerLeft">
            <Button
              type="primary"
              size="middle"
              className="btnPrimary"
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
          className="tableFullHeight"
        />
      </div>
    </Spin>
  )
}
