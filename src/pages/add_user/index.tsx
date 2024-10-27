import React from "react";
import { Container } from "@mui/material";
import Layout from "@components/Layout";
import AddUser from "@components/AddUser";

const AddUserPage: React.FC = () => {
  return (
    <Layout>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <AddUser />
      </Container>
    </Layout>
  );
};

export default AddUserPage;
