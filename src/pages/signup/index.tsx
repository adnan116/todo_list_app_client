import React from "react";
import SignupForm from "@components/SignupForm";
import { Box } from "@mui/material";

const SignupPage: React.FC = () => {
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
      <SignupForm />
    </Box>
  );
};

export default SignupPage;
