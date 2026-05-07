import { Spin, Table } from 'antd'
import { ModalSpp } from '@/components/ModalSpp'
import { usePembayaranSppController } from './PembayaranSpp.controller'

export function PembayaranSppPage() {
  const {
    loading,
    columns,
    dataSpp,
    open,
    setOpen,
    actions,
    dataSppInput,
    setDataSppInput,
    dataHistorySpp,
    setDataHistorySpp,
    dataHistorySppSelect,
    setDataHistorySppSelect,
    showModal,
    initiateData,
    getHistoryPembayaranSppByPembayaranSppId,
    pagination,
    handleTableChange,
  } = usePembayaranSppController()

  return (
    <>
      <ModalSpp
        getData={initiateData}
        action={actions}
        open={open}
        setOpen={setOpen}
        dataSppInput={dataSppInput}
        setDataSppInput={setDataSppInput}
        dataHistorySpp={dataHistorySpp}
        setDataHistorySpp={setDataHistorySpp}
        dataHistorySppSelect={dataHistorySppSelect}
        setDataHistorySppSelect={setDataHistorySppSelect}
        showModal={showModal}
        getHistoryPembayaranSppByPembayaranSppId={
          getHistoryPembayaranSppByPembayaranSppId
        }
      />
      <Spin tip="Loading Data" spinning={loading}>
        <div className="screenContainer">
          <div className="headerRow">
            <div className="headerLeft">
              <h2 className="screenTitle">Pembayaran SPP</h2>
            </div>
            <div className="headerLeft" />
          </div>
          <Table
            columns={columns}
            dataSource={dataSpp}
            scroll={{ x: 400 }}
            className="tableFullHeight"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
            }}
            onChange={handleTableChange}
          />
        </div>
      </Spin>
    </>
  )
}
