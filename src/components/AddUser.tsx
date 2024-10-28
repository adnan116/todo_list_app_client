import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import ToastNotification from "@components/ToastNotification";
import { genderOptions, religionOptions } from "@utils/constant";
import { backendBaseUrl } from "@configs/config";

const AddUser: React.FC = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dob: "",
    gender: "",
    religion: "",
    password: "",
    roleId: "",
  });

  const [roles, setRoles] = useState<{ id: string; roleName: string }[]>([]);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<
    "success" | "error" | "warning"
  >("success");

  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const fetchRoles = async () => {
    try {
      const token = window.localStorage.getItem("token");
      const response = await axios.get(`${backendBaseUrl}/user/all-roles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setRoles(response.data.data);
      }
    } catch (error) {
      // Check if the error is an AxiosError and if the response status is 401
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.error("Unauthorized access - Redirecting to login.");
        router.push("/");
      } else {
        console.error("Error fetching users:", error);
      }
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const name = e.target.name as string;
    setForm({ ...form, [name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [name]: "" });
  };

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      const token = window.localStorage.getItem("token");
      const response = await axios.post(`${backendBaseUrl}/user/create`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        setToastMessage("User added successfully!");
        setToastSeverity("success");
        setToastOpen(true);
        setTimeout(() => {
          router.push("/get_user");
        }, 3000);
      }
    } catch (error: any) {
      handleError(error);
    }
  };

  const handleError = (error: any) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { message, errors } = error.response.data;

        if (Array.isArray(errors) && errors.length > 0) {
          setToastMessage(errors[0]?.message || "Failed to add user");
          setFieldErrors((prevErrors) => ({
            ...prevErrors,
            [errors[0]?.field]: errors[0]?.message,
          }));
        } else {
          setToastMessage(message || "Failed to add user");
        }
        setToastSeverity("error");
      } else {
        setToastMessage("An unexpected error occurred. Please try again.");
        setToastSeverity("error");
      }
    } else {
      setToastMessage("An unexpected error occurred. Please try again.");
      setToastSeverity("error");
    }
    setToastOpen(true);
  };

  const handleToastClose = () => {
    setToastOpen(false);
  };

  return (
    <Paper elevation={6} sx={{ padding: 4, borderRadius: 2, width: 500 }}>
      <form onSubmit={handleAddUser}>
        <Typography variant="h5" component="h1" gutterBottom>
          Add New User
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="firstName"
              label="First Name"
              variant="outlined"
              fullWidth
              value={form.firstName}
              onChange={handleInputChange}
              required
              error={!!fieldErrors.firstName}
              helperText={fieldErrors.firstName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="lastName"
              label="Last Name"
              variant="outlined"
              fullWidth
              value={form.lastName}
              onChange={handleInputChange}
              required
              error={!!fieldErrors.lastName}
              helperText={fieldErrors.lastName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="email"
              label="Email"
              variant="outlined"
              fullWidth
              value={form.email}
              onChange={handleInputChange}
              required
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="phoneNumber"
              label="Phone Number"
              variant="outlined"
              fullWidth
              value={form.phoneNumber}
              onChange={handleInputChange}
              required
              error={!!fieldErrors.phoneNumber}
              helperText={fieldErrors.phoneNumber}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="dob"
              label="Date of Birth"
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={form.dob}
              onChange={handleInputChange}
              required
              error={!!fieldErrors.dob}
              helperText={fieldErrors.dob}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl
              variant="outlined"
              fullWidth
              required
              error={!!fieldErrors.gender}
            >
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={form.gender}
                onChange={handleSelectChange}
                label="Gender"
              >
                {genderOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.gender && (
                <Typography variant="caption" color="error">
                  {fieldErrors.gender}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl
              variant="outlined"
              fullWidth
              required
              error={!!fieldErrors.religion}
            >
              <InputLabel>Religion</InputLabel>
              <Select
                name="religion"
                value={form.religion}
                onChange={handleSelectChange}
                label="Religion"
              >
                {religionOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.religion && (
                <Typography variant="caption" color="error">
                  {fieldErrors.religion}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={form.password}
              onChange={handleInputChange}
              required
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl
              variant="outlined"
              fullWidth
              required
              error={!!fieldErrors.roleId}
            >
              <InputLabel>Role</InputLabel>
              <Select
                name="roleId"
                value={form.roleId}
                onChange={handleSelectChange}
                label="Role"
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.roleName}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.roleId && (
                <Typography variant="caption" color="error">
                  {fieldErrors.roleId}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Add User
        </Button>
      </form>

      <ToastNotification
        open={toastOpen}
        onClose={handleToastClose}
        message={toastMessage}
        severity={toastSeverity}
      />
    </Paper>
  );
};

export default AddUser;
