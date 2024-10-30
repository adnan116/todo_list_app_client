import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/router";
import bcrypt from "bcryptjs";
import Link from "next/link";

const Navbar: React.FC = () => {
  const router = useRouter();
  const [userType, setUserType] = useState<string | null>(null);

  const fetchUserType = async () => {
    if (typeof window !== "undefined") {
      const storedUserType = window.localStorage.getItem("userType");
      if (storedUserType) {
        const isAdmin = await bcrypt.compare("admin", storedUserType);
        const isUser = await bcrypt.compare("user", storedUserType);

        if (isAdmin) {
          setUserType("Admin");
        } else if (isUser) {
          setUserType("User");
        } else {
          setUserType("");
        }
      }
    }
  };

  useEffect(() => {
    fetchUserType();
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("userInfo");
      window.localStorage.removeItem("permittedFeatures");
      window.localStorage.removeItem("userType");
    }
    router.push("/");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2", boxShadow: 3 }}>
      <Toolbar
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        <Link
          href="/dashboard"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {`${userType ? userType : ""} Dashboard`}
          </Typography>
        </Link>

        <Box
          sx={{
            flexGrow: 2,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4" sx={{ marginLeft: "350px" }}>
            Enhanced ToDo List Application
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", flexGrow: 1 }}>
          <Button
            color="inherit"
            onClick={handleLogout}
            variant="outlined"
            sx={{
              borderRadius: "20px",
              "&:hover": {
                backgroundColor: "#fff",
                color: "#1976d2",
              },
              marginLeft: 2,
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
