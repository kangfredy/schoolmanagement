import React, { useState, useContext, useEffect } from 'react'
import { Layout, Menu, theme, Button, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
const { Header, Content, Footer, Sider } = Layout
import {
  HiUser,
  HiVideoCamera,
  HiUpload,
  HiBell,
  HiChevronRight,
  HiChevronLeft,
  HiCalendar,
  HiCash,
  HiTag,
  HiAcademicCap,
} from 'react-icons/hi'
import { RiAdminFill } from 'react-icons/ri'
import { MdClass, MdWarehouse } from 'react-icons/md'
import Image from 'next/image'
import { DataSiswa } from '@/screens/DataSiswa'
import { PembayaranSpp } from '@/screens/PembayaranSpp'
import { DataAdministrasi } from '@/screens/DataAdministrasi'
import { PembayaranSeragam } from '@/screens/PembayaranSeragam'
import { DataKelas } from '@/screens/DataKelas'
import { DataJurusan } from '@/screens/DataJurusan'
import { decodeData, key } from '@/helper/util/saltPassword'

export const Home = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [userData, setUserData] = useState({
    username: '',
    role: '',
    id: '',
    isLogin: false,
  })
  let componentToRender
  const [value, setValue] = useState('')

  const handleRender = (selectedValue: string) => {
    setValue(selectedValue)
  }

  useEffect(() => {
    let storedData = localStorage.getItem('user')
    handleRender('1')

    if (storedData == null) {
      window.location.href = '/'
    } else {
      try {
        setUserData(JSON.parse(decodeData(storedData, key)))
      } catch (error) {
        // Handle JSON parse error
        console.log('Error parsing data:', error)
        window.location.href = '/'
      }
    }
  }, [])

  const menuList = [
    {
      icon: MdWarehouse,
      label: 'Jurusan',
    },
    {
      icon: MdClass,
      label: 'Data Kelas',
    },
    {
      icon: HiAcademicCap,
      label: 'Data Siswa',
    },
    {
      icon: HiCalendar,
      label: 'Pembayaran SPP',
    },
    {
      icon: HiCash,
      label: 'Pembayaran Seragam',
    },
    ...(userData?.role === 'admin'
      ? [
          {
            icon: RiAdminFill,
            label: 'Administrasi',
          },
        ]
      : []),
  ]

  switch (value) {
    case '1':
      componentToRender = <DataJurusan />
      break
    case '2':
      componentToRender = <DataKelas />
      break
    case '3':
      componentToRender = <DataSiswa />
      break
    case '4':
      componentToRender = <PembayaranSpp />
      break
    case '5':
      componentToRender = <PembayaranSeragam />
      break
    case '6':
      componentToRender = <DataAdministrasi />
      break
    default:
      componentToRender = null
  }

  const logout = () => {
    // Perform logout actions here
    // Clear user data, redirect, etc.
    localStorage.clear()
    console.log('LOGOUT BUTTON CLICKED')
    window.location.href = '/'
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <a onClick={logout}>Logout</a>,
    },
  ]

  return (
    <Layout className="h-screen w-screen">
      <Sider trigger={null} collapsible collapsed={collapsed} width={230}>
        <div className="flex h-[120px] items-center justify-center">
          <div className="mt-2 flex h-[80px] w-[80%] items-center justify-center">
            <Image
              src="/assets/images/PGRILogo.png"
              alt={''}
              // style={{ borderRadius: 9999 }}
              width={100}
              height={100}
            />
          </div>
        </div>
        <Menu
          theme="dark"
          mode="vertical"
          defaultSelectedKeys={['1']}
          items={menuList.map((value, index) => ({
            key: String(index + 1),
            icon: React.createElement(value.icon),
            label: value.label,
          }))}
          onClick={({ key }) => {
            handleRender(key)
          }}
        />
      </Sider>
      <Layout>
        <Header
          style={{ padding: 0 }}
          className="flex justify-between bg-white">
          <Button
            type="text"
            icon={collapsed ? <HiChevronRight /> : <HiChevronLeft />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div className="mx-2 my-2 flex items-center justify-end sm:w-[40%] md:w-[30%] lg:w-[20%]">
            <div className="mr-3">{userData?.username}</div>
            <Dropdown menu={{ items }} placement="bottomRight">
              <Image
                src="/assets/images/PGRILogo.png"
                alt={''}
                style={{ borderRadius: 9999 }}
                width={45}
                height={45}
              />
            </Dropdown>
          </div>
        </Header>
        <Content className="mt-2 mx-5 h-[100%] overflow-scroll">
          {componentToRender}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  )
}
export default Home
