import { Spin, Tabs } from 'antd'
import { useDataAdministrasiController } from './DataAdministrasi.controller'

export function DataAdministrasiPage() {
  const { menu } = useDataAdministrasiController()

  return (
    <Spin tip="Loading Data" spinning={false}>
      <div className="screenContainer">
        <Tabs
          defaultActiveKey="1"
          type="card"
          size="middle"
          items={menu.map((value, index) => {
            const TabContent = value.content
            return {
              label: value.label,
              key: index.toString(),
              children: <TabContent />,
            }
          })}
        />
      </div>
    </Spin>
  )
}
