import { Spin, Table, Button } from 'antd'
import { ModalTambahJurusan } from '@/components/ModalTambahJurusan'
import { useDataJurusanController } from './DataJurusan.controller'
import { IJurusan } from '@/interface/ui/state/dataJurusanModal'

export function DataJurusanPage() {
  const {
    loading,
    columns,
    dataJurusan,
    open,
    setOpen,
    actions,
    dataJurusanInput,
    setDataJurusanInput,
    showModal,
    initiateData,
    pagination,
    handleTableChange,
  } = useDataJurusanController()

  return (
    <Spin tip="Loading Data" spinning={loading}>
      <div className="screenContainer">
        <div className="headerRow">
          <div className="headerLeft">
            <h2 className="screenTitle">Data Jurusan</h2>
          </div>
          <div className="headerLeft">
            <Button
              type="primary"
              size="middle"
              className="btnPrimary"
              onClick={() => showModal('tambah', {} as IJurusan)}>
              Tambah Jurusan
            </Button>
            <ModalTambahJurusan
              getData={initiateData}
              action={actions}
              open={open}
              setOpen={setOpen}
              dataJurusanInput={dataJurusanInput}
              setDataJurusanInput={setDataJurusanInput}
            />
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={dataJurusan}
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
  )
}
