import { useCallback, useEffect, useState } from "react";
import Tab from "./Tab";
import axiosInstance from "../../utils/axiosUtil";
import Swal from "sweetalert2";

export default function TermsAndConditions() {
  const token = localStorage.getItem("token");
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState({});
  const [role, setRole] = useState("doctor");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleIsEditingClose = () => setIsEditing(false);
  const handleIsEditingOpen = () => setIsEditing(true);

  const fetchContents = useCallback(
    async (type) => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get("/api/admin/terms_and_conditions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            role,
          },
        });
        if (res.data.success) {
          if (res.data.termsAndConditions) {
            // setContent(res.data.termsAndConditions.text);
            setContent(res.data.termsAndConditions);
          } else {
            setContent("");
          }
        }
        if (type === "cancel") {
          handleIsEditingClose();
        }
      } catch (err) {
        console.log("...error", err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text:
            type === "cancel"
              ? "Failed to cancel the changes..."
              : "Failed to fetch contents...",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [role]
  );

  const updateContent = (newValue) => {
    setContent((prev) => {
      return { ...prev, text: newValue };
    });
  };

  const handleOnSave = async (isDelete) => {
    setIsUpdating(true);
    try {
      let res = null;

      if (isDelete) {
        res = await axiosInstance.delete(
          `/api/admin/terms_and_conditions?id=${content._id}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        res = await axiosInstance.post(
          "/api/admin/terms_and_conditions",
          { text: content?.text, role },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Done...",
          text: "Successfully updated contents...",
        });
        handleIsEditingClose();
        fetchContents();
      }
    } catch (err) {
      console.log("...error", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOnDelete = () => {
    handleOnSave("-");
  };

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  return (
    <Tab
      text="Terms And Conditions"
      content={content}
      role={role}
      onRoleChange={setRole}
      isEditing={isEditing}
      isSaving={isUpdating}
      isLoading={isLoading}
      onContentChange={updateContent}
      onEdit={handleIsEditingOpen}
      onSave={handleOnSave}
      onCancel={() => {
        fetchContents("cancel");
      }}
      onDelete={handleOnDelete}
    />
  );
}
