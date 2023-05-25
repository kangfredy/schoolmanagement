import React, { useState, useContext, useEffect } from "react";
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
import { DataSiswa } from "@/components/DataSiswa";
import { DataBayarSPP } from "@/components/PembayaranSpp";
import { DataBayarPerin } from "@/components/PembayaranPerin";
import { DataBayarSeragam } from "@/components/PembayaranSeragam";
export const Home = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [userData, setUserData] = useState({
        username: "",
        role: "",
        id: "",
        isLogin: false,
    });
    let componentToRender;
    const [value, setValue] = useState("");

    const handleRender = (selectedValue: string) => {
        setValue(selectedValue);
    };

    useEffect(() => {
        let storedData = localStorage.getItem("user");

        if (storedData !== null) {
            try {
                setUserData(JSON.parse(storedData));
            } catch (error) {
                // Handle JSON parse error
                console.error("Error parsing data:", error);
                window.location.href = "/";
            }
        }
    }, []);

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

    switch (value) {
        case "1":
            componentToRender = <DataSiswa />;
            break;
        case "2":
            componentToRender = <DataBayarSPP />;
            break;
        case "3":
            componentToRender = <DataBayarSeragam />;
            break;
        case "4":
            componentToRender = <DataBayarPerin />;
            break;
        default:
            componentToRender = null;
    }

    return (
        <Layout className="h-screen w-screen">
            <Sider trigger={null} collapsible collapsed={collapsed} width={230}>
                <div className="flex h-[60px] items-center justify-center">
                    <div className="mt-2 flex h-[40px] w-[80%] bg-slate-300" />
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={["1"]}
                    items={menuList.map((value, index) => ({
                        key: String(index + 1),
                        icon: React.createElement(value.icon),
                        label: value.label,
                    }))}
                    onClick={({ key }) => {
                        handleRender(key);
                    }}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0 }} className="flex justify-between bg-white">
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
                    <div className="mx-2 my-2 flex items-center justify-end sm:w-[40%] md:w-[30%] lg:w-[20%]">
                        <div className="mr-3">{userData?.username}</div>
                        <Image
                            src="/assets/images/profileDummy.jpg"
                            alt={""}
                            style={{ borderRadius: 9999 }}
                            width={45}
                            height={45}
                        />
                    </div>
                </Header>
                <Content style={{ margin: "24px 16px 0" }}>{componentToRender}</Content>
                <Footer style={{ textAlign: "center" }}>Ant Design ©2023 Created by Ant UED</Footer>
            </Layout>
        </Layout>
    );
};
export default Home;
