import React, { useState } from "react";
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
import ToastNotification from "@components/ToastNotification";
import axios from "axios";
import { genderOptions, religionOptions } from "@utils/constant";
import { backendBaseUrl } from "@configs/config";
import Link from "next/link";

const SignupForm: React.FC = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dob: "",
    gender: "",
    religion: "",
    password: "",
  });

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<
    "success" | "error" | "warning"
  >("success");

  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const name = e.target.name as string;
    setForm({ ...form, [name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [name]: "" });
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      const response = await axios.post(`${backendBaseUrl}/user/sign-up`, form);

      if (response.status === 201) {
        setToastMessage("Signup successful!");
        setToastSeverity("success");
        setToastOpen(true);
        router.push("/");
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { message, errors } = error.response.data;

        if (Array.isArray(errors) && errors.length > 0) {
          setToastMessage(errors[0]?.message || "Sign Up failed");
          setFieldErrors((prevErrors) => ({
            ...prevErrors,
            [errors[0]?.field]: errors[0]?.message,
          }));
        } else {
          setToastMessage(message || "Sign Up failed");
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
      <form onSubmit={handleSignup}>
        <Typography variant="h5" component="h1" gutterBottom>
          Create Account
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
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
          <Grid item xs={6}>
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
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Sign Up
        </Button>
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            {"Already have an account?"} <Link href="/">{"Login"}</Link>
          </Typography>
        </Box>
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

export default SignupForm;
