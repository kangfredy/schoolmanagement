import { Spin, Table, Button } from 'antd'
import { useReminderSPPController } from './ReminderSPP.controller'

export function ReminderSPPPage() {
  const { loading, columns, dataUser, handleGeneratePdf } =
    useReminderSPPController()

  return (
    <Spin tip="Loading Data" spinning={loading}>
      <div className="screenContainer">
        <div className="headerRow">
          <div className="headerLeft">
            <h2 className="screenTitle">
              Data Siswa yang belum bayar bulan ini
            </h2>
          </div>
          <div className="headerLeft">
            <Button
              type="primary"
              size="middle"
              className="btnPrint"
              onClick={() => handleGeneratePdf()}>
              CETAK
            </Button>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={dataUser}
          scroll={{ x: 400 }}
          className="tableFullHeight"
        />
      </div>
    </Spin>
  )
}
