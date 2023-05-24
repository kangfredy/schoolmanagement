import { DatePicker, DatePickerProps, Input, Modal } from "antd";
import { UserOutlined, IdcardOutlined } from "@ant-design/icons";
import { BsGenderAmbiguous } from "react-icons/bs";
import { BiMapAlt } from "react-icons/bi";
import { useState } from "react";

interface DataSiswa {
    nim: string;
    nama: string;
    jenis_kelamin: string;
    alamat: string;
    tanggal_lahir: Date;
    tanggal_masuk: Date;
}

interface ModalTambahSiswaProps {
    open: boolean;
    handleOk: () => void;
    handleCancel: () => void;
    confirmLoading: boolean;
}

export function ModalTambahSiswa({ open, handleOk, handleCancel, confirmLoading }: ModalTambahSiswaProps) {
    const [dataSiswa, setDataSiswa] = useState<DataSiswa>({} as DataSiswa);

    const handleChange = (e: { target: { name: string; value: any } }) =>
        setDataSiswa((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));

    const onChange: DatePickerProps["onChange"] = (date, dateString) => {
        console.log(date, dateString);
    };
    return (
        <Modal
            title="Tambah Data Siswa"
            open={open}
            onOk={handleOk}
            okButtonProps={{ className: "bg-blue-500" }}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}>
            <div className="my-8">
                <div className="my-4 flex items-center">
                    <div className="w-[25%]">Nim:</div>
                    <div>
                        <Input
                            placeholder="Nim"
                            name="nim"
                            value={dataSiswa.nim}
                            prefix={<IdcardOutlined />}
                            onChange={handleChange}
                            className="ml-2 w-60"
                            required
                        />
                    </div>
                </div>
                <div className="my-4 flex items-center">
                    <div className="w-[25%]">Nama Siswa:</div>
                    <div>
                        <Input
                            placeholder="Nama"
                            name="nama"
                            value={dataSiswa.nama}
                            prefix={<UserOutlined />}
                            onChange={handleChange}
                            className="ml-2 w-60"
                            required
                        />
                    </div>
                </div>
                <div className="my-4 flex items-center">
                    <div className="w-[25%]">Jenis Kelamin:</div>
                    <div>
                        <Input
                            placeholder="Jenis Kelamin"
                            name="jenis_kelamin"
                            value={dataSiswa.jenis_kelamin}
                            prefix={<BsGenderAmbiguous />}
                            onChange={handleChange}
                            className="ml-2 w-60"
                            required
                        />
                    </div>
                </div>
                <div className="my-4 flex items-center">
                    <div className="w-[25%]">Tanggal Lahir:</div>
                    <div>
                        <DatePicker onChange={onChange} name="tanggal_lahir" className="ml-2 w-60" />
                    </div>
                </div>
                <div className="my-4 flex items-center">
                    <div className="w-[25%]">Alamat Siswa:</div>
                    <div>
                        <Input
                            placeholder="Alamat"
                            name="alamat"
                            value={dataSiswa.alamat}
                            onChange={handleChange}
                            prefix={<BiMapAlt />}
                            className="ml-2 w-60"
                            required
                        />
                    </div>
                </div>
                <div className="flex">
                    <div className="w-[25%]">Tanggal Masuk:</div>
                    <div>
                        <DatePicker onChange={onChange} name="tanggal_masuk" className="ml-2 w-60" />
                    </div>
                </div>
            </div>
        </Modal>
    );
}
