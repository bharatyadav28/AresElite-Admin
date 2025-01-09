import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  InputBase,
  InputLabel,
  OutlinedInput,
  StepContent,
  TextField,
  Typography,
  colors,
} from "@mui/material";
import { useResponsiveness } from "../../hooks/useResponsiveness";
import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { GetAllPlans } from "../../Redux/ApiCalls";
import { useDispatch, useSelector } from "react-redux";
import InputCard from "./InputCard";
import UploadImage from "../UploadImage";
import CircleIcon from "@mui/icons-material/Circle";
import CustomModal from "../Modal";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import DeletableImage from "../DeletableImage";
import axiosInstance from "../../utils/axiosUtil";
import Swal from "sweetalert2";
import TimelineIcon from "@mui/icons-material/Timeline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import dayjs from "dayjs";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Label } from "@mui/icons-material";
const SHIPMENT_STATUS = [
  { value: "order placed", label: "Order Placed" },
  { value: "order dispatched", label: "Order Dispatched" },
  { value: "shipped", label: "Shipped" },
  { value: "out for delivery", label: "Out For Delivery" },
  { value: "delivered", label: "Delivered" },
];

export default function Shipment() {
  const token = localStorage.getItem("token");
  const { theme, xs, sm, md, lg } = useResponsiveness();
  const { state } = useLocation();

  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isNewShipment =
    pathname === "/user_management/shipment/create" ||
    pathname === "/shipping-management/shipment/create";

  const { Plans, isFetching } = useSelector((state) => state.plan);
  const [Phases, setPhases] = useState([]);
  const [data, setData] = useState({
    plan: "",
    phase: "",
    productName: "",
    productDescription: "",
    productImages: [],
    shippingAddress: { name: "", address: "", mobile: "" },
    status: [],
  });

  const [newStatus, setNewStatus] = useState({
    label: "",
    value: "",
    startDate: "",
    endDate: "",
    trackingId: "",
  });
  const [isShipmentStatusOpen, setIsShipmentStatusOpen] = useState(false);
  const [isShipmentAddressOpen, setIsShipmentAddressOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(isNewShipment ? true : false);
  const [isSaving, setIsSaving] = useState(false);
  const [isShipmentLoading, setIsShipmentLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    let p = Plans.filter((plan) => plan.name === event.target.value);
    setData({ ...data, plan: event.target.value });
    setPhases(p[0].phases);
  };

  useEffect(() => {
    if (!data.phase || !data.plan) return;

    const selectedPlan = Plans.find((plan) => plan.name === data.plan);
    let selectedPhase;
    if (selectedPlan) {
      setPhases(selectedPlan.phases);
      selectedPhase = selectedPlan.phases.find(
        (phase) => phase.name === data.phase
      );
    }

    if (selectedPhase) {
      setData((prevData) => {
        return { ...prevData, phase: selectedPhase.name };
      });
    }
  }, [Plans, data.phase, data.plan]);

  // console.log("..", Plans);
  // console.log("..", Phases);
  // console.log("..", data);

  const handleConfirmClick = () => {
    setData((prevData) => {
      const newData = {
        label: newStatus.label,
        value: newStatus.value,
        startDate: newStatus.startDate || data.status.at(-1)?.startDate,
        endDate: newStatus.endDate || data.status.at(-1)?.endDate,
        trackingId: newStatus.trackingId || data.trackingId,
      };
      return { ...prevData, status: [...prevData.status, newData] };
    });
    setNewStatus({
      label: "",
      value: "",
      startDate: "",
      endDate: "",
      trackingId: "",
    });
    setIsShipmentStatusOpen(false);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    const fd = new FormData();
    fd.append("image", file);
    setIsImageUploading(true);
    if (
      file.type !== "image/png" &&
      file.type !== "image/jpg" &&
      file.type !== "image/jpeg"
    ) {
      Swal.fire({
        icon: "error",
        title: "oops...",
        text: "Only image with .png, .jpg or .jpeg extension are supported",
      });
      return;
    }
    try {
      const res = await axiosInstance.post("/api/admin/upload_file", fd, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData((prevData) => {
        return {
          ...prevData,
          productImages: [...prevData.productImages, res.data.link],
        };
      });
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "oops...",
        text: "Image Upload Failed...",
      });
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (isNewShipment) {
      const updatedData = {
        ...data,
        ...data.shippingAddress,
        status: data.status.at(-1).value,
        startDate: data.status.at(-1).startDate,
        endDate: data.status.at(-1).endDate,
        trackingId: data.status.at(-1).trackingId,
        id: state.user._id,
      };
      // console.log("....final create data:", updatedData);

      setIsSaving(true);
      try {
        const res = await axiosInstance.post(
          "/api/admin/shipment",
          updatedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log("...response create:", res.data);
        setIsEditing(false);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Successfully created new shipment",
        }).then(() => {
          let path = "/user_management";
          if (pathname.includes("shipping-management")) {
            path = "/shipping-management";
          }
          navigate(path, {
            state: { index: 4, user: state.user },
            replace: true,
          });
        });
      } catch (err) {
        console.log("...error creating shipment data:", err);
        Swal.fire({
          icon: "error",
          title: "oops...",
          text: "Failed to save the form...",
        });
      } finally {
        setIsSaving(false);
      }
    } else {
      const updatedStatus = data.status.map((sta) => {
        return {
          status: sta.value,
          startDate: sta.startDate,
          endDate: sta.endDate,
          trackingId: sta.trackingId,
        };
      });
      const { status, ...updatedData } = {
        ...data,
        shipmentStatus: updatedStatus,
        // name:data.shippingAddress.name,
        // address:data.shippingAddress.address,
        // mobile:data.shippingAddress.mobile,
      };
      console.log("....update final data:", updatedData);

      setIsSaving(true);
      try {
        const res = await axiosInstance.put(
          "/api/admin/shipment",
          { data: updatedData },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              id: state.shipment._id,
            },
          }
        );
        console.log("...response update:", res.data);

        setIsEditing(false);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Successfully updated shipment",
        });
        fetchShipmentDetails();
      } catch (err) {
        console.log("...error updating new shipment data:", err);
        Swal.fire({
          icon: "error",
          title: "oops...",
          text: "Failed to save the form...",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const fetchShipmentDetails = useCallback(async () => {
    setIsShipmentLoading(true);
    try {
      const res = await axiosInstance.get("/api/admin/shipment", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ShipmentId: state.shipment._id,
        },
      });
      console.log("...get shipment details", res.data.shipment);
      const shipment = res.data.shipment;
      setData({
        phase: shipment.phase,
        plan: shipment.plan,
        productName: shipment.productName,
        productDescription: shipment.productDescription,
        productImages: shipment.productImages?.length
          ? shipment.productImages
          : [],
        shippingAddress: shipment.shippingAddress,
        trackingId: shipment.trackingId,
        status: shipment.shipmentStatus.map((sta) => {
          const startDate = sta.startDate?.split("T")[0];
          const endDate = sta.endDate?.split("T")[0];
          return {
            label:
              SHIPMENT_STATUS.find((s) => s.value === sta.status)?.label || "",
            value: sta.status,
            startDate,
            endDate,
            trackingId: shipment.trackingId,
          };
        }),
      });
    } catch (err) {
      console.log("... get shipment details error", err);
      Swal.fire({
        icon: "error",
        title: "oops...",
        text: "Failed to load shipment details",
      });
    } finally {
      setIsShipmentLoading(false);
    }
  }, [state.shipment?._id, token]);

  useEffect(() => {
    if (isNewShipment) return;
    fetchShipmentDetails();
  }, [isNewShipment, fetchShipmentDetails, token]);

  useEffect(() => {
    const fetch = async () => {
      await GetAllPlans(dispatch);
    };
    fetch();
  }, [dispatch]);

  useEffect(() => {
    if (data.productImages.length) return;

    setIsImageModalOpen(false);
  }, [data.productImages?.length]);

  return (
    <>
      <Button
        style={{ marginTop: "1.5%", marginInline: "4%" }}
        startIcon={<ArrowBackIcon />}
        onClick={() => {
          let path = "/user_management";
          if (pathname.includes("shipping-management")) {
            path = "/shipping-management";
          }
          navigate(path, {
            state: { index: 4, user: state.user },
            replace: true,
          });
        }}
      >
        Go back
      </Button>
      <Box
        sx={{
          borderRadius: "2.5rem",
          display: "grid",
          gridTemplateColumns: sm ? "1fr" : "0.1fr 1fr",
          overflow: "hidden",
          marginTop: "0.3rem",
          marginInline: "1%",
        }}
      >
        <Box
          sx={{
            bgcolor: theme.palette.primary.main,
            display: sm ? "none" : "block",
          }}
        />
        <Box
          sx={{ p: sm ? "0.5rem" : "1rem", bgcolor: theme.palette.grey[100] }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: "1.5%" }}>
              Shipment Details
            </Typography>
            {isNewShipment ? (
              <Button
                color="primary"
                style={{
                  textTransform: "none",
                }}
                onClick={handleSubmit}
                variant="contained"
                startIcon={
                  isSaving && (
                    <CircularProgress
                      // color={theme?.palette?.primary?.light}
                      size={"0.8rem"}
                    />
                  )
                }
              >
                Save
              </Button>
            ) : isEditing ? (
              <Box sx={{ display: "flex", gap: "1rem" }}>
                <Button
                  color="primary"
                  style={{
                    // color: theme?.palette?.primary?.main,
                    textTransform: "none",
                  }}
                  onClick={handleSubmit}
                  variant="contained"
                  startIcon={
                    isSaving && (
                      <CircularProgress
                        // color={theme?.palette?.primary?.light}
                        size={"0.8rem"}
                      />
                    )
                  }
                >
                  Save
                </Button>
                <Button
                  style={{
                    color: theme.palette.warning.main,
                    textTransform: "none",
                  }}
                  onClick={() => {
                    setIsEditing(false);
                    fetchShipmentDetails();
                  }}
                >
                  Cancel
                </Button>
              </Box>
            ) : (
              <Button
                style={{
                  color: theme.palette.primary.main,
                  textTransform: "none",
                }}
                disabled={isShipmentLoading}
                startIcon={!isShipmentLoading && <EditIcon />}
                onClick={() => setIsEditing(true)}
              >
                {isShipmentLoading ? <CircularProgress size={25} /> : "Edit"}
              </Button>
            )}
          </Box>
          <Box
            sx={{
              display: sm ? "flex" : "grid",
              flexDirection: "column",
              gridTemplateColumns: sm ? "1fr" : "1fr 1fr",
              gap: "1%",
              mb: "1%",
            }}
          >
            <Grid style={{ width: "100%" }}>
              <InputCard label="Plan">
                <FormControl required sx={{ m: 1, minWidth: 500 }} fullWidth>
                  <Select
                    id="Select-Plan-required"
                    labelId="Select-Plan"
                    label="Select-Plan"
                    value={data.plan}
                    onChange={handleChange}
                    disabled={isFetching || !isEditing}
                    placeholder="Select Plan"
                    variant="standard"
                    disableUnderline
                    required
                    style={{
                      borderRadius: "0.8rem",
                      backgroundColor: colors.grey[100],
                      padding: "0.4rem",
                      color: theme.palette.primary.main,
                    }}
                    startAdornment={
                      isFetching && (
                        <InputAdornment position="start">
                          <CircularProgress size={20} />
                        </InputAdornment>
                      )
                    }
                  >
                    {Plans?.map((plan, index) => (
                      <MenuItem value={plan.name} key={index}>
                        {plan.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </InputCard>
            </Grid>
            <Grid style={{ width: "100%" }}>
              <InputCard label="Phase">
                <FormControl required sx={{ m: 1, minWidth: 500 }} fullWidth>
                  <Select
                    labelId="Select-Phase"
                    label="Select-Phase"
                    id="Select-Phase-required"
                    placeholder="Select Plan"
                    variant="standard"
                    disableUnderline
                    required
                    value={data.phase}
                    disabled={isFetching || !isEditing}
                    onChange={(e) => {
                      setData({ ...data, phase: e.target.value });
                    }}
                    style={{
                      borderRadius: "0.8rem",
                      backgroundColor: colors.grey[100],
                      padding: "0.4rem",
                      color: theme.palette.primary.main,
                    }}
                    startAdornment={
                      isFetching && (
                        <InputAdornment position="start">
                          <CircularProgress size={20} />
                        </InputAdornment>
                      )
                    }
                  >
                    {Phases?.map((p, i) => (
                      <MenuItem key={i} value={p.name}>
                        {p.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </InputCard>
            </Grid>

            <Grid
              style={{
                height: "100%",
                gridRowStart: 2,
                gridRowEnd: 4,
                marginTop: "1%",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <InputCard
                label="Product Images"
                isEditable={data.productImages.length > 0}
                editText="Browse images"
                onClick={() =>
                  isEditing &&
                  data.productImages.length &&
                  setIsImageModalOpen(true)
                }
              >
                <Box>
                  {data.productImages.length ? (
                    <Box sx={{ display: "flex", gap: "1%", flexWrap: "wrap" }}>
                      {data.productImages.map((img, i) => {
                        return (
                          <img
                            src={img}
                            key={i}
                            alt="product images"
                            style={{
                              width: "25%",
                              marginTop: "1%",
                              height: "8rem",
                              borderRadius: "0.5rem",
                            }}
                          />
                        );
                      })}
                    </Box>
                  ) : (
                    <FormControl
                      required
                      sx={{ m: 1, minWidth: 500 }}
                      fullWidth
                      style={{
                        marginBlock: "3rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <UploadImage
                        disabled={isImageUploading || !isEditing}
                        loading={isImageUploading}
                        onChange={handleUploadImage}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setData((prevData) => {
                            const newImages = [...prevData.images];
                            newImages.push(...e.dataTransfer.files);
                            return { ...prevData, images: newImages };
                          });
                        }}
                      />
                    </FormControl>
                  )}
                </Box>
              </InputCard>
            </Grid>

            <Grid style={{ width: "100%", marginTop: "1%" }}>
              <InputCard label="Product Name">
                <FormControl required sx={{ m: 1, minWidth: 500 }} fullWidth>
                  <TextField
                    style={{
                      borderRadius: "0.5rem",
                      backgroundColor: colors.grey[100],
                      padding: "0.4rem",
                    }}
                    onChange={(e) =>
                      setData({ ...data, productName: e.target.value })
                    }
                    disabled={!isEditing}
                    value={data.productName}
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    placeholder="Enter name of the product"
                  />
                </FormControl>
              </InputCard>
              <CustomModal
                open={isImageModalOpen}
                style={{
                  backgroundColor: "white",
                  padding: "2%",
                  borderRadius: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  minWidth: "20%",
                  maxHeight: "40rem",
                }}
                onClose={() => setIsImageModalOpen(false)}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                    padding: "0.5rem",
                  }}
                >
                  <IconButton onClick={() => setIsImageModalOpen(false)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                    mt: "-1rem",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Browse Images
                  </Typography>
                  <UploadImage
                    disabled={isImageUploading || !isEditing}
                    loading={isImageUploading}
                    btnText="Upload"
                    showDropArea={false}
                    onChange={handleUploadImage}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "1%",
                    flexWrap: "wrap",
                    overflow: "auto",
                  }}
                >
                  {data.productImages.map((img, i) => {
                    return (
                      <DeletableImage
                        src={img}
                        containerStyle={{
                          width: "30%",
                          marginTop: "1%",
                          height: "10rem",
                        }}
                        onClick={() => {
                          setData((prevData) => {
                            let updatedImages = [...prevData.productImages];
                            updatedImages = updatedImages.filter(
                              (_, j) => j !== i
                            );
                            return {
                              ...prevData,
                              productImages: updatedImages,
                            };
                          });
                        }}
                      />
                    );
                  })}
                </Box>
              </CustomModal>
            </Grid>
            <Grid
              style={{
                height: "100%",
                marginTop: "1%",
                gridColumnStart: 2,
                gridColumnEnd: 3,
              }}
            >
              <InputCard label="Product Description">
                <FormControl required sx={{ m: 1, minWidth: 500 }} fullWidth>
                  <TextField
                    style={{
                      borderRadius: "0.5rem",
                      backgroundColor: colors.grey[100],
                      padding: "0.4rem",
                    }}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setData({
                        ...data,
                        productDescription: e.target.value,
                      })
                    }
                    value={data.productDescription}
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    multiline
                    rows={lg ? 6 : 4}
                    placeholder="Enter Product description"
                  />
                </FormControl>
              </InputCard>
            </Grid>
            <Grid style={{ width: "100%", marginTop: "1%" }}>
              <InputCard
                label="Shipping Address"
                isEditable
                editText={isShipmentAddressOpen ? "Save" : "Edit"}
                onClick={() => setIsShipmentAddressOpen(!isShipmentAddressOpen)}
              >
                <FormControl required sx={{ m: 1, minWidth: 500 }} fullWidth>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.3rem",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      style={{ color: colors.grey[500] }}
                    >
                      Name
                      {data.shippingAddress.name && !isShipmentAddressOpen ? (
                        <span style={{ color: "black", marginLeft: "1rem" }}>
                          {data.shippingAddress.name}
                        </span>
                      ) : isShipmentAddressOpen ? (
                        <InputBase
                          label="Name"
                          fullWidth
                          placeholder="Enter Name"
                          disabled={!isEditing || !isShipmentAddressOpen}
                          sx={{
                            borderBottom: "1px solid",
                            borderColor: theme.palette.primary.main,
                            marginLeft: "1rem",
                            width: "80%",
                          }}
                          onChange={(e) =>
                            setData({
                              ...data,
                              shippingAddress: {
                                ...data.shippingAddress,
                                name: e.target.value,
                              },
                            })
                          }
                          value={data.shippingAddress.name}
                        />
                      ) : (
                        <span style={{ marginLeft: "1rem" }}>not set</span>
                      )}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      style={{ color: colors.grey[500] }}
                    >
                      Address
                      {data.shippingAddress.address &&
                      !isShipmentAddressOpen ? (
                        <span
                          style={{
                            color: "black",
                            marginLeft: "1rem",
                            whiteSpace: "wrap",
                          }}
                        >
                          {data.shippingAddress.address}
                        </span>
                      ) : isShipmentAddressOpen ? (
                        <InputBase
                          label="Address"
                          placeholder="Enter Address"
                          disabled={!isEditing || !isShipmentAddressOpen}
                          sx={{
                            borderBottom: "1px solid",
                            borderColor: theme.palette.primary.main,
                            marginLeft: "1rem",
                            width: "80%",
                          }}
                          fullWidth
                          multiline
                          onChange={(e) =>
                            setData({
                              ...data,
                              shippingAddress: {
                                ...data.shippingAddress,
                                address: e.target.value,
                              },
                            })
                          }
                          value={data.shippingAddress.address}
                        />
                      ) : (
                        <span style={{ marginLeft: "1rem" }}>not set</span>
                      )}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      style={{ color: colors.grey[500] }}
                    >
                      Mobile
                      {data.shippingAddress.mobile && !isShipmentAddressOpen ? (
                        <span style={{ color: "black", marginLeft: "1rem" }}>
                          {data.shippingAddress.mobile}
                        </span>
                      ) : isShipmentAddressOpen ? (
                        <InputBase
                          label="Mobile"
                          fullWidth
                          placeholder="Enter Mobile"
                          disabled={!isEditing || !isShipmentAddressOpen}
                          sx={{
                            borderBottom: "1px solid",
                            borderColor: theme.palette.primary.main,
                            marginLeft: "1rem",
                            width: "80%",
                          }}
                          onChange={(e) =>
                            setData({
                              ...data,
                              shippingAddress: {
                                ...data.shippingAddress,
                                mobile: e.target.value,
                              },
                            })
                          }
                          value={data.shippingAddress.mobile}
                        />
                      ) : (
                        <span style={{ marginLeft: "1rem" }}>not set</span>
                      )}
                    </Typography>
                  </Box>
                </FormControl>
              </InputCard>
            </Grid>
            <Grid style={{ width: "100%", marginTop: "1%" }}>
              <InputCard label="Shipment Status">
                <FormControl required sx={{ m: 1, minWidth: 500 }} fullWidth>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "start",
                      flexDirection: "column",
                    }}
                  >
                    {[...data.status, { isButton: true }].map((sta, index) => {
                      return (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "start",
                            gap: "2%",
                          }}
                        >
                          {sta.isButton ? (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <CircleIcon color="primary" />
                              </div>
                              <div>
                                <Button
                                  style={{ textTransform: "none", padding: 0 }}
                                  onClick={() => setIsShipmentStatusOpen(true)}
                                  color="primary"
                                  disabled={!isEditing}
                                >
                                  Add Shipment status detail
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <CircleIcon color="primary" />
                                <Divider
                                  orientation="vertical"
                                  sx={{
                                    height: "3rem",
                                    borderWidth: "0.2rem",
                                  }}
                                />
                              </div>
                              <div>
                                <Typography variant="subtitle2">
                                  {sta.label}
                                </Typography>
                                <Typography variant="caption">
                                  {dayjs(sta.startDate).format("MM/DD/YYYY")} -{" "}
                                  {dayjs(sta.endDate).format("MM/DD/YYYY")}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  style={{ display: "block" }}
                                >
                                  Tracking ID -{" "}
                                  {sta.trackingId || data.trackingId}
                                </Typography>
                              </div>
                              <div
                                style={{
                                  alignSelf: "start",
                                  marginTop: "0.2rem",
                                }}
                              >
                                <CloseIcon
                                  style={{ fontSize: "1rem" }}
                                  color="error"
                                  sx={{ "&:hover": { cursor: "pointer" } }}
                                  onClick={() => {
                                    if (!isEditing) return;
                                    setData((prevData) => {
                                      let updateData = [...prevData.status];
                                      updateData = updateData.filter(
                                        (d, i) => i !== index
                                      );
                                      return {
                                        ...prevData,
                                        status: updateData,
                                      };
                                    });
                                  }}
                                />
                              </div>
                            </>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                  <CustomModal
                    open={isShipmentStatusOpen}
                    style={{
                      backgroundColor: "white",
                      padding: "2%",
                      borderRadius: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                      minWidth: xs ? "90%" : sm ? "50%" : "20%",
                      paddingTop: 0,
                    }}
                    onClose={() => setIsShipmentStatusOpen(false)}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        paddingTop: "0.5rem",
                        // paddingBottom: "0",
                      }}
                    >
                      <IconButton
                        onClick={() => setIsShipmentStatusOpen(false)}
                        sx={{
                          padding: 0,
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        mt: "-1rem",
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Shipment details -{" "}
                        <span style={{ color: colors.grey[400] }}>
                          Equipment's
                        </span>
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: colors.grey[500] }}
                      >
                        Please enter Shipment details for the product
                      </Typography>
                    </Box>
                    <Grid style={{ width: "100%" }}>
                      <label
                        style={{
                          fontWeight: "bold",
                          marginBottom: "3%",
                          marginTop: sm ? "3%" : "",
                          fontSize: "0.8rem",
                        }}
                      >
                        Shipment Status
                      </label>
                      <FormControl
                        required
                        sx={{ m: 1, minWidth: 500 }}
                        fullWidth
                      >
                        <Select
                          startAdornment={
                            <InputAdornment
                              position="start"
                              disablePointerEvents
                            >
                              <IconButton sx={{ padding: 0 }}>
                                <LocalShippingIcon />
                              </IconButton>
                            </InputAdornment>
                          }
                          labelId="Select-Status"
                          label="Select-Status"
                          id="Select-Status-required"
                          placeholder="Select shipment status"
                          variant="standard"
                          disableUnderline
                          required
                          disabled={isFetching}
                          style={{
                            borderRadius: "0.8rem",
                            backgroundColor: colors.grey[100],
                            padding: "0.4rem",
                            color: theme.palette.primary.main,
                          }}
                          value={newStatus.value}
                          onChange={(e) =>
                            setNewStatus({
                              ...newStatus,
                              value: e.target.value,
                              label: SHIPMENT_STATUS.find(
                                (sta) => sta.value === e.target.value
                              ).label,
                            })
                          }
                        >
                          {SHIPMENT_STATUS.map((sta, index) => (
                            <MenuItem
                              key={sta}
                              disabled={
                                sta.value ===
                                  data.status.find((s) => s.value === sta.value)
                                    ?.value ||
                                (data.status.length === 0 && index > 0)
                              }
                              value={sta.value}
                            >
                              {sta.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid style={{ width: "100%" }}>
                      <label
                        style={{
                          fontWeight: "bold",
                          marginBottom: "3%",
                          marginTop: sm ? "3%" : "",
                          fontSize: "0.8rem",
                        }}
                      >
                        Tracking ID
                      </label>

                      <FormControl
                        required
                        sx={{ m: 1, minWidth: 500 }}
                        fullWidth
                      >
                        <OutlinedInput
                          value={
                            newStatus.trackingId ||
                            data.status.at(-1)?.trackingId
                          }
                          onChange={(e) =>
                            setNewStatus({
                              ...newStatus,
                              trackingId: e.target.value,
                            })
                          }
                          startAdornment={
                            <InputAdornment
                              position="start"
                              disablePointerEvents
                            >
                              <IconButton style={{ padding: 0 }}>
                                <TimelineIcon />
                              </IconButton>
                            </InputAdornment>
                          }
                          fullWidth
                          style={{
                            backgroundColor: colors.grey[100],
                            padding: "2%",
                          }}
                          sx={{
                            border: "none",
                            "& fieldset": { border: "none" },
                          }}
                          placeholder="Add tracking id"
                        />
                      </FormControl>
                    </Grid>

                    <Box>
                      <label
                        style={{
                          fontWeight: "bold",
                          marginBottom: "2%",
                          marginTop: sm ? "3%" : "",
                          fontSize: "0.8rem",
                        }}
                      >
                        Date
                      </label>
                      <div style={{ width: "37rem" }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: colors.grey[500],
                          }}
                        >
                          Please select both a start date and an end date. if
                          you have only one date, please enter the same date in
                          both input fields
                        </Typography>
                      </div>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "1rem",
                          marginTop: "2%",
                        }}
                      >
                        <Box>
                          <DatePicker
                            value={dayjs(
                              newStatus.startDate ||
                                data.status.at(-1)?.startDate
                            )}
                            onChange={(date) =>
                              setNewStatus({
                                ...newStatus,
                                startDate: dayjs(date).toISOString(),
                              })
                            }
                            inputFormat="MM/dd/yyyy"
                            renderInput={(params) => (
                              <OutlinedInput
                                {...params}
                                fullWidth
                                style={{
                                  backgroundColor: colors.grey[100],
                                  padding: "2%",
                                }}
                                sx={{
                                  border: "none",
                                  "& fieldset": { border: "none" },
                                }}
                                placeholder="Select start date"
                                className="remove-calender-icon"
                              />
                            )}
                          />
                        </Box>
                        <Box>
                          <LocalizationProvider>
                            <DatePicker
                              value={dayjs(
                                newStatus.endDate || data.status.at(-1)?.endDate
                              )}
                              onChange={(date) =>
                                setNewStatus({
                                  ...newStatus,
                                  endDate: dayjs(date).toISOString(),
                                })
                              }
                              inputFormat="MM/dd/yyyy"
                              renderInput={(params) => (
                                <OutlinedInput
                                  {...params}
                                  fullWidth
                                  style={{
                                    backgroundColor: colors.grey[100],
                                    padding: "2%",
                                    width: "100%",
                                  }}
                                  sx={{
                                    border: "none",
                                    "& fieldset": { border: "none" },
                                  }}
                                  placeholder="Select start date"
                                  className="remove-calender-icon"
                                />
                              )}
                            />
                          </LocalizationProvider>
                        </Box>
                      </Box>
                      <Box sx={{ width: "100%", mt: "4%" }}>
                        <Button
                          fullWidth
                          color="primary"
                          variant="contained"
                          style={{ paddingBlock: "2%", textTransform: "none" }}
                          onClick={handleConfirmClick}
                          disabled={!newStatus.value}
                        >
                          Confirm
                        </Button>
                      </Box>
                    </Box>
                  </CustomModal>
                </FormControl>
              </InputCard>
            </Grid>
          </Box>
        </Box>
      </Box>
    </>
  );
}
