import './app.css'
import {Button, ConfigProvider, Layout, theme, App as AntApp, Flex} from "antd";
import {Content, Header} from "antd/es/layout/layout";
import { PlusOutlined } from '@ant-design/icons';
import {Outlet, useNavigate} from "react-router";

export const App: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ConfigProvider theme={{
      algorithm: theme.defaultAlgorithm,
      components: {
        Layout: {
          headerBg: '#eee',
        }
      }
    }}>
      <Layout>
        <Header>
          <Flex vertical={false} gap={"middle"}>
            <div>Course Management System</div>
            <div><Button onClick={() => navigate("/new")}>Create new course <PlusOutlined /></Button></div>
          </Flex>
        </Header>
        <Layout>
          <Content>
            <AntApp>
              <Outlet />
            </AntApp>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
