import { Dispatch, SetStateAction } from "react";

export interface IUser {
    id: number;
    username: string;
    role: string;
}

export interface IUserModal {
    password?: string;
    id?: number;
    username: string;
    role: string;
}

export interface ModalTambahUserProps {
    open: boolean;
    action: string;
    setOpen: Dispatch<SetStateAction<boolean>>;
    getData: () => any;
    setDataUserInput: Dispatch<SetStateAction<IUserModal>>;
    dataUserInput: IUserModal;
}