import { DatePicker, DatePickerProps, Input, Modal } from "antd";
import { UserOutlined, IdcardOutlined } from "@ant-design/icons";
import { BsGenderAmbiguous } from "react-icons/bs";
import { BiMapAlt } from "react-icons/bi";
import { useState } from "react";
import { Select, Space } from "antd";

interface DataSiswa {
    nim: string;
    nama: string;
    jenis_kelamin: number;
    tanggal_lahir: string;
    alamat: string;
    kelasId: number;
    tanggal_masuk: string;
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

    const onChangeTanggalLahir: DatePickerProps["onChange"] = (date, dateString) => {
        setDataSiswa((prevState) => ({ ...prevState, tanggal_masuk: dateString }));
    };
    const onChangeTanggalMasuk: DatePickerProps["onChange"] = (date, dateString) => {
        console.log(date, dateString);
    };
    const handleSex = (value: number) => {
        setDataSiswa((prevState) => ({ ...prevState, jenis_kelamin: value }));
    };
    const handleKelas = (value: number) => {
        setDataSiswa((prevState) => ({ ...prevState, kelasId: value }));
    };
    const onSearchKelas = (value: string) => {
        console.log("search:", value);
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
                    <div className="w-[25%]">Jenis Kelamin:</div>
                    <Select
                        placeholder="Pilih Jenis Kelamin"
                        onChange={handleSex}
                        options={[
                            { value: 1, label: "Laki - Laki" },
                            { value: 2, label: "Perempuan" },
                        ]}
                        className="ml-2 w-60"
                    />
                </div>
                <div className="my-4 flex items-center">
                    <div className="w-[25%]">Tanggal Lahir:</div>
                    <div>
                        <DatePicker onChange={onChangeTanggalLahir} name="tanggal_lahir" className="ml-2 w-60" />
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
                <div className="my-4 flex items-center">
                    <div className="w-[25%]">Kelas:</div>
                    <Select
                        showSearch
                        placeholder="Pilih Kelas"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        onChange={handleKelas}
                        onSearch={onSearchKelas}
                        options={[
                            { value: 1, label: "TKJ 1" },
                            { value: 2, label: "TKR 2" },
                            { value: 3, label: "RPL 3" },
                            { value: 4, label: "TPM 1" },
                            { value: 5, label: "TITL 2" },
                            { value: 6, label: "TOI 1" },
                            { value: 7, label: "AK 2" },
                            { value: 8, label: "AP 3" },
                            { value: 9, label: "BDP 1" },
                            { value: 10, label: "TEI 2" },
                        ]}
                        className="ml-2 w-60"
                    />
                </div>
                <div className="flex">
                    <div className="w-[25%]">Tanggal Masuk:</div>
                    <div>
                        <DatePicker onChange={onChangeTanggalMasuk} name="tanggal_masuk" className="ml-2 w-60" />
                    </div>
                </div>
            </div>
        </Modal>
    );
}
