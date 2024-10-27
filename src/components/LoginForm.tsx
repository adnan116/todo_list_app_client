import React, { useState } from "react";
import { TextField, Button, Typography, Paper, Box } from "@mui/material";
import { useRouter } from "next/router";
import axiosInstance from "@utils/axiosInstance";
import axios from "axios";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axiosInstance.post("/user/login", {
        username,
        password,
      });

      if (response.status === 200) {
        const { accessToken, userInfo, userType, permittedFeatures } =
          response.data.data;
        if (typeof window !== "undefined") {
          window.localStorage.setItem("token", accessToken);
          window.localStorage.setItem("userInfo", JSON.stringify(userInfo));
          window.localStorage.setItem("userType", userType);
          window.localStorage.setItem(
            "permittedFeatures",
            JSON.stringify(permittedFeatures)
          );
        }
        router.push("/dashboard"); // Redirect to the dashboard
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      // Type assertion to check if error is an AxiosError
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Login failed.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Paper elevation={6} sx={{ padding: 4, borderRadius: 2, width: 500 }}>
      <form onSubmit={handleLogin}>
        <Typography variant="h5" component="h1" gutterBottom>
          Welcome Back
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          label="Email"
          variant="outlined"
          margin="normal"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          InputLabelProps={{ shrink: true }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Login
        </Button>
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Don't have an account? <a href="/signup">Sign up</a>
          </Typography>
        </Box>
      </form>
    </Paper>
  );
};

export default LoginForm;