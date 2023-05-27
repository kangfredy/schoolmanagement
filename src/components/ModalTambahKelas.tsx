import { DatePicker, DatePickerProps, Input, Modal, Spin, message } from "antd";
import { UserOutlined, IdcardOutlined } from "@ant-design/icons";
import { BsGenderAmbiguous } from "react-icons/bs";
import { BiMapAlt } from "react-icons/bi";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Select, Space } from "antd";
import { dataKelasUpdate, tambahKelas } from "@/helper/apiHelper/kelas";
import { Ikelas } from "@/screens/DataKelas";
import { SiGoogleclassroom } from "react-icons/si";
import { getJurusan } from "@/helper/apiHelper/jurusan";

export interface IDataKelas {
  id?: number;
  namaKelas: string;
  jurusanId: number;
}

interface IjurusanData {
  value: number;
  label: string;
}

interface ModalTambahKelasProps {
  open: boolean;
  action: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  getData: () => any;
  setDataKelasInput: Dispatch<SetStateAction<IDataKelas>>;
  dataKelasInput: IDataKelas;
}

export function ModalTambahKelas({
  action,
  open,
  setOpen,
  getData,
  setDataKelasInput,
  dataKelasInput,
}: ModalTambahKelasProps) {

 
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [dataJurusan, setDataJurusan] = useState<IjurusanData[]>(
    [] as IjurusanData[]
  );
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: { target: { name: string; value: any } }) =>
    setDataKelasInput((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

  const getJurusanData = () => {
    setLoading(true);
    getJurusan()
      .then((response) => {
        let arrayTemp: any = [];
        response.data.getJurusan.map(
          (value: { id: number; namaJurusan: string }) => {
            const objectData = {
              value: value.id,
              label: value.namaJurusan,
            };
            arrayTemp.push(objectData);
          }
        );
        setDataJurusan(arrayTemp);
      })
      .then((response) => {
        setLoading(false);
      })
      .catch((error) => {
        console.error(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getJurusanData();
  }, []);


  const handleOk = () => {
    setConfirmLoading(true);
    if (action === "tambah") {
      tambahKelas(dataKelasInput)
        .then((response: any) => {
          getData();
          setDataKelasInput({} as IDataKelas);
          setConfirmLoading(false);
        })
        .then((response) => {
          setOpen(false);
          message.success("sukses Tambah Kelas");
        })
        .catch((error: any) => {
          message.error(error.message);
          setOpen(false);
        });
    } else if (action === "edit") {
      dataKelasUpdate(dataKelasInput)
        .then((response: any) => {
          getData();
          setDataKelasInput({} as IDataKelas);
          setConfirmLoading(false);
        })
        .then((response) => {
          setOpen(false);
          message.success("sukses Tambah Kelas");
        })
        .catch((error: any) => {
          message.error(error.message);
          setOpen(false);
        });
    } else {
      setConfirmLoading(false);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setDataKelasInput({} as IDataKelas);
    setOpen(false);
  };

  const handleJurusan = (value: number) => {
    setDataKelasInput({ ...dataKelasInput, jurusanId: value });
  };

  return (
    <Modal
      title={
        action === "detail"
          ? "Detail Kelas"
          : action === "edit"
          ? "Edit Kelas"
          : "Tambah Kelas"
      }
      open={open}
      onOk={handleOk}
      okButtonProps={{ className: "bg-blue-500" }}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <Spin spinning={loading}>
        <div className="my-8">
          <div className="my-4 flex items-center">
            <div className="w-[25%]">Nama Kelas:</div>
            <div>
              <Input
                placeholder="Nama Kelas"
                name="namaKelas"
                disabled={action === "detail" ? true : false}
                value={dataKelasInput.namaKelas}
                prefix={<SiGoogleclassroom />}
                onChange={(e) => handleChange(e)}
                className="ml-2 w-60"
                required
              />
            </div>
          </div>
          <div className="my-4 flex items-center">
            <div className="w-[25%]">Jurusan:</div>
            <div>
              <Select
                showSearch
                placeholder="Pilih Kelas"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onChange={handleJurusan}
                options={dataJurusan}
                className="ml-2 w-60"
                value={dataKelasInput.jurusanId}
              />
            </div>
          </div>
        </div>
      </Spin>
    </Modal>
  );
}
