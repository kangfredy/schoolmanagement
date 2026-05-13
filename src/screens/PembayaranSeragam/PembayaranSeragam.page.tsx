import { Spin, Table, Button } from 'antd'
import { FaPlus } from 'react-icons/fa'
import { buildServerTablePagination } from '@/helper/util/serverTablePagination'
import { ModalSeragam } from '@/components/ModalSeragam'
import { usePembayaranSeragamController } from './PembayaranSeragam.controller'
import { IPembayaranSeragam } from '@/interface/ui/state/dataPembayaranSeragamTable'

export function PembayaranSeragamPage() {
  const {
    loading,
    columns,
    dataPembayaranSeragam,
    open,
    setOpen,
    actions,
    dataPembayaranSeragamInput,
    setDataPembayaranSeragamInput,
    dataHistorySeragam,
    setDataHistorySeragam,
    dataDetailHistoryPembayaranSeragam,
    setDataDetailHistoryPembayaranSeragam,
    dataSeragam,
    setDataSeragam,
    dataInputFilteredSeragam,
    setDataInputFilteredSeragam,
    showModal,
    initiateData,
    getHistoryPembayaranSeragamByPembayaranSeragamId,
    pagination,
    hasNextPage,
    handleTableChange,
  } = usePembayaranSeragamController()

  return (
    <Spin tip="Loading Data" spinning={loading}>
      <div className="screenContainer">
        <div className="headerRow">
          <div className="headerLeft">
            <h2 className="screenTitle">Pembayaran Seragam</h2>
          </div>
          <div className="headerLeft">
            <Button
              type="primary"
              size="middle"
              className="btnPrimary"
              icon={<FaPlus />}
              onClick={() => showModal('tambah', {} as IPembayaranSeragam)}>
              Tambah Seragam
            </Button>
            <ModalSeragam
              getData={initiateData}
              action={actions}
              open={open}
              setOpen={setOpen}
              dataPembayaranSeragamInput={dataPembayaranSeragamInput}
              setDataPembayaranSeragamInput={setDataPembayaranSeragamInput}
              dataHistorySeragam={dataHistorySeragam}
              setDataHistorySeragam={setDataHistorySeragam}
              dataDetailHistoryPembayaranSeragam={
                dataDetailHistoryPembayaranSeragam
              }
              setDataDetailHistoryPembayaranSeragam={
                setDataDetailHistoryPembayaranSeragam
              }
              dataSeragam={dataSeragam}
              setDataSeragam={setDataSeragam}
              dataInputFilteredSeragam={dataInputFilteredSeragam}
              setDataInputFilteredSeragam={setDataInputFilteredSeragam}
              showModal={showModal}
              getHistoryPembayaranSeragamByPembayaranSeragamId={
                getHistoryPembayaranSeragamByPembayaranSeragamId
              }
            />
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={dataPembayaranSeragam}
          scroll={{ x: 400 }}
          className="tableFullHeight"
          pagination={buildServerTablePagination(
            pagination.current,
            pagination.pageSize,
            hasNextPage,
            dataPembayaranSeragam.length,
          )}
          onChange={handleTableChange}
        />
      </div>
    </Spin>
  )
}
