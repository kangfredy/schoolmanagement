import { Input, Modal, Spin, message } from 'antd'
import { useEffect, useState } from 'react'
import { Select, Space } from 'antd'
import { SiGoogleclassroom } from 'react-icons/si'
import { ISelect } from '@/interface/ui/component/dropdown'
import { MdWarehouse } from 'react-icons/md'
import { getUserInfoWithNullCheck } from '@/helper/util/userInfo'
import { IUserModal, ModalTambahUserProps } from '@/interface/ui/state/dataUser'
import { dataUserUpdateService, tambahUserService } from '@/helper/apiHelper/user'
import { BsKey, BsPeople } from 'react-icons/bs'

export function ModalTambahUser({
  action,
  open,
  setOpen,
  getData,
  setDataUserInput,
  dataUserInput,
}: ModalTambahUserProps) {
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [userError, setUserError] = useState('')

  const handleChange = async (e: any) => {
    const user = await getUserInfoWithNullCheck()
    const updatedBy = user ? user.id : 0

    setDataUserInput((prevState: any) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))

    setUserError(e.target.value.trim() === '' ? 'Required' : '')
  }

  const handleSelect = (e: any) => {
    setDataUserInput({...dataUserInput, role: e})
  }

  const roleList = [
    {value: 'admin', label: 'Admin'},
    {value: 'user', label: 'User'}
  ]

  useEffect(() => {}, [])

  const handleOk = () => {

    if (
      dataUserInput?.username === '' ||
      dataUserInput?.username === undefined
    ) {
      setUserError(
        dataUserInput?.username === '' ||
          dataUserInput?.username === undefined
          ? 'Required'
          : '',
      )
      return
    }

    setConfirmLoading(true)
    if (action === 'tambah') {
      tambahUserService(dataUserInput)
        .then((response: any) => {
          getData()
          setDataUserInput({} as IUserModal)
          setConfirmLoading(false)
        })
        .then((response: any) => {
          setOpen(false)
          message.success('Sukses Tambah User')
        })
        .catch((error: any) => {
          message.error(error.message)
          setOpen(false)
        })
    } else if (action === 'edit') {
      dataUserUpdateService(dataUserInput)
        .then((response: any) => {
          getData()
          setDataUserInput({} as IUserModal)
          setConfirmLoading(false)
        })
        .then((response: any) => {
          setOpen(false)
          message.success('Sukses Edit User')
        })
        .catch((error: any) => {
          message.error(error.message)
          setOpen(false)
        })
    } else {
      setConfirmLoading(false)
      setOpen(false)
    }
  }

  const handleCancel = () => {
    setDataUserInput({} as IUserModal)
    setUserError('')
    setOpen(false)
  }

  return (
    <Modal
      title={
        action === 'detail'
          ? 'Detail User'
          : action === 'edit'
          ? 'Edit User'
          : 'Tambah User'
      }
      open={open}
      onOk={handleOk}
      okButtonProps={{ className: 'bg-blue-500' }}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}>
      <Spin spinning={loading}>
        <div className="my-8">
          <div className="my-4 flex items-center">
            <div className="w-[25%]">Nama User:</div>
            <div>
              <Input
                placeholder="Nama User"
                name="username"
                disabled={action === 'detail' ? true : false}
                value={dataUserInput.username}
                prefix={<BsPeople />}
                onChange={e => handleChange(e)}
                className="ml-2 w-60"
                status={userError ? 'error' : undefined}
                required
              />
            </div>
          </div>
          <div className="my-4 flex items-center">
            <div className="w-[25%]">Password:</div>
            <div>
              <Input
                placeholder="Nama User"
                name="password"
                type='password'
                disabled={action === 'detail' ? true : false}
                value={dataUserInput.password}
                prefix={<BsKey />}
                onChange={e => handleChange(e)}
                className="ml-2 w-60"
                status={userError ? 'error' : undefined}
                required
              />
            </div>
          </div>
          <div className="my-4 flex items-center">
            <div className="w-[25%]">Role:</div>
            <div>
            <Select
                showSearch
                placeholder="Pilih Role"
                onChange={e => handleSelect(e)}
                options={roleList}
                status={userError ? 'error' : undefined}
                className="ml-2 w-60"
                value={dataUserInput.role}
              />
            </div>
            {userError && (
              <p style={{ color: 'red' }} className="ml-4">
                {' '}
                {userError}
              </p>
            )}
          </div>
        </div>
      </Spin>
    </Modal>
  )
}
