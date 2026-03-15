import { Spin, Table, Button } from 'antd'
import { ModalTambahUser } from '@/components/ModalTambahUser'
import { useUserMenuController } from './UserMenu.controller'
import { IUser } from '@/interface/ui/state/dataUser'

export function UserMenuPage() {
  const {
    loading,
    columns,
    dataUser,
    open,
    setOpen,
    actions,
    dataUserInput,
    setDataUserInput,
    showModal,
    initiateData,
  } = useUserMenuController()

  return (
    <Spin tip="Loading Data" spinning={loading}>
      <div className="screenContainer">
        <div className="headerRow">
          <div className="headerLeft">
            <h2 className="screenTitle">Data User</h2>
          </div>
          <div className="headerLeft">
            <Button
              type="primary"
              size="middle"
              className="btnPrimary"
              onClick={() => showModal('tambah', {} as IUser)}>
              Tambah User
            </Button>
            <ModalTambahUser
              getData={initiateData}
              action={actions}
              open={open}
              setOpen={setOpen}
              dataUserInput={dataUserInput}
              setDataUserInput={setDataUserInput}
            />
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
