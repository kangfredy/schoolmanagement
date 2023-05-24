import { SearchOutlined } from "@ant-design/icons";
import { InputRef, Modal } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { ModalTambahSiswa } from "./Modal";

interface DataType {
  nama: string;
  tanggalMasuk: string;
  alamat: string;
  kelas: string;
  jenisKelamin: string;
  agama: string;
}
type DataIndex = keyof DataType;

const data: DataType[] = [
  {
    nama: "Ani",
    alamat: "Jalan 1",
    tanggalMasuk: "123123123",
    kelas: "TKJ 1",
    jenisKelamin: "Perempuan",
    agama: "islam",
  },
  {
    nama: "Zedy",
    alamat: "Jalan mawar",
    tanggalMasuk: "2011-11-10T14:48:00",
    kelas: "TKJ 2",
    jenisKelamin: "Laki-laki",
    agama: "hindu",
  },
  {
    nama: "dani",
    alamat: "Jalan hitam",
    tanggalMasuk: "2011-12-10T14:48:00",
    kelas: "TKJ 41",
    jenisKelamin: "Perempuan",
    agama: "islam",
  },
  {
    nama: "fredi",
    alamat: "Jalan 1",
    tanggalMasuk: "2011-31-10T14:48:00",
    kelas: "TKJ 3",
    jenisKelamin: "Laki-laki",
    agama: "budha",
  },
];

export const DataSiswa = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

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
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
            className="text-black"
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
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
      sorter: (a, b) => a.nama.localeCompare(b.nama),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Kelas",
      dataIndex: "kelas",
      key: "kelas",
      width: "10%",
      ...getColumnSearchProps("kelas"),
      sorter: (a, b) => a.kelas.localeCompare(b.kelas),
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
      title: "agama",
      dataIndex: "agama",
      key: "agama",
      width: "15%",
      ...getColumnSearchProps("agama"),
      sorter: (a, b) => a.agama.localeCompare(b.agama),
      sortDirections: ["descend", "ascend"],
    },
  ];

  return (
    <div className="rounded-md bg-white p-2 ">
      <div className="my-4 flex items-center justify-between px-4">
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-black">Data Siswa</h2>
        </div>
        <div className="flex items-center">
          <Button
            type="primary"
            size="middle"
            className="bg-blue-500"
            onClick={showModal}
          >
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
      <Table columns={columns} dataSource={data} scroll={{ x: 400 }} />
    </div>
  );
};
