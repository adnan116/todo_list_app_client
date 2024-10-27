import React from "react";
import LoginForm from "@components/LoginForm";
import { Box } from "@mui/material";

const LoginPage: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"

      sx={{
        backgroundImage: "url('/images/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <LoginForm />
    </Box>
  );
};

export default LoginPage;
