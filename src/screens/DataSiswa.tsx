import { SearchOutlined } from "@ant-design/icons";
import { InputRef, Modal, Popconfirm } from "antd";
import { Button, Input, Space, Table,message } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { ModalTambahSiswa } from "../components/ModalTambahSiswa";
import { getDataSiswa } from "@/helper/apiHelper/dataSiswa";

interface DataType {
    nama: string;
    nim: string;
    tanggalMasuk: string;
    tanggalLahir: string;
    alamat: string;
    kelasId: string;
    jenisKelamin: string;
    agama: string;
}
type DataIndex = keyof DataType;

const data: DataType[] = [
    {
        nama: "Akul Santoso",
        nim: "9876543210",
        alamat: "Jalan 2",
        tanggalMasuk: "2023-06-20T09:30:00Z",
        tanggalLahir: "2001-03-15T14:30:00Z",
        kelasId: "TKJ 2",
        jenisKelamin: "Laki-laki",
        agama: "Islam",
    },
    {
        nama: "Citra Sari",
        nim: "2468135790",
        alamat: "Jalan 3",
        tanggalMasuk: "2023-07-10T10:15:00Z",
        tanggalLahir: "2002-01-05T11:45:00Z",
        kelasId: "TKJ 1",
        jenisKelamin: "Perempuan",
        agama: "Islam",
    },
    {
        nama: "Zaki Prasetyo",
        nim: "1357924680",
        alamat: "Jalan 4",
        tanggalMasuk: "2023-08-05T08:45:00Z",
        tanggalLahir: "2003-06-25T13:20:00Z",
        kelasId: "TKJ 2",
        jenisKelamin: "Laki-laki",
        agama: "Islam",
    },
    {
        nama: "Eka Putri",
        nim: "8024671359",
        alamat: "Jalan 5",
        tanggalMasuk: "2023-09-15T12:00:00Z",
        tanggalLahir: "2002-10-12T16:00:00Z",
        kelasId: "TKJ 1",
        jenisKelamin: "Perempuan",
        agama: "Islam",
    },
    {
        nama: "Viki Rahman",
        nim: "5739162840",
        alamat: "Jalan 6",
        tanggalMasuk: "2023-10-25T11:30:00Z",
        tanggalLahir: "2001-05-28T09:15:00Z",
        kelasId: "TKJ 2",
        jenisKelamin: "Laki-laki",
        agama: "Islam",
    },
    {
        nama: "Gita Puspita",
        nim: "9182736450",
        alamat: "Jalan 7",
        tanggalMasuk: "2023-11-10T15:45:00Z",
        tanggalLahir: "2003-09-18T08:30:00Z",
        kelasId: "TKJ 1",
        jenisKelamin: "Perempuan",
        agama: "Islam",
    },
    {
        nama: "Joko Pramono",
        nim: "5063728194",
        alamat: "Jalan 8",
        tanggalMasuk: "2023-12-05T11:00:00Z",
        tanggalLahir: "2002-07-07T14:15:00Z",
        kelasId: "TKJ 2",
        jenisKelamin: "Laki-laki",
        agama: "Islam",
    },
    {
        nama: "Ika Dewi",
        nim: "1928374650",
        alamat: "Jalan 9",
        tanggalMasuk: "2024-01-15T09:45:00Z",
        tanggalLahir: "2001-11-30T12:45:00Z",
        kelasId: "TKJ 1",
        jenisKelamin: "Perempuan",
        agama: "Islam",
    },
    {
        nama: "Joko Susanto",
        nim: "3746582910",
        alamat: "Jalan 10",
        tanggalMasuk: "2024-02-20T14:00:00Z",
        tanggalLahir: "2003-04-10T11:30:00Z",
        kelasId: "TKJ 2",
        jenisKelamin: "Laki-laki",
        agama: "Islam",
    },
    {
        nama: "Karin Lestari",
        nim: "5019283746",
        alamat: "Jalan 11",
        tanggalMasuk: "2024-03-10T10:30:00Z",
        tanggalLahir: "2002-09-20T13:15:00Z",
        kelasId: "TKJ 1",
        jenisKelamin: "Perempuan",
        agama: "Islam",
    },
];

export const DataSiswa = () => {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef<InputRef>(null);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [DataSiswa, setDataSiswa] = useState<DataType>([])

    const showModal = () => {
        setOpen(true);
    };

    useEffect(()=> {
        getDataSiswa()
        .then(response => {
            console.log(response.data.dataSiswaData)
            setDataSiswa(response.data.dataSiswaData)
        })
        .catch(error =>  console.log(error))
    },[])

    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        console.log("Clicked cancel button");
        setOpen(false);
    };

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void, confirm: (param?: FilterConfirmProps) => void) => {
        clearFilters();
        setSearchText("");
        confirm();
    };

    //handle Popconfrim
    const handleConfirmDelete = (e: React.MouseEvent<HTMLElement>) => {
        message.success("Click on Yes");
    };

    const handleCancelDelete = (e: React.MouseEvent<HTMLElement>) => {
        console.log(e);
        message.error("Click on No");
    };

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                        className="text-black">
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters, confirm)}
                        size="small"
                        style={{ width: 90 }}>
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}>
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}>
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    const columns: ColumnsType<DataType> = [
        {
            title: "Nim",
            dataIndex: "nim",
            key: "nim",
            width: "13%",
            ...getColumnSearchProps("nim"),
            sorter: (a, b) => a.nim.localeCompare(b.nim),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Nama",
            dataIndex: "nama",
            key: "nama",
            width: "25%",
            ...getColumnSearchProps("nama"),
            sorter: (a, b) => a.nama.localeCompare(b.nama),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Kelas",
            dataIndex: "kelasId",
            key: "kelasId",
            width: "10%",
            ...getColumnSearchProps("kelasId"),
            sorter: (a, b) => a.kelasId.localeCompare(b.kelasId),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Alamat",
            dataIndex: "alamat",
            key: "alamat",
            width: "30%",
            ...getColumnSearchProps("alamat"),
            sorter: (a, b) => a.alamat.localeCompare(b.alamat),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Jenis Kelamin",
            dataIndex: "jenisKelamin",
            key: "jenisKelamin",
            width: "15%",
            ...getColumnSearchProps("jenisKelamin"),
            sorter: (a, b) => a.jenisKelamin.localeCompare(b.jenisKelamin),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Agama",
            dataIndex: "agama",
            key: "agama",
            width: "15%",
            ...getColumnSearchProps("agama"),
            sorter: (a, b) => a.agama.localeCompare(b.agama),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle" split>
                    <Button type="primary" size="middle" className="bg-blue-500" onClick={showModal}>
                        Edit Siswa
                    </Button>

                    <Popconfirm
                        title="Delete the task"
                        description="Are you sure to delete this task?"
                        onConfirm={handleConfirmDelete}
                        okText="Yes">
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="rounded-md bg-white p-2 h-[100%] overflow-scroll">
            <div className="my-4 flex items-center justify-between px-4">
                <div className="flex items-center">
                    <h2 className="text-xl font-bold text-black">Data Siswa</h2>
                </div>
                <div className="flex items-center">
                    <Button type="primary" size="middle" className="bg-blue-500" onClick={showModal}>
                        Tambah Data Siswa
                    </Button>
                    <ModalTambahSiswa
                        open={open}
                        handleOk={handleOk}
                        handleCancel={handleCancel}
                        confirmLoading={confirmLoading}
                    />
                </div>
            </div>
            <Table columns={columns} dataSource={data} scroll={{ x: 400}} className="h-[100%]"/>
        </div>
    );
};
