import { SearchOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";

const { Column, ColumnGroup } = Table;

interface DataType {
    nama: string;
    tanggalMasuk: string;
    alamat: string;
    kelas: string;
    jenisKelamin: number;
    agama: string;
}
type DataIndex = keyof DataType;

const data: DataType[] = [
    {
        nama: "ucok",
        alamat: "Jalan 1",
        tanggalMasuk: "123123123",
        kelas: "TKJ 1",
        jenisKelamin: 1,
        agama: "kong",
    },
    {
        nama: "dedi",
        alamat: "Jalan mawar",
        tanggalMasuk: "2011-11-10T14:48:00",
        kelas: "TKJ 2",
        jenisKelamin: 1,
        agama: "hindu",
    },
    {
        nama: "dani",
        alamat: "Jalan hitam",
        tanggalMasuk: "2011-12-10T14:48:00",
        kelas: "TKJ 41",
        jenisKelamin: 1,
        agama: "islam",
    },
    {
        nama: "fredi",
        alamat: "Jalan 1",
        tanggalMasuk: "2011-31-10T14:48:00",
        kelas: "TKJ 3",
        jenisKelamin: 1,
        agama: "budha",
    },
];
export const DataSiswa = () => {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef<InputRef>(null);

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText("");
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
                        style={{ width: 90 }}>
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
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
            title: "Nama",
            dataIndex: "nama",
            key: "nama",
            width: "30%",
            ...getColumnSearchProps("nama"),
        },
        {
            title: "Kelas",
            dataIndex: "kelas",
            key: "kelas",
            width: "20%",
            ...getColumnSearchProps("kelas"),
        },
        {
            title: "Alamat",
            dataIndex: "alamat",
            key: "alamat",
            ...getColumnSearchProps("alamat"),
            sorter: (a, b) => a.alamat.length - b.alamat.length,
            sortDirections: ["descend", "ascend"],
        },
    ];

    return <Table columns={columns} dataSource={data} />;
};
