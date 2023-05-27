import { DatePicker, DatePickerProps, Input, Modal } from "antd";
import { UserOutlined, IdcardOutlined } from "@ant-design/icons";
import { BsGenderAmbiguous } from "react-icons/bs";
import { BiMapAlt } from "react-icons/bi";
import { Dispatch, SetStateAction, useState } from "react";
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

interface ModalTambahKelasProps {
    open: boolean;
    action: string;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export function ModalTambahKelas({ action, open, setOpen }: ModalTambahKelasProps) {
    const [dataSiswa, setDataSiswa] = useState<DataSiswa>({} as DataSiswa);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const handleChange = (e: { target: { name: string; value: any } }) =>
        setDataSiswa((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));

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

    return (
        <Modal
            title={action === "detail" ? "Detail Kelas" : action === "edit" ? "Edit Kelas" : "Tambah Kelas"}
            open={open}
            onOk={handleOk}
            okButtonProps={{ className: "bg-blue-500" }}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}>
            <div className="my-8">
                <div className="my-4 flex items-center">
                    <div className="w-[25%]">Nama Kelas:</div>
                    <div>
                        <Input
                            placeholder="Nama Kelas"
                            name="kelasId"
                            disabled={action === "detail" ? true : false}
                            value={dataSiswa.kelasId}
                            prefix={<UserOutlined />}
                            onChange={handleChange}
                            className="ml-2 w-60"
                            required
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
}
