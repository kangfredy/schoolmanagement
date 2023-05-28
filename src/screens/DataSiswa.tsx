import { SearchOutlined } from "@ant-design/icons";
import { InputRef, Modal, Popconfirm } from "antd";
import { Button, Input, Space, Table,message } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { ModalTambahSiswa } from "../components/ModalTambahSiswa";
import { getDataSiswa } from "@/helper/apiHelper/dataSiswa";

interface IDataSiswa {
    nama: string;
    nim: string;
    tanggalMasuk: string;
    tanggalLahir: string;
    alamat: string;
    kelasId: string;
    namaKelas: string;
    jenisKelamin: string;
    agama: string;
}
type DataIndex = keyof IDataSiswa;

export const DataSiswa = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [DataSiswa, setDataSiswa] = useState<IDataSiswa[]>([]);

  const showModal = () => {
    setOpen(true);
  };

  useEffect(() => {
    getDataSiswa()
      .then((response) => {
        // console.log(response.data.dataSiswaData);

        const responseData = response.data.dataSiswaData
        const readyData = responseData.map((item: any) => {
          return {
            id: item.id,
            nim: item.nim,
            nama: item.nama,
            kelasId: item.kelasId,
            namaKelas: item.kelas.namaKelas,
            alamat: item.alamat,
            jenisKelamin: item.jenisKelamin,
            agama: item.agama,
            tanggalLahir: item.tanggalLahir,
            tanggalMasuk: item.tanggalMasuk,
          }
        })
        // console.log("READY DATA", readyData)

        setDataSiswa(readyData);
      })
      .catch((error) => console.log(error));
  }, []);

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

  const handleReset = (
    clearFilters: () => void,
    confirm: (param?: FilterConfirmProps) => void
  ) => {
    clearFilters();
    setSearchText("");
    confirm();
  };

  //handle Popconfrim
  const handleConfirmDelete = (data: IDataSiswa) => {
    message.success("Click on Yes");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<IDataSiswa> => ({
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
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
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

  const columns: ColumnsType<IDataSiswa> = [
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
      dataIndex: "namaKelas",
      key: "namaKelas",
      width: "10%",
      ...getColumnSearchProps("namaKelas"),
      sorter: (a, b) => a.namaKelas.localeCompare(b.namaKelas),
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
          <Button
            type="primary"
            size="middle"
            className="bg-blue-500"
            onClick={showModal}
          >
            Edit Siswa
          </Button>

          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={()=>handleConfirmDelete(record)}
            okText="Yes"
          >
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
      <Table
        columns={columns}
        dataSource={DataSiswa}
        scroll={{ x: 400 }}
        className="h-[100%]"
      />
    </div>
  );
};
