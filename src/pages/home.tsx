import React, { useState } from "react";
import { Layout, Menu, theme, Button } from "antd";
const { Header, Content, Footer, Sider } = Layout;
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
} from "react-icons/hi";
import Image from "next/image";
import { useHookstate } from "@hookstate/core";
import { userState } from "@/globalState/userState";
export const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const globalState = useHookstate(userState)
  const menuList = [
    {
      icon: HiUser,
      label: "Data Siswa",
    },
    {
      icon: HiCalendar,
      label: "Pembayaran SPP",
    },
    {
      icon: HiCash,
      label: "Pembayaran Seragam",
    },
    {
      icon: HiTag,
      label: "Pembayaran Prakerin",
    },
  ];
  return (
    <Layout className="h-screen w-screen">
      <Sider trigger={null} collapsible collapsed={collapsed} width={230}>
        <div className="flex items-center justify-center h-[60px]">
          <div className="h-[40px] w-[80%] bg-slate-300 mt-2 flex" />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["4"]}
          items={menuList.map((value, index) => ({
            key: String(index + 1),
            icon: React.createElement(value.icon),
            label: value.label,
          }))}
        />
      </Sider>
      <Layout>
        <Header
          style={{ padding: 0 }}
          className="bg-white flex justify-between"
        >
          <Button
            type="text"
            icon={collapsed ? <HiChevronRight /> : <HiChevronLeft />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <div className="mx-2 my-2 lg:w-[20%] md:w-[30%] sm:w-[40%] flex justify-end items-center">
           <div className="mr-3">{globalState.get().username}</div> 
          <Image src="/assets/images/profileDummy.jpg"
           alt={""}
           style={{borderRadius: 9999}} width={45} height={45} />
          </div>
        </Header>
        <Content style={{ margin: "24px 16px 0" }}>
          <div style={{ padding: 24, minHeight: 360 }} className="bg-white">
            content
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default Home;
