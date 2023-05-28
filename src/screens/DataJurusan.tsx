import { SearchOutlined } from "@ant-design/icons";
import { InputRef, Modal, Popconfirm, Spin, message } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { ModalTambahJurusan } from "../components/ModalTambahJurusan";
import { dataJurusanDelete, getJurusan } from "@/helper/apiHelper/jurusan";
import { IDataJurusanModal } from "@/interface/ui/state/dataJurusanModal";
import { IJurusan } from "@/interface/ui/state/dataJurusanModal";


type DataIndex = keyof IJurusan;

export const DataJurusan = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [open, setOpen] = useState(false);
  const [actions, setActions] = useState("");
  const [dataJurusan, setDataJurusan] = useState<IJurusan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataJurusanInput, setDataJurusanInput] = useState<IDataJurusanModal>(
    {} as IDataJurusanModal
  );

  const showModal = (action: string, data: IJurusan) => {
    let dataInput = {
      id: data?.id,
      namaJurusan: data?.namaJurusan,
    }
    setDataJurusanInput(dataInput)
    setActions(action);
    setOpen(true);
  };

  const initiateData = async () => {
    setLoading(true);
    await getJurusan()
      .then((response) => {
        setDataJurusan(response.data.getJurusan);
      })
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    initiateData();
  }, []);

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
  const handleConfirmDelete = async (clickedData: any) => {
    setLoading(true);
    await dataJurusanDelete({ id: clickedData.id })
      .then((response) => {
        message.success("Click on Yes");
        initiateData();
      })
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        message.error(error.message);
      });
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<IJurusan> => ({
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

  const columns: ColumnsType<IJurusan> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      width: "13%",
      ...getColumnSearchProps("id"),
      sorter: (a, b) => a.id - b.id,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Nama",
      dataIndex: "namaJurusan",
      key: "nama",
      width: "40%",
      ...getColumnSearchProps("namaJurusan"),
      sorter: (a, b) => a.namaJurusan.localeCompare(b.namaJurusan),
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
            onClick={() => showModal("edit", record)}
          >
            Edit Jurusan
          </Button>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={(e) => handleConfirmDelete(record)}
            okText="Yes"
            okButtonProps={{ className: "bg-blue-500", size: "small" }}
            cancelText="No"
          >
            <Button danger type="primary" size="middle" className="bg-blue-500">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Spin tip="Loading Data" spinning={loading}>
      <div className="rounded-md bg-white p-2 h-[100%] overflow-scroll">
        <div className="my-4 flex items-center justify-between px-4">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-black">Data Jurusan</h2>
          </div>
          <div className="flex items-center">
            <Button
              type="primary"
              size="middle"
              className="bg-blue-500"
              onClick={() => showModal("tambah", {} as IJurusan)}
            >
              Tambah Jurusan
            </Button>
            <ModalTambahJurusan
              getData={initiateData}
              action={actions}
              open={open}
              setOpen={setOpen}
              dataJurusanInput={dataJurusanInput}
              setDataJurusanInput={setDataJurusanInput}
            />
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={dataJurusan}
          scroll={{ x: 400 }}
          className="h-[100%]"
        />
      </div>
    </Spin>
  );
};
