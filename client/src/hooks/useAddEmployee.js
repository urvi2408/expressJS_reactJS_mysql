import Axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const useAddEmployee = ({ state }) => {
  const navigate = useNavigate();

  const [editID, setEditID] = useState(state?.ele?.employeeId);

  const handleFormSubmit = (values) => {
    const url = !!editID
      ? `http://localhost:3001/update-employee-details/${editID}`
      : "http://localhost:3001/create";

    const method = !!editID ? "put" : "post";
    Axios({ method, url, data: values })
      .then((res) => {
        toast.success(res.data.message);
        !!editID && setEditID("");
        navigate("/employee-details-list");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return {
    editID,
    handleFormSubmit,
  };
};

export { useAddEmployee };
