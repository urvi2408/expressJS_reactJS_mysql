import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  EditOutlined,
} from "@ant-design/icons";
import AddEmployee from "./components/addEmployee";
import EmployeDetailsList from "./list/employeDetailsList";
import "./App.css";
import { TbBrandNodejs } from "react-icons/tb";
import AddEmployeeDetailsForm from "./components/addEmployeeDetailsForm";

const { Header, Sider, Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: "100vh", overflow: "hidden" }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={250}
          style={{
            background: "#ddd4d0",
            borderRight: "2px solid black",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <div className="logo">
            {collapsed ? <TbBrandNodejs /> : <b>NodeJS / React</b>}
          </div>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={["1"]}
            style={{ backgroundColor: "#ddd4d0" }}
          >
            <Menu.Item
              key="1"
              icon={<EditOutlined />}
              style={{ backgroundColor: "#ddd4d0", color: "black" }}
            >
              <b>Employee Management</b>
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout style={{ marginLeft: collapsed ? 80 : 250 }}>
          <Header
            style={{
              background: "#ddd4d0",
              borderBottom: "2px solid black",
              display: "flex",
              alignItems: "center",
              position: "fixed",
              width: "calc(100% - 30px)",
              left: collapsed ? 80 : 250,
              top: 0,
              zIndex: 10,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="menu-toggle"
            />
            <h2 style={{ marginLeft: 20 }}>Employee Management</h2>
          </Header>

          <Content
            style={{
              padding: "80px 20px 20px",
              height: "calc(100vh - 64px)",
              overflowY: "auto",
              background: "#f5f5f5",
              marginLeft: 30,
              transition: "margin-left 0.3s ease",
            }}
          >
            <Routes>
              {/* <Route path="/" element={<AddEmployee />} /> */}
              <Route path="/" element={<EmployeDetailsList />} />
              <Route
                path="/add-employee-details"
                element={<AddEmployeeDetailsForm />}
              />
              <Route
                path="/edit-employee-details"
                element={<AddEmployeeDetailsForm />}
              />
              <Route
                path="/view-employee-details"
                element={<AddEmployeeDetailsForm />}
              />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
