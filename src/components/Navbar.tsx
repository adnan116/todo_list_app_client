import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar: React.FC = () => {
  const router = useRouter();
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserType = window.localStorage.getItem("userType");
      if (storedUserType) {
        setUserType(
          storedUserType.charAt(0).toUpperCase() +
            storedUserType.slice(1).toLowerCase()
        );
      }
    }
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
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {`${userType ? userType : ""} Dashboard`}
        </Typography>
        <Button
          color="inherit"
          onClick={handleLogout}
          variant="outlined"
          sx={{ borderRadius: "20px" }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
