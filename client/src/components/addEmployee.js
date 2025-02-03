import React, { useRef } from "react";
import "../App.css";
import { ToastContainer } from "react-toastify";
import { useAddEmployee } from "../hooks/useAddEmployee";
import { Formik } from "formik";
import { employeeDetailsSchema } from "../schema/employeeDetailsSchema";
import { Table, Button, Pagination } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { columns } from "../config/employeeListColumns";

const AddEmployee = () => {
  const employeeDetailsRef = useRef();
  const {
    employeeDetails,
    isLoading,
    uploading,
    editID,
    currentPage,
    pageSize,
    totalEntries,
    handleUpload,
    handleDownload,
    handleFormSubmit,
    deleteEmployeeDetail,
    editEmployeeDetail,
    handleTableChange,
    handlePageChange,
  } = useAddEmployee({ employeeDetailsRef });

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
            onClick={() => editEmployeeDetail(record)}
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
    <Formik
      initialValues={{
        name: "",
        email: "",
        position: "",
        age: "",
        officeDays: "",
      }}
      validationSchema={employeeDetailsSchema}
      innerRef={employeeDetailsRef}
      onSubmit={(values) => {
        handleFormSubmit(values);
      }}
    >
      {(formik) => {
        const {
          errors,
          touched,
          values,
          setFieldTouched,
          setFieldValue,
          handleSubmit,
          resetForm,
        } = formik;
        return (
          <>
            <div className="main-wrapper">
              {/* Left Form */}
              <div className="information">
                <form
                  onSubmit={(e) => {
                    handleSubmit();
                    e.preventDefault();
                  }}
                >
                  <label>Name:</label>
                  <input
                    type="text"
                    value={values.name}
                    onChange={(e) => {
                      setFieldTouched("name");
                      setFieldValue("name", e.target.value);
                    }}
                  />
                  <div className="error-message">
                    <b>{touched.name && errors.name ? errors.name : ""}</b>
                  </div>

                  <label>Age:</label>
                  <input
                    type="number"
                    value={values.age}
                    onChange={(e) => {
                      setFieldTouched("age");
                      setFieldValue("age", e.target.value);
                    }}
                  />
                  <div className="error-message">
                    <b>{touched.age && errors.age ? errors.age : ""}</b>
                  </div>

                  <label>Position:</label>
                  <input
                    type="text"
                    value={values.position}
                    onChange={(e) => {
                      setFieldTouched("position");
                      setFieldValue("position", e.target.value);
                    }}
                  />
                  <div className="error-message">
                    <b>
                      {touched.position && errors.position
                        ? errors.position
                        : ""}
                    </b>
                  </div>

                  <label>Email:</label>
                  <input
                    type="text"
                    value={values.email}
                    onChange={(e) => {
                      setFieldTouched("email");
                      setFieldValue("email", e.target.value);
                    }}
                  />
                  <div className="error-message">
                    <b>{touched.email && errors.email ? errors.email : ""}</b>
                  </div>

                  <label>Office Days:</label>
                  <input
                    type="number"
                    value={values.officeDays}
                    onChange={(e) => {
                      setFieldTouched("officeDays");
                      setFieldValue("officeDays", e.target.value);
                    }}
                  />
                  <div className="error-message">
                    <b>
                      {touched.officeDays && errors.officeDays
                        ? errors.officeDays
                        : ""}
                    </b>
                  </div>

                  <button type="button" onClick={() => resetForm()}>
                    Reset Form
                  </button>

                  <button type="submit">
                    {!editID ? "Add Employee" : "Update Employee"}
                  </button>

                  <button type="button" onClick={() => handleDownload()}>
                    Download Employee Data
                  </button>
                  <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleUpload}
                    disabled={uploading}
                  />
                </form>
              </div>
              {/* Right Table */}
              <div className="table-container">
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
                    onChange={(page, size) => {
                      handlePageChange(page, size);
                    }}
                    showSizeChanger
                    pageSizeOptions={["5", "10", "20", "50"]}
                  />
                </div>
              </div>
              <ToastContainer />
            </div>
          </>
        );
      }}
    </Formik>
  );
};

export default AddEmployee;
