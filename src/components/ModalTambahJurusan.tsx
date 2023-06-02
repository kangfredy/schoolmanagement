import {  Input, Modal, Spin, message } from "antd";
import {  useEffect, useState } from "react";
import { Select, Space } from "antd";
import { dataJurusanUpdate, tambahJurusan } from "@/helper/apiHelper/jurusan";
import { SiGoogleclassroom } from "react-icons/si";
import { getJurusan } from "@/helper/apiHelper/jurusan";
import { ISelect } from "@/interface/ui/component/dropdown";
import { IDataJurusanModal } from "@/interface/ui/state/dataJurusanModal";
import { ModalTambahJurusanProps } from "@/interface/ui/props/ModalTambahJurusan";
import { MdWarehouse } from "react-icons/md";


export function ModalTambahJurusan({
  action,
  open,
  setOpen,
  getData,
  setDataJurusanInput,
  dataJurusanInput,
}: ModalTambahJurusanProps) {

 
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [dataJurusan, setDataJurusan] = useState<ISelect[]>(
    [] as ISelect[]
  );
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: { target: { name: string; value: any } }) =>
    setDataJurusanInput((prevState: any) => ({
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
      tambahJurusan(dataJurusanInput)
        .then((response: any) => {
          getData();
          setDataJurusanInput({} as IDataJurusanModal);
          setConfirmLoading(false);
        })
        .then((response: any) => {
          setOpen(false);
          message.success("sukses Tambah Jurusan");
        })
        .catch((error: any) => {
          message.error(error.message);
          setOpen(false);
        });
    } else if (action === "edit") {
      dataJurusanUpdate(dataJurusanInput)
        .then((response: any) => {
          getData();
          setDataJurusanInput({} as IDataJurusanModal);
          setConfirmLoading(false);
        })
        .then((response: any) => {
          setOpen(false);
          message.success("sukses Tambah Jurusan");
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
    setDataJurusanInput({} as IDataJurusanModal);
    setOpen(false);
  };

  return (
    <Modal
      title={
        action === "detail"
          ? "Detail Jurusan"
          : action === "edit"
          ? "Edit Jurusan"
          : "Tambah Jurusan"
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
            <div className="w-[25%]">Nama Jurusan:</div>
            <div>
              <Input
                placeholder="Nama Jurusan"
                name="namaJurusan"
                disabled={action === "detail" ? true : false}
                value={dataJurusanInput.namaJurusan}
                prefix={<MdWarehouse />}
                onChange={(e) => handleChange(e)}
                className="ml-2 w-60"
                required
              />
            </div>
          </div>
        </div>
      </Spin>
    </Modal>
  );
}