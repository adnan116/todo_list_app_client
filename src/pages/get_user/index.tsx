import React from "react";
import Layout from "@components/Layout";
import UserList from "@components/UserList";
import { Container } from "@mui/material";

const GetUserPage: React.FC = () => {
  return (
    <Layout>
      <Container>
        <h1>User List</h1>
        <UserList />
      </Container>
    </Layout>
  );
};

export default GetUserPage;
