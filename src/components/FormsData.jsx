import React, { useCallback, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosUtil";
import Swal from "sweetalert2";

function FormsData({ userId }) {
  const token = localStorage.getItem("token");

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(null);

  const fetchFormData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(
        `/api/admin/all-form-data/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFormData(res.data.data);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    fetchFormData();
  }, [fetchFormData]);

  const renderFormData = () => {
    if (!formData) return <div></div>;

    return Object.entries(formData).map(
      ([formName, formContent]) =>
        formContent &&
        formContent.form.length > 0 && (
          <div key={formContent._id} style={{ marginBottom: "20px" }}>
            <h3
              style={{
                textTransform: "capitalize",
                marginBottom: "10px",
                borderBottom: "2px solid #ccc",
              }}
            >
              {formName}
            </h3>
            {formContent.form.map((formItem, index) => (
              <div
                key={index}
                style={{
                  padding: "20px",
                  borderRadius: "5px",
                  marginBottom: "5px",
                  backgroundColor: index % 2 === 0 ? "#ffff" : "#000", // Darker color for the first row of each form
                }}
              >
                {Object.entries(formItem).map(([key, value], inde) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "5px 0",
                    }}
                  >
                    <span>{key}:</span>
                    <span>
                      {Array.isArray(value) ? value.join(", ") : value}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )
    );
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Forms</h1>
      {isLoading ? <p>Loading...</p> : renderFormData()}
    </div>
  );
}

export default FormsData;
