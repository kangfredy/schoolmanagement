import { Spin, Table, Button } from 'antd'
import { FaPlus } from 'react-icons/fa'
import { buildServerTablePagination } from '@/helper/util/serverTablePagination'
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
    pagination,
    hasNextPage,
    handleTableChange,
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
              icon={<FaPlus />}
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
          pagination={buildServerTablePagination(
            pagination.current,
            pagination.pageSize,
            hasNextPage,
            dataKelas.length,
          )}
          onChange={handleTableChange}
        />
      </div>
    </Spin>
  )
}
