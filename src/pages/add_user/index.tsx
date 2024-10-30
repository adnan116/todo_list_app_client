import React, { useEffect } from "react";
import { Container } from "@mui/material";
import Layout from "@components/Layout";
import AddUser from "@components/AddUser";
import { useRouter } from "next/router";

const AddUserPage: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    let token;
    if (typeof window !== "undefined") {
      token = window.localStorage.getItem("token");
    }
    if (!token) {
      router.push("/");
    }
  });

  return (
    <Layout>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "85vh",
        }}
      >
        <AddUser />
      </Container>
    </Layout>
  );
};

export default AddUserPage;
