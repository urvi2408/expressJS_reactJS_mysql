import React, { useRef } from "react";
import "../App.css";
import { ToastContainer } from "react-toastify";
import { useAddEmployee } from "../hooks/useAddEmployee";
import { Formik } from "formik";
import { employeeDetailsSchema } from "../schema/employeeDetailsSchema";
import { Card, Button, Row, Col } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { RedoOutlined, CheckOutlined, LeftOutlined } from "@ant-design/icons";

const AddEmployeeDetailsForm = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const employeeDetailsRef = useRef();
  const { editID, handleFormSubmit } = useAddEmployee({ state });
  console.log("state", state);

  return (
    <Formik
      initialValues={{
        name: state?.ele?.name || "",
        email: state?.ele?.email || "",
        position: state?.ele?.position || "",
        age: state?.ele?.age || "",
        officeDays: state?.ele?.officeDays || "",
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
            <Card
              title="Employee Details Form"
              style={{
                width: "100%",
                maxWidth: "1700px",
                marginTop: "30px",
              }}
            >
              <form
                onSubmit={(e) => {
                  handleSubmit();
                  e.preventDefault();
                }}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={12} lg={6}>
                    <div className="form-group">
                      <label>Name:</label>
                      <input
                        type="text"
                        value={values.name}
                        disabled={state?.isView}
                        onChange={(e) => {
                          setFieldTouched("name");
                          setFieldValue("name", e.target.value);
                        }}
                        className="form-input"
                      />
                      <div className="error-message">
                        <b>{touched.name && errors.name ? errors.name : ""}</b>
                      </div>
                    </div>
                  </Col>

                  <Col xs={24} sm={12} md={12} lg={6}>
                    <div className="form-group">
                      <label>Age:</label>
                      <input
                        type="number"
                        value={values.age}
                        disabled={state?.isView}
                        onChange={(e) => {
                          setFieldTouched("age");
                          setFieldValue("age", e.target.value);
                        }}
                        className="form-input"
                      />
                      <div className="error-message">
                        <b>{touched.age && errors.age ? errors.age : ""}</b>
                      </div>
                    </div>
                  </Col>

                  <Col xs={24} sm={12} md={12} lg={6}>
                    <div className="form-group">
                      <label>Position:</label>
                      <input
                        type="text"
                        value={values.position}
                        disabled={state?.isView}
                        onChange={(e) => {
                          setFieldTouched("position");
                          setFieldValue("position", e.target.value);
                        }}
                        className="form-input"
                      />
                      <div className="error-message">
                        <b>
                          {touched.position && errors.position
                            ? errors.position
                            : ""}
                        </b>
                      </div>
                    </div>
                  </Col>

                  <Col xs={24} sm={12} md={12} lg={6}>
                    <div className="form-group">
                      <label>Email:</label>
                      <input
                        type="text"
                        value={values.email}
                        disabled={state?.isView}
                        onChange={(e) => {
                          setFieldTouched("email");
                          setFieldValue("email", e.target.value);
                        }}
                        className="form-input"
                      />
                      <div className="error-message">
                        <b>
                          {touched.email && errors.email ? errors.email : ""}
                        </b>
                      </div>
                    </div>
                  </Col>
                </Row>

                <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
                  <Col xs={24} sm={12} md={12} lg={6}>
                    <div className="form-group">
                      <label>Office Days:</label>
                      <input
                        type="number"
                        value={values.officeDays}
                        disabled={state?.isView}
                        onChange={(e) => {
                          setFieldTouched("officeDays");
                          setFieldValue("officeDays", e.target.value);
                        }}
                        className="form-input"
                      />
                      <div className="error-message">
                        <b>
                          {touched.officeDays && errors.officeDays
                            ? errors.officeDays
                            : ""}
                        </b>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row
                  style={{
                    width: "100%",
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                  }}
                >
                  <Button
                    icon={<RedoOutlined />}
                    size="large"
                    onClick={() => resetForm()}
                    disabled={state?.isView}
                  >
                    Reset
                  </Button>
                  <Button
                    htmlType="submit"
                    icon={<CheckOutlined />}
                    size="large"
                    style={{ marginLeft: "10px" }}
                    disabled={state?.isView}
                  >
                    {!editID ? "Save" : "Update"}
                  </Button>
                  <Button
                    icon={<LeftOutlined />}
                    size="large"
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </Button>
                </Row>
              </form>
            </Card>
            <ToastContainer />
          </>
        );
      }}
    </Formik>
  );
};

export default AddEmployeeDetailsForm;
