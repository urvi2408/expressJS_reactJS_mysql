import { Button, Card, Col, Pagination, Row, Table } from "antd";
import { ToastContainer } from "react-toastify";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  DownloadOutlined,
  UploadOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { columns } from "../config/employeeListColumns";
import "../App.css";
import { useNavigate } from "react-router";
import { useEmployeeDetailsList } from "../hooks/useEmployeeDetailsList";

const EmployeDetailsList = () => {
  const navigate = useNavigate();
  const {
    employeeDetails,
    isLoading,
    uploading,
    totalEntries,
    currentPage,
    pageSize,
    fileInputRef,
    handlePageChange,
    handleTableChange,
    deleteEmployeeDetail,
    handleUpload,
    handleDownload,
    handleButtonClick,
    onChangeSearch,
  } = useEmployeeDetailsList();

  const customColumns = [
    {
      title: "SR No.",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    ...columns,
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() =>
              navigate("/edit-employee-details", {
                state: {
                  ele: record,
                },
              })
            }
          />
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() =>
              navigate("/view-employee-details", {
                state: { isView: true, ele: record },
              })
            }
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteEmployeeDetail(record?.employeeId)}
          />
        </div>
      ),
    },
  ];

  return (
    <Card
      style={{
        width: "100%",
        maxWidth: "1700px",
        marginTop: "20px",
      }}
    >
      <Row
        style={{
          width: "100%",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Col style={{ flex: 1, maxWidth: "400px" }}>
          <input
            type="text"
            placeholder="Search..."
            allowClear
            size={"large"}
            onChange={onChangeSearch}
            icon={<SearchOutlined />}
            style={{
              width: "100%",
              padding: "12px 12px",
              border: "1px solid #d9d9d9",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          />
        </Col>

        <Col style={{ display: "flex", gap: "10px" }}>
          <Button
            icon={<PlusOutlined />}
            size="large"
            onClick={() => {
              navigate("/add-employee-details");
            }}
          >
            Add Employee Details
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            size="large"
          >
            Download Employee Details
          </Button>
          <Button
            icon={<UploadOutlined />}
            size="large"
            onClick={handleButtonClick}
            loading={uploading}
          >
            Import Employee Details
          </Button>
          <input
            type="file"
            accept=".xlsx"
            ref={fileInputRef}
            onChange={handleUpload}
            style={{ display: "none" }}
          />
        </Col>
      </Row>

      <Table
        columns={customColumns}
        dataSource={employeeDetails}
        loading={isLoading || uploading}
        rowKey="employeeId"
        pagination={false}
        bordered
        onChange={handleTableChange}
        scroll={{ y: 400 }}
      />

      <div className="pagination-wrapper">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalEntries || 0}
          onChange={(page, size) => handlePageChange(page, size)}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
        />
      </div>

      <ToastContainer />
    </Card>
  );
};

export default EmployeDetailsList;
