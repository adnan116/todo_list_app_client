import React, { useState } from "react";
import { TextField, Button, Typography, Paper, Grid, Box } from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import ToastNotification from "@components/ToastNotification";
import { backendBaseUrl } from "@configs/config";

const AddTaskCategory: React.FC = () => {
  const [form, setForm] = useState({
    categoryName: "",
    description: "",
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

  const handleAddTaskCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      const token = window.localStorage.getItem("token");
      const response = await axios.post(
        `${backendBaseUrl}/task-category/create`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setToastMessage("Task category added successfully!");
        setToastSeverity("success");
        setToastOpen(true);
        setTimeout(() => {
          router.push("/get_category");
        }, 3000);
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
          setToastMessage(errors[0]?.message || "Failed to add task category");
          setFieldErrors((prevErrors) => ({
            ...prevErrors,
            [errors[0]?.field]: errors[0]?.message,
          }));
        } else {
          setToastMessage(message || "Failed to add task category");
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
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ height: "85vh", overflow: "hidden", padding: 0, margin: 0 }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          borderRadius: 2,
          width: "100%",
          maxWidth: 500,
          overflow: "hidden",
        }}
      >
        <form onSubmit={handleAddTaskCategory}>
          <Typography variant="h5" component="h1" gutterBottom>
            Add New Task Category
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="categoryName"
                label="Category Name"
                variant="outlined"
                fullWidth
                value={form.categoryName}
                onChange={handleInputChange}
                required
                error={!!fieldErrors.categoryName}
                helperText={fieldErrors.categoryName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={form.description}
                onChange={handleInputChange}
                required
                error={!!fieldErrors.description}
                helperText={fieldErrors.description}
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
            Add Task Category
          </Button>
        </form>

        <ToastNotification
          open={toastOpen}
          onClose={handleToastClose}
          message={toastMessage}
          severity={toastSeverity}
        />
      </Paper>
    </Box>
  );
};

export default AddTaskCategory;
