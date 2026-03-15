import React, { useState, useEffect, useMemo } from 'react'
import { Layout, Menu, Button, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
const { Header, Content, Footer, Sider } = Layout
import {
  HiChevronRight,
  HiChevronLeft,
  HiAcademicCap,
  HiCalendar,
  HiCash,
} from 'react-icons/hi'
import Image from 'next/image'
import { DataSiswa } from '@/screens/DataSiswa'
import { DataJurusan } from '@/screens/DataJurusan'
import { DataKelas } from '@/screens/DataKelas'
import { PembayaranSpp } from '@/screens/PembayaranSpp'
import { PembayaranSeragam } from '@/screens/PembayaranSeragam'
import { DataAdministrasi } from '@/screens/DataAdministrasi'
import { useUserStore } from '@/store/userStore'
import { MdWarehouse, MdClass } from 'react-icons/md'
import { RiAdminFill } from 'react-icons/ri'

export const Home = () => {
  const [collapsed, setCollapsed] = useState(false)
  const user = useUserStore((state) => state.user)
  const logout = useUserStore((state) => state.logout)
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)
  const [value, setValue] = useState('')

  const handleRender = (selectedValue: string) => {
    setValue(selectedValue)
  }

  useEffect(() => {
    handleRender('1')
    if (!isAuthenticated()) {
      window.location.href = '/'
    }
  }, [isAuthenticated])

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
    ...(user?.role === 'admin'
      ? [
          {
            icon: RiAdminFill,
            label: 'Administrasi',
          },
        ]
      : []),
  ]

  const componentMap: Record<string, React.ComponentType> = {
    '1': DataJurusan,
    '2': DataKelas,
    '3': DataSiswa,
    '4': PembayaranSpp,
    '5': PembayaranSeragam,
    '6': DataAdministrasi,
  }
  const CurrentComponent = useMemo(
    () => componentMap[value] ?? null,
    [value]
  )

  const handleLogout = () => {
    logout()
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <a onClick={handleLogout}>Logout</a>,
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
            <div className="mr-3">{user?.username}</div>
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
        {CurrentComponent && <CurrentComponent />}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Orb Studio ©2023 Created by Orb Studio
        </Footer>
      </Layout>
    </Layout>
  )
}
export default Home
