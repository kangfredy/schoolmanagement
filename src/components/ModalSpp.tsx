import { DatePicker, DatePickerProps, Input, Modal } from "antd";
import { UserOutlined, IdcardOutlined } from "@ant-design/icons";
import { BsGenderAmbiguous } from "react-icons/bs";
import { BiMapAlt } from "react-icons/bi";
import { Dispatch, SetStateAction, useState } from "react";
import { Select, Space } from "antd";

interface DataType {
    siswaId: number;
    tunggakan: number;
    totalbayar: number;
}

interface ModalSppProps {
    open: boolean;
    action: string;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export function ModalSpp({ action, open, setOpen }: ModalSppProps) {
    const [DataPembayaran, setDataPembayaran] = useState<DataType>({} as DataType);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const handleChange = (e: { target: { name: string; value: any } }) =>
        setDataPembayaran((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));

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
    const handleKelas = (value: number) => {
        setDataPembayaran((prevState) => ({ ...prevState, kelasId: value }));
    };
    const onSearchKelas = (value: string) => {
        console.log("search:", value);
    };

    return (
        <Modal
            title={
                action === "detail" ? "Detail Pembayaran" : action === "edit" ? "Edit Pembayaran" : "Tambah Pembayaran"
            }
            open={open}
            onOk={handleOk}
            okButtonProps={{ className: "bg-blue-500" }}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}>
            <div className="my-8">
                <div className="my-4 flex items-center">
                    <div className="w-[25%]">Nama Siswa:</div>
                    <Select
                        showSearch
                        placeholder="Nama Siswa"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        onChange={handleKelas}
                        onSearch={onSearchKelas}
                        options={[
                            { value: 1, label: "Joko" },
                            { value: 2, label: "Adi" },
                            { value: 3, label: "Ina" },
                            { value: 4, label: "Dany" },
                            { value: 5, label: "Mario 2" },
                            { value: 6, label: "Ahmad 1" },
                            { value: 7, label: "Roni 2" },
                            { value: 8, label: "Predi 3" },
                        ]}
                        className="ml-2 w-60"
                        disabled={action === "detail" || "edit" ? true : false}
                    />
                </div>
            </div>
            <div className="my-8">
                <div className="my-4 flex items-center">
                    <div className="w-[25%]">Tunggakan:</div>
                    <div>
                        <Input
                            placeholder="Tunggakan"
                            name="tunggakan"
                            disabled={action === "detail" ? true : false}
                            value={DataPembayaran.tunggakan}
                            prefix={<UserOutlined />}
                            onChange={handleChange}
                            className="ml-2 w-60"
                            required
                        />
                    </div>
                </div>
            </div>
            <div className="my-8">
                <div className="my-4 flex items-center">
                    <div className="w-[25%]">Total Pembayaran:</div>
                    <div>
                        <Input
                            placeholder="Total Pembayaran"
                            name="totalbayar"
                            disabled={action === "detail" ? true : false}
                            value={DataPembayaran.totalbayar}
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
