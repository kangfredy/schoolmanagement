import { Dispatch, SetStateAction } from "react";
import { IDataJurusanModal } from "../state/dataJurusanModal";

export interface ModalTambahJurusanProps {
    open: boolean;
    action: string;
    setOpen: Dispatch<SetStateAction<boolean>>;
    getData: () => any;
    setDataJurusanInput: Dispatch<SetStateAction<IDataJurusanModal>>;
    dataJurusanInput: IDataJurusanModal;
  }