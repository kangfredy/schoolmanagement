import { Dispatch, SetStateAction } from "react";
import { IDataKelasModal } from "../state/dataKelasModal";

export interface ModalTambahKelasProps {
    open: boolean;
    action: string;
    setOpen: Dispatch<SetStateAction<boolean>>;
    getData: () => any;
    setDataKelasInput: Dispatch<SetStateAction<IDataKelasModal>>;
    dataKelasInput: IDataKelasModal;
  }