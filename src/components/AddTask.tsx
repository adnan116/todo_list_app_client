import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import ToastNotification from "@components/ToastNotification";
import { backendBaseUrl } from "@configs/config";
import { taskStatusOptions } from "@utils/constant";

const AddTask: React.FC = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "",
    deadline: "",
    categoryId: "",
    userId: "",
  });

  const [categories, setCategories] = useState<
    { id: string; categoryName: string }[]
  >([]);
  const [users, setUsers] = useState<
    { id: string; firstName: string; lastName: string }[]
  >([]);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<
    "success" | "error" | "warning"
  >("success");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = window.localStorage.getItem("token");
        const response = await axios.get(
          `${backendBaseUrl}/task-category/all-categories`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 200) {
          setCategories(response.data.data);
        }
      } catch (error) {
        handleUnauthorizedError(error);
      }
    };

    const fetchUsers = async () => {
      try {
        const token = window.localStorage.getItem("token");
        const response = await axios.get(`${backendBaseUrl}/user/all-users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setUsers(response.data.data);
        }
      } catch (error) {
        handleUnauthorizedError(error);
      }
    };

    const handleUnauthorizedError = (error: unknown) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.error("Unauthorized access - Redirecting to login.");
        router.push("/");
      } else {
        console.error("Error:", error);
      }
    };

    fetchCategories();
    fetchUsers();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const name = e.target.name as string;
    setForm({ ...form, [name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [name]: "" });
  };

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      const token = window.localStorage.getItem("token");
      const response = await axios.post(`${backendBaseUrl}/task/create`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        setToastMessage("Task added successfully!");
        setToastSeverity("success");
        setToastOpen(true);
        setTimeout(() => router.push("/get_task"), 3000);
      }
    } catch (error: unknown) {
      handleError(error);
    }
  };

  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { message, errors } = error.response.data;
        if (Array.isArray(errors) && errors.length > 0) {
          setToastMessage(errors[0]?.message || "Failed to add task");
          setFieldErrors((prevErrors) => ({
            ...prevErrors,
            [errors[0]?.field]: errors[0]?.message,
          }));
        } else {
          setToastMessage(message || "Failed to add task");
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

  const handleToastClose = () => setToastOpen(false);

  return (
    <Paper
      elevation={6}
      sx={{
        padding: 4,
        borderRadius: 2,
        width: "100%",
        maxWidth: 500,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <form onSubmit={handleAddTask}>
        <Typography variant="h5" component="h1" gutterBottom>
          Add New Task
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="title"
              label="Title"
              variant="outlined"
              fullWidth
              value={form.title}
              onChange={handleInputChange}
              required
              error={!!fieldErrors.title}
              helperText={fieldErrors.title}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              variant="outlined"
              fullWidth
              value={form.description}
              onChange={handleInputChange}
              required
              error={!!fieldErrors.description}
              helperText={fieldErrors.description}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="deadline"
              label="Deadline"
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={form.deadline}
              onChange={handleInputChange}
              required
              error={!!fieldErrors.deadline}
              helperText={fieldErrors.deadline}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl
              variant="outlined"
              fullWidth
              required
              error={!!fieldErrors.status}
            >
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={form.status}
                onChange={handleSelectChange}
                label="Status"
              >
                {taskStatusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.status && (
                <Typography variant="caption" color="error">
                  {fieldErrors.status}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl
              variant="outlined"
              fullWidth
              required
              error={!!fieldErrors.categoryId}
            >
              <InputLabel>Category</InputLabel>
              <Select
                name="categoryId"
                value={form.categoryId}
                onChange={handleSelectChange}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.categoryName}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.categoryId && (
                <Typography variant="caption" color="error">
                  {fieldErrors.categoryId}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl
              variant="outlined"
              fullWidth
              required
              error={!!fieldErrors.userId}
            >
              <InputLabel>Assigned User</InputLabel>
              <Select
                name="userId"
                value={form.userId}
                onChange={handleSelectChange}
                label="Assigned User"
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.userId && (
                <Typography variant="caption" color="error">
                  {fieldErrors.userId}
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
          Add Task
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

export default AddTask;
