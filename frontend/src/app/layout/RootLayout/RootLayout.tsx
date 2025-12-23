import { useAuth } from "@/features/auth/model/hooks/useAuth";
import { logout } from "@/shared/api";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CommentOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Menu, Space } from "antd";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import styles from "./RootLayout.module.css";

const { Header, Sider, Content } = Layout;

export const RootLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    {
      key: "/",
      icon: <AppstoreOutlined />,
      label: "Заявки",
    },
    ...(user?.role === "ADMIN"
      ? [
          {
            key: "/users",
            icon: <TeamOutlined />,
            label: "Пользователи",
          },
          {
            key: "/statistics",
            icon: <BarChartOutlined />,
            label: "Статистика",
          },
          {
            key: "/parts",
            icon: <ShoppingCartOutlined />,
            label: "Запчасти",
          },
          {
            key: "/comments",
            icon: <CommentOutlined />,
            label: "Комментарии",
          },
        ]
      : []),
  ];

  const userMenuItems = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Выход",
      onClick: () => {
        logout();
        navigate("/login");
      },
    },
  ];

  return (
    <Layout className={styles.layout}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className={styles.sider}
        width={220}
      >
        <div className={styles.logo}>
          <AppstoreOutlined style={{ fontSize: 24 }} />
          {!collapsed && <span>Service Center</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 220, transition: "margin-left 0.2s" }}>
        <Header className={styles.header}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 64, height: 64 }}
          />

          <Space>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space className={styles.userInfo} style={{ cursor: "pointer" }}>
                <Avatar icon={<UserOutlined />} />
                {!collapsed && <span>{user?.name}</span>}
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};




