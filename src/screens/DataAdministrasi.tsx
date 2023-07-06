import { Spin, Tabs } from "antd";
import { UserMenu } from "./UserMenu";
import { ReminderSPP } from "./ReminderSPP";
import { ReminderSeragam } from "./ReminderSeragam";

export const DataAdministrasi = () => {


  const menu = [
    {
      label: "User menu",
      content: UserMenu
    },
    {
      label: "Pengingat SPP",
      content: ReminderSPP
    },
    {
      label: "Pengingat Seragam",
      content: ReminderSeragam
    }
  ]
  return (
    <Spin tip="Loading Data" spinning={false}>
    <div className="rounded-md bg-white p-2 h-[100%]">
    <Tabs
        defaultActiveKey="1"
        type="card"
        size='middle'
        items={menu.map((value, index) => {
          return {
            label: value.label,
            key: index.toString(),
            children: < value.content />,
          };
        })}
      />
    </div>
    </Spin>
  );
};
