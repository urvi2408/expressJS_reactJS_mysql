import Axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { debounce } from "lodash";

const useEmployeeDetailsList = () => {
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalEntries, setTotalEntries] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getEmployeeDetails();
  }, []);

  const fileInputRef = useRef(null);

  const onChangeSearch = useCallback(
    debounce((e) => {
      let searchValue = e?.target?.value?.trim();
      setSearch(searchValue);
      getEmployeeDetails(
        currentPage,
        pageSize,
        sortField,
        sortOrder,
        searchValue
      );
    }, 500),
    [1000]
  );

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const getOrdering = (order) => {
    switch (order) {
      case "ascend":
        return "ASC";
      case "descend":
        return "DESC";
      default:
        return "";
    }
  };

  const getEmployeeDetails = (
    page = currentPage,
    size = pageSize,
    field = sortField,
    order = sortOrder,
    searchParams = search
  ) => {
    Axios.get(
      `http://localhost:3001/get-employee-details/?page=${page}&pageSize=${size}&sortField=${field}&sortOrder=${order}&search=${searchParams}`
    )
      .then((res) => {
        setIsLoading(false);
        toast.success(res.data.message);
        setCurrentPage(res.data.currentPage);
        setPageSize(res.data.pageSize);
        setTotalEntries(res.data.totalEntries);
        setEmployeeDetails(res.data.data);
      })
      .catch((err) => {});
  };

  const handleTableChange = (_pagination, _filters, sorter) => {
    const { field, order } = sorter;
    const ordering = getOrdering(order);
    setSortField(field);
    setSortOrder(ordering);
    getEmployeeDetails(currentPage, pageSize, field, ordering);
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    getEmployeeDetails(page, size, sortField, sortOrder);
  };

  const handleDownload = () => {
    Axios.get("http://localhost:3001/download-employee-data", {
      responseType: "blob", // Important: Ensure you're receiving the file as a Blob
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create an anchor element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "employees.xlsx"); // Set the file name
      document.body.appendChild(link);
      link.click();

      // Clean up the temporary URL after download
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const response = await Axios.post(
        "http://localhost:3001/upload-employee-details",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      e.target.value = null;
      setUploading(false);
      getEmployeeDetails();
      toast.success(response.data.message);
    } catch (error) {
      setUploading(false);
      toast.error(error.response?.data?.error);
    }
  };

  const deleteEmployeeDetail = (id) => {
    Axios.delete(`http://localhost:3001/delete-employee-details/${id}`)
      .then((res) => {
        setIsLoading(false);
        toast.success(res.data.message);
        getEmployeeDetails(
          employeeDetails.length == 1 ? currentPage - 1 : currentPage,
          pageSize,
          sortField,
          sortOrder
        );
      })
      .catch((err) => {});
  };

  return {
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
  };
};

export { useEmployeeDetailsList };
