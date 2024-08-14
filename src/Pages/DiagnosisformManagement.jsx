import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../utils/axiosUtil";
import Forms from "../components/Forms";
import Swal from "sweetalert2";


const DiagnosisformManagement = () => {
  const token = localStorage.getItem("token");
  const [formElements, setFormElements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);
    await axiosInstance
      .post(
        "/api/admin/save_form",
        { obj: formElements, name: "Diagnosis" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Done...",
          text: "Request successfully handled...",
        });
      })
      .finally(() => setIsSubmiting(false));
  };

  console.log("....formaData", formElements);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/api/admin/fetch_form", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          name: "Diagnosis",
        },
      });
      setFormElements(response?.data?.doc[0]?.obj);
    } catch (error) {
      alert("Error fetching form data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  return (
    <Forms
      isLoading={isLoading}
      isSubmiting={isSubmiting}
      formElements={formElements}
      setFormElements={setFormElements}
      onSubmit={handleSubmit}
      title={"Diagnosis Form"}
      getData={fetchData}
    />
  );
};

export default DiagnosisformManagement;
